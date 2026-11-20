# OpenCode prompts — YB branding, English CV and project portfolio update

Project root: `C:\Portfolio`  
Portfolio repository: `https://github.com/youssefelbajoury/youssef-el-bajoury-portfolio`  
Production website: `https://youssef-el-bajoury-portfolio.vercel.app/`  
Vercel project: `https://vercel.com/youssef-el-bajoury/youssef-el-bajoury-portfolio`

Use these prompts one phase at a time. Do not ask OpenCode to implement every phase in one large change.

---

## PROMPT 0 — Safety contract and read-only audit

```text
You are working on my EXISTING production portfolio in C:\Portfolio.

GitHub repository: https://github.com/youssefelbajoury/youssef-el-bajoury-portfolio
Production website: https://youssef-el-bajoury-portfolio.vercel.app/
Vercel project: https://vercel.com/youssef-el-bajoury/youssef-el-bajoury-portfolio

NON-NEGOTIABLE SAFETY RULES
1. Do not delete, rename, move, overwrite, or bulk-reformat any existing file or folder.
2. Do not replace the project architecture, redesign the site from scratch, or remove any existing page, route, component, animation, asset, or feature.
3. Do not modify package.json, package-lock.json, Next.js configuration, Tailwind configuration, TypeScript configuration, ESLint configuration, .gitignore, security headers, authentication, environment variables, Vercel settings, or GitHub settings without first explaining the change and receiving my explicit approval.
4. Never expose, copy, log, or commit secrets, API keys, tokens, private environment values, private documents, or confidential IZIRY information.
5. Never run destructive commands such as git reset --hard, git clean, force-push, or commands that discard local changes.
6. Never push directly to the production branch, merge a pull request, or deploy to production unless I explicitly approve that final release.
7. Add new files with new names. If a target filename already exists, stop and ask before replacing it.
8. The current website's dark graphite/near-black theme, restrained cyan/blue accents, typography, spacing, layout, navigation, and interaction language must remain recognizable. Improve details; do not impose a different visual identity.

FIRST, READ-ONLY INSPECTION
- Run git status --short, git branch --show-current, git remote -v, and inspect recent commits.
- Identify the repository's actual production branch from the current Git and Vercel configuration. Do not assume it is main without checking.
- Inspect the existing App Router/pages, components, data/content folders, public assets, logo, favicon, loading/suspense boundaries, resume links, and project cards.
- Read MASTER_SPECIFICATION.md and preserve its constraints.
- Inspect current package scripts and already-installed dependencies before recommending any new package.
- Identify any uncommitted user work. Do not stash, reset, discard, or overwrite it.

Return an audit with exact file paths, proposed additions, proposed edits, risks, and tests. Do not modify anything until I approve the file-by-file plan.
```

---

## PROMPT 1 — Add YB logo, favicon and animated loading mark

```text
Implement the approved branding update using the supplied files that I will place in C:\Portfolio:

- YB-Logo.png — high-resolution transparent PNG master
- YB-Logo.svg — scalable vector master
- YB-Favicon-512.png — square high-resolution favicon/app-icon source
- YB-Favicon-64.png — small favicon rendition
- YBLoadingLogo.tsx — reusable SVG stroke-draw loading component

Brand direction: YB monogram; graphite/metallic structure with cyan/blue light; subtle circuit traces and data/AI node motif. Match the existing dark portfolio theme. Do not add a different background or unrelated brand colors.

TASK A — ASSET PLACEMENT
1. Inspect the current public/app asset layout and choose an appropriate existing branding/assets directory.
2. Add the supplied logo and loader files using new filenames/paths. Do not overwrite any existing asset.
3. Preserve the SVG as the scalable source and PNG as the static image.

TASK B — LOADING ANIMATION
1. Inspect the existing loading/suspense implementation before touching it.
2. Integrate YBLoadingLogo.tsx into the existing loading experience or a new, non-conflicting loading component.
3. The animation should feel like a technical pen/pencil tracing the YB monogram: draw the Y strokes first, then the B strokes, then reveal the circuit traces and nodes with a subtle cyan glow.
4. Use the supplied SVG path geometry and match the static logo. Do not substitute a different monogram.
5. Use a polished fade/scale transition when the loader exits. Do not introduce an arbitrary long delay or block the site after the page is ready.
6. Respect prefers-reduced-motion. In reduced-motion mode show the static mark immediately.
7. Ensure the loader cleans up any animation/listeners if it uses JavaScript. Prefer CSS/SVG animation where possible and do not add a new dependency.

TASK C — FAVICON
1. Inspect how this exact Next.js project currently configures icons (metadata, app/icon files, favicon.ico, manifest, or public links).
2. Use YB-Favicon-64.png or the 512px master as appropriate for the existing setup.
3. Keep old icon files as backups; do not delete or overwrite them. Update only the active icon reference using the existing app conventions.
4. If the framework's file-based icon convention prevents a safe reference-only update, stop and show me the exact existing file and proposed backup/rename plan before proceeding.

TASK D — QA
- Check logo on the existing dark background and at 16px, 32px, 64px, and larger sizes.
- Check for transparent background, crisp edges, no clipping, and no overflow.
- Check loader on desktop and mobile and with reduced motion.
- Preserve all routes, content, navigation and functionality.

Before editing, show the exact files you will create or modify and wait for my approval. After editing, report every changed path and test result. Do not deploy.
```

