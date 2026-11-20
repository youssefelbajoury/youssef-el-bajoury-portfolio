# youssef-el-bajoury-portfolio

Premium interactive portfolio showcasing Full Stack Software Engineering, IoT &amp; AI &amp; Cloud systems, modern web development and high-end UI/UX experiences.

## Run

```bash
npm install
npm run dev
```

`npm run build` produces the production build. `npm run lint`, `npm run typecheck`, `npm run validate:kb` and `npm run check:secrets` are the verification commands; all five must pass before a commit.

## Environment

The site builds and runs with an empty environment. Every server variable below is optional and has a default.

### Public

| Name                   | Default                 | Notes                                                                                                                                        |
| ---------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | The site's canonical origin. Also the value the contact route checks `Origin` against, so it must match the address the site is served from. |

Only `NEXT_PUBLIC_SITE_URL` and `NODE_ENV` are public. A credential never carries the `NEXT_PUBLIC_` prefix — `npm run check:secrets` fails the build if one does.

### Server-only

Read once in `lib/env.server.ts`, which throws if it is ever imported into a client bundle and is forbidden outside `app/api` route handlers by ESLint.

| Name                        | Default  | Used by                                           |
| --------------------------- | -------- | ------------------------------------------------- |
| `CONTACT_DELIVERY_PROVIDER` | `none`   | delivery adapter selection                        |
| `CONTACT_API_KEY`           | —        | provider auth (unused while `none`)               |
| `CONTACT_FROM_EMAIL`        | —        | sender on a verified domain (unused while `none`) |
| `CONTACT_TO_EMAIL`          | —        | recipient (unused while `none`)                   |
| `CONTACT_TIMEOUT_MS`        | `8000`   | provider abort                                    |
| `RATE_LIMIT_WINDOW_MS`      | `600000` | per-client limiter window                         |
| `RATE_LIMIT_MAX`            | `5`      | requests per client per window                    |

`AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`, `AI_BASE_URL`, `AI_TIMEOUT_MS` and `AI_MAX_OUTPUT_TOKENS` are reserved in the schema for a later, separately approved stage. Nothing reads them yet.

## Contact route

`POST /api/contact` is the only backend route. It validates with the same Zod schema the form uses, rate-limits by a SHA-256 hash of the client address, and never stores or logs a name, address, message body, or IP.

| Status | Body                                                                                                    |
| ------ | ------------------------------------------------------------------------------------------------------- |
| 200    | `{ ok: true, status: "accepted", id }` or `{ ok: true, status: "handoff", handoff: { channel, href } }` |
| 400    | `{ ok: false, code: "VALIDATION", fields }`                                                             |
| 403    | `{ ok: false, code: "ORIGIN" }`                                                                         |
| 413    | `{ ok: false, code: "PAYLOAD_TOO_LARGE" }`                                                              |
| 415    | `{ ok: false, code: "UNSUPPORTED_MEDIA_TYPE" }`                                                         |
| 429    | `{ ok: false, code: "RATE_LIMIT", retryAfter }`                                                         |
| 503    | `{ ok: false, code: "DELIVERY_NOT_CONFIGURED" }`                                                        |
| 504    | `{ ok: false, code: "TIMEOUT" }`                                                                        |
| 500    | `{ ok: false, code: "INTERNAL" }`                                                                       |

With `CONTACT_DELIVERY_PROVIDER=none` (the default) a valid submission returns **handoff**: the message passed validation but nothing was delivered, and the page says so while offering the visitor's own email app or WhatsApp. The form never reports success without an `accepted` body.

## Assistant

The portfolio assistant is deterministic retrieval over `data/assistant/knowledge.ts`. No language model is called, no provider is configured, and every answer cites a source. `npm run validate:kb` enforces the boundary: the knowledge base may not reference the motivation letter, `process.env`, the filesystem, or any unapproved source.
