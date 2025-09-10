'use server';

import { ElevenLabs, ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { getStoredApiKey } from '@/app/actions/utils';

export async function getAgent(
  id: string,
): Promise<ElevenLabs.GetAgentResponseModel> {
  try {
    const apiKey = await getStoredApiKey();
    const client = new ElevenLabsClient({ apiKey });

    const response = await client.conversationalAi.agents.get(id);

    return response;
  } catch (error) {
    throw error;
  }
}
