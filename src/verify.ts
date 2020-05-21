import {
  openAttestationVerifiers,
  verificationBuilder,
  Verifier,
  VerificationFragment,
  VerificationFragmentType,
  VerificationManagerOptions,
  isWrappedV3Document
} from "@govtechsg/oa-verify";
import fetch from "node-fetch";
import { getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";

export interface RegistryEntry {
  name: string;
  displayCard: boolean;
  website?: string;
  email?: string;
  phone?: string;
  logo?: string;
  id?: string;
}
export interface Registry {
  issuers: {
    [key: string]: RegistryEntry;
  };
}
export type OpencertsRegistryVerificationFragmentData = Partial<RegistryEntry> & {
  value: string;
  status: "VALID" | "INVALID";
};

export const type = "ISSUER_IDENTITY";
export const name = "OpencertsRegistryVerifier";

// NEVER EVER REPLACE OR CHANGE A VALUE :)
// code for errors and invalid fragment
export enum OpencertsRegistryCode {
  INVALID_IDENTITY = 0,
  SKIPPED = 1
}

const storeToFragment = (
  registry: Registry,
  store: string
  // TODO fix oa-verify to not have optional on data
): VerificationFragment & { data: OpencertsRegistryVerificationFragmentData } => {
  const key = Object.keys(registry.issuers).find(k => k.toLowerCase() === store.toLowerCase());
  if (key) {
    return {
      status: "VALID",
      type,
      name,
      data: {
        status: "VALID" as "VALID",
        value: store,
        ...registry.issuers[key]
      }
    };
  }
  return {
    status: "INVALID",
    type,
    name,
    data: {
      value: store,
      status: "INVALID" as "INVALID",
      reason: {
        code: OpencertsRegistryCode.INVALID_IDENTITY,
        codeString: OpencertsRegistryCode[OpencertsRegistryCode.INVALID_IDENTITY],
        message: `Document store ${store} not found in the registry`
      }
    },
    reason: {
      code: OpencertsRegistryCode.INVALID_IDENTITY,
      codeString: OpencertsRegistryCode[OpencertsRegistryCode.INVALID_IDENTITY],
      message: `Document store ${store} not found in the registry`
    }
  };
};

export const registryVerifier: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>,
  VerificationManagerOptions,
  OpencertsRegistryVerificationFragmentData | OpencertsRegistryVerificationFragmentData[]
> = {
  test: document => {
    if (isWrappedV3Document(document)) {
      const documentData = getData(document);
      return documentData.proof.method === v3.Method.DocumentStore;
    }
    const documentData = getData(document);
    return documentData.issuers.some(issuer => "documentStore" in issuer || "certificateStore" in issuer);
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
    const registry: Registry = await fetch("https://opencerts.io/static/registry.json").then(res => res.json());

    if (isWrappedV3Document(document)) {
      const documentData = getData(document);
      return storeToFragment(registry, documentData.proof.value);
    }
    const documentData = getData(document);
    const issuerFragments = documentData.issuers.map(issuer =>
      storeToFragment(registry, (issuer.documentStore || issuer.certificateStore)!)
    );
    // if one issuer is valid => fragment status is valid otherwise if all issuers are invalid => invalid
    const status = issuerFragments.some(fragment => fragment.status === "VALID") ? "VALID" : "INVALID";
    return {
      type,
      name,
      status,
      data: issuerFragments.map(fragment => fragment.data),
      reason: issuerFragments.find(fragment => fragment.reason)?.reason
    };
  }
};

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
    const fragmentForRegistryVerifier = verificationFragmentsForType.find(fragment => fragment.name === name);
    return (
      fragmentForRegistryVerifier?.status === "VALID" || // if registry fragment is valid then issuer identity is valid
      fragmentForDnsVerifier?.data?.status === "VALID" || // otherwise if there is one issuer and it's dns entry is valid then issuer identity is valid
      fragmentForDnsVerifier?.data?.every?.((d: any) => d.status === "VALID") // otherwise if there are multiple issuers and all of them have valid dns entry then issuer identity is valid
    );
  });
};

export const verify: (
  document: WrappedDocument<v3.OpenAttestationDocument> | WrappedDocument<v2.OpenAttestationDocument>,
  options: VerificationManagerOptions
) => Promise<VerificationFragment[]> = verificationBuilder([...openAttestationVerifiers, registryVerifier]);
