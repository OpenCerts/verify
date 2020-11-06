import {
  openAttestationVerifiers,
  Reason,
  verificationBuilder,
  VerificationFragment,
  VerificationFragmentType,
  VerificationManagerOptions,
  Verifier
} from "@govtechsg/oa-verify";
import { getData, utils, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { getAllowlist, getDenyList } from "./registry";
import { DenyList, OpencertsRegistryCode, Registry, RegistryEntry, RegistryVerifierOptions } from "./types";

export type OpencertsRegistryVerificationFragmentData = Partial<RegistryEntry> & {
  value: string;
  status: "VALID" | "INVALID";
};

export const type = "ISSUER_IDENTITY";
export const name = "OpencertsRegistryVerifier";

const storeToFragment = (registry: Registry, store: string): VerificationFragment => {
  const key = Object.keys(registry.issuers).find(k => k.toLowerCase() === store.toLowerCase());
  if (key) {
    return {
      status: "VALID",
      type,
      name,
      data: {
        status: "VALID" as const,
        value: store,
        ...registry.issuers[key]
      }
    };
  }
  const reason: Reason = {
    code: OpencertsRegistryCode.INVALID_IDENTITY,
    codeString: OpencertsRegistryCode[OpencertsRegistryCode.INVALID_IDENTITY],
    message: `Document store ${store} not found in the registry`
  };
  return {
    status: "INVALID",
    type,
    name,
    data: {
      value: store,
      status: "INVALID" as const,
      reason
    },
    reason
  };
};

// local function to check data + data.issuers fields
// don't use utils.isWrappedV2Document, as it only checks OpenAttestationDocument version
const isWrappedV2Document = (document: any): document is WrappedDocument<v2.OpenAttestationDocument> => {
  return document.data && document.data.issuers;
};

// create a fragment if the entry provided has been denied
// otherwise return nothing
const deniedFragment = (
  denyList: DenyList[],
  { store, location, date }: { store: string; location: string; date: Date }
): VerificationFragment | undefined => {
  // comparison must be case insensitive
  const lowercaseLocation = location.toLowerCase();
  const lowercaseStore = store.toLowerCase();
  // find any element that
  // - is within the date range
  // - and that matches the document store or the location.
  // when startDate is not provided, any date will match
  // when endDate is not provided, any date will match
  // eslint-disable-next-line no-shadow
  const deniedElement = denyList.find(({ type, value, startDate, endDate }) => {
    const lowercaseValue = value.toLowerCase();
    const isInRange =
      (!startDate || startDate.getTime() <= date.getTime()) && (!endDate || endDate.getTime() >= date.getTime());
    const match =
      (type === "DOCUMENT_STORE" && lowercaseValue === lowercaseStore) ||
      (type === "LOCATION" &&
        (lowercaseValue === lowercaseLocation || lowercaseLocation.endsWith(`.${lowercaseValue}`)));
    return isInRange && match;
  });
  if (deniedElement) {
    const reason: Reason = {
      code: OpencertsRegistryCode.DENIED,
      codeString: OpencertsRegistryCode[OpencertsRegistryCode.DENIED],
      message: `Certificate issuer ${deniedElement.type === "DOCUMENT_STORE" ? "store" : "location"} has been denied`
    };

    return {
      status: "INVALID",
      type,
      name,
      data: {
        details: deniedElement,
        value: deniedElement.type === "DOCUMENT_STORE" ? store : location,
        status: "INVALID" as const,
        reason
      },
      reason
    };
  }
  return undefined;
};

type RegistryVerifier = (
  registryVerifierOptions: RegistryVerifierOptions
) => Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>,
  VerificationManagerOptions,
  OpencertsRegistryVerificationFragmentData | OpencertsRegistryVerificationFragmentData[]
>;
export const registryVerifier: RegistryVerifier = registryVerifierOptions => ({
  test: document => {
    if (utils.isWrappedV3Document(document)) {
      const documentData = getData(document);
      return documentData.proof.method === v3.Method.DocumentStore;
    }

    if (isWrappedV2Document(document)) {
      const documentData = getData(document);
      return documentData.issuers.some(issuer => "documentStore" in issuer || "certificateStore" in issuer);
    }

    return false;
  },
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: OpencertsRegistryCode.SKIPPED,
        codeString: OpencertsRegistryCode[OpencertsRegistryCode.SKIPPED],
        message: `Document issuers doesn't have "documentStore" or "certificateStore" property or ${v3.Method.DocumentStore} method`
      }
    });
  },
  verify: async document => {
    try {
      const [registry, denyList] = await Promise.all([getAllowlist(), getDenyList(registryVerifierOptions)]);

      if (utils.isWrappedV3Document(document)) {
        const documentData = getData(document);
        return (
          deniedFragment(denyList, {
            store: documentData.proof.value,
            location: documentData.issuer.identityProof.location,
            date: new Date()
          }) || storeToFragment(registry, documentData.proof.value)
        );
      }
      const documentData = getData(document);
      const issuerFragments = documentData.issuers.map(issuer => {
        const store: string = (issuer.documentStore || issuer.certificateStore)!;
        return (
          deniedFragment(denyList, {
            store,
            location: issuer.identityProof?.location || "",
            date: new Date()
          }) || storeToFragment(registry, store)
        );
      });
      // TODO I will need to check with PO what's the behaviour for multi issuers
      /**
       * - issuer 1: BLACKLIST, issuer 2: WHITELIST =>
       * - issuer 1: BLACKLIST, issuer 2: DNS =>
       * - issuer 1: BLACKLIST, issuer 2: INVALID =>
       * - issuer 1: BLACKLIST, issuer 2: INVALID =>
       * - issuer 1: WHITELIST, issuer 2: ERROR (network error) =>
       */
      // if one issuer is valid => fragment status is valid otherwise if all issuers are invalid => invalid
      const status = issuerFragments.some(fragment => fragment.status === "VALID") ? "VALID" : "INVALID";
      return {
        type,
        name,
        status,
        data: issuerFragments.map(fragment => fragment.data),
        reason: issuerFragments.find(fragment => fragment.reason)?.reason
      };
    } catch (e) {
      return {
        name,
        type,
        reason: {
          message: e.message,
          code: e.code || OpencertsRegistryCode.UNEXPECTED_ERROR,
          codeString: e.codeString || OpencertsRegistryCode[OpencertsRegistryCode.UNEXPECTED_ERROR]
        },
        status: "ERROR"
      };
    }
  }
});

