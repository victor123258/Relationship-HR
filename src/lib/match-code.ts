/**
 * 6-character match codes using an unambiguous alphabet
 * (no O/0, I/1 confusion possible).
 */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateMatchCode(): string {
  const chars: string[] = [];
  const cryptoObj = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  for (let i = 0; i < 6; i++) {
    if (cryptoObj?.getRandomValues) {
      const buf = new Uint8Array(1);
      cryptoObj.getRandomValues(buf);
      chars.push(ALPHABET[buf[0] % ALPHABET.length]);
    } else {
      chars.push(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
    }
  }
  return chars.join("");
}

export function normalizeMatchCode(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

export function isValidMatchCode(code: string): boolean {
  if (!/^[A-Z0-9]{6}$/.test(code)) return false;
  // reject codes containing ambiguous characters
  return !/[O0I1]/.test(code);
}
