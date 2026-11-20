# Phase 9 — AI Portfolio Assistant & Recruiter Contact System

**Status:** audit and proposal. No application code has been written.
**Branch:** `update/portfolio-profile-2026` (Phase 2/6 work still uncommitted; Phase 8 planned but not implemented).
**Scope:** one deterministic assistant, one chat interface, one contact form, one API route, and a provider integration proposal that is **not** selected or installed.

---

## 1. Findings first

### 1.1 There is no AI provider

Nothing in the repository references an AI provider. `package.json` contains no `openai`, `@anthropic-ai`, `@google/generative-ai`, `langchain`, `ai`, or `ollama` package. There is no key, no endpoint, no model name, and no `.env` file of any kind. **No provider exists to inspect beyond confirming its absence.**

### 1.2 There is no email or notification provider

No `resend`, `nodemailer`, `postmark`, `sendgrid`, `mailgun`, or `@vercel/postgres` dependency. No `.env`, no `RESEND_API_KEY`, no SMTP host, no webhook. There is no service to reuse.

### 1.3 There is no backend at all

| Checked                         | Result                                                |
| ------------------------------- | ----------------------------------------------------- |
| `app/**/route.ts`               | **0 files**                                           |
| Server actions (`"use server"`) | **0 occurrences**                                     |
| `middleware.ts`                 | absent                                                |
| `app/api/**`                    | absent                                                |
| Database / ORM                  | absent                                                |
| Auth / sessions / cookies       | absent                                                |
| `lib/`                          | one file: `env.ts`                                    |
| Environment variables           | `NODE_ENV`, `NEXT_PUBLIC_SITE_URL` — both public-safe |
| `lib/env.ts` importers          | `app/layout.tsx` only (a server component)            |
| Zod                             | present, **4.4.3**                                    |
| `server-only` package           | **not installed**                                     |

**Consequence:** the phrase "use the existing application backend architecture" has no referent today. Phase 9 would create the application's **first** route handler. That is a meaningful architectural step, not an increment, and it is why this report exists.

The honest framing: _the site is currently a statically rendered Next.js App Router application with zero server surface. Phase 9 adds exactly one POST endpoint, and nothing else._

### 1.4 What already exists that Phase 9 can reuse

| Asset                                                                 | Reuse                                                                                                              |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `constants/profile.ts` (`PROFILE`, `SOCIAL_LINKS`)                    | Contact facts, WhatsApp URL, email, availability — the assistant's contact intent reads these, never restates them |
| `data/projects/projects.ts`, `case-studies.ts`                        | AutoFlow and Morocco Retail answers                                                                                |
| `data/skills/skills.ts`                                               | Technology answers                                                                                                 |
| `data/experience/experience.ts`, `data/academic/academic.ts`          | Experience and academic answers                                                                                    |
| `features/credibility/resume-center/resumeDocuments.ts`               | Resume links (EN, FR only — see D3)                                                                                |
| `components/ui/{Button,Card,Badge}`, `SectionShell`, `SectionHeading` | All new surfaces compose these; `components/ui/` is not modified                                                   |
| `revealMotion.ts`, `EASE_APPLE`, `useReducedMotion`                   | Message and section transitions                                                                                    |
| `zod` 4.4.3                                                           | One schema shared by client and server                                                                             |
| `features/conversion/ai-recruiter-assistant/.gitkeep`                 | The intended location already exists                                                                               |

---

## 2. Assistant architecture

### 2.1 Two layers, one contract

```
visitor question
      │
      ▼
┌─────────────────────────────┐
│  Retrieval engine (client)  │  deterministic, ships now, no network
│  normalise → score → answer │
└─────────────┬───────────────┘
              │ confidence ≥ threshold
              ▼
      Knowledge base (typed, allowlisted, build-time)
              │
              ▼
      answer + citations + provenance
```

An optional LLM layer (§2.4) would sit **on the server**, behind the same answer contract, and would be fed the same knowledge base. The UI does not change when that layer is added — which is the point of defining the contract first.

### 2.2 The knowledge base

`data/assistant/knowledge.ts` — a plain TypeScript module, imported at build time. No filesystem access, no `process.env`, no network, no database.

