# Swag Labs Playwright Testing Framework

A production-ready test automation framework built with Playwright and TypeScript for testing the [Swag Labs](https://www.saucedemo.com/) e-commerce website.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Suites](#test-suites)
- [Page Object Model](#page-object-model)
- [Test Data](#test-data)
- [CI/CD Integration](#cicd-integration)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Page Object Model (POM)**: Well-structured, maintainable page objects
- **TypeScript**: Full type safety and better developer experience
- **Reusable Base Page**: Abstract base class with 40+ common methods
- **Test Data Management**: Separate JSON files for static test data
- **Environment Variables**: Secure credential management
- **Custom Wait Strategies**: Robust element waiting and synchronization
- **Comprehensive Test Coverage**: 5 test cases covering major functionality
- **Multi-Browser Support**: Tests run on Chromium, Firefox, and WebKit
- **CI/CD Integration**: Automated testing with GitHub Actions
- **Detailed Reports**: HTML, JSON, and JUnit test reports
- **Screenshots & Videos**: Automatic capture on test failures
- **Parallel Execution**: Faster test execution with sharding

## 📁 Project Structure

```
swag-labs-playwright-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions workflow
├── config/
│   └── playwright.config.ts         # Playwright configuration
├── data/
│   ├── credentials.json            # User credentials
│   ├── products.json               # Product catalog
│   └── test-data.json             # Test data and messages
├── pages/
│   ├── common.ts                  # BasePage class and common utilities
│   ├── LoginPage.ts               # Login page object
│   ├── InventoryPage.ts           # Inventory page object
│   ├── CartPage.ts                # Cart page object
│   ├── CheckoutPage.ts            # Checkout form page object
│   ├── CheckoutOverviewPage.ts    # Checkout overview page object
│   └── CheckoutCompletePage.ts    # Checkout complete page object
├── tests/
│   ├── global-setup.ts            # Global test setup
│   ├── global-teardown.ts         # Global test teardown
│   ├── login.spec.ts              # Login test suite
│   ├── cart.spec.ts               # Cart functionality test suite
│   ├── checkout.spec.ts           # Checkout process test suite
│   ├── sorting.spec.ts            # Product sorting test suite
│   └── e2e.spec.ts                # End-to-end test suite
├── utils/
│   ├── constants.ts               # Application constants and selectors
│   ├── data-helper.ts             # Test data helper utilities
│   └── wait-strategies.ts         # Custom wait strategies
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🔧 Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Git**: Latest version

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd swag-labs-playwright-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install --with-deps
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Base URL for the application
BASE_URL=https://www.saucedemo.com

# User credentials
STANDARD_USER=standard_user
LOCKED_OUT_USER=locked_out_user
PROBLEM_USER=problem_user
PERFORMANCE_GLITCH_USER=performance_glitch_user
ERROR_USER=error_user
VISUAL_USER=visual_user

# Default password for all users
PASSWORD=secret_sauce

# Browser configuration
HEADLESS=true
BROWSER=chromium

# Test execution timeout (in milliseconds)
TIMEOUT=30000

# Screenshot configuration
SCREENSHOT_ON_FAILURE_ONLY=true

# Video recording
VIDEO=retain-on-failure

# Test reporter
REPORTER=list

# Clear previous test results before running
CLEAR_TEST_RESULTS=false
```

### Playwright Configuration

The Playwright configuration is located in [`config/playwright.config.ts`](config/playwright.config.ts). Key settings include:

- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled
- **Retry on CI**: 2 retries
- **Reporters**: List, HTML, JSON, JUnit
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Timeout**: 60 seconds per test

## 🚀 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run tests with UI mode
```bash
npm run test:ui
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

### Run tests with specific pattern
```bash
npx playwright test --grep "login"
```

### Run tests on specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 🧪 Test Suites

### 1. Login Tests ([`tests/login.spec.ts`](tests/login.spec.ts))
Tests for user authentication and login functionality.

- Successful login with valid credentials - Verifies that a user can successfully log in and is redirected to the inventory page

### 2. Cart Tests ([`tests/cart.spec.ts`](tests/cart.spec.ts))
Tests for shopping cart functionality.

- Add multiple products to cart - Verifies that multiple products can be added to the cart and the cart badge updates correctly

### 3. Checkout Tests ([`tests/checkout.spec.ts`](tests/checkout.spec.ts))
Tests for the complete checkout process.

- Complete checkout flow successfully - Verifies the end-to-end checkout process from adding products to order completion

### 4. Product Sorting Tests ([`tests/sorting.spec.ts`](tests/sorting.spec.ts))
Tests for product sorting functionality.

- Sort products by name (A to Z) - Verifies that products are sorted alphabetically from A to Z

### 5. End-to-End Tests ([`tests/e2e.spec.ts`](tests/e2e.spec.ts))
Comprehensive tests covering complete user journeys.

- Complete user journey - browse, add to cart, and purchase - Verifies the complete user journey from login to order completion

## 📄 Page Object Model

The framework uses the Page Object Model pattern for better test maintainability and reusability.

### BasePage

The [`BasePage`](pages/common.ts) class (defined in [`pages/common.ts`](pages/common.ts:15)) provides common functionality for all page objects:

- Navigation methods
- Element interaction methods (click, fill, hover, etc.)
- Wait strategies
- Assertion methods
- Utility methods (screenshot, scroll, etc.)

### Page Objects

Each page in the application has a corresponding page object:

- [`LoginPage`](pages/LoginPage.ts): Handles login functionality
- [`InventoryPage`](pages/InventoryPage.ts): Handles product listing and cart operations
- [`CartPage`](pages/CartPage.ts): Handles cart management
- [`CheckoutPage`](pages/CheckoutPage.ts): Handles checkout form
- [`CheckoutOverviewPage`](pages/CheckoutOverviewPage.ts): Handles order review
- [`CheckoutCompletePage`](pages/CheckoutCompletePage.ts): Handles order confirmation

### Example Usage

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test('User can login and view products', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // Navigate and login
  await loginPage.navigateToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');

  // Verify products are displayed
  await inventoryPage.assertInventoryPageLoaded();
  const products = await inventoryPage.getProductList();
  expect(products.length).toBeGreaterThan(0);
});
```

## 📊 Test Data

Test data is stored in separate JSON files in the [`data/`](data/) directory:

### [`credentials.json`](data/credentials.json)
Contains user credentials for different user types:
- standard_user
- locked_out_user
- problem_user
- performance_glitch_user
- error_user
- visual_user

### [`products.json`](data/products.json)
Contains the complete product catalog with names, prices, and descriptions.

### [`test-data.json`](data/test-data.json)
Contains test data including:
- Checkout information
- Error messages
- Success messages

### Data Helper

The [`data-helper.ts`](utils/data-helper.ts) utility provides convenient methods to access test data:

```typescript
import {
  getStandardUserCredentials,
  getRandomProduct,
  getCheckoutInfo,
  calculateTotalPrice,
} from '../utils/data-helper';

// Get credentials
const credentials = getStandardUserCredentials();

// Get random product
const product = getRandomProduct();

// Get checkout info
const checkoutInfo = getCheckoutInfo();

// Calculate total price
const total = calculateTotalPrice(['Product A', 'Product B']);
```

## 🔄 CI/CD Integration

The framework is integrated with GitHub Actions for automated testing on every push and pull request.

### Workflow Features

- **Parallel Execution**: Tests run in 4 shards for faster execution
- **Multi-Browser**: Tests run on Chromium, Firefox, and WebKit
- **Artifact Upload**: Test results, screenshots, videos, and reports are uploaded
- **Report Merging**: Merged HTML report with all test results
- **Test Results**: Published as GitHub check with pass/fail status
- **Linting**: ESLint runs on every push (requires configuration file to be added)

### Workflow Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

### View Workflow Results

1. Go to the **Actions** tab in your GitHub repository
2. Select the workflow run you want to view
3. Download artifacts for detailed reports, screenshots, and videos

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and structure
- Write descriptive test names and comments
- Add new tests to appropriate test suites
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) - The testing framework
- [Swag Labs](https://www.saucedemo.com/) - The test application
- [TypeScript](https://www.typescriptlang.org/) - The programming language

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Testing! 🚀**
