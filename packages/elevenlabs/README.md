# AI SDK - ElevenLabs Provider

The **[ElevenLabs provider](https://elevenlabs.dev/providers/elevenlabs-providers/elevenlabs)** for the [AI SDK](https://elevenlabs.dev/docs)
contains language model support for the ElevenLabs chat and completion APIs and embedding model support for the ElevenLabs embeddings API.

## Setup

The ElevenLabs provider is available in the `@elevenlabs/elevenlabs` module. You can install it with

```bash
npm i @elevenlabs/elevenlabs
```

## Provider Instance

You can import the default provider instance `elevenlabs` from `@elevenlabs/elevenlabs`:

```ts
import { elevenlabs } from '@elevenlabs/elevenlabs';
```

## Example

```ts
import { elevenlabs } from '@elevenlabs/elevenlabs';
import { experimental_transcribe as transcribe } from 'ai';

const { text } = await transcribe({
  model: elevenlabs.transcription('scribe_v1'),
  audio: new URL(
    'https://github.com/vercel/ai/raw/refs/heads/main/examples/ai-core/data/galileo.mp3',
  ),
});
```

## Documentation

Please check out the **[ElevenLabs provider documentation](https://elevenlabs.dev/providers/elevenlabs-providers/elevenlabs)** for more information.