```ts
export interface KnowledgeCitation {
  label: string;
  href: string;
  kind: "section" | "project" | "document" | "external";
}

export interface KnowledgeEntry {
  id: string;
  /** The visitor question this entry answers, in one line. */
  question: string;
  /** Normalised trigger phrases. Never sentences. */
  triggers: readonly string[];
  /** Plain-text paragraphs. Rendered as text nodes, never as HTML. */
  answer: readonly string[];
  /** At least one. An answer without a source is not rendered. */
  citations: readonly KnowledgeCitation[];
  /** Human-readable provenance, e.g. "CV 2026 §FORMATION". */
  sources: readonly string[];
}
```

**Entries (12):**

| id                      | Answers                                      | Sources                                       |
| ----------------------- | -------------------------------------------- | --------------------------------------------- |
| `resume`                | "Show me your resume"                        | EN + FR 2026 PDFs only                        |
| `technologies`          | "What technologies do you use?"              | `data/skills/skills.ts`                       |
| `autoflow`              | "Tell me about AutoFlow"                     | AutoFlow case study                           |
| `morocco-retail`        | "Explain the Morocco Retail project"         | MRIDP case study                              |
| `iziry`                 | "What did you develop at IZIRY?"             | CV 2026 §EXPÉRIENCE — public bullets only     |
| `academic`              | "Tell me about your academic background"     | `data/experience` education + TP repo         |
| `contact`               | "How can I contact you?"                     | `PROFILE`, `SOCIAL_LINKS`                     |
| `current-work`          | "What are you developing now?"               | AutoFlow + Master II-BDCC + IZIRY, all public |
| `smart-health-room`     | Follow-up from the project list              | SHR case study                                |
| `rolex`                 | Follow-up from the project list              | Rolex case study                              |
| `location-availability` | "Where are you based / are you available?"   | `PROFILE.availability`                        |
| `stack-by-layer`        | "What do you use for data / frontend / IoT?" | Skills grouped by existing categories         |

Every answer is composed from the same records the page renders. **No number is typed into the knowledge base**; metrics are read from the project records so the assistant cannot drift from the page.

### 2.3 Hard exclusions

The assistant must never surface, read, or reference:

| Excluded                         | Enforcement                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| Private CV versions              | KB imports only `resumeDocuments.ts` entries `EN` and `FR`                                       |
| The motivation letter            | Excluded by id even though a copy is publicly served today (**D3**)                              |
| API keys / environment variables | KB module may not import `process`, `fs`, `lib/env`; validator fails the build script if it does |
| IZIRY internal datasets          | No such data exists in the repo; KB states only the CV's public bullets                          |
| Proprietary company information  | No client names, no metrics, no internal tooling names                                           |
| Local private project files      | KB imports only `data/**` and `constants/**`; validator allowlists those paths                   |

**Enforcement is mechanical, not editorial.** `scripts/validate-assistant-kb.mjs` fails if any file under `data/assistant/` contains `process.env`, `fs`, `readFile`, `NEXT_PUBLIC_`, `API_KEY`, `.env`, or imports outside `@/data` and `@/constants`. It also asserts that every entry has ≥ 1 citation and that every citation href resolves to a known anchor, project slug, public file, or external allowlist entry.

### 2.4 Optional LLM layer — proposal only

If you later approve a provider, this is the shape. **No provider, model, or subscription is selected here.**

```
POST /api/assistant
  body: { question: string }        // max 500 chars, no PII expected
  → server builds the prompt from data/assistant/knowledge.ts
  → provider call with 8s timeout
  → response validated against { answer: string, citationIds: string[] }
  → citations resolved server-side from the KB
  → 200 { answer, citations } | 503 | 504 | 429 | 400
```

Rules that would apply:

- **Server-only key.** `AI_API_KEY`, never `NEXT_PUBLIC_AI_*`. A build check greps the client bundle for the key name and fails.
- **No tools, no function calling, no browsing.** The model receives the knowledge base and the question, nothing else.
- **No conversation history by default.** Multi-turn history is where prompt injection and PII accumulation live; Phase 9 sends one question at a time.
- **No form data.** The contact form and the assistant never share state or transport.
- **Output is text.** No HTML, no markdown renderer, no links generated by the model. Citations come from the KB, not from the completion.
- **Length cap** (`AI_MAX_OUTPUT_TOKENS`, default 400) and a refusal path when the KB has no matching entry.
- **Logging:** request id, latency, outcome, token counts. Never the question text.

