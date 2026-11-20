import { z } from "zod";

/*
  ─────────────────────────────────────────────────────────────────────────────
  SERVER-ONLY ENVIRONMENT
  ─────────────────────────────────────────────────────────────────────────────
  This module is the only place a secret-bearing variable is read. It is
  imported by route handlers and nothing else — enforced twice:

    1. this runtime guard, which turns a client bundle that accidentally
       includes it into an immediate, obvious failure rather than a silent
       leak of the schema's names into the browser;
    2. an ESLint `no-restricted-imports` rule that forbids the path outside
       route handlers under `app/api`.

  `server-only` is not installed, so the guard is hand-rolled on purpose: it is
  one line, it has no dependency, and it can be tested.

  EVERY VARIABLE HERE IS OPTIONAL. The app builds and runs with an empty
  environment, which is how it runs today; a provider is selected by setting
  `CONTACT_DELIVERY_PROVIDER`, not by the presence of a key.
*/

if (typeof window !== "undefined") {
  throw new Error("lib/env.server.ts was imported into a client bundle");
}

const optionalText = z.string().min(1).optional();
const optionalEmail = z.string().email().optional();

const serverEnvSchema = z.object({
  /** `none` is the shipped default: validate, then hand off. */
  CONTACT_DELIVERY_PROVIDER: z.enum(["none", "resend", "smtp"]).default("none"),
  CONTACT_API_KEY: optionalText,
  CONTACT_FROM_EMAIL: optionalEmail,
  CONTACT_TO_EMAIL: optionalEmail,
  CONTACT_TIMEOUT_MS: z.coerce.number().int().min(1000).max(30_000).default(8000),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(60_000).default(600_000),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).max(100).default(5),

  /** The origin the form must come from. Same value the browser already uses. */
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),

  /* Reserved for stage 9.6 (assistant provider). Declared here so the approved
     names live in one place; nothing reads them yet. */
  AI_PROVIDER: z.enum(["none", "openai", "anthropic", "ollama"]).default("none"),
  AI_API_KEY: optionalText,
  AI_MODEL: optionalText,
  AI_BASE_URL: z.string().url().optional(),
  AI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(30_000).default(8000),
  AI_MAX_OUTPUT_TOKENS: z.coerce.number().int().min(64).max(4096).default(400),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function loadServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse({
    CONTACT_DELIVERY_PROVIDER: process.env.CONTACT_DELIVERY_PROVIDER,
    CONTACT_API_KEY: process.env.CONTACT_API_KEY,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_TIMEOUT_MS: process.env.CONTACT_TIMEOUT_MS,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    AI_PROVIDER: process.env.AI_PROVIDER,
    AI_API_KEY: process.env.AI_API_KEY,
    AI_MODEL: process.env.AI_MODEL,
    AI_BASE_URL: process.env.AI_BASE_URL,
    AI_TIMEOUT_MS: process.env.AI_TIMEOUT_MS,
    AI_MAX_OUTPUT_TOKENS: process.env.AI_MAX_OUTPUT_TOKENS,
  });

  if (!parsed.success) {
    /*
      The message names the variable and the rule, never the value. An invalid
      key is still a secret and must not reach a log line.
    */
    const formatted = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid server environment configuration:\n${formatted}`);
  }

  return parsed.data;
}

/** Parsed once at module load, so a bad value fails at boot, not mid-request. */
export const serverEnv: ServerEnv = loadServerEnv();
