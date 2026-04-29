import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

const eslintConfig = [
  {
    ignores: [".source/", "scripts/"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "@next/next/no-duplicate-head": "off",
      // New react-hooks v7 rules — disable until codebase is ready
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/static-components": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/globals": "off",
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
]

export default eslintConfig
