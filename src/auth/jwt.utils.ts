import { createHmac, timingSafeEqual } from 'crypto';
import type { JwtClaims } from './jwt.types';

function base64UrlDecode(input: string): Buffer {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(padLength);
  return Buffer.from(padded, 'base64');
}

function base64UrlEncode(input: Buffer): string {
  return input
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function signJwtHs256(payload: JwtClaims, secret: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;
  const signature = createHmac('sha256', secret).update(signingInput).digest();
  const sigB64 = base64UrlEncode(signature);
  return `${signingInput}.${sigB64}`;
}

export function verifyJwtHs256(token: string, secret: string): JwtClaims {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const [headerB64, payloadB64, sigB64] = parts;
  const headerJson = base64UrlDecode(headerB64).toString('utf8');
  const header = JSON.parse(headerJson) as { alg?: string; typ?: string };
  if (header.alg !== 'HS256') {
    throw new Error('Unsupported JWT alg');
  }

  const signingInput = `${headerB64}.${payloadB64}`;
  const expectedSig = createHmac('sha256', secret)
    .update(signingInput)
    .digest();
  const providedSig = base64UrlDecode(sigB64);
  if (
    providedSig.length !== expectedSig.length ||
    !timingSafeEqual(providedSig, expectedSig)
  ) {
    throw new Error('Invalid JWT signature');
  }

  const payloadJson = base64UrlDecode(payloadB64).toString('utf8');
  const claims = JSON.parse(payloadJson) as JwtClaims;

  if (!claims.sub) {
    throw new Error('JWT missing sub');
  }

  const now = Math.floor(Date.now() / 1000);
  if (typeof claims.exp === 'number' && claims.exp < now) {
    throw new Error('JWT expired');
  }

  return claims;
}
