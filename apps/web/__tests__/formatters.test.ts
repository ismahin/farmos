import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  formatWeightGrams,
  formatWeightKg,
} from "@/lib/formatters";

describe("Display Formatters", () => {
  test("formats currency in USD correctly", () => {
    const formatted = formatCurrency(2500, "USD");
    expect(formatted).toContain("2,500");
    expect(formatted).toContain("$");
  });

  test("formats large numbers with commas", () => {
    expect(formatNumber(10000)).toBe("10,000");
    expect(formatNumber(9820)).toBe("9,820");
  });

  test("formats weight in kg", () => {
    expect(formatWeightKg(1200)).toBe("1,200 kg");
  });

  test("formats weight in grams with conversion to kg for >= 1000g", () => {
    expect(formatWeightGrams(450)).toBe("450 g");
    expect(formatWeightGrams(1450)).toBe("1.45 kg");
    expect(formatWeightGrams(2050)).toBe("2.05 kg");
  });

  test("formats percentage with specified decimals", () => {
    expect(formatPercent(98.24, 1)).toBe("98.2%");
    expect(formatPercent(3.6, 2)).toBe("3.60%");
  });

  test("formats ISO date string", () => {
    const formatted = formatDate("2026-09-22");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("Sep");
  });
});

