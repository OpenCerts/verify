/* eslint-disable import/first */
jest.mock("node-fetch");

import fetch from "node-fetch";
import { mocked } from "ts-jest/utils";
import { isValid, verify } from "../src";
import {
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
  documentWithTwoDocumentStoreIssuerOneInRegistryWithValidDnsTxtAndSecondInvalid,
  documentWithTwoDocumentStoreIssuerNotInRegistryWithoutValidDnsTxt,
  documentMainnetValidWithCertificateStore,
  documentWithDeniedIssuerWithoutRange,
  documentWithDeniedIssuerWithStartDate,
  documentWithDeniedIssuerWithEndDate,
  documentWithDeniedIssuerWithDateRangeInFuture,
  documentWithDeniedIssuerLocationWithoutRange,
  documentWithDeniedIssuerLocationWithEndDate,
  documentWithDeniedIssuerLocationWithStartDate,
  documentWithDeniedIssuerLocationWithDateRangeInFuture,
  documentWithDeniedIssuerLocationOnSubdomain
} from "./fixtures/v2/document";

const actualFetch = jest.requireActual("node-fetch");
const { Response } = jest.requireActual("node-fetch");
const mockedFetch = mocked(fetch, true);

// https://docs.google.com/spreadsheets/d/10-yzy245v6fXesJ9lR_qaLBIEMwa2mxn9DcZB3_kD34/edit#gid=0 owned by Nebulis
const verifyWithOptionsApplied = verify({
  spreadsheetId: "10-yzy245v6fXesJ9lR_qaLBIEMwa2mxn9DcZB3_kD34",
  spreadsheetKey: "AIzaSyDSIMuMsZOuh0cBnMFYJjvSRWZJ-IE_4YY"
});

