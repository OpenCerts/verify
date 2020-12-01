import { isValid, verify } from "../src";
import {
  documentRopstenValidWithDocumentStore,
  documentWithDocumentStoreIssuerInRegistryAndInvalidDns,
  documentWithDocumentStoreIssuerInRegistryAndValidDns,
  documentWithDocumentStoreIssuerNotInRegistryAndInvalidDns,
  documentWithDocumentStoreIssuerNotInRegistryAndValidDns,
} from "./fixtures/v3/document";

const ropstenVerify = verify({
  network: "ropsten",
});

describe("verify", () => {
  it("should fail OpenAttestationDnsTxt when identity is invalid and be valid for remaining checks when document with certificate store is valid on ropsten", async () => {
    const results = await ropstenVerify(documentRopstenValidWithDocumentStore);

    expect(results).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY",
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
        },
        name: "OpenAttestationEthereumTokenRegistryStatus",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS",
      },
      {
        data: {
          details: {
            issuance: {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true,
            },
            revocation: {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: false,
            },
          },
          issuedOnAll: true,
          revokedOnAny: false,
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreStatus",
        type: "DOCUMENT_STATUS",
      },
      {
        name: "OpenAttestationDidSignedDocumentStatus",
        reason: {
          code: 0,
          codeString: "SKIPPED",
          message: "Document was not signed by DID directly",
        },
        status: "SKIPPED",
        type: "DOCUMENT_STATUS",
      },
      {
        location: "some.io",
        name: "OpenAttestationDnsTxtIdentityProof",
        reason: {
          code: 4,
          codeString: "MATCHING_RECORD_NOT_FOUND",
          message: "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        },
        status: "INVALID",
        type: "ISSUER_IDENTITY",
        value: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
      },
      {
        name: "OpenAttestationDnsDidIdentityProof",
        reason: {
          code: 0,
          codeString: "SKIPPED",
          message: "Document was not issued using DNS-DID",
        },
        status: "SKIPPED",
        type: "ISSUER_IDENTITY",
      },
      {
        data: {
          value: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          status: "INVALID",
          reason: {
            code: 0,
            codeString: "INVALID_IDENTITY",
            message: "Document store 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3 not found in the registry",
          },
        },
        reason: {
          code: 0,
          codeString: "INVALID_IDENTITY",
          message: "Document store 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3 not found in the registry",
        },
        name: "OpencertsRegistryVerifier",
        status: "INVALID",
        type: "ISSUER_IDENTITY",
      },
    ]);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });
  it("should fail when identity is invalid and be valid for remaining checks when document with certificate store is valid on ropsten", async () => {
    const results = await ropstenVerify(documentWithDocumentStoreIssuerInRegistryAndValidDns);

    expect(results).toStrictEqual([
      {
        data: false,
        status: "INVALID",
        reason: {
          code: 0,
          codeString: "DOCUMENT_TAMPERED",
          message: "Document has been tampered with",
        },
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY",
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
        },
        name: "OpenAttestationEthereumTokenRegistryStatus",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS",
      },
      {
        data: {
          details: {
            issuance: {
              issued: false,
              address: "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
              reason: {
                code: 1,
                codeString: "DOCUMENT_NOT_ISSUED",
                message: "Invalid call arguments",
              },
            },
          },
          issuedOnAll: false,
        },
        reason: {
          code: 1,
          codeString: "DOCUMENT_NOT_ISSUED",
          message: "Invalid call arguments",
        },
        status: "INVALID",
        name: "OpenAttestationEthereumDocumentStoreStatus",
        type: "DOCUMENT_STATUS",
      },
      {
        name: "OpenAttestationDidSignedDocumentStatus",
        reason: {
          code: 0,
          codeString: "SKIPPED",
          message: "Document was not signed by DID directly",
        },
        status: "SKIPPED",
        type: "DOCUMENT_STATUS",
      },
      {
        location: "example.openattestation.com",
        name: "OpenAttestationDnsTxtIdentityProof",
        status: "VALID",
        type: "ISSUER_IDENTITY",
        value: "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
      },
      {
        name: "OpenAttestationDnsDidIdentityProof",
        reason: {
          code: 0,
          codeString: "SKIPPED",
          message: "Document was not issued using DNS-DID",
        },
        status: "SKIPPED",
        type: "ISSUER_IDENTITY",
      },
      {
        data: {
          displayCard: false,
          name: "ROPSTEN: Government Technology Agency of Singapore (GovTech)",
          value: "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
          status: "VALID",
        },
        name: "OpencertsRegistryVerifier",
        status: "VALID",
        type: "ISSUER_IDENTITY",
      },
    ]);
    // it's not valid on DOCUMENT_INTEGRITY and DOCUMENT_STATUS so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["ISSUER_IDENTITY"])).toStrictEqual(true);
  });
  describe("IDENTITY_ISSUER", () => {
    it("should have valid ISSUER_IDENTITY when document issuer is in registry and dns is valid", async () => {
      const fragments = await ropstenVerify(documentWithDocumentStoreIssuerInRegistryAndValidDns);
      expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
    });
    it("should have valid ISSUER_IDENTITY when document issuer is in registry but dns is invalid", async () => {
      const fragments = await ropstenVerify(documentWithDocumentStoreIssuerInRegistryAndInvalidDns);
      expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
    });
    it("should have valid ISSUER_IDENTITY when document issuer is not in registry but dns is valid", async () => {
      const fragments = await ropstenVerify(documentWithDocumentStoreIssuerNotInRegistryAndValidDns);
      expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
    });
    it("should have invalid ISSUER_IDENTITY when document issuer is not in registry and dns is invalid", async () => {
      const fragments = await ropstenVerify(documentWithDocumentStoreIssuerNotInRegistryAndInvalidDns);
      expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
    });
  });
});
