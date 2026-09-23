import { v7 as uuidv7, validate as validateUuid, version as uuidVersion } from "uuid";

export const newId = (): string => uuidv7();
export const isUuidV7 = (value: string): boolean => validateUuid(value) && uuidVersion(value) === 7;
