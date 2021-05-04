import { SchemaId, v2, WrappedDocument } from "@govtechsg/open-attestation";

const issuerInRegistry = "0x532C9Ff853CA54370D7492cD84040F9f8099f11B";
const issuerInRegistry2 = "0xdcA6Eea7024151c270b50FcA9E67161119B06BAD";
const issuerNotInRegistry = "0x8FC57204C35FB9317D91285EF52D6B892EC08CD3";
const issuerNotInRegistry2 = "0x64A51C250D3fC5838B757a5311dE3CE8Ae1c4C04";

interface CustomDocument extends v2.OpenAttestationDocument {
  name: string;
  issuedOn: string;
  $template: string;
  recipient: {
    name: string;
  };
}

export const documentMainnetValidWithCertificateStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  schema: "opencerts/1.4",
  data: {
    id: "ab89a9ae-954f-4d28-8b48-2a534d3a3d60:string:2018-SAF-01",
    $template: "2d00853b-43ae-4bc9-82a2-c614ec0fca49:string:SG-GOVTECH-OPENCERTS",
    name: "9a4499fa-8f68-43d8-b42b-57dc365ab249:string:Certified OpenCerts Associate",
    issuedOn: "60bf1feb-e373-4757-8a5d-cf485199bf7a:string:2018-11-30T15:00:00+08:00",
    issuers: [
      {
        name: "a8d46c32-2e35-4f4e-99b1-f8a5acb04180:string:GovTech",
        certificateStore: "9f3ffc2c-2e06-4a9d-a762-8449aec4ca9e:string:0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
      },
    ],
    recipient: {
      name: "d93f6840-0219-4f16-991e-d02fae161c6b:string:Jonathan Tay",
    },
  },
  privacy: {
    obfuscatedData: [
      "38c3bb23e0e0bb29d1e6efecc25ff6f95cf4bc05e6310e767f2ebd3eac766fa9",
      "825aff8c9c91518b75aaa583ee72f182fa3b40a2c09d9a2e1092b6b5d8ed0b7d",
      "54ea1052e0a5dd98a1a674b14af0f21aa8a3d7a23d6c90adcebc1215622fb0d2",
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "5b5ed60a40d445c58ffa21e73d11a98acc04be538ab9729da5066f75f0eaddb4",
    proof: [
      "86874cd45a74f39759c21028ddacb6b45c56cd1b36203a874d91d3ef276eab7b",
      "cd6d9d9a5969a6c5f428b7b4d8e854a798143072371f477bf09145a66951a9d8",
      "6e78b6b1bfc66f4f34fe70f97d3e91bcc318f17916394eab95cf15e2e20ac63e",
    ],
    merkleRoot: "1a040999254caaf7a33cba67ec6a9b862da1dacf8a0d1e3bb76347060fc615d6",
  },
};

export const documentWithOneCertificateStoreIssuerInRegistry: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        certificateStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerInRegistry}`,
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};
export const documentWithOneCertificateStoreIssuerNotInRegistry: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        certificateStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerNotInRegistry}`,
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};
export const documentWithOneDocumentStoreIssuerInRegistryAndValidDnsTxt: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        documentStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerInRegistry}`,
        identityProof: {
          type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
          location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.openattestation.com",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};
export const documentWithOneDocumentStoreIssuerNotInRegistryAndValidDnsTxt: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        documentStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerNotInRegistry}`,
        identityProof: {
          type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
          location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.openattestation.com",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};
export const documentWithOneDocumentStoreIssuerInRegistryAndInvalidDnsTxt: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        documentStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerInRegistry}`,
        identityProof: {
          type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
          location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:no.no.com",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};
export const documentWithOneDocumentStoreIssuerNotInRegistryAndInvalidDnsTxt: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        documentStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerNotInRegistry}`,
        identityProof: {
          type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
          location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:no.no.com",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};

export const documentWithTwoCertificateStoreIssuerInRegistry: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        certificateStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerInRegistry}`.toLowerCase(),
      },
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        certificateStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerInRegistry2}`,
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};

