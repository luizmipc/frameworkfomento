# Workflow Runbook

This document is this repo's Workflow Runbook: the Standard Operating
Procedure for the development loop — named stages, explicit gates,
required outputs. It exists so a human can read one file and know what
happens, which agent does it, and why — instead of tracing five skill
files to reconstruct the picture.

**Spec Kit is the backbone and is never bypassed.** Every path below sits
on top of the standard Spec Kit artifacts — `specs/<slug>/spec.md`,
`plan.md`, `tasks.md` — and the standard `speckit-*` skills
(`speckit-specify`, `speckit-clarify`, `speckit-checklist`,
`speckit-plan`, `speckit-tasks`, `speckit-analyze`, `speckit-implement`,
`speckit-converge`, `speckit-taskstoissues`, `speckit-constitution`). None
of it is replaced. What follows names the roles those artifacts already
play and adds the small set of behaviors that were genuinely missing.

Two standing constraints, unchanged by anything below:
- **`/meeting` never auto-triggers.** It only runs when the user types
  `/meeting`, or a composing skill (`/quick-task`) calls it internally.
- **"Deploy" stays readiness-report-only.** `devops` audits deploy
  readiness (`/check-deployment` → `docs/deploy-report/`) but never
  pushes to a real environment — no CD target or credentials exist here.

## Vocabulary used below (one line each, detail inline where it matters)

- **Mission Brief** — `specs/<slug>/spec.md`: goal, non-goals, acceptance
  criteria, constraints. The unit of delegation to `dev`/`designer`. Its
  own (mission-level) autonomy envelope and evidence obligation live in
  the same file — NFR/Constraints, and the Acceptance Criteria a
  Merge-Readiness Pack must satisfy — not as separate labeled sections,
  but under those existing headings. That is distinct from `dev`'s
  standing (agent-level) autonomy envelope below, which applies across
  every mission, not just one.
- **Mentorship Pack** — `CLAUDE.md` + `.specify/memory/constitution.md` +
  `.claude/agents/*.md`: the institutional rulebook every agent loads
  before doing anything (norms, boundaries, "what good looks like here")
  — this repo's version of the project-config-file pattern (`CLAUDE.md`,
  `AGENT.md`-style files) already common practice elsewhere; nothing new
  was built.
- **Handoff Contract** — the explicit package one agent hands the next:
  what changed, what to do next, what proof already exists. Named inline
  at each handoff below.
- **Consultation Request Pack** — a structured escalation `dev` raises
  before an irreversible/high-blast-radius decision (defined in full in
  `dev.md` § "Envelope de autonomia").
- **Merge-Readiness Pack** — the evidence bundle that proves a task is
  done. At feature-level closeout, `qa-test/SKILL.md`'s report template
  (`docs/qa-report/*.html`) covers functional completeness, verification
  soundness, engineering hygiene ("Higiene de engenharia"), and rationale
  ("Mudanças e não-mudanças"); auditability comes from the doc's stable
  anchors plus the git history of the Resolution Record commits it
  references, not a separate manifest file. The lighter per-task Done gate
  (`shortcuts/check-guardrails.sh`, enforced in CI) only requires a
  pass/fail signal — a `qa-report` or a changed `tests.py` in the diff —
  proportional to how small most tasks here are; see "What was
  deliberately not built."
