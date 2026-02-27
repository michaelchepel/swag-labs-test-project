# GitHub Actions Integration

This document explains how the Swag Labs Playwright test framework is integrated with GitHub Actions for automated testing.

## Overview

The project is configured with GitHub Actions to automatically run tests on every push to the `main` and `develop` branches, as well as on pull requests targeting these branches.

## Workflow Configuration

The GitHub Actions workflow is defined in [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml:1).

### Workflow Triggers

The workflow is triggered on:
- **Push** to `main` or `develop` branches
- **Pull requests** targeting `main` or `develop` branches
- **Manual dispatch** (can be triggered manually from the GitHub Actions tab)

### Jobs

The workflow consists of three main jobs:

#### 1. Test Job

Runs the actual Playwright tests with the following features:

- **Timeout**: 60 minutes per job
- **Strategy**: Uses matrix strategy with 4 shards for parallel execution
- **Browser Support**: Chromium, Firefox, and WebKit browsers
- **Test Execution**: Runs tests using `npx playwright test --shard=${{ matrix.shard }}/4`

**Steps:**
1. Checkout code
2. Setup Node.js (version 20)
3. Install dependencies (`npm ci`)
4. Install Playwright browsers with dependencies
5. Run Playwright tests (sharded)
6. Upload test results (retained for 7 days)
7. Upload screenshots on failure (retained for 7 days)
8. Upload videos (retained for 7 days)
9. Upload HTML reports (retained for 7 days)

#### 2. Report Job

Runs after the test job completes (even if tests fail) to:

- Download all test results from all shards
- Merge test results into a single HTML report
- Upload the merged HTML report (retained for 30 days)
- Publish test results as GitHub checks

#### 3. Lint Job

Runs code quality checks:

- Setup Node.js (version 20)
- Install dependencies
- Run ESLint (`npm run lint`)
- Continues even if linting fails (non-blocking)

## Test Sharding

The workflow uses test sharding to distribute tests across 4 parallel jobs:
- Shard 1: Tests 1-25% of the test suite
- Shard 2: Tests 26-50% of the test suite
- Shard 3: Tests 51-75% of the test suite
- Shard 4: Tests 76-100% of the test suite

This significantly reduces the total test execution time by running tests in parallel.

## Artifacts

The workflow generates and uploads the following artifacts:

### Test Results
- **Name**: `playwright-results-{shard}`
- **Path**: `test-results/`
- **Retention**: 7 days
- **Uploaded**: Always

### Screenshots
- **Name**: `playwright-screenshots-{shard}`
- **Path**: `screenshots/`
- **Retention**: 7 days
- **Uploaded**: On test failure only

### Videos
- **Name**: `playwright-videos-{shard}`
- **Path**: `videos/`
- **Retention**: 7 days
- **Uploaded**: Always

### HTML Reports
- **Name**: `playwright-html-report-{shard}`
- **Path**: `playwright-report/`
- **Retention**: 7 days
- **Uploaded**: Always

### Merged HTML Report
- **Name**: `playwright-merged-report`
- **Path**: `playwright-report/`
- **Retention**: 30 days
- **Uploaded**: Always (after merging all shards)

## Viewing Results

### On GitHub

1. Navigate to your repository: https://github.com/michaelchepel/swag-labs-test-project
2. Click on the **Actions** tab
3. Select the workflow run you want to view
4. View job logs, test results, and download artifacts

### Downloading Artifacts

1. Go to the Actions tab
2. Click on a completed workflow run
3. Scroll down to the **Artifacts** section
4. Click on any artifact to download it

### Viewing HTML Reports

1. Download the `playwright-merged-report` artifact
2. Extract the ZIP file
3. Open `playwright-report/index.html` in your browser

## Environment Variables

The workflow uses environment variables from the repository:

- **Test Environment**: Uses the default Playwright configuration
- **Base URL**: Configured in `playwright.config.ts`
- **Credentials**: Loaded from test data files (not from `.env` file which is gitignored)

Note: The `.env` file is excluded from the repository (see [`.gitignore`](.gitignore:8)). Make sure to configure any required environment variables in your GitHub repository settings under **Settings > Secrets and variables > Actions**.

## Troubleshooting

### Workflow Not Triggering

If the workflow doesn't trigger on push:
1. Verify you're pushing to `main` or `develop` branch
2. Check that the workflow file is in `.github/workflows/playwright.yml`
3. Ensure the workflow YAML syntax is correct

### Tests Failing in CI

If tests pass locally but fail in CI:
1. Check the workflow logs for specific error messages
2. Download screenshots and videos to debug failures
3. Verify that all test data files are committed
4. Ensure browser compatibility (CI uses Ubuntu, you might be on Windows/Mac)

### Timeout Issues

If tests timeout:
1. Check the `timeout-minutes` setting in the workflow
2. Review test execution time and consider optimizing slow tests
3. Verify network connectivity in the CI environment

## Best Practices

1. **Keep tests fast**: Optimize test execution time to reduce CI costs
2. **Use meaningful commit messages**: Helps identify which changes broke tests
3. **Review artifacts regularly**: Check screenshots and videos for flaky tests
4. **Update dependencies**: Keep Playwright and Node.js versions up to date
5. **Monitor CI costs**: Be aware of GitHub Actions usage limits

## Next Steps

To further enhance your CI/CD pipeline:

1. Add code coverage reporting
2. Set up status badges in your README
3. Configure notifications for failed builds
4. Add deployment steps for passing builds
5. Integrate with other tools (e.g., Slack notifications, Jira integration)

## Repository URL

Your code is now hosted at: https://github.com/michaelchepel/swag-labs-test-project

## Support

For issues or questions about the GitHub Actions integration:
- Check the [Playwright CI/CD documentation](https://playwright.dev/docs/ci)
- Review the [GitHub Actions documentation](https://docs.github.com/en/actions)
- Open an issue in the repository
