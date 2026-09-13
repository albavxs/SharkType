import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Deferred cleanup: keep known non-security style debt visible as warnings
  // while release gates continue to fail on actual lint errors.
  {
    files: [
      "app/api/billing/asaas/webhook/route.ts",
      "app/api/billing/plus/pix-automatic/route.ts",
      "components/providers/AuthProvider.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: [
      "app/login/page.tsx",
      "app/tracks/**/page.tsx",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
