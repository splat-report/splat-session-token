.PHONY: dev
dev: node_modules/.modules.yaml
	npm run dev



node_modules/.modules.yaml:
	npx pnpm install
