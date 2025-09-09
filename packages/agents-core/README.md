# ElevenLabs JavaScript Client Library

An SDK library for using ElevenLabs in browser based applications. If you're looking for a Node.js library, please refer to the [ElevenLabs Node.js Library](https://www.npmjs.com/package/elevenlabs).

> Note that this library is launching to primarily support Conversational AI. The support for speech synthesis and other more generic use cases is planned for the future.

![LOGO](https://github.com/elevenlabs/elevenlabs-python/assets/12028621/21267d89-5e82-4e7e-9c81-caf30b237683)
[![Discord](https://badgen.net/badge/black/ElevenLabs/icon?icon=discord&label)](https://discord.gg/elevenlabs)
[![Twitter](https://badgen.net/badge/black/elevenlabsio/icon?icon=twitter&label)](https://twitter.com/elevenlabsio)

## Installation

Install the package in your project through package manager.

```shell
npm install @elevenlabs/client
# or
yarn add @elevenlabs/client
# or
pnpm install @elevenlabs/client
```

## Usage

This library is primarily meant for development in vanilla JavaScript projects, or as a base for libraries tailored to specific frameworks.
It is recommended to check whether your specific framework has it's own library.
However, you can use this library in any JavaScript-based project.

### Connection types

A conversation can be started via one of two connection types: WebSockets (the default) or WebRTC.

### Initialize conversation

First, initialize the Conversation instance:

```js
const conversation = await Conversation.startSession(options);
```

This will kick off the websocket connection and start using microphone to communicate with the ElevenLabs Conversational AI agent. Consider explaining and allowing microphone access in your apps UI before the Conversation kicks off. The microphone may also be blocked for the current page by default, resulting in the allow prompt not showing up at all. You should handle such use case in your application and display appropriate message to the user:

```js
// call after explaning to the user why the microphone access is needed
// handle errors and show appropriate message to the user
try {
  await navigator.mediaDevices.getUserMedia();
} catch {
  // handle error
}
```

#### Session configuration

The options passed to `startSession` specifiy how the session is established. There are three ways to start a session:

##### Public agents

Agents that don't require any authentication can be used to start a conversation by using the agent ID and the connection type. The agent ID can be acquired through the [ElevenLabs UI](https://elevenlabs.io/app/conversational-ai).

For public agents, you can use the ID directly:

```js
const conversation = await Conversation.startSession({
  agentId: "<your-agent-id>",
  connectionType: "webrtc", // 'websocket' is also accepted
});
```

##### Private agents

If the conversation requires authorization, you will need to add a dedicated endpoint to your server that will either request a signed url (if using the WebSockets connection type) or a conversation token (if using WebRTC) using the [ElevenLabs API](https://elevenlabs.io/docs/introduction) and pass it back to the client.

Here's an example for a WebSocket connection:

```js
// Node.js server

app.get("/signed-url", yourAuthMiddleware, async (req, res) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${process.env.AGENT_ID}`,
    {
      headers: {
        // Requesting a signed url requires your ElevenLabs API key
        // Do NOT expose your API key to the client!
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
    }
  );

  if (!response.ok) {
    return res.status(500).send("Failed to get signed URL");
  }

  const body = await response.json();
  res.send(body.signed_url);
});
```

```js
// Client

const response = await fetch("/signed-url", yourAuthHeaders);
const signedUrl = await response.text();

const conversation = await Conversation.startSession({
  signedUrl,
  connectionType: "websocket",
});
```

Here's an example for WebRTC:

```js
// Node.js server

app.get("/conversation-token", yourAuthMiddleware, async (req, res) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${process.env.AGENT_ID}`,
    {
      headers: {
        // Requesting a conversation token requires your ElevenLabs API key
        // Do NOT expose your API key to the client!
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      }
    }
  );

  if (!response.ok) {
    return res.status(500).send("Failed to get conversation token");
  }

  const body = await response.json();
  res.send(body.token);
);
```

Once you have the token, providing it to `startSession` will initiate the conversation using WebRTC.

```js
// Client

const response = await fetch("/conversation-token", yourAuthHeaders);
const conversationToken = await response.text();

const conversation = await Conversation.startSession({
  conversationToken,
  connectionType: "webrtc",
});
```

#### Optional callbacks

The options passed to `startSession` can also be used to register optional callbacks:

- **onConnect** - handler called when the conversation websocket connection is established.
- **onDisconnect** - handler called when the conversation websocket connection is ended.
- **onMessage** - handler called when a new text message is received. These can be tentative or final transcriptions of user voice, replies produced by LLM. Primarily used for handling conversation transcription.
- **onError** - handler called when an error is encountered.
- **onStatusChange** - handler called whenever connection status changes. Can be `connected`, `connecting` and `disconnected` (initial).
- **onModeChange** - handler called when a status changes, eg. agent switches from `speaking` to `listening`, or the other way around.
- **onCanSendFeedbackChange** - handler called when sending feedback becomes available or unavailable.

#### Setting input/output devices

You can provide a device ID to start the conversation using the input/output device of your choice. If the device ID is invalid, the default input and output devices will be used.

```js
const conversation = await Conversation.startSession({
  agentId: "<your-agent-id>",
  inputDeviceId: "<new-input-id>",
  outputDeviceId: "<new-output-id>",
});
```

**Note:** Device switching only works for voice conversations. You can enumerate available devices using the [MediaDevices.enumerateDevices()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices) API.

#### Client Tools

Client tools are a way to enabled agent to invoke client-side functionality. This can be used to trigger actions in the client, such as opening a modal or doing an API call on behalf of the user.

Client tools definition is an object of functions, and needs to be identical with your configuration within the [ElevenLabs UI](https://elevenlabs.io/app/conversational-ai), where you can name and describe different tools, as well as set up the parameters passed by the agent.

```ts
const conversation = await Conversation.startSession({
  clientTools: {
    displayMessage: async (parameters: { text: string }) => {
      alert(text);

      return "Message displayed";
    },
  },
});
```

In case function returns a value, it will be passed back to the agent as a response.
Note that the tool needs to be explicitly set to be blocking conversation in ElevenLabs UI for the agent to await and react to the response, otherwise agent assumes success and continues the conversation.

#### Conversation overrides

You may choose to override various settings of the conversation and set them dynamically based other user interactions.
We support overriding various settings.
These settings are optional and can be used to customize the conversation experience.
The following settings are available:

```ts
const conversation = await Conversation.startSession({
  overrides: {
    agent: {
      prompt: {
        prompt: "My custom prompt",
      },
      firstMessage: "My custom first message",
      language: "en",
    },
    tts: {
      voiceId: "custom voice id",
    },
    conversation: {
      textOnly: true,
    },
  },
});
```

#### User identification

You can optionally pass a user ID to identify the user in the conversation. This can be your own customer identifier. This will be included in the conversation initiation data sent to the server:

Tracking this ID can be helpful for filtering conversations, tracking analytics on a user level, etc.

```ts
const conversation = await Conversation.startSession({
  agentId: "<your-agent-id>",
  userId: "user-123", // Optional user identifier
  connectionType: "webrtc",
});
```

#### Text only

If your agent is configured to run in text-only mode, i.e. it does not send or receive audio messages,
you can use this flag to use a lighter version of the conversation. In that case, the
user will not be asked for microphone permissions and no audio context will be created.

```ts
const conversation = await Conversation.startSession({
  textOnly: true,
});
```

#### Prefer Headphones for iOS Devices

While this SDK leaves the choice of audio input/output device to the browser/system, iOS Safari seem to prefer the built-in speaker over headphones even when bluetooth device is in use. If you want to "force" the use of headphones on iOS devices when available, you can use the following option. Please, keep in mind that this is not guaranteed, since this functionality is not provided by the browser. System audio should be the default choice.

```ts
const conversation = await Conversation.startSession({
  preferHeadphonesForIosDevices: true,
});
```

#### Connection delay

You can configure additional delay between when the microphone is activated and when the connection is established.
On Android, the delay is set to 3 seconds by default to make sure the device has time to switch to the correct audio mode.
Without it, you may experience issues with the beginning of the first message being cut off.

```ts
const conversation = await Conversation.startSession({
  connectionDelay: {
    android: 3_000,
    ios: 0,
    default: 0,
  },
});
```

#### Acquiring a Wake Lock

By default, the conversation will attempt to acquire a [wake lock](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) to prevent the device from going to sleep during the conversation.
This can be disabled by setting the `useWakeLock` option to `false`:

```ts
const conversation = await Conversation.startSession({
  useWakeLock: false,
});
```

#### Return value

`startSession` returns a `Conversation` instance that can be used to control the session. The method will throw an error if the session cannot be established. This can happen if the user denies microphone access, or if the websocket connection
fails.

##### endSession

A method to manually end the conversation. The method will end the conversation and disconnect from websocket.
Afterwards the conversation instance will be unusable and can be safely discarded.

```js
await conversation.endSession();
```

##### sendFeedback

A method for sending binary feedback to the agent.
The method accepts a boolean value, where `true` represents positive feedback and `false` negative feedback.
Feedback is always correlated to the most recent agent response and can be sent only once per response.
You can listen to `onCanSendFeedbackChange` to know if feedback can be sent at the given moment.

```js
conversation.sendFeedback(true);
```

##### sendContextualUpdate

A method to send contextual updates to the agent.
This can be used to inform the agent about user actions that are not directly related to the conversation, but may influence the agent's responses.

```js
conversation.sendContextualUpdate(
  "User navigated to another page. Consider it for next response, but don't react to this contextual update."
);
```

##### sendUserMessage

Sends a text messages to the agent.

Can be used to let the user type in the message instead of using the microphone.
Unlike `sendContextualUpdate`, this will be treated as a user message and will prompt the agent to take its turn in the conversation.

```js
sendButton.addEventListener("click", e => {
  conversation.sendUserMessage(textInput.value);
  textInput.value = "";
});
```

##### sendUserActivity

Notifies the agent about user activity.

The agent will not attempt to speak for at least 2 seconds after the user activity is detected.
This can be used to prevent the agent from interrupting the user when they are typing.

```js
textInput.addEventListener("input", () => {
  conversation.sendUserActivity();
});
```

##### getId

A method returning the conversation ID.

```js
const id = conversation.getId();
```

##### setVolume

A method to set the output volume of the conversation. Accepts object with volume field between 0 and 1.

```js
await conversation.setVolume({ volume: 0.5 });
```

##### muteMic

A method to mute/unmute the microphone.

```js
// Mute the microphone
conversation.setMicMuted(true);

// Unmute the microphone
conversation.setMicMuted(false);
```

##### getInputVolume / getOutputVolume

Methods that return the current input/output volume on a scale from `0` to `1` where `0` is -100 dB and `1` is -30 dB.

```js
const inputVolume = await conversation.getInputVolume();
const outputVolume = await conversation.getOutputVolume();
```

##### getInputByteFrequencyData / getOutputByteFrequencyData

Methods that return `Uint8Array`s containing the current input/output frequency data. See [AnalyserNode.getByteFrequencyData](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData) for more information.

**Note:** These methods are only available for voice conversations. In WebRTC mode the audio is hardcoded to use `pcm_48000`, meaning any visualization using the returned data might show different patterns to WebSocket connections.

##### changeInputDevice

Allows you to change the audio input device during an active voice conversation. This method is only available for voice conversations.

**Note:** In WebRTC mode the input format and sample rate are hardcoded to `pcm` and `48000` respectively. Changing those values when changing the input device is a no-op.

```js
const conversation = await Conversation.startSession({
  agentId: "<your-agent-id>",
});

// Change to a specific input device
await conversation.changeInputDevice({
  sampleRate: 16000,
  format: "pcm",
  preferHeadphonesForIosDevices: true,
  inputDeviceId: "your-device-id",
});
```

##### changeOutputDevice

Allows you to change the audio output device during an active voice conversation. This method is only available for voice conversations.

**Note:** In WebRTC mode the output format and sample rate are hardcoded to `pcm` and `48000` respectively. Changing those values when changing the output device is a no-op.

```js
// Change to a specific output device
await conversation.changeOutputDevice({
  sampleRate: 16000,
  format: "pcm",
  outputDeviceId: "your-device-id",
});
```

**Note:** Device switching only works for voice conversations. If no specific `deviceId` is provided, the browser will use its default device selection. You can enumerate available devices using the [MediaDevices.enumerateDevices()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices) API.

## Development

Please, refer to the README.md file in the root of this repository.

## Contributing

Please, create an issue first to discuss the proposed changes. Any contributions are welcome!

Remember, if merged, your code will be used as part of a MIT licensed project. By submitting a Pull Request, you are giving your consent for your code to be integrated into this library.
