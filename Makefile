# Common tasks for the site. Run `make` to list them.

.DEFAULT_GOAL := help
.PHONY: help install serve build preview check new-publication citations clean

help: ## List available commands
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-16s %s\n", $$1, $$2}'

node_modules: package.json package-lock.json
	npm install
	@touch node_modules

install: node_modules ## Install dependencies

serve: node_modules ## Run the site locally at http://localhost:4321 (shows drafts)
	npx astro dev

build: node_modules ## Build the site into dist/ (fails if any paper has bad data)
	npx astro build

preview: build ## Build, then serve the built site locally
	npx astro preview

check: node_modules ## Check data and types without building
	npx astro check

new-publication: ## Create a publication: make new-publication id=gallagher2026example
	@node scripts/new-publication.mjs "$(id)"

citations: node_modules ## Update citation counts from Google Scholar (dry_run=1 to preview)
	@node scripts/update-citations.mjs $(if $(dry_run),--dry-run)

clean: ## Remove build output and caches
	rm -rf dist .astro node_modules/.astro
