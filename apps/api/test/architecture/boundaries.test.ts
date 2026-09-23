import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? sourceFiles(join(directory, entry.name)) : Promise.resolve(entry.name.endsWith(".ts") ? [join(directory, entry.name)] : [])));
  return nested.flat();
}

describe("modular-monolith boundaries", () => {
  it("keeps backend independent of the frontend and controllers out of domain/application layers", async () => {
    const files = await sourceFiles(join(process.cwd(), "src"));
    for (const file of files) {
      const content = await readFile(file, "utf8");
      expect(content, file).not.toMatch(/apps[\\/]web/);
      if (/[\\/](domain|application)[\\/]/.test(file)) expect(content, file).not.toMatch(/from ["'][^"']*api[\\/]/);
    }
  });
});