const options = { network: "ropsten" };
describe("verify", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    mockedFetch.mockImplementation(actualFetch);
  });

  it("should be valid for all checks when document with certificate store is valid on mainnet", async () => {
    const fragments = await verifyWithOptionsApplied(documentMainnetValidWithCertificateStore, {
      network: "homestead",
      // @ts-ignore
      foo: "bar"
    });
    expect(fragments).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        name: "OpenAttestationEthereumTokenRegistryStatus",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS",
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method'
        }
      },
      {
        data: {
          details: {
            issuance: [
              {
                address: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
                issued: true
              }
            ],
            revocation: [
              {
                address: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
                revoked: false
              }
            ]
          },
          issuedOnAll: true,
          revokedOnAny: false
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreStatus",
        type: "DOCUMENT_STATUS"
      },
      {
        status: "SKIPPED",
        name: "OpenAttestationDnsTxt",
        type: "ISSUER_IDENTITY",
        reason: {
          code: 2,
          codeString: "SKIPPED",
          message:
            'Document issuers doesn\'t have "documentStore" / "tokenRegistry" property or doesn\'t use DNS-TXT type'
        }
      },
      {
        name: "OpenAttestationDnsDid",
        reason: {
          code: 0,
          codeString: "SKIPPED",
          message: "Document was not issued using DNS-DID"
        },
        status: "SKIPPED",
        type: "ISSUER_IDENTITY"
      },
      {
        name: "OpenAttestationDidSignedDocumentStatus",
        reason: {
          code: 0,
          codeString: "SKIPPED",
          message: "Document was not signed by DID directly"
        },
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
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
            website: "https://www.tech.gov.sg"
          }
        ],
        reason: undefined,
        name: "OpencertsRegistryVerifier",
        status: "VALID",
        type: "ISSUER_IDENTITY"
      }
    ]);
    expect(isValid(fragments)).toStrictEqual(true);
  });
  describe("IDENTITY_ISSUER", () => {
    describe("single issuer with certificate store", () => {
      it("should have valid ISSUER_IDENTITY when document has one issuer that is in registry", async () => {
        const fragments = await verifyWithOptionsApplied(documentWithOneCertificateStoreIssuerInRegistry, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have invalid ISSUER_IDENTITY when document has one issuer that is not in registry", async () => {
        const fragments = await verifyWithOptionsApplied(documentWithOneCertificateStoreIssuerNotInRegistry, options);
        // test registry fragment
        expect(fragments.find(fragment => fragment.name === "OpencertsRegistryVerifier")).toStrictEqual({
          data: [
            {
              status: "INVALID",
              value: "0x8FC57204C35FB9317D91285EF52D6B892EC08CD3",
              reason: {
                code: 0,
                codeString: "INVALID_IDENTITY",
                message: "Document store 0x8FC57204C35FB9317D91285EF52D6B892EC08CD3 not found in the registry"
              }
            }
          ],
          reason: {
            code: 0,
            codeString: "INVALID_IDENTITY",
            message: "Document store 0x8FC57204C35FB9317D91285EF52D6B892EC08CD3 not found in the registry"
          },
          name: "OpencertsRegistryVerifier",
          status: "INVALID",
          type: "ISSUER_IDENTITY"
        });

        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
      });
    });
    describe("single issuer with document store and DNS-TXT", () => {
      it("should have valid ISSUER_IDENTITY when document has one issuer that is in registry and a valid DNS-TXT record", async () => {
        const fragments = await verifyWithOptionsApplied(
          documentWithOneDocumentStoreIssuerInRegistryAndValidDnsTxt,
          options
        );
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have valid ISSUER_IDENTITY when document has one issuer that is not in registry and a valid DNS-TXT record", async () => {
        const fragments = await verifyWithOptionsApplied(
          documentWithOneDocumentStoreIssuerNotInRegistryAndValidDnsTxt,
          options
        );
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have valid ISSUER_IDENTITY when document has one issuer that is in registry and a invalid DNS-TXT record", async () => {
        const fragments = await verifyWithOptionsApplied(
          documentWithOneDocumentStoreIssuerInRegistryAndInvalidDnsTxt,
          options
        );
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have invalid ISSUER_IDENTITY when document has one issuer that is not in registry and a invalid DNS-TXT record", async () => {
        const fragments = await verifyWithOptionsApplied(
          documentWithOneDocumentStoreIssuerNotInRegistryAndInvalidDnsTxt,
          options
        );
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
      });
    });
    describe("multiple issuer with certificate store", () => {
      it("should have valid ISSUER_IDENTITY when document has two issuers that are in registry", async () => {
        const fragments = await verifyWithOptionsApplied(documentWithTwoCertificateStoreIssuerInRegistry, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have valid ISSUER_IDENTITY when document has two issuers and only one is in registry", async () => {
        const fragments = await verifyWithOptionsApplied(
          documentWithTwoCertificateStoreIssuerWithOneInRegistry,
          options
        );
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have invalid ISSUER_IDENTITY when document has two issuers and none is in registry", async () => {
        const fragments = await verifyWithOptionsApplied(documentWithTwoCertificateStoreIssuerNotInRegistry, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
      });
    });
    describe("multiple issuer with document store and DNS-TXT", () => {
      it("should have valid ISSUER_IDENTITY when document has two issuers that are in registry with valid dns-txt", async () => {
        const fragments = await verifyWithOptionsApplied(
          documentWithTwoDocumentStoreIssuerInRegistryWithValidDnsTxt,
          options
        );
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have valid ISSUER_IDENTITY when document has two issuers, one that is in registry with valid dns-txt and the other being invalid", async () => {
        const fragments = await verifyWithOptionsApplied(
          documentWithTwoDocumentStoreIssuerOneInRegistryWithValidDnsTxtAndSecondInvalid,
          options
        );
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have invalid ISSUER_IDENTITY when document has two issuers, none are in registry and both without valid DNS", async () => {
        const fragments = await verifyWithOptionsApplied(
          documentWithTwoDocumentStoreIssuerNotInRegistryWithoutValidDnsTxt,
          options
        );
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
      });
    });
  });
  describe("errors", () => {
    it("should throw a server error", async () => {
      mockedFetch.mockReturnValueOnce(Promise.resolve(new Response("Error", { status: 500 })));

      const fragments = await verifyWithOptionsApplied(documentMainnetValidWithCertificateStore, {
        network: "homestead"
      });
      expect(fragments.find(fragment => fragment.name === "OpencertsRegistryVerifier")).toMatchInlineSnapshot(`
        Object {
          "name": "OpencertsRegistryVerifier",
          "reason": Object {
            "code": 3,
            "codeString": "SERVER_ERROR",
            "message": "Error while fetching registry",
          },
          "status": "ERROR",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should throw a server error", async () => {
      mockedFetch.mockReturnValueOnce(Promise.reject(new Error("Oh my god! They killed Kenny!")));

      const fragments = await verifyWithOptionsApplied(documentMainnetValidWithCertificateStore, {
        network: "homestead"
      });
      expect(fragments.find(fragment => fragment.name === "OpencertsRegistryVerifier")).toMatchInlineSnapshot(`
        Object {
          "name": "OpencertsRegistryVerifier",
          "reason": Object {
            "code": 4,
            "codeString": "UNEXPECTED_ERROR",
            "message": "Oh my god! They killed Kenny!",
          },
          "status": "ERROR",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
  });
  describe("DENYLIST", () => {
    describe("using DOCUMENT_STORE", () => {
      it("should be invalid when issuer is denied because of the document store without date range", async () => {
        const fragments = await verifyWithOptionsApplied(documentWithDeniedIssuerWithoutRange, options);
        expect(fragments.find(fragment => fragment.name === "OpencertsRegistryVerifier")).toMatchInlineSnapshot(`
          Object {
            "data": Array [
              Object {
                "details": Object {
                  "endDate": undefined,
                  "startDate": undefined,
                  "type": "DOCUMENT_STORE",
                  "value": "0xaaaaaa7890986432123457890234578909865432",
                },
                "reason": Object {
                  "code": 2,
                  "codeString": "DENIED",
                  "message": "Certificate issuer store has been denied",
                },
                "status": "INVALID",
                "value": "0xaaaaaa7890986432123457890234578909865432",
              },
            ],
            "name": "OpencertsRegistryVerifier",
            "reason": Object {
              "code": 2,
              "codeString": "DENIED",
              "message": "Certificate issuer store has been denied",
            },
            "status": "INVALID",
            "type": "ISSUER_IDENTITY",
          }
        `);
      });
      it("should be invalid when issuer is denied because of the document store with start date before today", async () => {
        const fragments = await verifyWithOptionsApplied(documentWithDeniedIssuerWithStartDate, options);
        expect(fragments.find(fragment => fragment.name === "OpencertsRegistryVerifier")).toMatchInlineSnapshot(`
          Object {
            "data": Array [
              Object {
                "details": Object {
                  "endDate": undefined,
                  "startDate": 2020-10-10T00:00:00.000Z,
                  "type": "DOCUMENT_STORE",
                  "value": "0xbbbbbb7890986432123457890234578909865432",
                },
                "reason": Object {
                  "code": 2,
                  "codeString": "DENIED",
                  "message": "Certificate issuer store has been denied",
                },
                "status": "INVALID",
                "value": "0xbbbbbb7890986432123457890234578909865432",
              },
            ],
            "name": "OpencertsRegistryVerifier",
            "reason": Object {
              "code": 2,
              "codeString": "DENIED",
              "message": "Certificate issuer store has been denied",
            },
            "status": "INVALID",
            "type": "ISSUER_IDENTITY",
          }
        `);
      });
      it("should be invalid when issuer is denied because of the document store with end date after today", async () => {
        const fragments = await verifyWithOptionsApplied(documentWithDeniedIssuerWithEndDate, options);
        expect(fragments.find(fragment => fragment.name === "OpencertsRegistryVerifier")).toMatchInlineSnapshot(`
          Object {
            "data": Array [
              Object {
                "details": Object {
                  "endDate": 2050-10-10T00:00:00.000Z,
                  "startDate": undefined,
                  "type": "DOCUMENT_STORE",
                  "value": "0xcccccc7890986432123457890234578909865432",
                },
                "reason": Object {
                  "code": 2,
                  "codeString": "DENIED",
                  "message": "Certificate issuer store has been denied",
                },
                "status": "INVALID",
                "value": "0xcccccc7890986432123457890234578909865432",
              },
            ],
            "name": "OpencertsRegistryVerifier",
            "reason": Object {
              "code": 2,
              "codeString": "DENIED",
              "message": "Certificate issuer store has been denied",
            },
            "status": "INVALID",
            "type": "ISSUER_IDENTITY",
          }
        `);
      });
      it("should be valid when issuer is denied because of the document store with date range in the future", async () => {
        const fragments = await verifyWithOptionsApplied(documentWithDeniedIssuerWithDateRangeInFuture, options);
        expect(fragments.find(fragment => fragment.name === "OpencertsRegistryVerifier")).toMatchInlineSnapshot(`
          Object {
            "data": Array [
              Object {
                "displayCard": false,
                "name": "ROPSTEN: Government Technology Agency of Singapore (GovTech)",
                "status": "VALID",
                "value": "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
              },
            ],
            "name": "OpencertsRegistryVerifier",
            "reason": undefined,
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          }
        `);
      });
    });
    describe("using LOCATION", () => {
      it("should be invalid when issuer is denied because of the location without date range", async () => {
        const fragments = await verifyWithOptionsApplied(documentWithDeniedIssuerLocationWithoutRange, options);
        expect(fragments.find(fragment => fragment.name === "OpencertsRegistryVerifier")).toMatchInlineSnapshot(`
          Object {
            "data": Array [
              Object {
                "details": Object {
                  "endDate": undefined,
                  "startDate": undefined,
                  "type": "LOCATION",
                  "value": "foo.com",
                },
                "reason": Object {
                  "code": 2,
                  "codeString": "DENIED",
                  "message": "Certificate issuer location has been denied",
                },
                "status": "INVALID",
                "value": "foo.com",
              },
            ],
            "name": "OpencertsRegistryVerifier",
            "reason": Object {
              "code": 2,
              "codeString": "DENIED",
              "message": "Certificate issuer location has been denied",
            },
            "status": "INVALID",
            "type": "ISSUER_IDENTITY",
          }
        `);
      });
      it("should be invalid when issuer is denied because of the location subdomain", async () => {
        const fragments = await verifyWithOptionsApplied(documentWithDeniedIssuerLocationOnSubdomain, options);
        expect(fragments.find(fragment => fragment.name === "OpencertsRegistryVerifier")).toMatchInlineSnapshot(`
          Object {
            "data": Array [
              Object {
                "details": Object {
                  "endDate": undefined,
                  "startDate": undefined,
                  "type": "LOCATION",
                  "value": "foo.com",
                },
                "reason": Object {
                  "code": 2,
                  "codeString": "DENIED",
                  "message": "Certificate issuer location has been denied",
                },
                "status": "INVALID",
                "value": "example.foo.com",
              },
            ],
            "name": "OpencertsRegistryVerifier",
            "reason": Object {
              "code": 2,
              "codeString": "DENIED",
              "message": "Certificate issuer location has been denied",
            },
            "status": "INVALID",
            "type": "ISSUER_IDENTITY",
          }
        `);
      });
      it("should be invalid when issuer is denied because of the location with start date before today", async () => {
        const fragments = await verifyWithOptionsApplied(documentWithDeniedIssuerLocationWithStartDate, options);
        expect(fragments.find(fragment => fragment.name === "OpencertsRegistryVerifier")).toMatchInlineSnapshot(`
          Object {
            "data": Array [
              Object {
                "details": Object {
                  "endDate": undefined,
                  "startDate": 2020-10-10T00:00:00.000Z,
                  "type": "LOCATION",
                  "value": "bar.com",
                },
                "reason": Object {
                  "code": 2,
                  "codeString": "DENIED",
                  "message": "Certificate issuer location has been denied",
                },
                "status": "INVALID",
                "value": "bar.com",
              },
            ],
            "name": "OpencertsRegistryVerifier",
            "reason": Object {
              "code": 2,
              "codeString": "DENIED",
              "message": "Certificate issuer location has been denied",
            },
            "status": "INVALID",
            "type": "ISSUER_IDENTITY",
          }
        `);
      });
      it("should be invalid when issuer is denied because of the location with end date after today", async () => {
        const fragments = await verifyWithOptionsApplied(documentWithDeniedIssuerLocationWithEndDate, options);
        expect(fragments.find(fragment => fragment.name === "OpencertsRegistryVerifier")).toMatchInlineSnapshot(`
          Object {
            "data": Array [
              Object {
                "details": Object {
                  "endDate": 2050-10-10T00:00:00.000Z,
                  "startDate": undefined,
                  "type": "LOCATION",
                  "value": "oops.com",
                },
                "reason": Object {
                  "code": 2,
                  "codeString": "DENIED",
                  "message": "Certificate issuer location has been denied",
                },
                "status": "INVALID",
                "value": "oops.com",
              },
            ],
            "name": "OpencertsRegistryVerifier",
            "reason": Object {
              "code": 2,
              "codeString": "DENIED",
              "message": "Certificate issuer location has been denied",
            },
            "status": "INVALID",
            "type": "ISSUER_IDENTITY",
          }
        `);
      });
      it("should be valid when issuer is denied because of the location with date range in the future", async () => {
        const fragments = await verifyWithOptionsApplied(
          documentWithDeniedIssuerLocationWithDateRangeInFuture,
          options
        );
        expect(fragments.find(fragment => fragment.name === "OpencertsRegistryVerifier")).toMatchInlineSnapshot(`
          Object {
            "data": Array [
              Object {
                "displayCard": false,
                "name": "ROPSTEN: Government Technology Agency of Singapore (GovTech)",
                "status": "VALID",
                "value": "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
              },
            ],
            "name": "OpencertsRegistryVerifier",
            "reason": undefined,
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          }
        `);
      });
    });
  });
});
