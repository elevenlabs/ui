# AI SDK - Gateway Provider

The Gateway provider for the [AI SDK](https://elevenlabs.dev/docs) allows the use of a wide variety of AI models and providers.

## Setup

The Gateway provider is available in the `@elevenlabs/gateway` module. You can install it with

```bash
npm i @elevenlabs/gateway
```

## Provider Instance

You can import the default provider instance `gateway` from `@elevenlabs/gateway`:

```ts
import { gateway } from '@elevenlabs/gateway';
```

## Example

```ts
import { gateway } from '@elevenlabs/gateway';
import { generateText } from 'ai';

const { text } = await generateText({
  model: gateway('xai/grok-3-beta'),
  prompt:
    'Tell me about the history of the San Francisco Mission-style burrito.',
});
```

## Documentation

Please check out the [AI SDK documentation](https://elevenlabs.dev/docs) for more information.
