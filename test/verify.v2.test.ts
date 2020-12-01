import { isValid, verify } from "../src";
import {
  documentDnsDidSigned,
  documentMainnetValidWithCertificateStore,
  documentWithOneCertificateStoreIssuerInRegistry,
  documentWithOneCertificateStoreIssuerNotInRegistry,
  documentWithOneDocumentStoreIssuerInRegistryAndInvalidDnsTxt,
  documentWithOneDocumentStoreIssuerInRegistryAndValidDnsTxt,
  documentWithOneDocumentStoreIssuerNotInRegistryAndInvalidDnsTxt,
  documentWithOneDocumentStoreIssuerNotInRegistryAndValidDnsTxt,
  documentWithTwoCertificateStoreIssuerInRegistry,
  documentWithTwoCertificateStoreIssuerNotInRegistry,
  documentWithTwoCertificateStoreIssuerWithOneInRegistry,
  documentWithTwoDocumentStoreIssuerInRegistryWithValidDnsTxt,
  documentWithTwoDocumentStoreIssuerNotInRegistryWithoutValidDnsTxt,
  documentWithTwoDocumentStoreIssuerOneInRegistryWithValidDnsTxtAndSecondInvalid,
} from "./fixtures/v2/document";

const mainnetVerify = verify({
  network: "homestead",
});
const ropstenVerify = verify({
  network: "ropsten",
});

describe("verify", () => {
  it("should be valid for all checks when document with certificate store is valid on mainnet", async () => {
    const fragments = await mainnetVerify(documentMainnetValidWithCertificateStore);
    expect(fragments).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY",
      },
      {
        name: "OpenAttestationEthereumTokenRegistryStatus",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS",
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
        },
      },
      {
        data: {
          details: {
            issuance: [
              {
                address: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
                issued: true,
              },
            ],
            revocation: [
              {
                address: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
                revoked: false,
              },
            ],
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
        status: "SKIPPED",
        name: "OpenAttestationDnsTxtIdentityProof",
        type: "ISSUER_IDENTITY",
        reason: {
          code: 2,
          codeString: "SKIPPED",
          message:
            'Document issuers doesn\'t have "documentStore" / "tokenRegistry" property or doesn\'t use DNS-TXT type',
        },
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
        data: [
          {
            displayCard: true,
            email: "info@tech.gov.sg",
            id: "govtech-registry",
            logo: "/static/images/GOVTECH_logo.png",
            name: "Government Technology Agency of Singapore (GovTech)",
            phone: "+65 6211 2100",
            status: "VALID",
            value: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
            website: "https://www.tech.gov.sg",
          },
        ],
        reason: undefined,
        name: "OpencertsRegistryVerifier",
        status: "VALID",
        type: "ISSUER_IDENTITY",
      },
    ]);
    expect(isValid(fragments)).toStrictEqual(true);
  });
  describe("IDENTITY_ISSUER", () => {
    describe("single issuer with certificate store", () => {
      it("should have valid ISSUER_IDENTITY when document has one issuer that is in registry", async () => {
        const fragments = await ropstenVerify(documentWithOneCertificateStoreIssuerInRegistry);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have invalid ISSUER_IDENTITY when document has one issuer that is not in registry", async () => {
        const fragments = await ropstenVerify(documentWithOneCertificateStoreIssuerNotInRegistry);
        // test registry fragment
        expect(fragments.find((fragment) => fragment.name === "OpencertsRegistryVerifier")).toStrictEqual({
          data: [
            {
              status: "INVALID",
              value: "0x8FC57204C35FB9317D91285EF52D6B892EC08CD3",
              reason: {
                code: 0,
                codeString: "INVALID_IDENTITY",
                message: "Document store 0x8FC57204C35FB9317D91285EF52D6B892EC08CD3 not found in the registry",
              },
            },
          ],
          reason: {
            code: 0,
            codeString: "INVALID_IDENTITY",
            message: "Document store 0x8FC57204C35FB9317D91285EF52D6B892EC08CD3 not found in the registry",
          },
          name: "OpencertsRegistryVerifier",
          status: "INVALID",
          type: "ISSUER_IDENTITY",
        });

        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
      });
    });
    describe("single issuer with document store and DNS-TXT", () => {
      it("should have valid ISSUER_IDENTITY when document has one issuer that is in registry and a valid DNS-TXT record", async () => {
        const fragments = await ropstenVerify(documentWithOneDocumentStoreIssuerInRegistryAndValidDnsTxt);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have valid ISSUER_IDENTITY when document has one issuer that is not in registry and a valid DNS-TXT record", async () => {
        const fragments = await ropstenVerify(documentWithOneDocumentStoreIssuerNotInRegistryAndValidDnsTxt);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have valid ISSUER_IDENTITY when document has one issuer that is in registry and a invalid DNS-TXT record", async () => {
        const fragments = await ropstenVerify(documentWithOneDocumentStoreIssuerInRegistryAndInvalidDnsTxt);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have invalid ISSUER_IDENTITY when document has one issuer that is not in registry and a invalid DNS-TXT record", async () => {
        const fragments = await ropstenVerify(documentWithOneDocumentStoreIssuerNotInRegistryAndInvalidDnsTxt);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
      });
    });

    describe("single issuer with DID", () => {
      it("should have valid ISSUER_IDENTITY when document is using DNS-DID", async () => {
        const fragments = await ropstenVerify(documentDnsDidSigned);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
    });
    describe("multiple issuer with certificate store", () => {
      it("should have valid ISSUER_IDENTITY when document has two issuers that are in registry", async () => {
        const fragments = await ropstenVerify(documentWithTwoCertificateStoreIssuerInRegistry);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have valid ISSUER_IDENTITY when document has two issuers and only one is in registry", async () => {
        const fragments = await ropstenVerify(documentWithTwoCertificateStoreIssuerWithOneInRegistry);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have invalid ISSUER_IDENTITY when document has two issuers and none is in registry", async () => {
        const fragments = await ropstenVerify(documentWithTwoCertificateStoreIssuerNotInRegistry);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
      });
    });
    describe("multiple issuer with document store and DNS-TXT", () => {
      it("should have valid ISSUER_IDENTITY when document has two issuers that are in registry with valid dns-txt", async () => {
        const fragments = await ropstenVerify(documentWithTwoDocumentStoreIssuerInRegistryWithValidDnsTxt);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have valid ISSUER_IDENTITY when document has two issuers, one that is in registry with valid dns-txt and the other being invalid", async () => {
        const fragments = await ropstenVerify(
          documentWithTwoDocumentStoreIssuerOneInRegistryWithValidDnsTxtAndSecondInvalid
        );
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have invalid ISSUER_IDENTITY when document has two issuers, none are in registry and both without valid DNS", async () => {
        const fragments = await ropstenVerify(documentWithTwoDocumentStoreIssuerNotInRegistryWithoutValidDnsTxt);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
      });
    });
  });
});
