---
title: Response
description: Streaming markdown renderer with smooth character-by-character animations for AI responses using Streamdown.
featured: true
component: true
---

<ComponentPreview
  name="response-demo"
  description="A live scrolling response visualization with smooth animations."
  marginOff
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx @elevenlabs/cli@latest components add response
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install streamdown
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="response" title="components/ui/response.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

To ensure the styles are properly applied, you need to configure your Tailwind setup to include Streamdown's source files.

### Tailwind v4

Add the following CSS source directive to your `globals.css` or main CSS file:

```css title="globals.css"
@source "../node_modules/streamdown/dist/*.js";
```

Make sure the path matches the location of your `node_modules` folder relative to your CSS file.

### Tailwind v3

Add Streamdown to your `content` array in your `tailwind.config.js`:

```js title="tailwind.config.js"
module.exports = {
  content: ["./node_modules/streamdown/dist/*.js"],
  // ... rest of your config
}
```

## Usage

```tsx showLineNumbers
import { Response } from "@/components/ui/response"
```

### Basic Usage

```tsx showLineNumbers
<Response>This is a simple text response.</Response>
```

### With Markdown

The Response component supports full markdown rendering:

```tsx showLineNumbers
<Response>
  {`# Heading

This is a paragraph with **bold** and *italic* text.

- List item 1
- List item 2
- List item 3

\`\`\`javascript
const greeting = "Hello, world!"
console.log(greeting)
\`\`\`
`}
</Response>
```

### Streaming Response

Perfect for streaming AI responses character-by-character:

```tsx showLineNumbers
const [response, setResponse] = useState("")

// As tokens arrive, append to response
const handleStream = (token: string) => {
  setResponse((prev) => prev + token)
}

return <Response>{response}</Response>
```

### With Message Component

```tsx showLineNumbers
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import { Response } from "@/components/ui/response"

export default ({ streamingResponse }) => (
  <Message from="assistant">
    <MessageAvatar src="/ai-avatar.jpg" name="AI" />
    <MessageContent>
      <Response>{streamingResponse}</Response>
    </MessageContent>
  </Message>
)
```

## API Reference

### Response

A memoized wrapper around Streamdown that renders streaming markdown with smooth animations.

#### Props

Extends all props from the [`Streamdown`](https://github.com/vercel/streamdown) component.

| Prop      | Type         | Description                    |
| --------- | ------------ | ------------------------------ |
| children  | `ReactNode`  | Content to render (markdown)   |
| className | `string`     | Optional CSS classes           |
| ...props  | `Streamdown` | All Streamdown component props |

## Notes

- Built on top of [`streamdown`](https://github.com/vercel/streamdown) for smooth markdown streaming animations
- Automatically removes top margin from first child and bottom margin from last child for clean integration
- Memoized to prevent unnecessary re-renders - only updates when children change
- Supports full markdown syntax including code blocks, lists, tables, and more
- Optimized for streaming AI responses with character-by-character rendering
- Works seamlessly with the Message component
- This component is inspired by Vercel's [AI SDK Response component](https://ai-sdk.dev/elements/components/message) with modifications for ElevenLabs UI
