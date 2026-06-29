import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Rule overrides
  {
    rules: {
      // Disabled: flags legitimate patterns — hydration guards, localStorage sync,
      // and async fetch effects — that are false positives for this rule.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated PWA service worker files — not our code
    "public/sw.js",
    "public/workbox-*.js",
  ]),
]);

export default eslintConfig;
