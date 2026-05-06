import { describe, expect, it } from "vitest";
import { formatBRL } from "../../lib/format/currency";

describe("formatBRL", () => {
  it("formats 0 cents", () => {
    expect(formatBRL(0)).toBe("R$ 0,00");
  });
  it("formats 1 cent", () => {
    expect(formatBRL(1)).toBe("R$ 0,01");
  });
  it("formats 99 cents", () => {
    expect(formatBRL(99)).toBe("R$ 0,99");
  });
  it("formats 8990 (R$ 89,90)", () => {
    expect(formatBRL(8990)).toBe("R$ 89,90");
  });
  it("formats 9590 (peça canônica R$ 95,90)", () => {
    expect(formatBRL(9590)).toBe("R$ 95,90");
  });
  it("formats 100000 com separador de milhares (R$ 1.000,00)", () => {
    expect(formatBRL(100000)).toBe("R$ 1.000,00");
  });
  it("formats 1234567 (R$ 12.345,67)", () => {
    expect(formatBRL(1234567)).toBe("R$ 12.345,67");
  });
  it("usa space normal (não no-break space) entre R$ e número", () => {
    const formatted = formatBRL(9590);
    expect(formatted).toContain("R$ 9");
    expect(formatted).not.toContain(" ");
  });
  it("throws em valor negativo", () => {
    expect(() => formatBRL(-100)).toThrow(/não-negativo/);
  });
  it("throws em decimal", () => {
    expect(() => formatBRL(89.5)).toThrow(/inteiro/);
  });
  it("throws em Infinity", () => {
    expect(() => formatBRL(Number.POSITIVE_INFINITY)).toThrow();
  });
  it("throws em NaN", () => {
    expect(() => formatBRL(Number.NaN)).toThrow();
  });
});
