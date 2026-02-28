# Swag Labs Playwright Testing Framework

A production-ready test automation framework built with Playwright and TypeScript for testing the [Swag Labs](https://www.saucedemo.com/) e-commerce website.

## Prerequisites

- Node.js: >= 18.0.0
- npm: >= 9.0.0

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd swag-labs-playwright-framework
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Install Playwright browsers
   ```bash
   npx playwright install --with-deps
   ```

4. Configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### View test report
```bash
npm run test:report
```

### Run specific test file
```bash
npx playwright test tests/login.spec.ts
```

### Run tests on specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```