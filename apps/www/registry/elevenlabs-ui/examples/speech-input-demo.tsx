"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"

import { getScribeToken } from "@/registry/elevenlabs-ui/blocks/realtime-transcriber-01/actions/get-scribe-token"
import { Input } from "@/registry/elevenlabs-ui/ui/input"
import {
  SpeechInput,
  SpeechInputCancelButton,
  SpeechInputPreview,
  SpeechInputRecordButton,
} from "@/registry/elevenlabs-ui/ui/speech-input"
import { Textarea } from "@/registry/elevenlabs-ui/ui/textarea"

async function getToken() {
  const result = await getScribeToken()
  if (result.error) {
    throw new Error(result.error)
  }
  return result.token!
}

function TextareaWithSpeechInputRight() {
  const [value, setValue] = useState("")
  const valueAtStartRef = useRef("")

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
        }}
        placeholder="Jot down some thoughts..."
        className="min-h-[120px] resize-none rounded-2xl px-3.5 pt-3 pb-14"
      />
      <div className="absolute right-3 bottom-3 flex items-center gap-2">
        <SpeechInput
          size="sm"
          getToken={getToken}
          onStart={() => {
            valueAtStartRef.current = value
          }}
          onChange={({ transcript }) => {
            setValue(valueAtStartRef.current + transcript)
          }}
          onStop={({ transcript }) => {
            setValue(valueAtStartRef.current + transcript)
          }}
          onCancel={() => {
            setValue(valueAtStartRef.current)
          }}
          onError={(error) => {
            toast.error(String(error))
          }}
        >
          <SpeechInputCancelButton />
          <SpeechInputPreview placeholder="Listening..." />
          <SpeechInputRecordButton />
        </SpeechInput>
      </div>
    </div>
  )
}

function TextareaWithSpeechInputLeft() {
  const [value, setValue] = useState("")
  const valueAtStartRef = useRef("")

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
        }}
        placeholder="Jot down some thoughts..."
        className="min-h-[120px] resize-none rounded-2xl px-3.5 pt-3 pb-14"
      />
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <SpeechInput
          size="sm"
          getToken={getToken}
          onStart={() => {
            valueAtStartRef.current = value
          }}
          onChange={({ transcript }) => {
            setValue(valueAtStartRef.current + transcript)
          }}
          onStop={({ transcript }) => {
            setValue(valueAtStartRef.current + transcript)
          }}
          onCancel={() => {
            setValue(valueAtStartRef.current)
          }}
          onError={(error) => {
            toast.error(String(error))
          }}
        >
          <SpeechInputRecordButton />
          <SpeechInputPreview placeholder="Listening..." />
          <SpeechInputCancelButton />
        </SpeechInput>
      </div>
    </div>
  )
}

function InputWithSpeechInput() {
  const [value, setValue] = useState("")
  const valueAtStartRef = useRef("")

  return (
    <div className="flex items-center gap-2.5">
      <Input
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
        }}
        placeholder="Give this idea a title..."
        className="min-w-0 flex-1 px-3.5 text-base transition-[flex-basis] duration-200 md:text-sm"
      />
      <SpeechInput
        getToken={getToken}
        className="shrink-0"
        onStart={() => {
          valueAtStartRef.current = value
        }}
        onChange={({ transcript }) => {
          setValue(valueAtStartRef.current + transcript)
        }}
        onStop={({ transcript }) => {
          setValue(valueAtStartRef.current + transcript)
        }}
        onCancel={() => {
          setValue(valueAtStartRef.current)
        }}
        onError={(error) => {
          toast.error(String(error))
        }}
      >
        <SpeechInputCancelButton />
        <SpeechInputRecordButton />
      </SpeechInput>
    </div>
  )
}

export default function SpeechInputDemo() {
  return (
    <div className="absolute inset-0 space-y-4 overflow-auto rounded-2xl p-10">
      <TextareaWithSpeechInputRight />
      <TextareaWithSpeechInputLeft />
      <InputWithSpeechInput />
    </div>
  )
}
