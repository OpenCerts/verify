import { InstanceOf, Literal, Partial, Record, Static, String, Union } from "runtypes";

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

export const DenyListRunType = Record({
  type: Union(Literal("DOCUMENT_STORE"), Literal("LOCATION")),
  value: String
}).And(
  Partial({
    // in the event endDate is not provided, the default value will be an empty string (spreadsheet behaviour)
    startDate: InstanceOf(Date),
    endDate: InstanceOf(Date)
  })
);
export type DenyList = Static<typeof DenyListRunType>;

// NEVER EVER REPLACE OR CHANGE A VALUE :)
// code for errors and invalid fragment
export enum OpencertsRegistryCode {
  INVALID_IDENTITY = 0,
  SKIPPED = 1,
  DENIED = 2,
  SERVER_ERROR = 3,
  UNEXPECTED_ERROR = 4
}

export interface RegistryVerifierOptions {
  spreadsheetId: string;
  spreadsheetKey: string;
}
