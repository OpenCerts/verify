import { isValid, verify } from "../src";
import {
  documentRopstenValidWithDocumentStore,
  documentWithDocumentStoreIssuerInRegistryAndInvalidDns,
  documentWithDocumentStoreIssuerInRegistryAndValidDns,
  documentWithDocumentStoreIssuerNotInRegistryAndInvalidDns,
  documentWithDocumentStoreIssuerNotInRegistryAndValidDns
} from "./fixtures/v3/document";

const options = { network: "ropsten" };

describe("verify", () => {
  it("should fail OpenAttestationDnsTxt when identity is invalid and be valid for remaining checks when document with certificate store is valid on ropsten", async () => {
    const results = await verify(documentRopstenValidWithDocumentStore, { network: "ropsten" });

    expect(results).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        name: "OpenAttestationSignedProof",
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: "Document does not have a proof block"
        },
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method'
        },
        name: "OpenAttestationEthereumTokenRegistryStatus",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: {
            issuance: {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true
            },
            revocation: {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: false
            }
          },
          issuedOnAll: true,
          revokedOnAny: false
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreStatus",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          location: "some.io",
          status: "INVALID",
          value: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
        },
        reason: {
          code: 1,
          codeString: "INVALID_IDENTITY",
          message: "Document issuer identity is invalid"
        },
        name: "OpenAttestationDnsTxt",
        status: "INVALID",
        type: "ISSUER_IDENTITY"
      },
      {
        data: {
          value: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          status: "INVALID",
          reason: {
            code: 0,
            codeString: "INVALID_IDENTITY",
            message: "Document store 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3 not found in the registry"
          }
        },
        reason: {
          code: 0,
          codeString: "INVALID_IDENTITY",
          message: "Document store 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3 not found in the registry"
        },
        name: "OpencertsRegistryVerifier",
        status: "INVALID",
        type: "ISSUER_IDENTITY"
      }
    ]);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });
  it("should fail when identity is invalid and be valid for remaining checks when document with certificate store is valid on ropsten", async () => {
    const results = await verify(documentWithDocumentStoreIssuerInRegistryAndValidDns, { network: "ropsten" });

    expect(results).toStrictEqual([
      {
        data: false,
        status: "INVALID",
        reason: {
          code: 0,
          codeString: "DOCUMENT_TAMPERED",
          message: "Document has been tampered with"
        },
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        name: "OpenAttestationSignedProof",
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: "Document does not have a proof block"
        },
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method'
        },
        name: "OpenAttestationEthereumTokenRegistryStatus",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: {
            issuance: {
              issued: false,
              address: "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
              reason: {
                code: 6,
                codeString: "INVALID_ARGUMENT",
                message: "Error with smart contract 0x532C9Ff853CA54370D7492cD84040F9f8099f11B: incorrect data length"
              }
            }
          },
          issuedOnAll: false
        },
        reason: {
          code: 6,
          codeString: "INVALID_ARGUMENT",
          message: "Error with smart contract 0x532C9Ff853CA54370D7492cD84040F9f8099f11B: incorrect data length"
        },
        status: "INVALID",
        name: "OpenAttestationEthereumDocumentStoreStatus",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          location: "example.openattestation.com",
          status: "VALID",
          value: "0x532C9Ff853CA54370D7492cD84040F9f8099f11B"
        },
        name: "OpenAttestationDnsTxt",
        status: "VALID",
        type: "ISSUER_IDENTITY"
      },
      {
        data: {
          displayCard: false,
          name: "ROPSTEN: Government Technology Agency of Singapore (GovTech)",
          value: "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
          status: "VALID"
        },
        name: "OpencertsRegistryVerifier",
        status: "VALID",
        type: "ISSUER_IDENTITY"
      }
    ]);
    // it's not valid on DOCUMENT_INTEGRITY and DOCUMENT_STATUS so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["ISSUER_IDENTITY"])).toStrictEqual(true);
  });
  describe("IDENTITY_ISSUER", () => {
    it("should have valid ISSUER_IDENTITY when document issuer is in registry and dns is valid", async () => {
      const fragments = await verify(documentWithDocumentStoreIssuerInRegistryAndValidDns, options);
      expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
    });
    it("should have valid ISSUER_IDENTITY when document issuer is in registry but dns is invalid", async () => {
      const fragments = await verify(documentWithDocumentStoreIssuerInRegistryAndInvalidDns, options);
      expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
    });
    it("should have valid ISSUER_IDENTITY when document issuer is not in registry but dns is valid", async () => {
      const fragments = await verify(documentWithDocumentStoreIssuerNotInRegistryAndValidDns, options);
      expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
    });
    it("should have invalid ISSUER_IDENTITY when document issuer is not in registry and dns is invalid", async () => {
      const fragments = await verify(documentWithDocumentStoreIssuerNotInRegistryAndInvalidDns, options);
      expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
    });
  });
});
