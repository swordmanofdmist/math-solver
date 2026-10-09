import { describe, expect, it } from "vitest";
import {
  getLocale,
  supportedLocales,
  translations,
} from "../src/lib/i18n";

describe("internationalization", () => {
  it("offers English and Macedonian", () => {
    expect(supportedLocales).toEqual(["en", "mk"]);
    expect(translations.mk.common.language).toBe("Јазик");
    expect(translations.mk.derivative.solve).toBe("Пресметај извод");
  });

  it("falls back to English for unknown locales", () => {
    expect(getLocale("mk")).toBe("mk");
    expect(getLocale("de")).toBe("en");
    expect(getLocale()).toBe("en");
  });

  it("omits redundant exponents from first-order derivatives", () => {
    expect(translations.en.derivative.resultText(1, "x", "x^2", "2*x")).toBe(
      "d/dx (x^2) = 2*x",
    );
    expect(translations.en.derivative.resultText(2, "x", "x^3", "6*x")).toBe(
      "d^2/dx^2 (x^3) = 6*x",
    );
  });
});
