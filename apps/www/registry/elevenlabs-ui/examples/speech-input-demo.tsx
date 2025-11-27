"use client"

import { useRef, useState } from "react"

import { getScribeToken } from "@/registry/elevenlabs-ui/blocks/realtime-transcriber-01/actions/get-scribe-token"
import { Button } from "@/registry/elevenlabs-ui/ui/button"
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

  return (
    <div className="border-border w-full space-y-6 rounded-2xl border border-dashed p-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold">Sound story</h3>
          <p className="text-muted-foreground text-sm">
            Describe the kind of sound you want to create, or hold the mic to
            speak it out loud.
          </p>
        </div>

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
      </div>

      <div className="space-y-2">
        <div>
          <h4 className="text-sm font-medium">Mixing notes</h4>
          <p className="text-muted-foreground text-xs">
            Capture quick production notes without the transcript preview.
          </p>
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
      </div>
    </div>
  )
}
