# llm-wiki workspace

This repository is a Pi-maintained incremental markdown wiki designed for Obsidian-first inspection.

## Operating contract

- Treat `.pi-wiki.json` as the machine-readable source of layout truth.
- Treat `raw` as the immutable raw-source layer.
- Treat `wiki` as the LLM-maintained wiki layer.
- Do not edit existing files under `raw`.
- When you add or materially update wiki pages, also update:
  - `wiki/index.md`
  - `wiki/log.md`
- Read `wiki/index.md` first for query and maintenance tasks.
- Prefer Obsidian wikilinks (for example `[[wiki/concepts/example]]`) for intra-vault links.
- Add concise frontmatter to wiki pages so Obsidian search and Dataview-style queries stay useful.
- Keep pages interlinked and carry forward contradictions, caveats, and source freshness.

## Obsidian-first conventions

- The scaffold configures Obsidian attachments to land in `raw/assets`.
- Human-created notes in Obsidian should default to `wiki/analyses` unless a more specific folder is appropriate.
- Use `wiki/_views` for inspection-oriented notes and dashboards.
- Use `wiki/_templates` for reusable page templates and examples.
- Keep `raw` collapsed in everyday browsing; inspect `wiki` as the primary knowledge layer.

## Preferred workflows

- Use the `llm-wiki` skill for ingest, query, and lint operations.
- Use `wiki_status` to inspect the workspace layout and counts.
- Use `wiki_search` to search the current wiki before scanning many files manually.

## Page conventions

- Source summaries belong under `wiki/sources`.
- Entity pages belong under `wiki/entities`.
- Concept pages belong under `wiki/concepts`.
- Saved answers, comparisons, and analyses belong under `wiki/analyses`.
- Prefer concise summaries, visible links, frontmatter, and a dedicated sources/citations section on each page.