**Provider shortlist for your decision (not a recommendation of one):**

| Provider        | Shape                   | Notes                                                                       |
| --------------- | ----------------------- | --------------------------------------------------------------------------- |
| OpenAI          | hosted API              | broad model range; per-token cost                                           |
| Anthropic       | hosted API              | long-context, instruction-following                                         |
| Google (Gemini) | hosted API              | free tier exists                                                            |
| Mistral         | hosted API or self-host | EU hosting                                                                  |
| Ollama          | **local**, no key       | no per-request cost, needs a host with RAM; not deployable on a static host |

**My recommendation for Phase 9:** ship the deterministic assistant first. It answers all eight required questions, needs no key, cannot hallucinate, and costs nothing. Add an LLM only if the deterministic answers prove too narrow — and then as an _additional_ route behind the same contract, with the label changing from "answers come from this page's data" to "AI-generated, verified against this page's data".

### 2.5 Honesty label

The deterministic assistant is labelled, in mono, above the transcript:

> **Portfolio assistant — retrieval.** Answers are read from this site's own records. No language model is called.

It is never described as AI, never given a robot avatar, and never shows a three-dot "typing" indicator that implies generation. While it looks up an entry it shows `Searching portfolio…` — which is literally what it is doing. If an LLM is later approved, the label and the indicator change together.

---

## 3. Chat interface

### 3.1 Composition

```
┌ Assistant ─────────────────────────────── 09 ┐
│ Portfolio assistant — retrieval              │
│ Answers are read from this site's records.   │
│                                              │
│  ┌ YB  Hello. Ask me about the projects, …   │
│  │      the stack, or how to get in touch.   │
│  │      10:42                                │
│  │                                           │
│  │            What did you build at IZIRY? ┌ │
│  │                            10:42        │ │
│  │                                           │
│  │  ┌ YB  A pricing and forecasting engine… │
│  │  │      [Experience →] [IZIRY]           │
│  │  │      10:42                            │
│  └                                           │
│                                              │
│  [ Resume ] [ Stack ] [ AutoFlow ] [ MRIDP ] │
│  [ IZIRY ] [ Academic ] [ Contact ] [ Now ]  │
│                                              │
│  ┌──────────────────────────────────┐ [Send] │
│  │ Ask about the work…              │        │
│  └──────────────────────────────────┘        │
│  Retrieval · 12 topics · Clear conversation  │
└──────────────────────────────────────────────┘
```

### 3.2 Behaviour

| Requirement         | Implementation                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Message bubbles     | Assistant left, visitor right; square-cornered `rounded-sm`, hairline border, no tail                                            |
| Avatars             | Assistant: `YB` monogram in a hairline square. Visitor: a neutral `You` glyph. **No robot/AI avatar**                            |
| Timestamps          | `<time dateTime>` under each message, mono, `Intl.DateTimeFormat` computed on mount (no hydration mismatch)                      |
| Typing indicator    | Deterministic: `Searching portfolio…` with three static dots. LLM (later): animated three dots                                   |
| Smooth transitions  | Framer Motion, 220ms, `EASE_APPLE`; reduced motion = instant                                                                     |
| Auto-scroll         | Only when the reader is within 80px of the bottom; otherwise a `New answer ↓` button appears instead of hijacking their position |
| Clear conversation  | Button resets to the greeting + suggestions, returns focus to the input                                                          |
| Loading state       | Send disabled, inline `Searching…`, input preserved                                                                              |
| Error state         | Inline error card with a Retry action; the question is not lost                                                                  |
| Suggested questions | The eight required prompts as chips; they disappear after the first answer and return on clear                                   |

### 3.3 Accessibility

- Transcript is `role="log"` with `aria-live="polite"` and `aria-relevant="additions"`.
- Each message is a `<li>` in an ordered list; the author is announced via a visually hidden prefix, not by avatar alone.
- Input has a visible `<label>`, `autoComplete="off"`, `maxLength={500}`, and a character counter after 400.
- `Enter` sends, `Shift+Enter` newlines (textarea).
- The transcript is focusable (`tabIndex={0}`) so a keyboard user can scroll it.
- Reduced motion removes the transition and the dot animation; nothing is hidden.

