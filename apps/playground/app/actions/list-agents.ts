'use server';

import { ElevenLabs, ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { getStoredApiKey } from '@/app/actions/utils';

export async function listAgents(
  params: ElevenLabs.conversationalAi.agents.AgentsListRequest = {},
): Promise<ElevenLabs.GetAgentsPageResponseModel> {
  try {
    const apiKey = await getStoredApiKey();
    const client = new ElevenLabsClient({ apiKey });

    const response = await client.conversationalAi.agents.list({
      ...(params.search && { search: params.search }),
      ...(params.cursor && { cursor: params.cursor }),
      ...(params.pageSize && { pageSize: params.pageSize }),
    });

    return response;
  } catch (error) {
    throw error;
  }
}
