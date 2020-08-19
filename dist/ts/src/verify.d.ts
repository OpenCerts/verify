import { Verifier, VerificationFragment, VerificationFragmentType, VerificationManagerOptions } from "@govtechsg/oa-verify";
import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
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
export declare type OpencertsRegistryVerificationFragmentData = Partial<RegistryEntry> & {
    value: string;
    status: "VALID" | "INVALID";
};
export declare const type = "ISSUER_IDENTITY";
export declare const name = "OpencertsRegistryVerifier";
export declare enum OpencertsRegistryCode {
    INVALID_IDENTITY = 0,
    SKIPPED = 1
}
export declare const registryVerifier: Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>, VerificationManagerOptions, OpencertsRegistryVerificationFragmentData | OpencertsRegistryVerificationFragmentData[]>;
export declare const isValid: (verificationFragments: VerificationFragment<any>[], types?: VerificationFragmentType[]) => boolean;
export declare const verify: (document: WrappedDocument<v3.OpenAttestationDocument> | WrappedDocument<v2.OpenAttestationDocument>, options: VerificationManagerOptions) => Promise<VerificationFragment[]>;