---

## 4. Recruiter contact form

### 4.1 Fields

| Field                      | Type                             | Validation                             |
| -------------------------- | -------------------------------- | -------------------------------------- |
| First name                 | text                             | 2–60, required                         |
| Last name                  | text                             | 2–60, required                         |
| Company                    | text                             | 0–80, optional                         |
| Email or WhatsApp          | text                             | email **or** E.164-ish phone, required |
| Preferred response channel | radio: Email / WhatsApp / Either | default Either                         |
| Message                    | textarea                         | 40–2000, required                      |
| Honeypot                   | hidden text                      | must be empty                          |
| Rendered-at                | hidden number                    | must be 2.5s–30min old                 |

The "email or WhatsApp" field is one input with a discriminated parse: if it contains `@` it must be a valid email; otherwise it must match a phone pattern. The label says exactly that — `Email or WhatsApp number` — and the helper text gives an example of each.

### 4.2 Apple-inspired interaction

- **Floating labels:** label sits inside the field at rest, rises to the hairline on focus or when filled (`peer-placeholder-shown` + `peer-focus`, `placeholder=" "`). No JavaScript.
- **Animated focus:** the hairline goes from `rgba(255,255,255,0.09)` to `rgba(255,255,255,0.26)` over 180ms, and a 1px accent rule grows from the left along the field's bottom edge (transform only).
- **Caret:** `caret-color: var(--color-accent)`. Native caret, no custom renderer — a fake caret is the classic accessibility regression.
- **Placeholder transitions:** placeholders are only used as the label's resting position; no second placeholder string swaps underneath, so nothing moves while typing.
- **Validation:** on blur and on submit, never on every keystroke. Message: what is wrong and how to fix it (`Enter an email address or a phone number with country code`). `aria-invalid` + `aria-describedby`; the first invalid field takes focus.
- **Layout:** one column on mobile; first/last name side by side at `sm`; message full width; submit full width below `sm`.
- **Drafting indicator:** when the message field has focus and the value changed within the last 1.5s, a small mono line appears under the textarea: `Drafting…` with a 2px animated bar. It is `aria-hidden` (a screen reader gains nothing from being told someone is typing) and it stops when the field loses focus. **It never inserts text into any field.**
- **No autofill simulation.** The form never types, never pre-fills a message, never animates a fake keystroke.

### 4.3 Status machine

```
IDLE ──first keystroke──▶ TYPING ──submit──▶ SENDING ──▶ SUCCESS
  ▲                          │                  │
  └──────── clear ───────────┘                  ├──▶ ERROR
                                                └──▶ HANDOFF
```

| State     | Trigger                                                 | UI                                                       |
| --------- | ------------------------------------------------------- | -------------------------------------------------------- |
| `IDLE`    | initial / after clear                                   | Submit enabled, no status                                |
| `TYPING`  | any field has a value                                   | `Draft in progress` (mono, quiet)                        |
| `SENDING` | submit, schema valid                                    | Button spinner, fields disabled, `Sending…`, `aria-busy` |
| `SUCCESS` | HTTP 2xx **and** `{ ok: true, status: "accepted", id }` | `Message accepted` + reference id                        |
| `ERROR`   | 4xx/5xx/timeout/network                                 | `Could not send` + reason + Retry                        |
| `HANDOFF` | HTTP 200 `{ ok: true, status: "handoff" }`              | `Ready to send — finish in your email app` + copy + link |

**`SUCCESS` is impossible without a server confirmation.** Pressing the button moves the form to `SENDING`; it never moves straight to `SUCCESS`.

**`HANDOFF` is an addition to the five required states.** It exists because the required behaviour ("do not claim delivery") cannot be expressed as either success or error: the server accepted and validated the message but has no provider to deliver it. Showing `ERROR` there would be false; showing `SUCCESS` would be a lie. The handoff state says exactly what happened.

---

## 5. Backend proposal

### 5.1 The one route

`app/api/contact/route.ts` — `POST` only. No `GET`, so nothing is cached or enumerable.

