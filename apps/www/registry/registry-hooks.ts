import { type Registry } from "shadcn/schema"

export const hooks: Registry["items"] = [
  {
    name: "use-mobile",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-mobile.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-transcript-viewer",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-transcript-viewer.ts",
        type: "registry:hook",
      },
    ],
    devDependencies: ["@elevenlabs/elevenlabs-js"],
  },
  {
    name: "use-scribe",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-scribe.ts",
        type: "registry:hook",
      },
    ],
    dependencies: ["@elevenlabs/client"],
  },
]
