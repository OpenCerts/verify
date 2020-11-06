import fetch from "node-fetch";
import { CodedError } from "@govtechsg/oa-verify";
import { DenyList, DenyListRunType, OpencertsRegistryCode, Registry, RegistryVerifierOptions } from "./types";

export const getAllowlist = (): Promise<Registry> => {
  return fetch("https://opencerts.io/static/registry.json").then(res => {
    if (!res.ok) {
      throw new CodedError("Error while fetching registry", OpencertsRegistryCode.SERVER_ERROR, "SERVER_ERROR");
    }
    return res.json();
  });
};

export const getDenyList = async ({ spreadsheetId, spreadsheetKey }: RegistryVerifierOptions): Promise<DenyList[]> => {
  if (!spreadsheetId || !spreadsheetKey) {
    throw new CodedError(
      "Please provide valid spreadsheet parameters for deny list",
      OpencertsRegistryCode.SERVER_ERROR,
      "SERVER_ERROR"
    );
  }
  const range = "Denylist!A:D";
  const { values }: { values: unknown } = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueRenderOption=UNFORMATTED_VALUE&key=${spreadsheetKey}`
  ).then(res => {
    if (!res.ok) {
      throw new CodedError("Error while fetching deny list", OpencertsRegistryCode.SERVER_ERROR, "SERVER_ERROR");
    }
    return res.json();
  });
  // filter the entries from the spreadsheet and only keep one correctly formatted
  return Array.isArray(values)
    ? values
        .map(([type, value, startDate, endDate]) => ({
          type,
          value,
          // TODO should we use UTC here ? hmm
          // https://support.google.com/docs/answer/3092969 transform number to date
          startDate: startDate ? new Date(Date.UTC(1900, 0, startDate - 1)) : undefined,
          endDate: endDate ? new Date(Date.UTC(1900, 0, endDate - 1)) : undefined
        }))
        .reduce((prev, curr) => {
          return DenyListRunType.guard(curr) ? [...prev, curr] : prev;
        }, [] as DenyList[])
    : [];
};
