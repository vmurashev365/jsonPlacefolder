# JSONPlaceholder API Testing Framework

Comprehensive API testing framework for [JSONPlaceholder](https://jsonplaceholder.typicode.com) using Cucumber, TypeScript, and modern testing practices.

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd jsonplaceholder-api-testing
make setup

# Run smoke tests (1-2 minutes)
make test-smoke

# Run all tests
make test

# Generate and open reports
make report-open

# Docker execution
make docker-test
```

## 📊 Project Overview

This framework provides comprehensive testing coverage for the JSONPlaceholder API with multiple test types:

- **🔥 Smoke Tests**: Critical functionality verification
- **🧪 API Tests**: Comprehensive endpoint testing
- **🔄 E2E Tests**: End-to-end workflow validation
- **⚡ Performance Tests**: Response time and load testing
- **🔒 Security Tests**: Validation and security checks

## 🏗️ Architecture

```
jsonplaceholder-api-testing/
├── features/              # Cucumber feature files
├── src/
│   ├── clients/          # HTTP client implementations
│   ├── config/           # Configuration management
│   ├── hooks/            # Cucumber hooks and World
│   ├── steps/            # Step definitions
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript type definitions
├── scripts/              # Build and utility scripts
├── reports/              # Test reports (generated)
├── logs/                 # Log files (generated)
└── docs/                 # Documentation
```

## 🏷️ Test Tags

Use tags to run specific test suites:

```bash
# Test types
npm test -- --tags "@smoke"
npm test -- --tags "@e2e"
npm test -- --tags "@performance"

# Endpoints
npm test -- --tags "@posts"
npm test -- --tags "@users"
npm test -- --tags "@comments"

# Test categories
npm test -- --tags "@positive"
npm test -- --tags "@negative"
npm test -- --tags "@validation"
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests |
| `npm run test:smoke` | Run smoke tests only |
| `npm run test:posts` | Run posts endpoint tests |
| `npm run test:users` | Run users endpoint tests |
| `npm run test:comments` | Run comments endpoint tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:performance` | Run performance tests |
| `npm run build` | Compile TypeScript |
| `npm run build:watch` | Watch mode compilation |
| `npm run report` | Generate HTML reports |
| `npm run report:open` | Generate and open reports |
| `npm run clean` | Interactive cleanup |
| `npm run clean:all` | Clean all artifacts |
| `npm run health-check` | Check API availability |

## 🔧 Configuration

Environment variables can be set in `.env` file:

```env
# Base configuration
BASE_URL=https://jsonplaceholder.typicode.com
TIMEOUT=30000
LOG_LEVEL=info

# Test execution
PARALLEL=2
RETRY_COUNT=1
TAGS=@smoke

# Reports
GENERATE_HTML_REPORT=true
REPORT_TITLE="JSONPlaceholder API Tests"
```

## 🐳 Docker Support

```bash
# Build image
docker build -t jsonplaceholder-tests .

# Run tests
docker run --rm jsonplaceholder-tests

# Run with custom tags
docker run --rm -e TAGS="@smoke" jsonplaceholder-tests
```

## 📊 Reports

Multiple report formats are generated:

- **HTML Report**: `reports/cucumber-report.html`
- **JSON Report**: `reports/cucumber-report.json`
- **Console Output**: Real-time test execution
- **Logs**: Detailed execution logs in `logs/`

## 🔄 CI/CD Integration

GitHub Actions workflow included for:

- ✅ Automated testing on push/PR
- 📊 Test result artifacts
- 🔄 Scheduled runs
- 📧 Failure notifications

## 🧪 Test Examples

### Smoke Test
```gherkin
@smoke @posts @positive
Feature: Posts API - Smoke Tests
  Scenario: Get all posts
    When I send a GET request to "/posts"
    Then the response status should be 200
    And the response should be JSON
    And the response data should be an array
    And the response data should not be empty
```

### Validation Test
```gherkin
@validation @posts @negative
Feature: Posts API - Validation
  Scenario: Create post with invalid data
    When I send a POST request to "/posts" with body:
      """
      {
        "title": "",
        "body": "",
        "userId": "invalid"
      }
      """
    Then the response status should be 400
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm 8+
- TypeScript knowledge

### Setup Development Environment
```bash
npm install
npm run build
npm run dev  # Watch mode
```

### Adding New Tests
1. Create feature file in `features/`
2. Add step definitions in `src/steps/`
3. Update types if needed in `src/types/`
4. Run tests: `npm test`

### Code Quality
```bash
npm run lint        # Check code style
npm run lint:fix    # Fix style issues
npm run format      # Format with Prettier
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- 📖 [Documentation](./docs/)
- 🐛 [Issues](./issues)
- 📧 Contact: [team@example.com]

---

**Happy Testing! 🧪✨**
