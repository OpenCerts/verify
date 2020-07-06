import { v2, WrappedDocument } from "@govtechsg/open-attestation";
interface CustomDocument extends v2.OpenAttestationDocument {
    name: string;
    issuedOn: string;
    $template: string;
    recipient: {
        name: string;
    };
}
export declare const documentMainnetValidWithCertificateStore: WrappedDocument<CustomDocument>;
export declare const documentWithOneCertificateStoreIssuerInRegistry: WrappedDocument<v2.OpenAttestationDocument>;
export declare const documentWithOneCertificateStoreIssuerNotInRegistry: WrappedDocument<v2.OpenAttestationDocument>;
export declare const documentWithOneDocumentStoreIssuerInRegistryAndValidDnsTxt: WrappedDocument<v2.OpenAttestationDocument>;
export declare const documentWithOneDocumentStoreIssuerNotInRegistryAndValidDnsTxt: WrappedDocument<v2.OpenAttestationDocument>;
export declare const documentWithOneDocumentStoreIssuerInRegistryAndInvalidDnsTxt: WrappedDocument<v2.OpenAttestationDocument>;
export declare const documentWithOneDocumentStoreIssuerNotInRegistryAndInvalidDnsTxt: WrappedDocument<v2.OpenAttestationDocument>;
export declare const documentWithTwoCertificateStoreIssuerInRegistry: WrappedDocument<v2.OpenAttestationDocument>;
export declare const documentWithTwoDocumentStoreIssuerInRegistryWithValidDnsTxt: WrappedDocument<v2.OpenAttestationDocument>;
export declare const documentWithTwoDocumentStoreIssuerOneInRegistryWithValidDnsTxtAndSecondInvalid: WrappedDocument<v2.OpenAttestationDocument>;
export declare const documentWithTwoDocumentStoreIssuerNotInRegistryWithoutValidDnsTxt: WrappedDocument<v2.OpenAttestationDocument>;
export declare const documentWithTwoCertificateStoreIssuerWithOneInRegistry: WrappedDocument<v2.OpenAttestationDocument>;
export declare const documentWithTwoCertificateStoreIssuerNotInRegistry: WrappedDocument<v2.OpenAttestationDocument>;
export {};
