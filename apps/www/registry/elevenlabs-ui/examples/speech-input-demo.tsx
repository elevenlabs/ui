"use client"

import { useRef, useState } from "react"

import { getScribeToken } from "@/registry/elevenlabs-ui/blocks/realtime-transcriber-01/actions/get-scribe-token"
import { Button } from "@/registry/elevenlabs-ui/ui/button"
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

export default function SpeechInputDemo() {
  const [textareaValue, setTextareaValue] = useState("")
  const textareaValueAtStartRef = useRef("")
  const [notesValue, setNotesValue] = useState("")
  const notesValueAtStartRef = useRef("")
  const [titleValue, setTitleValue] = useState("")
  const titleValueAtStartRef = useRef("")

  return (
    <div className="w-full space-y-6 rounded-2xl p-6">
      <div className="relative">
        <Textarea
          value={textareaValue}
          onChange={(event) => {
            setTextareaValue(event.target.value)
          }}
          placeholder="Describe a sound..."
          className="min-h-[120px] resize-none rounded-2xl px-3.5 pt-3 pb-14"
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <SpeechInput
            size="sm"
            getToken={getToken}
            onStart={() => {
              textareaValueAtStartRef.current = textareaValue
            }}
            onChange={({ transcript }) => {
              setTextareaValue(textareaValueAtStartRef.current + transcript)
            }}
            onStop={({ transcript }) => {
              setTextareaValue(textareaValueAtStartRef.current + transcript)
            }}
            onCancel={() => {
              setTextareaValue(textareaValueAtStartRef.current)
            }}
            onError={(error) => {
              console.error("Speech input error:", error)
            }}
          >
            <SpeechInputCancelButton />
            <SpeechInputPreview placeholder="Listening..." />
            <SpeechInputRecordButton />
          </SpeechInput>
          <Button size="sm" className="shadow-sm">
            Generate
          </Button>
        </div>
      </div>
      <div className="relative">
        <Textarea
          value={notesValue}
          onChange={(event) => {
            setNotesValue(event.target.value)
          }}
          placeholder="Add post-processing notes..."
          className="min-h-[100px] resize-none rounded-2xl px-3.5 pt-3 pb-12"
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <SpeechInput
            size="sm"
            getToken={getToken}
            onStart={() => {
              notesValueAtStartRef.current = notesValue
            }}
            onChange={({ transcript }) => {
              setNotesValue(notesValueAtStartRef.current + transcript)
            }}
            onStop={({ transcript }) => {
              setNotesValue(notesValueAtStartRef.current + transcript)
            }}
            onCancel={() => {
              setNotesValue(notesValueAtStartRef.current)
            }}
            onError={(error) => {
              console.error("Speech input error:", error)
            }}
          >
            <SpeechInputCancelButton />
            <SpeechInputRecordButton />
          </SpeechInput>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Input
          value={titleValue}
          onChange={(event) => {
            setTitleValue(event.target.value)
          }}
          placeholder="Give this idea a title..."
          className="min-w-0 flex-1 rounded-lg px-3.5 text-base transition-[flex-basis] duration-200 md:text-sm"
        />
        <SpeechInput
          getToken={getToken}
          className="shrink-0"
          onStart={() => {
            titleValueAtStartRef.current = titleValue
          }}
          onChange={({ transcript }) => {
            setTitleValue(titleValueAtStartRef.current + transcript)
          }}
          onStop={({ transcript }) => {
            setTitleValue(titleValueAtStartRef.current + transcript)
          }}
          onCancel={() => {
            setTitleValue(titleValueAtStartRef.current)
          }}
          onError={(error) => {
            console.error("Speech input error:", error)
          }}
        >
          <SpeechInputCancelButton />
          <SpeechInputRecordButton />
        </SpeechInput>
      </div>
    </div>
  )
}
