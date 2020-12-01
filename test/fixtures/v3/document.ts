import { SchemaId, v3, WrappedDocument } from "@govtechsg/open-attestation";

const issuerInRegistry = "0x532C9Ff853CA54370D7492cD84040F9f8099f11B";
const issuerNotInRegistry = "0x8FC57204C35FB9317D91285EF52D6B892EC08CD3";

export const documentWithDocumentStoreIssuerInRegistryAndValidDns: WrappedDocument<v3.OpenAttestationDocument> = {
  version: SchemaId.v3,
  data: {
    reference: "23099a48-5d9f-463e-941f-28fffaabaec7:string:ABCXXXXX00",
    name: "f7da877a-ba98-4317-9434-67b072bd620a:string:Certificate of whatever",
    template: {
      name: "378bfcf7-25f1-4165-b131-06ad9e5293c7:string:CUSTOM_TEMPLATE",
      type: "bbbb19d4-132f-4139-96e5-0c33492d5319:string:EMBEDDED_RENDERER",
      url: "f0b0332b-b6db-4bd0-8ea8-14bd079d61c8:string:http://localhost:3000/rederer",
    },
    validFrom: "5a7063dd-f8be-45df-931d-75080bd5c701:string:2018-08-30T00:00:00+08:00",
    proof: {
      type: "ba78d365-b039-46fa-a843-b96005a9b49c:string:OpenAttestationSignature2018",
      method: "f0bb4f79-c8a3-476b-8e51-d947d0406047:string:DOCUMENT_STORE",
      value: `0b9bbe75-8421-4e70-a176-cba76843216d:string:${issuerInRegistry}`,
    },
    issuer: {
      id: "43f69633-d31a-443b-a3ff-d06ec10583e5:string:https://example.com",
      name: "1e98660f-b351-4d58-8787-9950a5fc51ad:string:Issuer name",
      identityProof: {
        type: "997589bb-9d9d-4879-b640-18c55df22ff8:string:DNS-TXT",
        location: "52eafb04-2edf-4419-b3fd-5c576e23205c:string:example.openattestation.com",
      },
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};
export const documentWithDocumentStoreIssuerInRegistryAndInvalidDns: WrappedDocument<v3.OpenAttestationDocument> = {
  version: SchemaId.v3,
  data: {
    reference: "23099a48-5d9f-463e-941f-28fffaabaec7:string:ABCXXXXX00",
    name: "f7da877a-ba98-4317-9434-67b072bd620a:string:Certificate of whatever",
    template: {
      name: "378bfcf7-25f1-4165-b131-06ad9e5293c7:string:CUSTOM_TEMPLATE",
      type: "bbbb19d4-132f-4139-96e5-0c33492d5319:string:EMBEDDED_RENDERER",
      url: "f0b0332b-b6db-4bd0-8ea8-14bd079d61c8:string:http://localhost:3000/rederer",
    },
    validFrom: "5a7063dd-f8be-45df-931d-75080bd5c701:string:2018-08-30T00:00:00+08:00",
    proof: {
      type: "ba78d365-b039-46fa-a843-b96005a9b49c:string:OpenAttestationSignature2018",
      method: "f0bb4f79-c8a3-476b-8e51-d947d0406047:string:DOCUMENT_STORE",
      value: `0b9bbe75-8421-4e70-a176-cba76843216d:string:${issuerInRegistry}`,
    },
    issuer: {
      id: "43f69633-d31a-443b-a3ff-d06ec10583e5:string:https://example.com",
      name: "1e98660f-b351-4d58-8787-9950a5fc51ad:string:Issuer name",
      identityProof: {
        type: "997589bb-9d9d-4879-b640-18c55df22ff8:string:DNS-TXT",
        location: "52eafb04-2edf-4419-b3fd-5c576e23205c:string:no.no.com",
      },
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};
export const documentWithDocumentStoreIssuerNotInRegistryAndValidDns: WrappedDocument<v3.OpenAttestationDocument> = {
  version: SchemaId.v3,
  data: {
    reference: "23099a48-5d9f-463e-941f-28fffaabaec7:string:ABCXXXXX00",
    name: "f7da877a-ba98-4317-9434-67b072bd620a:string:Certificate of whatever",
    template: {
      name: "378bfcf7-25f1-4165-b131-06ad9e5293c7:string:CUSTOM_TEMPLATE",
      type: "bbbb19d4-132f-4139-96e5-0c33492d5319:string:EMBEDDED_RENDERER",
      url: "f0b0332b-b6db-4bd0-8ea8-14bd079d61c8:string:http://localhost:3000/rederer",
    },
    validFrom: "5a7063dd-f8be-45df-931d-75080bd5c701:string:2018-08-30T00:00:00+08:00",
    proof: {
      type: "ba78d365-b039-46fa-a843-b96005a9b49c:string:OpenAttestationSignature2018",
      method: "f0bb4f79-c8a3-476b-8e51-d947d0406047:string:DOCUMENT_STORE",
      value: `0b9bbe75-8421-4e70-a176-cba76843216d:string:${issuerNotInRegistry}`,
    },
    issuer: {
      id: "43f69633-d31a-443b-a3ff-d06ec10583e5:string:https://example.com",
      name: "1e98660f-b351-4d58-8787-9950a5fc51ad:string:Issuer name",
      identityProof: {
        type: "997589bb-9d9d-4879-b640-18c55df22ff8:string:DNS-TXT",
        location: "52eafb04-2edf-4419-b3fd-5c576e23205c:string:example.openattestation.com",
      },
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};

export const documentWithDocumentStoreIssuerNotInRegistryAndInvalidDns: WrappedDocument<v3.OpenAttestationDocument> = {
  version: SchemaId.v3,
  data: {
    reference: "23099a48-5d9f-463e-941f-28fffaabaec7:string:ABCXXXXX00",
    name: "f7da877a-ba98-4317-9434-67b072bd620a:string:Certificate of whatever",
    template: {
      name: "378bfcf7-25f1-4165-b131-06ad9e5293c7:string:CUSTOM_TEMPLATE",
      type: "bbbb19d4-132f-4139-96e5-0c33492d5319:string:EMBEDDED_RENDERER",
      url: "f0b0332b-b6db-4bd0-8ea8-14bd079d61c8:string:http://localhost:3000/rederer",
    },
    validFrom: "5a7063dd-f8be-45df-931d-75080bd5c701:string:2018-08-30T00:00:00+08:00",
    proof: {
      type: "ba78d365-b039-46fa-a843-b96005a9b49c:string:OpenAttestationSignature2018",
      method: "f0bb4f79-c8a3-476b-8e51-d947d0406047:string:DOCUMENT_STORE",
      value: `0b9bbe75-8421-4e70-a176-cba76843216d:string:${issuerNotInRegistry}`,
    },
    issuer: {
      id: "43f69633-d31a-443b-a3ff-d06ec10583e5:string:https://example.com",
      name: "1e98660f-b351-4d58-8787-9950a5fc51ad:string:Issuer name",
      identityProof: {
        type: "997589bb-9d9d-4879-b640-18c55df22ff8:string:DNS-TXT",
        location: "52eafb04-2edf-4419-b3fd-5c576e23205c:string:no.no.com",
      },
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "abcd",
    proof: [],
    merkleRoot: "abcd",
  },
};

export const documentRopstenValidWithDocumentStore: WrappedDocument<v3.OpenAttestationDocument> = {
  version: SchemaId.v3,
  data: {
    reference: "8354acc7-74ab-4cab-be1c-1bf1e10a6920:string:ABCXXXXX00",
    name: "1c1df86c-168e-4519-805b-f38698e5b00e:string:Certificate of whatever",
    template: {
      name: "a63b3426-3aeb-4f99-a88c-18c99940e108:string:CUSTOM_TEMPLATE",
      type: "514a184c-c68c-42dd-816a-133d58dad24d:string:EMBEDDED_RENDERER",
      url: "cabe4859-a1e6-4394-a88f-4a3bb30e05ae:string:http://localhost:3000/rederer",
    },
    validFrom: "b72d0f94-e7a0-47b8-bbb2-91bc7397c406:string:2018-08-30T00:00:00+08:00",
    proof: {
      type: "0a9e819c-1e18-4c6e-bd2b-0d34e97e3d27:string:OpenAttestationSignature2018",
      method: "006b1ad2-c284-4373-9742-b83ab97bf173:string:DOCUMENT_STORE",
      value: "434d9cf9-5ce1-4ac0-a960-4badd935834c:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
    },
    issuer: {
      id: "dca00886-d384-4218-bbf5-9699f2a6f274:string:https://example.com",
      name: "d8b5c027-69ce-4c6d-93e0-ef72da26ae36:string:Issuer name",
      identityProof: {
        type: "1c5ce8f4-7fcc-4285-9d33-5d3c38c53ad1:string:DNS-TXT",
        location: "79009458-fdd6-42fe-a3b9-d13ac8d4ca91:string:some.io",
      },
    },
  },
  privacy: {
    obfuscatedData: [],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "7f42e288dfdb20e7f9a62329adf1f3ad8eed0345a2c517ee7af3e9e88d02a5cd",
    proof: [],
    merkleRoot: "7f42e288dfdb20e7f9a62329adf1f3ad8eed0345a2c517ee7af3e9e88d02a5cd",
  },
};
