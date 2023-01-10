.PHONY: dev
dev: node_modules/.modules.yaml
	BROWSER=none npx netlify-cli dev



node_modules/.modules.yaml:
	npx pnpm install
