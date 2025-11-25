const { parseAge } = require("../src/utils/age");

describe("parseAge", () => {
  test("parses pure digits", () => {
    expect(parseAge("25")).toBe(25);
    expect(parseAge("025")).toBe(25);
  });

  test("extracts digits from text", () => {
    expect(parseAge("a30b")).toBe(30);
    expect(parseAge("Age: 42 yrs")).toBe(42);
  });

  test("handles empty or non-digit strings", () => {
    expect(parseAge("")).toBeNull();
    expect(parseAge("abc")).toBeNull();
    expect(parseAge(null)).toBeNull();
    expect(parseAge(undefined)).toBeNull(); 
  });

  test("handles zero", () => {
    expect(parseAge("0")).toBe(0);
    expect(parseAge("00")).toBe(0);
  });
});