export const documentWithTwoDocumentStoreIssuerInRegistryWithValidDnsTxt: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        documentStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerInRegistry}`,
        identityProof: {
          type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
          location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.openattestation.com",
        },
      },
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        documentStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerInRegistry2}`,
        identityProof: {
          type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
          location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.openattestation.com",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};
export const documentWithTwoDocumentStoreIssuerOneInRegistryWithValidDnsTxtAndSecondInvalid: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        documentStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerInRegistry}`,
        identityProof: {
          type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
          location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.openattestation.com",
        },
      },
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        documentStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerNotInRegistry}`,
        identityProof: {
          type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
          location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:no.no.com",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};
export const documentWithTwoDocumentStoreIssuerNotInRegistryWithoutValidDnsTxt: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        documentStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerNotInRegistry}`,
        identityProof: {
          type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
          location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:no.no.com",
        },
      },
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        documentStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerNotInRegistry2}`,
        identityProof: {
          type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
          location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:no.no.com",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};

export const documentWithTwoCertificateStoreIssuerWithOneInRegistry: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        certificateStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:0x${"532C9Ff853CA54370D7492cD84040F9f8099f11B".toUpperCase()}`,
      },
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        certificateStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerNotInRegistry}`,
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};

export const documentWithTwoCertificateStoreIssuerNotInRegistry: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        certificateStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerNotInRegistry}`,
      },
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        certificateStore: `4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:${issuerNotInRegistry2}`,
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};

export const documentDnsDidSigned: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "9a472a0a-42db-4559-baf2-90d6fcc2b113:string:SGCNM21566325",
    $template: {
      name: "e2da3963-d070-43e0-9cce-888886cd3173:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "f6b1b012-7dcb-4725-952d-228708746a21:string:EMBEDDED_RENDERER",
      url: "f64728c6-b985-465c-a31c-d2c98d5e055a:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        id: "27f71dea-839c-4484-8a72-72f974a3c093:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        name: "cc8465bc-4432-47cf-94bf-0ee0c8c49c22:string:DEMO STORE",
        revocation: { type: "85debc04-1698-4a1b-b6ac-7ef7e8f9d4b4:string:NONE" },
        identityProof: {
          type: "767bd2d0-f1e4-4471-81a0-c4056d42f592:string:DNS-DID",
          key:
            "5edf0191-5492-4659-891b-84e68793c9be:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          location: "ad412e6a-a9b6-40e6-bb17-18b097d86833:string:example.tradetrust.io",
        },
      },
    ],
    recipient: {
      name: "243cdac1-8d75-47ca-a4f3-b9e305f16f50:string:SG FREIGHT",
      address: {
        street: "241f4d4f-ddeb-4344-a0e5-6a766b664c38:string:101 ORCHARD ROAD",
        country: "b66e2078-1bb2-41e3-b60b-0a16b6b79639:string:SINGAPORE",
      },
    },
    consignment: {
      description: "77d0a5c6-e383-485c-b0bf-1439a1f67ae4:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "cd54295b-e569-4461-8b3d-5eae4f12f86d:number:5000",
        unit: "c4f4b1b4-3f05-469c-9f79-8eea65cfb9e1:string:LITRES",
      },
      countryOfOrigin: "89377474-29b7-44eb-8a2e-d2d8f4c2ba25:string:AUSTRALIA",
      outwardBillNo: "8c8e7f1b-6ec0-429f-8536-739b149507f9:string:AQSIQ170923130",
      dateOfDischarge: "32ef239d-d98a-4712-a40a-330d39d4db16:string:2018-01-26",
      dateOfDeparture: "a068e31d-9f2b-4698-b4d0-69bf9181d1d6:string:2018-01-30",
      countryOfFinalDestination: "2ef9d520-dd2c-4076-a2af-bf1e6bd9bd61:string:CHINA",
      outgoingVehicleNo: "099c443a-c51e-4446-ae2c-0ba90d6d2510:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "b9915d76-bf07-427d-952d-2c77eca55cc3:string:PETER LEE",
      designation: "d04e3577-515c-4fad-aa66-47319ce3b970:string:SHIPPING MANAGER",
      date: "ffd492e3-88f6-4803-a2eb-1a6395197909:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "d0ebc96b62001b10348d3f9931f91b3c7aa421445f9719a984d67c22465a86c5",
    proof: [],
    merkleRoot: "d0ebc96b62001b10348d3f9931f91b3c7aa421445f9719a984d67c22465a86c5",
  },
  proof: [
    {
      type: "OpenAttestationSignature2018",
      proofPurpose: "assertionMethod",
      created: "2021-03-25T07:52:31.291Z",
      verificationMethod: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature:
        "0xd05bb71bdb6f78451e2d12851825421666c6c5e355f516325ce5002a0586f89f6ebbd465227bec59c745dd26918dd8dab9122dcd398256d8e487e0ecf82a53421b",
    },
  ],
};