```jsonc
// request
{
  "firstName": "Sara",
  "lastName": "Amrani",
  "company": "Acme",
  "contact": "sara@example.com",
  "preferredChannel": "email",
  "message": "…",
  "website": "",            // honeypot, must be empty
  "renderedAt": 1763300000000
}

// 200 — provider configured and accepted
{ "ok": true, "status": "accepted", "id": "req_01J…" }

// 200 — no provider configured (the Phase 9 default)
{ "ok": true, "status": "handoff",
  "handoff": { "channel": "email", "href": "mailto:…" } }

// 400 — validation
{ "ok": false, "code": "VALIDATION", "fields": { "message": "Too short" } }

// 403 — cross-origin
{ "ok": false, "code": "ORIGIN" }

// 429 — rate limited
{ "ok": false, "code": "RATE_LIMIT", "retryAfter": 420 }

// 503 — provider selected but not configured
{ "ok": false, "code": "DELIVERY_NOT_CONFIGURED" }

// 504 — provider timeout
{ "ok": false, "code": "TIMEOUT" }
```

**Why one route and not a server action:** a route handler has an explicit HTTP contract that can be tested with `curl`, returns real status codes for the rate limiter and the timeout, and does not depend on React's action transport. It is also the only server surface in the app, which makes the audit small.

### 5.2 Server-side validation

One Zod schema in `features/conversion/contact-form/contactSchema.ts`, imported by both the client and the route. The server always re-parses; the client copy is a convenience, never the control.

```ts
const contactSchema = z
  .object({
    firstName: z.string().trim().min(2).max(60),
    lastName: z.string().trim().min(2).max(60),
    company: z.string().trim().max(80).optional().default(""),
    contact: z.string().trim().min(5).max(120),
    preferredChannel: z.enum(["email", "whatsapp", "either"]).default("either"),
    message: z.string().trim().min(40).max(2000),
    website: z.string().max(0), // honeypot
    renderedAt: z.coerce.number().int().positive(),
  })
  .superRefine(/* email-or-phone + CRLF rejection */);
```

Additional server checks that Zod does not express:

- strip `\r` and `\n` from every value used in an email subject;
- reject if `message` contains more than two URLs;
- reject if the body exceeds 16 kB (checked before parsing).

### 5.3 Spam protection (no third-party service)

| Layer        | Rule                                            | Failure                                            |
| ------------ | ----------------------------------------------- | -------------------------------------------------- |
| Honeypot     | `website` must be `""`                          | Silent 200 `handoff` (do not tell a bot it failed) |
| Timing       | `renderedAt` between 2.5s and 30min old         | Silent 200                                         |
| Origin       | `Origin` must equal `NEXT_PUBLIC_SITE_URL`      | 403                                                |
| Content type | must be `application/json`                      | 415                                                |
| Link count   | ≤ 2 URLs in the message                         | 400                                                |
| Rate limit   | 5 requests / 10 min / IP hash; 100 / min global | 429 + `Retry-After`                                |

**Rate limiting without Redis:** an in-memory sliding window in `lib/contact/rateLimit.ts`, keyed by a SHA-256 hash of the client IP (the IP itself is never stored), with a 10-minute TTL and a hard cap on the map size.

**Known limitation, stated plainly:** in-memory counters reset on a cold start and are per-instance. On a single long-running Node server they work; on a multi-instance serverless deployment they under-count. The correct fix is a shared store (Upstash Redis or Vercel KV), which is an external integration and therefore **needs your approval** (D7). Until then the limiter is a speed bump, not a wall, and the honeypot plus timing check carry more of the load.

### 5.4 Timeout, errors, logging

- Provider call wrapped in `AbortSignal.timeout(CONTACT_TIMEOUT_MS ?? 8000)`; abort → 504.
- One `try/catch` at the route boundary; unknown errors → 500 `{ code: "INTERNAL" }`, never a stack trace.
- Structured log per request: `{ requestId, durationMs, outcome, code }`. **No email, no phone, no message body, no IP.**
- No storage: nothing is written to a database, a file, or a queue. The message exists in memory for the duration of the request.

### 5.5 Delivery adapter

`lib/contact/delivery.ts` defines one interface and two implementations:

```ts
interface DeliveryAdapter {
  readonly id: "none" | "resend" | "smtp";
  send(input: ContactMessage): Promise<{ id: string }>;
}
```