---

## PROMPT 2 — Integrate the English CV and resume button

```text
Add my new English CV to the existing Resume/CV experience without removing or replacing my existing French CV.

New English PDF supplied by me:
Youssef-El-Bajoury-CV-EN-2026.pdf

Source French CV on my PC:
C:\Portfolio\YoussefElBajouryCvFr.pdf

Private motivation letter on my PC:
C:\Portfolio\Lettre_de_motivation_Youssef_El_Bajoury.pdf

IMPORTANT PRIVACY RULE:
The motivation letter is private by default. Do not copy it into public/, do not link it from the website, and do not expose it in the portfolio. Do not publish any private document unless I separately authorize it.

TASKS
1. Inspect the current resume files, their exact paths, download links, buttons and route behavior.
2. Add the English PDF as a NEW asset, preferably under the existing public resume/documents structure. If no suitable structure exists, propose a new path such as:
   public/resume/Youssef-El-Bajoury-CV-EN-2026.pdf
3. Do not overwrite, rename or delete the French CV or any other existing PDF.
4. Add a clearly visible action with this exact label:
   "View Resume (English version)"
5. Keep the current French CV action working and label it clearly, for example "View Resume (French version)" or the equivalent existing French wording.
6. The English PDF should open in a new tab or download reliably, following the existing site's resume UX and security conventions.
7. Add meaningful accessible text, keyboard focus styles and mobile-friendly button layout.
8. Verify that the PDF URL returns the correct file and that the browser can open/download it.
9. Do not add the motivation letter to the site's public assets.

The English CV content must be treated as a verified translation of the supplied French CV. Do not add new skills, seniority, job results, metrics or qualifications. Keep the dates, 461 test result, database/API counts and language levels consistent with the document.

Before editing, list the precise files and wait for approval. After implementation, test both English and French CV actions. Do not deploy.
```

---

## PROMPT 3 — Update project cards and repositories with the correct links and local images

```text
Update the existing Projects section and project case-study pages using the following exact sources. Do not invent repository URLs or screenshots.

PORTFOLIO REPOSITORY
https://github.com/youssefelbajoury/youssef-el-bajoury-portfolio

SMART HEALTH ROOM
Repository: https://github.com/youssefelbajoury/SMART-HEALTH-ROOM
Use this exact URL on the Smart Health Room project card and case study.
Inspect the repository README and actual source tree before describing functionality. Preserve any existing local screenshots.

ROLEX PROJECT
Repository: https://github.com/youssefelbajoury/RolexProject
Use this exact URL for the Rolex Experience / academic Rolex project card and case study. Preserve the existing Rolex screenshots and assets.

MOROCCO RETAIL INTELLIGENCE DATA PLATFORM (MRIDP)
Local assets and screenshots: C:\Portfolio\MRIDP_Images
Repository: https://github.com/youssefelbajoury/morocco-retail-intelligence-data-platform
The local folder contains README.md and application screenshots covering sales performance, management overview, inventory status, procurement and general platform features. Inspect every file and use the actual screenshots in a categorized gallery. Read the README before making claims.

AUTOFLOW
Local project images: C:\Portfolio\AutoFlow_Images
AutoFlow is still under development. Inspect this directory and use its actual project images. If an image is only a concept/mockup, label it clearly as "Conceptual UI" or "In development"; never present it as a real production screenshot. Do not invent an AutoFlow GitHub URL; no repository link has been supplied in this task.

CONTENT RULES
- Preserve the current project cards and details unless I explicitly authorize removal.
- Add the exact repository links above to the corresponding buttons, labels or "View Source" actions.
- Validate every link and ensure it opens the correct repository.
- Keep academic projects clearly identified as academic work; do not present them as paid commercial deployments.
- For MRIDP, distinguish a local/demo or synthetic-data platform from a real live retailer deployment. Do not invent live users, customer deployments, revenue impact or production usage.
- For Smart Health Room, use only capabilities supported by the repository/CV. The CV describes six sensor types and RFID access control.
- For Rolex, preserve the academic-project context.
- Keep IZIRY's project description high-level and do not expose company data, client names, proprietary models, internal datasets, source code or confidential architecture.
- Keep AutoFlow's implementation status accurate; do not invent completion status or live business users.

Before editing, inspect the actual local images and README/source documents, identify the target files, and wait for approval. After implementation, verify all project links and galleries. Do not deploy.
```

