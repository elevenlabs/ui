import { cookies } from 'next/headers';
import { decryptApiKey } from '@/lib/crypto';

export async function getStoredApiKey(): Promise<string> {
  const cookieStore = await cookies();
  const encryptedKey = cookieStore.get('el_session')?.value;

  if (!encryptedKey) {
    throw new Error(
      'No ElevenLabs API key found. Please add your API key using the key icon in the header.',
    );
  }

  const apiKey = await decryptApiKey(encryptedKey);
  return apiKey;
}