- `none` — the default. Throws `DeliveryNotConfigured`; the route maps it to `handoff`, not to an error.
- `resend` / `smtp` — **not implemented** until a provider is approved and a key exists.

This is the whole point of the adapter: the route, the validation, the rate limiter, and the UI can all ship and be tested today, and adding a provider later is one file plus environment variables.

### 5.6 Provider options (no selection)

| Option                         | Requires                          | Trade-offs                                                                          |
| ------------------------------ | --------------------------------- | ----------------------------------------------------------------------------------- |
| **Resend**                     | `RESEND_API_KEY`, verified domain | simplest HTTP API, good deliverability; new vendor                                  |
| **Postmark**                   | server token, verified domain     | strongest transactional deliverability; stricter onboarding                         |
| **SMTP (nodemailer)**          | host, port, user, password        | works with any mailbox; more config, more failure modes                             |
| **Formspree / Web3Forms**      | endpoint URL                      | no backend needed; message passes through a third party, and the endpoint is public |
| **EmailJS / client-side keys** | public key in the browser         | **rejected** — the key is public and abusable                                       |

**My recommendation:** keep `none` for Phase 9, ship the handoff, and choose Resend or SMTP only when you are ready to verify a sending domain. A contact form that hands off to the visitor's own mail client is honest, costs nothing, and leaks no data to a third party.

---

## 6. Environment variables (names only)

**Nothing is created until approved.** All new variables are server-only and optional, with defaults, so the app still builds with an empty environment — which is how it builds today.

### 6.1 Public (unchanged)

| Name                   | Scope  | Notes                                 |
| ---------------------- | ------ | ------------------------------------- |
| `NODE_ENV`             | both   | existing                              |
| `NEXT_PUBLIC_SITE_URL` | public | existing; also the origin check value |

### 6.2 Server-only (proposed, all optional)

| Name                                | Default  | Used by                             |
| ----------------------------------- | -------- | ----------------------------------- |
| `CONTACT_DELIVERY_PROVIDER`         | `none`   | delivery adapter selection          |
| `CONTACT_API_KEY`                   | —        | provider auth                       |
| `CONTACT_FROM_EMAIL`                | —        | sender, must be a verified domain   |
| `CONTACT_TO_EMAIL`                  | —        | recipient                           |
| `CONTACT_TIMEOUT_MS`                | `8000`   | provider abort                      |
| `RATE_LIMIT_WINDOW_MS`              | `600000` | limiter                             |
| `RATE_LIMIT_MAX`                    | `5`      | limiter                             |
| `AI_PROVIDER`                       | `none`   | assistant provider selection        |
| `AI_API_KEY`                        | —        | provider auth                       |
| `AI_MODEL`                          | —        | model id                            |
| `AI_BASE_URL`                       | —        | local Ollama only                   |
| `AI_TIMEOUT_MS`                     | `8000`   | provider abort                      |
| `AI_MAX_OUTPUT_TOKENS`              | `400`    | cost cap                            |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | —        | only if D7 chooses a shared limiter |

**Structural safeguard:** the existing `lib/env.ts` stays public-only. A new `lib/env.server.ts` holds the secret-bearing schema and starts with a runtime guard:

```ts
if (typeof window !== "undefined") {
  throw new Error("lib/env.server.ts was imported into a client bundle");
}
```

plus an ESLint `no-restricted-imports` rule that forbids `@/lib/env.server` from any file under `app/` that is not a route handler or from any `"use client"` module. `server-only` is **not** installed, so this is a hand-rolled guard rather than a dependency — and it is testable.

**Forbidden, permanently:** any `NEXT_PUBLIC_` prefix on an AI or email credential.

---

## 7. Security risk register

