import { getStatusConfig, statusMap } from "@/lib/status";

describe("Product Status Language", () => {
  test("returns valid configuration for ACTIVE status", () => {
    const config = getStatusConfig("ACTIVE");
    expect(config.label).toBe("Active");
    expect(config.tone).toBe("emerald");
    expect(config.badgeClass).toContain("bg-emerald-50");
  });

  test("returns valid configuration for CRITICAL status", () => {
    const config = getStatusConfig("CRITICAL");
    expect(config.label).toBe("Critical");
    expect(config.tone).toBe("rose");
    expect(config.dotClass).toContain("animate-pulse");
  });

  test("returns valid configuration for PENDING_APPROVAL status", () => {
    const config = getStatusConfig("PENDING_APPROVAL");
    expect(config.label).toBe("Pending Approval");
    expect(config.tone).toBe("amber");
  });

  test("handles lowercase input gracefully", () => {
    const config = getStatusConfig("warning");
    expect(config.label).toBe("Warning");
    expect(config.tone).toBe("amber");
  });

  test("falls back cleanly for unknown status", () => {
    const config = getStatusConfig("UNKNOWN_STATE");
    expect(config.label).toBe("UNKNOWN_STATE");
    expect(config.tone).toBe("slate");
  });
});