export const isValid = (
  verificationFragments: VerificationFragment[],
  types: VerificationFragmentType[] = ["DOCUMENT_STATUS", "DOCUMENT_INTEGRITY", "ISSUER_IDENTITY"]
) => {
  if (verificationFragments.length < 1) {
    throw new Error("Please provide at least one verification fragment to check");
  }
  if (types.length < 1) {
    throw new Error("Please provide at least one type to check");
  }
  return types.every(currentType => {
    const verificationFragmentsForType = verificationFragments.filter(fragment => fragment.type === currentType);

    // return true if at least one fragment is valid
    // and all fragments are valid or skipped
    const defaultCheck =
      verificationFragmentsForType.some(fragment => fragment.status === "VALID") &&
      verificationFragmentsForType.every(fragment => fragment.status === "VALID" || fragment.status === "SKIPPED");
    // return defaultCheck if it's true or if type is DOCUMENT_INTEGRITY or DOCUMENT_STATUS
    if (currentType === "DOCUMENT_STATUS" || currentType === "DOCUMENT_INTEGRITY" || defaultCheck) {
      return defaultCheck;
    }

    // if default check is false and type is issuer identity we need to perform further checks
    const fragmentForDnsVerifier = verificationFragmentsForType.find(
      fragment => fragment.name === "OpenAttestationDnsTxt"
    );
    const fragmentForRegistryVerifier:
      | VerificationFragment<OpencertsRegistryVerificationFragmentData | OpencertsRegistryVerificationFragmentData[]>
      | undefined = verificationFragmentsForType.find(fragment => fragment.name === name);

    // TODO need better than this :)
    if (fragmentForRegistryVerifier?.reason?.code === OpencertsRegistryCode.DENIED) {
      return false;
    }
    return (
      fragmentForRegistryVerifier?.status === "VALID" || // if registry fragment is valid then issuer identity is valid
      fragmentForDnsVerifier?.data?.status === "VALID" || // otherwise if there is one issuer and it's dns entry is valid then issuer identity is valid
      fragmentForDnsVerifier?.data?.every?.((d: any) => d.status === "VALID") // otherwise if there are multiple issuers and all of them have valid dns entry then issuer identity is valid
    );
  });
};

type Verify = (
  registryVerifierOptions: RegistryVerifierOptions
) => (
  document: WrappedDocument<v3.OpenAttestationDocument> | WrappedDocument<v2.OpenAttestationDocument>,
  options: VerificationManagerOptions
) => Promise<VerificationFragment[]>;

export const verify: Verify = (registryVerifierOptions: RegistryVerifierOptions) =>
  verificationBuilder([...openAttestationVerifiers, registryVerifier(registryVerifierOptions)]);