| #   | Risk                              | Impact                               | Mitigation                                                                           |
| --- | --------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------ |
| R1  | API key reaches the browser       | key theft, billing abuse             | server-only env, no `NEXT_PUBLIC_`, bundle grep in QA                                |
| R2  | Prompt injection (LLM path)       | fabricated claims, data exfiltration | KB in system message, no tools, no history, output schema, citation allowlist        |
| R3  | Hallucinated claim in an answer   | reputational damage                  | deterministic default; every answer cites a KB entry; refusal instead of guessing    |
| R4  | Private document surfaced         | confidentiality breach               | KB allowlist: EN/FR CV only; motivation letter excluded; validator fails on the term |
| R5  | Form data sent to an AI provider  | privacy breach                       | separate transports, separate modules, no shared state; documented in code           |
| R6  | PII retained in logs              | GDPR exposure                        | log `{requestId, durationMs, outcome}` only; no body, no email, no IP                |
| R7  | Spam / form flooding              | inbox noise, cost                    | honeypot, timing, origin, link cap, rate limit                                       |
| R8  | Rate limit bypass via cold starts | abuse                                | documented limitation; shared store only with approval                               |
| R9  | Email header injection            | spoofing                             | CRLF stripped from every header-bound value                                          |
| R10 | XSS via message rendering         | session/data theft                   | React text nodes only; no `dangerouslySetInnerHTML`; no markdown renderer            |
| R11 | CSRF                              | forged submissions                   | no cookies/session; JSON-only; same-origin check                                     |
| R12 | Oversized payload                 | memory/CPU                           | 16 kB body cap before parse; field length caps                                       |
| R13 | Provider outage                   | lost messages                        | 8s timeout, explicit error, handoff fallback retained                                |
| R14 | Supply-chain risk from a new SDK  | compromised package                  | prefer raw `fetch` adapters; no SDK required for Phase 9                             |
| R15 | Fake success                      | trust damage                         | `SUCCESS` only on server `{status:"accepted"}`                                       |

---

## 8. Files required

### 8.1 New (22, plus 1 optional)

**Assistant (8)**

```
types/assistant.ts
data/assistant/knowledge.ts
data/assistant/suggestions.ts
features/conversion/ai-recruiter-assistant/index.ts
features/conversion/ai-recruiter-assistant/PortfolioAssistant.tsx
features/conversion/ai-recruiter-assistant/components/MessageBubble.tsx
features/conversion/ai-recruiter-assistant/components/SuggestionChips.tsx
features/conversion/ai-recruiter-assistant/useAssistant.ts
```

**Contact form (7)**

```
features/conversion/contact-form/index.ts
features/conversion/contact-form/RecruiterContactForm.tsx
features/conversion/contact-form/components/FloatingField.tsx
features/conversion/contact-form/components/FormStatus.tsx
features/conversion/contact-form/components/HandoffPanel.tsx
features/conversion/contact-form/contactSchema.ts
features/conversion/contact-form/useContactForm.ts
```

**Server (4)**

```
app/api/contact/route.ts
lib/env.server.ts
lib/contact/rateLimit.ts
lib/contact/delivery.ts
```

**Tooling and docs (3)**

```
scripts/validate-assistant-kb.mjs
scripts/check-no-public-secrets.mjs
docs/PHASE_9_REPORT.md          (this file)
```

_(Optional, if the drafting indicator is not inlined: `features/conversion/contact-form/components/DraftIndicator.tsx`.)_

### 8.2 Modified (5)

| File                                                            | Change                                                                                                |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `app/page.tsx`                                                  | Mount the assistant section; mount the form inside the contact section                                |
| `features/conversion/contact-hub/components/ContactPreview.tsx` | Accept an optional `form` slot rendered under the invitation (no second contact section, no deletion) |
| `lib/env.ts`                                                    | Unchanged in substance; a comment pointing to `env.server.ts`                                         |
| `package.json`                                                  | Scripts `validate:kb`, `check:secrets`; **no dependencies**                                           |
| `README.md`                                                     | Document the two scripts and the env matrix                                                           |

### 8.3 Deleted

**None.**

### 8.4 Dependencies

**Zero** for the approved path (deterministic assistant, handoff delivery, in-memory limiter).

Only if a provider is approved later: `resend` (or `nodemailer`), and optionally an AI SDK — though both can be raw `fetch` with no dependency at all. I would prefer raw `fetch`: two adapters, no supply chain, no version drift.

---

## 9. Implementation stages

