# @govtechsg/opencerts-verify

[![CircleCI](https://circleci.com/gh/OpenCerts/verify.svg?style=svg)](https://circleci.com/gh/OpenCerts/verify)

Library to verify any [Opencerts](https://opencerts.io) document. This library extends [@govtechsg/oa-verify](https://github.com/Open-Attestation/oa-verify).

## Installation

```sh
npm install @govtechsg/opencerts-verify
```

## Usage

```typescript
import { documentMainnetValidWithCertificateStore } from "./test/fixtures/v2/document";
import { verify, isValid } from "@govtechsg/opencerts-verify";

const fragments = await verify(documentMainnetValidWithCertificateStore, { network: "goerli" });
console.log(fragments); // see below
console.log(isValid(fragments)); // display true
```

```json
[
  {
    "data": true,
    "status": "VALID",
    "name": "OpenAttestationHash",
    "type": "DOCUMENT_INTEGRITY"
  },
  {
    "data": {
      "details": [
        {
          "address": "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
          "issued": true
        }
      ],
      "issuedOnAll": true
    },
    "status": "VALID",
    "name": "OpenAttestationEthereumDocumentStoreIssued",
    "type": "DOCUMENT_STATUS"
  },
  {
    "message": "Document issuers doesn't have \"tokenRegistry\" property or TOKEN_REGISTRY method",
    "name": "OpenAttestationEthereumTokenRegistryMinted",
    "status": "SKIPPED",
    "type": "DOCUMENT_STATUS"
  },
  {
    "data": {
      "details": [
        {
          "address": "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
          "revoked": false
        }
      ],
      "revokedOnAny": false
    },
    "status": "VALID",
    "name": "OpenAttestationEthereumDocumentStoreRevoked",
    "type": "DOCUMENT_STATUS"
  },
  {
    "message": "Document issuers doesn't have \"documentStore\" / \"tokenRegistry\" property or doesn't use DNS-TXT type",
    "status": "SKIPPED",
    "name": "OpenAttestationDnsTxt",
    "type": "ISSUER_IDENTITY"
  },
  {
    "data": [
      {
        "status": "VALID",
        "value": "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
        "name": "Government Technology Agency of Singapore (GovTech)",
        "displayCard": true,
        "website": "https://www.tech.gov.sg",
        "email": "info@tech.gov.sg",
        "phone": "+65 6211 2100",
        "logo": "/static/images/GOVTECH_logo.png",
        "id": "govtech-registry"
      }
    ],
    "name": "OpencertsRegistryVerifier",
    "status": "VALID",
    "type": "ISSUER_IDENTITY"
  }
]
```

## Differences with @govtechsg/oa-verify

### OpencertsRegistryVerifier

`OpencertsRegistryVerifier` is a new verifier specific to [Opencerts](https://opencerts.io) documents:

-   it ensures document `ISSUER_IDENTITY` and works closely with `OpenAttestationDnsTxt` verifier (see `isValid` below)
-   it returns a `VALID` fragment if at least one of the issuer is in [Opencerts registry](https://opencerts.io/static/registry.json)
-   it returns a `SKIPPED` fragment if none of the issuers is in the registry.

### isValid

With the addition of `OpencertsRegistryVerifier` verifier, different rules apply for `ISSUER_IDENTITY` type verifiers:

-   `ISSUER_IDENTITY` is valid if at least one issuer is in the registry, i.e. if `OpencertsRegistryVerifier` has status `VALID`
-   if `OpencertsRegistryVerifier` doesn't have `VALID` status then all issuers must have valid DNS-TXT record.

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

## License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html)
