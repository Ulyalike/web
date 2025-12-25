.PHONY: setup install build prepare start \
        dev-migrate dev-rollback dev-reset \
        prod-migrate prod-rollback prod-reset prod-deploy \
        start-backend start-backend-prod start-frontend start-frontend-prod \
        lint test test-coverage db-migrate db-reset

setup: prepare install build

prepare:
	cp -n .env.example .env || true

install:
	npm ci

build:
	npm run build

# Production
prod-migrate:
	@npm run migrate

prod-rollback:
	@npm run migrate:rollback

prod-reset:
	@npm run reset

migrate:
	@npm run migrate

start-prod: start-backend-prod

start-backend-prod:
	@npm start

start-frontend-prod:
	@npx webpack --mode=production

# Development
dev-migrate:
	@npm run dev:migrate

dev-rollback:
	@npm run dev:rollback

dev-reset:
	@npm run dev:reset

start-backend:
	@echo "🔧 Starting backend server..."
	@npm run dev:backend

start-frontend:
	@echo "🔧 Starting frontend watcher..."
	@npm run dev:frontend

start:
	@echo "🚀 Starting frontend and backend..."
	@bash -c '\
		trap "kill 0" EXIT; \
		echo "🔧 Starting frontend watcher..."; \
		npm run dev:frontend & \
		echo "🔧 Starting backend server..."; \
		npm run dev:backend & \
		wait \
	'

lint:
	npm run lint

test:
	npm test

test-coverage:
	npm run test:coverage

# Aliases
db-migrate: dev-migrate
db-reset: dev-reset