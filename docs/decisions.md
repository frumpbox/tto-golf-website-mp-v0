# Durable decisions

This file records only decisions expected to guide future work.

## Official project name

**Decision:** The official name is **The Tyrrells Open**, abbreviated **TTO**.
Use that exact spelling without apostrophes. No other spelling or apostrophe
variation is acceptable.

**Consequence:** New documentation, interface copy, metadata, code, and data
should use the official name. Corrections to existing implementation files
remain controlled tasks.

## Static multi-page architecture

**Decision:** TTO remains a Vite static multi-page website using plain HTML,
CSS, and JavaScript.

**Consequence:** Do not migrate to React, Next.js, Vue, Tailwind, another
framework, or a single-page application without an explicit new decision.
Preserve the six existing page URLs.

## Direct development before automation

**Decision:** Direct Codex development comes before Frumpbox automation.

**Consequence:** Frumpbox is not on the critical path for improving TTO.

## Independent maintainability

**Decision:** TTO must not depend on Discord or Frumpbox to be maintainable.

**Consequence:** Installation, development, building, previewing, and normal
maintenance must continue to work directly from this repository.

## Approval-controlled publication

**Decision:** Git publication remains controlled by James.

**Consequence:** Do not commit, push, deploy, or publish without James's
explicit approval. Approval to implement is not approval to publish.

## Leaderboard migration gate

**Decision:** The consolidated leaderboard dataset cannot replace the live
implementation until verification passes.

**Consequence:** Reconcile data failures before replacing the renderer or
treating `src/data/leaderboard-data.js` as the live source of truth.

## Retention before cleanup

**Decision:** Old files are not deleted merely because they appear duplicated
or unused.

**Consequence:** Verify consumers and obtain explicit cleanup approval before
moving or deleting historical, generated, or divergent files.

## Active source convention

**Decision:** Files under `src/` are the active implementation unless current
documentation explicitly states otherwise.

**Consequence:** Divergent root copies are not authoritative.

## Canonical course scorecards

**Decision:** Each course has one canonical scorecard representing the latest
authoritative published configuration deliberately selected for the website.
TTO does not maintain separate historical course configurations for individual
event years.

**Consequence:** Course Ratings, leaderboard scorecards, and
handicap/Stableford calculations may all use the same canonical course data.
Historical leaderboard points and results remain authoritative even when an
original gross scorecard is missing or no longer reproduces those points
against the canonical card. A future gross-score reconstruction may use the
canonical configuration, but it must be identified internally as reconstructed
and must not be presented as an original scorecard.

## Historical plans

**Decision:** Older root-level plans and audits are reference material, not
automatically current instructions.

**Consequence:** Verify their claims against the current implementation before
using them.
