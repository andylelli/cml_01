# CML 2.0 — Crime Modeling Language

CML 2.0 is a formal, fair-play specification for modeling mystery logic.

It encodes **why a crime is misunderstood**, not how it is narrated.

## What CML Is For
- Designing fair-play detective fiction
- Validating mystery plots
- Generating solvable cases with AI
- Separating logic from prose

## What CML Is Not
- A plot outline
- A character sheet
- A trope list
- A story generator

## Core Idea
Every mystery fails because of **one mistaken belief**.

CML makes that belief explicit.

## Pipeline (Mandatory Order)

Spec → CML → Validate → Clues → Outline → Prose

Never reverse this order.

## Design Guarantees
- One primary deception axis
- No hidden evidence
- No confessions
- Reader-solvable logic

## Who This Is For
- Mystery writers who care about fairness
- Game designers building deduction systems
- AI researchers generating reasoning puzzles
- Editors and validators checking logic integrity

## Status

Phase 2 complete (Postgres-backed persistence, validation endpoints, artifact previews, run events).
Phase 3 complete (deterministic pipeline execution, step validation artifacts, run events, novelty audit placeholder).
Phase 4: Export packaging implemented (UI ExportPanel and backend export API endpoint allow users to download selected artifacts as a JSON file).
Phase 5: Prose and game pack artifacts are generated deterministically (placeholders) and available via the API.
V1 complete: clue list with red herrings, fair-play report, simple suspect cards, and granular regenerate controls are now visible in the UI.
V2 complete: play mode chapter reveal, printable party kit PDF download, and community templates are available.

Pull requests welcome.

## Database (Postgres)
This project uses PostgreSQL as the system of record. You can run Postgres in Docker and point the API/worker to it with a standard connection string.

Recommended environment variables:
- `DATABASE_URL` (e.g., `postgres://user:password@localhost:5432/cml`)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` (optional split vars)

Notes:
- Migrations/schema setup are handled by the backend service once implemented.
- The database is required for projects, specs, artifacts, and run history.

## Local startup (Windows)
- Run start-app.bat to install dependencies, build packages, and start API/worker/web.
- If starting manually, build @cml/cml first (`npm run -w @cml/cml build`) before running @cml/api dev.
