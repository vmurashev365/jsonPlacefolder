# JSONPlaceholder API Testing Framework - Makefile

# Variables
NODE_VERSION := 18
NPM_VERSION := 8
PROJECT_NAME := jsonplaceholder-api-testing
BASE_URL := https://jsonplaceholder.typicode.com

# Colors
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
BLUE := \033[0;34m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# Help target
.PHONY: help
help: ## Show this help message
	@echo "$(BLUE)$(PROJECT_NAME) - Available Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Environment Variables:$(NC)"
	@echo "  BASE_URL     - API base URL (default: $(BASE_URL))"
	@echo "  TAGS         - Test tags to run (default: @smoke)"
	@echo "  PARALLEL     - Number of parallel jobs (default: 2)"
	@echo "  LOG_LEVEL    - Log level (default: info)"
	@echo ""
	@echo "$(YELLOW)Examples:$(NC)"
	@echo "  make test-smoke"
	@echo "  make test TAGS=@posts"
	@echo "  BASE_URL=https://staging-api.com make test"

# Setup and Installation
.PHONY: check-node
check-node: ## Check Node.js version
	@echo "$(BLUE)Checking Node.js version...$(NC)"
	@node --version | grep -E '^v($(NODE_VERSION)\.|[1-9][0-9]\.)'  > /dev/null || (echo "$(RED)Error: Node.js $(NODE_VERSION)+ required$(NC)" && exit 1)
	@npm --version | grep -E '^($(NPM_VERSION)\.|[1-9][0-9]\.)'  > /dev/null || (echo "$(RED)Error: npm $(NPM_VERSION)+ required$(NC)" && exit 1)
	@echo "$(GREEN)✅ Node.js and npm versions are compatible$(NC)"

.PHONY: install
install: check-node ## Install dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	npm ci
	@echo "$(GREEN)✅ Dependencies installed$(NC)"

.PHONY: build
build: ## Build the project
	@echo "$(BLUE)Building project...$(NC)"
	npm run build
	@echo "$(GREEN)✅ Project built successfully$(NC)"

.PHONY: setup
setup: install build ## Complete project setup
	@echo "$(GREEN)✅ Project setup completed$(NC)"

# Testing
.PHONY: test
test: ## Run all tests
	@echo "$(BLUE)Running all tests...$(NC)"
	npm test
	@echo "$(GREEN)✅ All tests completed$(NC)"

.PHONY: test-smoke
test-smoke: ## Run smoke tests only
	@echo "$(BLUE)Running smoke tests...$(NC)"
	npm run test:smoke
	@echo "$(GREEN)✅ Smoke tests completed$(NC)"

.PHONY: test-posts
test-posts: ## Run posts endpoint tests
	@echo "$(BLUE)Running posts tests...$(NC)"
	npm run test:posts
	@echo "$(GREEN)✅ Posts tests completed$(NC)"

.PHONY: test-users
test-users: ## Run users endpoint tests
	@echo "$(BLUE)Running users tests...$(NC)"
	npm run test:users
	@echo "$(GREEN)✅ Users tests completed$(NC)"

.PHONY: test-comments
test-comments: ## Run comments endpoint tests
	@echo "$(BLUE)Running comments tests...$(NC)"
	npm run test:comments
	@echo "$(GREEN)✅ Comments tests completed$(NC)"

.PHONY: test-e2e
test-e2e: ## Run end-to-end tests
	@echo "$(BLUE)Running E2E tests...$(NC)"
	npm run test:e2e
	@echo "$(GREEN)✅ E2E tests completed$(NC)"

.PHONY: test-performance
test-performance: ## Run performance tests
	@echo "$(BLUE)Running performance tests...$(NC)"
	npm run test:performance
	@echo "$(GREEN)✅ Performance tests completed$(NC)"

.PHONY: test-validation
test-validation: ## Run validation tests
	@echo "$(BLUE)Running validation tests...$(NC)"
	npm run test:validation
	@echo "$(GREEN)✅ Validation tests completed$(NC)"

# Health Check
.PHONY: health-check
health-check: ## Run API health check
	@echo "$(BLUE)Running health check...$(NC)"
	npm run health-check
	@echo "$(GREEN)✅ Health check completed$(NC)"

# Reports
.PHONY: report
report: ## Generate test reports
	@echo "$(BLUE)Generating test reports...$(NC)"
	npm run report
	@echo "$(GREEN)✅ Reports generated$(NC)"

.PHONY: report-open
report-open: ## Generate and open test reports
	@echo "$(BLUE)Generating and opening test reports...$(NC)"
	npm run report:open
	@echo "$(GREEN)✅ Reports opened$(NC)"

# Cleanup
.PHONY: clean
clean: ## Interactive cleanup
	@echo "$(BLUE)Starting interactive cleanup...$(NC)"
	npm run clean

.PHONY: clean-all
clean-all: ## Clean all generated files
	@echo "$(BLUE)Cleaning all generated files...$(NC)"
	npm run clean:all
	@echo "$(GREEN)✅ Cleanup completed$(NC)"

.PHONY: clean-reports
clean-reports: ## Clean only reports
	@echo "$(BLUE)Cleaning reports...$(NC)"
	npm run clean:reports
	@echo "$(GREEN)✅ Reports cleaned$(NC)"

.PHONY: clean-logs
clean-logs: ## Clean only logs
	@echo "$(BLUE)Cleaning logs...$(NC)"
	npm run clean:logs
	@echo "$(GREEN)✅ Logs cleaned$(NC)"

# Development
.PHONY: dev
dev: ## Start development mode (watch)
	@echo "$(BLUE)Starting development mode...$(NC)"
	npm run dev

.PHONY: lint
lint: ## Run linting
	@echo "$(BLUE)Running linting...$(NC)"
	npm run lint
	@echo "$(GREEN)✅ Linting completed$(NC)"

.PHONY: lint-fix
lint-fix: ## Fix linting issues
	@echo "$(BLUE)Fixing linting issues...$(NC)"
	npm run lint:fix
	@echo "$(GREEN)✅ Linting issues fixed$(NC)"

.PHONY: format
format: ## Format code
	@echo "$(BLUE)Formatting code...$(NC)"
	npm run format
	@echo "$(GREEN)✅ Code formatted$(NC)"

# Docker
.PHONY: docker-build
docker-build: ## Build Docker image
	@echo "$(BLUE)Building Docker image...$(NC)"
	docker build -t $(PROJECT_NAME) .
	@echo "$(GREEN)✅ Docker image built$(NC)"

.PHONY: docker-test
docker-test: docker-build ## Run tests in Docker
	@echo "$(BLUE)Running tests in Docker...$(NC)"
	docker run --rm -e BASE_URL=$(BASE_URL) $(PROJECT_NAME)
	@echo "$(GREEN)✅ Docker tests completed$(NC)"

.PHONY: docker-test-smoke
docker-test-smoke: docker-build ## Run smoke tests in Docker
	@echo "$(BLUE)Running smoke tests in Docker...$(NC)"
	docker run --rm -e TAGS=@smoke $(PROJECT_NAME)
	@echo "$(GREEN)✅ Docker smoke tests completed$(NC)"

# CI/CD
.PHONY: ci-test
ci-test: ## Run tests for CI/CD
	@echo "$(BLUE)Running CI/CD tests...$(NC)"
	npm ci
	npm run build
	npm run health-check
	npm run test:smoke
	npm test
	npm run report
	@echo "$(GREEN)✅ CI/CD tests completed$(NC)"

.PHONY: ci-health-check
ci-health-check: ## Health check for CI/CD
	@echo "$(BLUE)Running CI/CD health check...$(NC)"
	npm run health-check
	@echo "$(GREEN)✅ CI/CD health check completed$(NC)"

# Quick Commands
.PHONY: quick-smoke
quick-smoke: ## Quick smoke test (minimal setup)
	@echo "$(BLUE)Running quick smoke test...$(NC)"
	@npm run health-check > /dev/null 2>&1 && echo "$(GREEN)✅ API is healthy$(NC)" || echo "$(RED)❌ API health check failed$(NC)"
	@npm run test:smoke

.PHONY: quick-test
quick-test: ## Quick full test (with health check)
	@echo "$(BLUE)Running quick full test...$(NC)"
	@make health-check
	@make test

# Maintenance
.PHONY: update-deps
update-deps: ## Update dependencies
	@echo "$(BLUE)Updating dependencies...$(NC)"
	npm update
	@echo "$(GREEN)✅ Dependencies updated$(NC)"

.PHONY: audit
audit: ## Security audit
	@echo "$(BLUE)Running security audit...$(NC)"
	npm audit
	@echo "$(GREEN)✅ Security audit completed$(NC)"

.PHONY: audit-fix
audit-fix: ## Fix security vulnerabilities
	@echo "$(BLUE)Fixing security vulnerabilities...$(NC)"
	npm audit fix
	@echo "$(GREEN)✅ Security vulnerabilities fixed$(NC)"

# Information
.PHONY: info
info: ## Show project information
	@echo "$(BLUE)$(PROJECT_NAME) - Project Information$(NC)"
	@echo ""
	@echo "$(YELLOW)Environment:$(NC)"
	@echo "  Node.js: $$(node --version)"
	@echo "  npm: $$(npm --version)"
	@echo "  OS: $$(uname -s)"
	@echo ""
	@echo "$(YELLOW)Configuration:$(NC)"
	@echo "  Base URL: $(BASE_URL)"
	@echo "  Tags: $${TAGS:-@smoke}"
	@echo "  Parallel: $${PARALLEL:-2}"
	@echo "  Log Level: $${LOG_LEVEL:-info}"
	@echo ""
	@echo "$(YELLOW)Project Structure:$(NC)"
	@echo "  Features: $$(find features -name '*.feature' | wc -l) files"
	@echo "  Step Definitions: $$(find src/steps -name '*.ts' | wc -l) files"
	@echo "  Test Data: $$(find src -name '*.ts' | wc -l) TypeScript files"

.PHONY: status
status: ## Show project status
	@echo "$(BLUE)Project Status$(NC)"
	@echo ""
	@if [ -f "health-status.txt" ]; then \
		echo "$(YELLOW)Last Health Check:$(NC) $$(cat health-status.txt | head -1)"; \
		echo "$(YELLOW)Timestamp:$(NC) $$(cat health-status.txt | sed -n '2p')"; \
	else \
		echo "$(RED)No health check data available$(NC)"; \
	fi
	@echo ""
	@if [ -d "reports" ] && [ -n "$$(ls -A reports 2>/dev/null)" ]; then \
		echo "$(YELLOW)Latest Report:$(NC) $$(ls -t reports/*.html 2>/dev/null | head -1)"; \
		echo "$(YELLOW)Report Count:$(NC) $$(ls reports/*.html 2>/dev/null | wc -l) HTML reports"; \
	else \
		echo "$(RED)No reports available$(NC)"; \
	fi

# Validation
.PHONY: validate
validate: ## Validate project setup
	@echo "$(BLUE)Validating project setup...$(NC)"
	@make check-node
	@test -f package.json || (echo "$(RED)Error: package.json not found$(NC)" && exit 1)
	@test -f tsconfig.json || (echo "$(RED)Error: tsconfig.json not found$(NC)" && exit 1)
	@test -f cucumber.js || (echo "$(RED)Error: cucumber.js not found$(NC)" && exit 1)
	@test -d features || (echo "$(RED)Error: features directory not found$(NC)" && exit 1)
	@test -d src || (echo "$(RED)Error: src directory not found$(NC)" && exit 1)
	@echo "$(GREEN)✅ Project setup is valid$(NC)"

# All-in-one targets
.PHONY: full-test
full-test: clean-all setup health-check test report ## Complete test cycle
	@echo "$(GREEN)✅ Full test cycle completed$(NC)"

.PHONY: quick-verify
quick-verify: health-check test-smoke ## Quick verification
	@echo "$(GREEN)✅ Quick verification completed$(NC)"
