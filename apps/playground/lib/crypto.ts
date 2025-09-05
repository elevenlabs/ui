import { webcrypto } from 'crypto';

// Use Node's webcrypto for consistency with Web Crypto API
const crypto = webcrypto as unknown as Crypto;

// Server-side secret key (should be in env var in production)
const SERVER_SECRET =
  process.env.ENCRYPTION_SECRET ||
  'default-server-secret-change-in-production-please!';

/**
 * Derive a consistent encryption key from server secret
 */
async function getServerKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(SERVER_SECRET),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  // Use a fixed salt for consistency (we want the same key every time)
  const salt = enc.encode('elevenlabs-api-key-encryption');

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Encrypt API key with server-side secret
 * Returns base64 string containing: iv|ciphertext
 */
export async function encryptApiKey(apiKey: string): Promise<string> {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await getServerKey();

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(apiKey),
  );

  // Pack iv|ciphertext as base64
  const packed = Buffer.concat([
    Buffer.from(iv),
    Buffer.from(ciphertext),
  ]).toString('base64');

  return packed;
}

/**
 * Decrypt API key with server-side secret
 * Takes base64 string containing: iv|ciphertext
 */
export async function decryptApiKey(packed: string): Promise<string> {
  const buf = Buffer.from(packed, 'base64');
  const iv = new Uint8Array(buf.subarray(0, 12));
  const ciphertext = new Uint8Array(buf.subarray(12));

  const key = await getServerKey();

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext,
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

/**
 * Validate API key with ElevenLabs
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: {
        'xi-api-key': apiKey,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