- **Resolution Record** — this repo's "Lição aprendida": a dated entry a
  Retrospectiva writes into the responsible `.claude/agents/*.md` or
  `.claude/skills/*/SKILL.md` file. For a decision reached via a
  Consultation Request Pack, the pushed commit that rolls it into
  `plan.md`/`docs/index.html` is the actual record — frozen and
  addressable by its SHA, not a separate file (see `dev.md` § "Envelope
  de autonomia").
- **Layered readiness** — a task passing QA makes it *merge-ready*; a
  whole feature with every task `[x]` and a PR opened is
  *integration-ready*. Two different levels of "done," checked at two
  different steps (see Path 3).
- **Autonomy envelope** — what an agent may decide alone vs. must escalate
  vs. must never do, scaled by how reversible the decision is. Defined
  for `dev` (the only agent touching infra/schema/prod-adjacent
  surfaces) in `dev.md` — an agent-level envelope, standing across every
  mission it works (see the Mission Brief entry above for the separate,
  per-mission envelope).

---

## Path 1 — Create Spec (Design Phase)

Trigger: `/meeting` → Modo **"Criar spec"** (`meeting/SKILL.md`).

**1.1 — Describe the feature.** If not given inline, ask in chat: "Qual a
descrição dessa feature nova?"

**1.2 — `product-owner` drafts the Mission Brief.** Runs `speckit-specify`
(writes `specs/<slug>/spec.md`), then `speckit-clarify` (resolves
ambiguity — no `[NEEDS CLARIFICATION]` marker may remain), then
`speckit-checklist` (its own Definition-of-Ready gate). *Why a gate here:*
an ambiguous brief must be clarified before anyone builds against it — a
fast executor turns a small ambiguity into large rework at full
confidence. If `product-owner` reports a block,
**stop** — no branch, no Sincronização, no Retrospectiva. The mission
never started.

**1.3 — Branch created.** The canonical **Branch da feature** routine
(`kanban-start/SKILL.md`) creates/switches to `<slug>`, automatically, no
confirmation asked.

**1.4 — `designer` builds the prototype.** Handoff Contract in: the
Mission Brief's User Stories/FRs. Out: a static, non-functional prototype
in `prototype/<slug>/` (or an update, if one already exists for this
slug) — HTML/CSS/JS, no framework, ponytail-minimal.

**1.5 — Design-review gate (opt-in).** Ask: "Rodar uma revisão de design
(QA e/ou persona) no protótipo antes de gerar o plano técnico?"
- **Yes** → `qa` runs `qa-test` against the prototype (plus
  `fundraiser-test`/`coordenador-test` if a persona baseline already
  exists), then ask: "Spec e protótipo aprovados para seguir à
  implementação técnica?" **Reject** → capture the reason as a Resolution
  Record, loop back to 1.2 for another `speckit-clarify`/
  `speckit-checklist` round (not a full re-`specify` unless the reason
  says the spec itself is wrong). **Approve** → continue.
- **No** → skip straight to 1.6.
*Why:* this is the checkpoint that decouples the design phase from the
engineering phase — catching a wrong Mission Brief here is cheap; catching
it after `plan.md`/`tasks.md`/code exist is not.

**1.6 — `dev` produces the technical plan.** Runs `speckit-plan` →
`plan.md` (Django app structure, models, deps), then `speckit-tasks` →
`tasks.md` (dependency-ordered `T\d{3}` breakdown). This is where the
Mission Brief becomes executable work units.

**1.7 — Sincronização.** Loads the new `T\d{3}` tasks' visibility into
`KANBAN.md` (their backlog stays in `tasks.md` itself — `KANBAN.md` never
duplicates it, see `KANBAN.md`'s own header).

**1.8 — Retrospectiva.** Ask if anything went wrong; if so, write a
Resolution Record into the responsible agent/skill file.

---

## Path 2 — Refine Spec

Trigger: `/meeting` → Modo **"Atualizar spec"** (`meeting/SKILL.md`).

**2.1 — Describe the gap.** What motivated it (persona test, direct
observation, a request) and the expected behavior, if not given inline.

**2.2 — Resolve which feature.** `find specs -mindepth 1 -maxdepth 1
-type d`; ask if more than one.

**2.3 — Branch switched** to that feature (canonical routine).

**2.4 — `product-owner` amends the Mission Brief.** Decides the right
shape — new FR, extension of an existing one, or a new User Story — and
updates `spec.md` + `docs/index.html` accordingly. Explicitly barred from
touching `tasks.md`/`KANBAN.md`/`plan.md`/`app/` here — whether to touch
the prototype (2.5) and whether to create a task (2.6) are separate
decisions, made below, not by `product-owner`.

**2.5 — Prototype updated, if relevant.** If a prototype already exists
for this gap (`prototype/<slug>/` or a linked `prototype/avulsa-<ID>/`),
ask whether the new requirement changes anything visible; if yes,
`designer` reflects the minimal change in the existing prototype (never
recreated from scratch).

**2.6 — Closing decision.** Ask: "Requisito formalizado em spec.md. Criar
já uma tarefa avulsa para isso (protótipo e/ou lembrete de
implementação)?" **Yes** → continue into Path 4's task-creation steps,
entering partway at 4.3 (`meeting/SKILL.md`'s Modo "Criar nova tarefa",
step 2 — branch to `main` — since the origin and description are already
resolved by this path; steps 4.1-4.2 don't re-run), skipping its own
Retrospectiva since 2.7 below already covers it. **No** → go straight to
2.7. This question *is* the approval gate for the refinement — no
separate Yes/No was added on top of it.

**2.7 — Retrospectiva.**

---

## Path 3 — Implement Spec (Engineering Phase)

Trigger: `/kanban-start`, run once per pending task, repeated until the
feature's `tasks.md` is 100% `[x]`.

**3.1 — Fresh data.** Runs `meeting/SKILL.md`'s **Sincronização**
sub-routine alone (no ritual) to prune any task that already left In
Progress.

**3.2 — Select a task.** Combines `KANBAN.md`'s `A\d{3}` To Do with
pending `T\d{3}` read straight from every `specs/*/tasks.md`, presented as
clickable options (paginated at 4). A Task ID can also be passed inline.
If `docs/persona/` has at least one report, one extra option is reserved
in the same list: "Criar tarefa a partir de dores de persona" — picking
it runs `kanban-start/SKILL.md`'s own "Origem: persona" sub-routine
(create-then-select from `meeting`'s persona sub-routine, in-line, no
separate `/meeting` call needed) before returning to normal selection.

**3.3 — Optional Spec Kit step first** (only for `T\d{3}`): let `dev`
decide, or run `speckit-clarify`/replan/`speckit-analyze` before starting.

**3.4 — Branch + lock.** The canonical **Branch da feature** routine
switches to the feature's branch (or `main` for `A\d{3}`). Then the task
line moves into `KANBAN.md`'s `## In Progress`. *This lock is this repo's
lightweight answer to a coordination problem that needs much heavier
machinery at fleet scale (many agents planning around each other on
shared surfaces)* — this repo doesn't need that machinery because it runs
one `dev` on one task on one branch at a time by design, but the
underlying need (no two people silently working the same surface) is met
exactly the same way, at the scale this repo actually operates at: one
task locked In Progress, one branch per feature.

**3.5 — Handoff to `dev`.** The prompt is this step's Handoff Contract:
Task ID + verbatim description, exact `tasks.md` path, prototype path (if
any), instruction to consult `spec.md`/`plan.md`, `codegraph_explore`
reminder, ponytail reminder, and `dev.md`'s handoff rules. `dev` operates
inside its **autonomy envelope** (`dev.md`) — deciding freely on
reversible work, raising a **Consultation Request Pack** before anything
destructive/hard-to-reverse. Once a consultation is resolved, `dev` rolls
the *decision itself* back into `plan.md`/`docs/index.html` (not just a
note in its own Lição aprendida) — this repo's name for skipping that
step is "Brief Rot": a decision that only lives in chat/agent-notes
leaves the Mission Brief lying to the next reader. On completion, `dev`'s
report includes a minimal work-artifact + evidence summary (what changed,
what it already checked) — that summary is itself the Handoff Contract
into step 3.6.

**3.6 — QA gate (mandatory) — the review-loop pattern, bounded.** `qa`
receives that summary and tests against acceptance criteria.
- **Pass** → this task is now **merge-ready** (a Merge-Readiness Pack:
  the `docs/qa-report/*.html` verdict + `KANBAN.md` state). Continue.
- **Fail** → back to `dev` **exactly once** with the QA report. Still
  failing → **stop**, leave the task In Progress with a note, report to
  the user. *Why bounded at one retry:* this repo's own bounded-escalation
  convention — after one rejection, stop and hand the decision to a human
  rather than looping forever, enforced as a hard N=1, proportional to
  this repo's scale.

**3.7 — Reflect the result.** Sincronização again (T\d{3} `[x]` → drops
out of In Progress automatically) or, for `A\d{3}`, move the line to Done
by hand. `shortcuts/check-guardrails.sh` (local pre-push hook + CI) then
backstops this mechanically: a diff that flips a task to Done with no
`qa-report`/`tests.py` evidence alongside it fails the `guardrails` check.

**3.8 — Conditional docs update.** Only if `dev`/`qa` flagged that a
documented requirement/architecture decision was actually wrong.

**3.9 — Retrospectiva**, then **3.10 — Commit** (Conventional Commits,
detailed body), then:

**3.11 — Integration-ready gate.** Only when every `T\d{3}` in the
feature is `[x]` and the branch is pushed: ask whether to open a PR to
`main`. This is the feature-level "done," distinct from 3.6's per-task
merge-ready — a feature can have several merge-ready tasks land over
days before it becomes integration-ready as a whole.

---

## Path 4 — Fix Problem

Trigger: `/quick-task` (small, spec-less fixes), or `/meeting` → Modo
"Criar nova tarefa" → "A partir de um relatório existente" followed by
`/kanban-start` (when the fix should still show up as a normal avulsa
task on the board with full traceability to its source report). The two
entry points aren't identical past step 4.5: `/quick-task` explicitly
tells `meeting` to stop before its own step 9 (Retrospectiva), so the
combined flow gets exactly one, at `/kanban-start`'s end. The manual
`/meeting` call has no such instruction — its own Retrospectiva runs in
full before the separately-invoked `/kanban-start` adds its own, so this
entry point runs two.

**4.1 — Pick the report source.** One of the five "Origem:
`docs/*-report/`" sub-routines in `meeting/SKILL.md`: persona
(`docs/persona/`), QA (`docs/qa-report/`), security
(`docs/cybersec-report/`), deploy-readiness (`docs/deploy-report/`), or
strategic (`docs/coordenador-report/`). Each lists its report files, lets
the user pick one, extracts the failed/high-severity items, and offers
them via a multi-select `AskUserQuestion`.

**4.2 — One task description per selected item.** Built as `<título> (via
<relatório>#<âncora>)` — a pointer, not a copy of the full finding, so the
implementer opens the link for the complete write-up.

**4.3 — Branch to `main`** (canonical routine — ad-hoc `A\d{3}` tasks
always run on `main`), scope check against `docs/index.html`, feature/
avulsa bucket chosen, next `A\d{3}` ID allocated, line added to
`KANBAN.md`.

**4.4 — Prototype touch, if relevant** — `designer` adjusts an existing
one or creates a new one, same as any other new task.

**4.5 — Sincronização, then hand off into Path 3** (`/kanban-start`) for
that task — same merge-ready gate, same bounded QA retry, same commit
flow. No separate mechanism: a problem-report-derived task is just a
task. Via `/quick-task`, this step also skips `meeting`'s own
Retrospectiva (see trigger note above); via the manual `/meeting` entry
point, `meeting`'s Retrospectiva runs here before Path 3 starts.

---

## Path 5 — Create Report (Dynamic Parallelization)

Trigger: `/create-reports` (`create-reports/SKILL.md`) — the one path
with no prior equivalent; nothing previously let you pick several report
types and run them together.

**5.1 — Select report types.** Multi-select `AskUserQuestion`: Segurança
(`cybersecurity-blue`), Deploy (`devops`), QA (`qa`, then a sub-choice of
protótipo vs. aplicação real), Persona (`fundraiser`/
`coordenador-de-pesquisa`, multi-select of lens × target).

**5.2 — Parallel fan-out.** Every selected subagent is invoked in **one**
message block — true parallel execution, not sequential — each running
exactly the skill already documented for it
(`/cybersecurity-check`, `/check-deployment`, `/qa-test`/
`/qa-production-test`, `/fundraiser-test`/`/coordenador-test` and their
`-production-test` variants). No logic is duplicated here; this skill is
pure fan-out.

**5.3 — Collect and report.** Once all finish, list every generated file
path and suggest running `/docs-sync` next, so `docs/index.html` — the
existing living-docs hub — cross-links the new reports. No second
dashboard file is built; the hub already exists.

**5.4 — Retrospectiva.**

---

## Deploy note

Nothing above ends in an actual deploy. `devops`'s `/check-deployment`
produces a readiness report only (`docs/deploy-report/`). A real deploy
capability — target environment, credentials, rollback plan — is a
separate, higher-risk infrastructure project, deliberately out of scope
here.

## What was deliberately not built

- **Fleet-scale multi-agent runtime machinery** (shared-workspace
  isolation, scheduling, cost control across concurrently running agents).
  This repo runs one `dev` on one task at a time by design (Path 3, step
  3.4), so it doesn't need that machinery yet. The lightweight equivalents
  that solve the same underlying problem — `KANBAN.md`'s In Progress lock,
  one branch per feature, the Handoff Contract already carried in every
  subagent prompt — already exist and are named above. Build the heavier
  versions only if this repo starts running multiple agents concurrently
  on the same feature.
- **Autonomy-envelope boilerplate on every agent.** Only `dev` touches
  infra/schema/prod-adjacent surfaces, so only `dev.md` carries an
  explicit autonomy envelope and Consultation Request Pack structure.
  Copying that section onto `product-owner`/`designer`/`qa`/others would
  be ceremony applied where the risk doesn't warrant it.
- **New artifact file types** (a `mission-brief.md`, a `handoff/`
  directory, etc.). Every artifact above reuses a file this repo already
  has. Adding artifact types this repo's scale doesn't need would be
  ceremony, not rigor.
- **A machine-readable manifest for the Merge-Readiness Pack.**
  `qa-test/SKILL.md`'s report template plus the Resolution Record commits
  it links to already give stable anchors and a git-backed history —
  enough auditability at this repo's scale without a separate manifest
  file enumerating evidence with checksums. Add one if the evidence volume
  ever outgrows what a human can review by following links.
- **Progressive/evidence-driven widening of `dev`'s autonomy envelope.**
  It's static — defined once in `dev.md`, not something that widens after
  a track record of clean merges or narrows after a regression. Reasonable
  for a single maintainer running one `dev` at a time; revisit if that
  changes.