---

## PROMPT 4 — Final consistency, accessibility and regression checks

```text
Perform a read-only audit first, then propose any fixes. Do not delete, rename, move or overwrite files.

CHECK THE NEW BRANDING
- YB logo is legible on the existing dark theme.
- PNG and SVG assets render sharply.
- Favicon uses the new YB mark without breaking the existing icon/manifest setup.
- Loading animation draws the Y and B in sequence and reveals circuit details.
- Reduced-motion users receive a static/faster experience.

CHECK THE RESUME CENTER
- "View Resume (English version)" opens the new English PDF.
- The French CV link still works.
- The private motivation letter is not publicly accessible or linked.

CHECK THE PROJECTS
- Smart Health Room points to https://github.com/youssefelbajoury/SMART-HEALTH-ROOM
- Rolex points to https://github.com/youssefelbajoury/RolexProject
- MRIDP points to https://github.com/youssefelbajoury/morocco-retail-intelligence-data-platform
- AutoFlow uses the approved images in C:\Portfolio\AutoFlow_Images and has no invented source URL.
- MRIDP uses actual screenshots from C:\Portfolio\MRIDP_Images and claims supported by README.md.
- Existing Rolex, Smart Health Room and other project assets remain available.

CHECK THE EXISTING SITE
- Current visual identity, navigation, homepage, routes, responsive behavior and existing animations are preserved.
- No broken internal or external links.
- No missing images or console errors.
- No horizontal overflow on mobile.
- No private documents, API keys, credentials or IZIRY confidential data are exposed.

TECHNICAL CHECKS
Inspect package.json and run only the existing project scripts, where available:
- npm run lint
- npm run typecheck
- npm run build
Also run git diff --check.
Do not install dependencies or broadly format unrelated files.

Return a report with: passed checks, failed checks, blockers, changed files, new files, and exact fixes proposed. Do not push, merge or deploy.
```

---

## PROMPT 5 — Prepare a safe GitHub and Vercel release

```text
Prepare the approved portfolio changes for release, but do not merge or deploy to production.

1. Confirm the working directory is C:\Portfolio.
2. Run git status --short, git branch --show-current, git remote -v, and git diff --stat.
3. Confirm the remote is:
   https://github.com/youssefelbajoury/youssef-el-bajoury-portfolio
   If the actual configured remote differs, stop and show me; do not rewrite it automatically.
4. Check the current production branch in the Vercel project settings. Do not assume it is main without verification.
5. Confirm there are no unreviewed/uncommitted user changes. If there are, stop and explain; do not discard or silently stash them.
6. Stage only the exact files I approved. Never use git add -A or git add . without first listing and reviewing every staged path.
7. Create a descriptive commit on a separate feature branch, for example:
   update/yb-branding-english-cv-projects
8. Push only that feature branch to the existing GitHub repository.
9. Open a Pull Request targeting the verified Vercel production branch.
10. Wait for Vercel to create a Preview Deployment. Give me its exact preview URL and source commit.
11. Do not merge the PR, push to the production branch, run vercel --prod, or trigger a production deployment.
12. Wait for my explicit approval after I manually review the preview.

Never use force push, reset --hard, git clean, destructive commands, or commands that delete local changes. Keep the existing production deployment intact.
```

---

## Manual release checklist (after preview approval)

1. Check `git status --short`; ensure all intended files are committed and no unrelated files are staged.
2. Confirm the pushed branch and commit in GitHub.
3. Review the Pull Request diff and the Vercel Preview URL.
4. Test the preview on desktop and mobile, including project links, gallery images, loading experience, favicon, both CV buttons, all routes and contact links.
5. Download/open the English PDF from the preview and confirm the French CV still works.
6. Confirm the motivation letter is not exposed.
7. Confirm Vercel's configured Production Branch and Production environment settings have not changed.
8. Only after explicit approval, merge the Pull Request using the repository's normal review process.
9. In Vercel, open the new Production Deployment and confirm it was built from the approved merge commit and completed successfully.
10. Open the stable site `https://youssef-el-bajoury-portfolio.vercel.app/` and verify it.
11. If production is faulty, use Vercel's deployment history to roll back to the last known-good production deployment; do not attempt destructive Git fixes.

Official Vercel Git deployment documentation: https://vercel.com/docs/git
Official Vercel environments documentation: https://vercel.com/docs/deployments/environments

```

```
