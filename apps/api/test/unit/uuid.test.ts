import { describe, expect, it } from "vitest";
import { newId } from "../../src/building-blocks/ids/uuid.js";

describe("UUIDv7 identifiers", () => {
  it("creates valid, time-ordered version 7 UUIDs", () => {
    const ids = Array.from({ length: 32 }, () => newId());
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id[14] === "7")).toBe(true);
    expect([...ids].sort()).toEqual(ids);
  });
});
