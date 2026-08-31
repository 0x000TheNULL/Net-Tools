function bytesToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function hashText(value: string, algorithm: 'MD5' | 'SHA-1' | 'SHA-256') {
  if (algorithm === 'MD5') return md5(value);
  return bytesToHex(await crypto.subtle.digest(algorithm, new TextEncoder().encode(value)));
}

export function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

export function decodeBase64(value: string) {
  const binary = atob(value.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

// Compact, dependency-free MD5 implementation for local utility use.
function md5(input: string) {
  const add = (a: number, b: number) => (a + b) | 0;
  const rotate = (value: number, shift: number) => (value << shift) | (value >>> (32 - shift));
  const cmn = (q: number, a: number, b: number, x: number, s: number, t: number) => add(rotate(add(add(a, q), add(x, t)), s), b);
  const ff = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => cmn((b & c) | (~b & d), a, b, x, s, t);
  const gg = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => cmn((b & d) | (c & ~d), a, b, x, s, t);
  const hh = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => cmn(b ^ c ^ d, a, b, x, s, t);
  const ii = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => cmn(c ^ (b | ~d), a, b, x, s, t);
  const bytes = [...new TextEncoder().encode(input)];
  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 0; i < 8; i += 1) bytes.push(Math.floor(bitLength / 2 ** (8 * i)) & 255);
  let a0 = 0x67452301 | 0, b0 = 0xefcdab89 | 0, c0 = 0x98badcfe | 0, d0 = 0x10325476 | 0;
  const shifts = [7,12,17,22, 5,9,14,20, 4,11,16,23, 6,10,15,21];
  const constants = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0);
  for (let offset = 0; offset < bytes.length; offset += 64) {
    const words = Array.from({ length: 16 }, (_, i) => (
      bytes[offset + i * 4] | (bytes[offset + i * 4 + 1] << 8) |
      (bytes[offset + i * 4 + 2] << 16) | (bytes[offset + i * 4 + 3] << 24)
    ));
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i += 1) {
      let next: number;
      const round = Math.floor(i / 16);
      const index = round === 0 ? i : round === 1 ? (5 * i + 1) % 16 : round === 2 ? (3 * i + 5) % 16 : (7 * i) % 16;
      const shift = shifts[round * 4 + (i % 4)];
      if (round === 0) next = ff(a, b, c, d, words[index], shift, constants[i]);
      else if (round === 1) next = gg(a, b, c, d, words[index], shift, constants[i]);
      else if (round === 2) next = hh(a, b, c, d, words[index], shift, constants[i]);
      else next = ii(a, b, c, d, words[index], shift, constants[i]);
      [a, b, c, d] = [d, next, b, c];
    }
    a0 = add(a0, a); b0 = add(b0, b); c0 = add(c0, c); d0 = add(d0, d);
  }
  return [a0, b0, c0, d0].map((word) =>
    [0,8,16,24].map((shift) => ((word >>> shift) & 255).toString(16).padStart(2, '0')).join(''),
  ).join('');
}
