/*
  Jest smoke test for Gemini environment key.
  This file intentionally avoids importing or calling any Gemini SDK at
  module scope so Jest can safely parse and run it in any environment.
*/

describe('Gemini environment', () => {
  test('GEMINI_API_KEY is present and non-empty', () => {
    const key = process.env.GEMINI_API_KEY;
    expect(key).toBeDefined();
    expect(String(key).trim().length).toBeGreaterThan(0);
  });
});