| Stage   | Work                                                                       | Gate                                                                                           |
| ------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **9.0** | Approve this report and D1–D12                                             | Nothing written before                                                                         |
| **9.1** | Knowledge base + retrieval engine + validator                              | `validate:kb` passes; all 8 required questions answered with citations; refusal path verified  |
| **9.2** | Chat interface (bubbles, avatars, timestamps, states, suggestions, clear)  | Keyboard-only pass, reduced motion, `aria-live` verified                                       |
| **9.3** | Contact form UI + status machine (client only, no route)                   | Floating labels, caret, drafting indicator, validation, `SUCCESS` unreachable without a server |
| **9.4** | `POST /api/contact` + Zod + honeypot + timing + origin + limiter + handoff | `curl` matrix: 200 handoff, 400, 403, 415, 429; no PII in logs                                 |
| **9.5** | Provider integration                                                       | **Blocked** until a provider is chosen, a domain verified, and env vars approved               |
| **9.6** | LLM assistant route                                                        | **Blocked** until a provider and model are chosen; requires 9.1's contract                     |
| **9.7** | QA sweep                                                                   | Section 10                                                                                     |

Each stage is one commit. No push, no deploy, no `--no-verify`.

---

## 10. Verification checklist

**Assistant**

- [ ] All 8 required questions answer correctly and cite at least one source
- [ ] Unknown question → refusal + suggestions, never a guess
- [ ] No answer contains a number that is not in a data file
- [ ] `validate:kb` fails if the motivation letter, `process.env`, or `fs` appears
- [ ] Label says "No language model is called"
- [ ] Clear conversation resets and restores focus

**Form**

- [ ] Floating label positions correct at rest, focus, filled, error
- [ ] Validation fires on blur/submit only
- [ ] Drafting indicator appears while typing and never inserts text
- [ ] `SUCCESS` unreachable without `{status:"accepted"}`
- [ ] `HANDOFF` shows the mailto/WhatsApp link and says "finish in your email app"
- [ ] Timeout, network failure, 429 and 500 each render a distinct error with Retry

**Security**

- [ ] `check:secrets` finds no `NEXT_PUBLIC_AI` / `NEXT_PUBLIC_CONTACT` anywhere
- [ ] `lib/env.server.ts` cannot be imported by a client module (ESLint rule + runtime guard)
- [ ] Logs contain no email, phone, message, or IP
- [ ] Honeypot, timing, origin, link cap, and rate limit each verified with `curl`
- [ ] No `dangerouslySetInnerHTML`, no markdown renderer, no `eval`
- [ ] Nothing stored after the response

**Accessibility**

- [ ] Transcript `role="log"`, messages announced once
- [ ] Form errors announced; first invalid field focused
- [ ] Reduced motion: no dot animation, no message transition
- [ ] 44px targets, visible focus rings, contrast unchanged

---

## 11. Decisions needed

| #       | Decision                                                                                                                                                                   | Recommendation                                 |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **D1**  | Phase 8 is planned but not implemented; Phase 9 builds on the current Phase 6 site and does not assume Phase 8 exists                                                      | Approve                                        |
| **D2**  | Ship the deterministic assistant first; no AI provider selected                                                                                                            | Approve                                        |
| **D3**  | The assistant excludes the motivation letter even though a public copy is currently served by the Resume Center. Confirm whether that public copy should also be withdrawn | Exclude from assistant; leave the file for now |
| **D4**  | Assistant becomes its own section before Contact; not a dock destination                                                                                                   | Approve                                        |
| **D5**  | Contact form renders inside the existing contact section via a slot, so there is one contact block, not two                                                                | Approve                                        |
| **D6**  | Create `POST /api/contact` now with the `none` delivery adapter; no external service                                                                                       | Approve                                        |
| **D7**  | In-memory rate limiting now; shared store (Upstash/Vercel KV) only with later approval                                                                                     | Approve                                        |
| **D8**  | No CAPTCHA; honeypot + timing + origin + rate limit                                                                                                                        | Approve                                        |
| **D9**  | Zero new dependencies for the approved path; raw `fetch` adapters later                                                                                                    | Approve                                        |
| **D10** | Add a `HANDOFF` UI state alongside the five required states, because "accepted but not delivered" is neither success nor error                                             | Approve                                        |
| **D11** | Log only `{requestId, durationMs, outcome}`; never the message or the sender                                                                                               | Approve                                        |
| **D12** | Approve the env variable **names** in §6 before any of them is created                                                                                                     | Approve                                        |

**Nothing is coded until D1–D12 are answered.** If you approve, the first commit is 9.1 — the knowledge base and the validator — which touches no UI and creates no endpoint.
