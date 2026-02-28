import { Page } from '@playwright/test';
import { TIMEOUTS } from './constants';

/**
 * Custom wait strategies for handling dynamic elements and conditions
 */

/**
 * Wait for element to be visible with retry logic
 * @param page - Playwright Page object
 * @param selector - CSS selector or data-test attribute
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise that resolves when element is visible
 */
export async function waitForElementVisible(
  page: Page,
  selector: string,
  timeout: number = TIMEOUTS.ELEMENT_LOAD
): Promise<void> {
  await page.waitForSelector(selector, {
    state: 'visible',
    timeout,
  });
}

/**
 * Wait for element to be attached to DOM
 * @param page - Playwright Page object
 * @param selector - CSS selector or data-test attribute
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise that resolves when element is attached
 */
export async function waitForElementAttached(
  page: Page,
  selector: string,
  timeout: number = TIMEOUTS.ELEMENT_LOAD
): Promise<void> {
  await page.waitForSelector(selector, {
    state: 'attached',
    timeout,
  });
}

/**
 * Wait for element to be hidden
 * @param page - Playwright Page object
 * @param selector - CSS selector or data-test attribute
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise that resolves when element is hidden
 */
export async function waitForElementHidden(
  page: Page,
  selector: string,
  timeout: number = TIMEOUTS.ELEMENT_LOAD
): Promise<void> {
  await page.waitForSelector(selector, {
    state: 'hidden',
    timeout,
  });
}

/**
 * Wait for element to be detached from DOM
 * @param page - Playwright Page object
 * @param selector - CSS selector or data-test attribute
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise that resolves when element is detached
 */
export async function waitForElementDetached(
  page: Page,
  selector: string,
  timeout: number = TIMEOUTS.ELEMENT_LOAD
): Promise<void> {
  await page.waitForSelector(selector, {
    state: 'detached',
    timeout,
  });
}

/**
 * Wait for element to be enabled/clickable
 * @param page - Playwright Page object
 * @param selector - CSS selector or data-test attribute
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise that resolves when element is enabled
 */
export async function waitForElementEnabled(
  page: Page,
  selector: string,
  timeout: number = TIMEOUTS.ELEMENT_LOAD
): Promise<void> {
  await page.waitForSelector(selector, {
    state: 'visible',
    timeout,
  });
  const element = page.locator(selector);
  await element.waitFor({ state: 'attached', timeout });
  await element.evaluate((el) => {
    if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
      if (el.disabled) {
        throw new Error('Element is disabled');
      }
    }
  });
}

/**
 * Wait for URL to match pattern
 * @param page - Playwright Page object
 * @param pattern - URL pattern (string or RegExp)
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise that resolves when URL matches pattern
 */
export async function waitForURL(
  page: Page,
  pattern: string | RegExp,
  timeout: number = TIMEOUTS.PAGE_LOAD
): Promise<void> {
  await page.waitForURL(pattern, { timeout });
}

/**
 * Wait for page load to complete
 * @param page - Playwright Page object
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise that resolves when page is loaded
 */
export async function waitForPageLoad(
  page: Page,
  timeout: number = TIMEOUTS.PAGE_LOAD
): Promise<void> {
  await page.waitForLoadState('domcontentloaded', { timeout });
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for text to be present in element
 * @param page - Playwright Page object
 * @param selector - CSS selector or data-test attribute
 * @param text - Expected text
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise that resolves when text is present
 */
export async function waitForText(
  page: Page,
  selector: string,
  text: string,
  timeout: number = TIMEOUTS.ELEMENT_LOAD
): Promise<void> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible', timeout });
  await element.waitFor({ state: 'attached', timeout });
  await element.evaluate((el, expectedText) => {
    if (!el.textContent?.includes(expectedText)) {
      throw new Error(`Text "${expectedText}" not found in element`);
    }
  }, text);
}

/**
 * Wait for element count to match expected count
 * @param page - Playwright Page object
 * @param selector - CSS selector or data-test attribute
 * @param expectedCount - Expected number of elements
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise that resolves when count matches
 */
export async function waitForElementCount(
  page: Page,
  selector: string,
  expectedCount: number,
  timeout: number = TIMEOUTS.ELEMENT_LOAD
): Promise<void> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'attached', timeout });
  await element.evaluate((_, count) => {
    const actualCount = document.querySelectorAll(selector).length;
    if (actualCount !== count) {
      throw new Error(`Expected ${count} elements, found ${actualCount}`);
    }
  }, expectedCount);
}

/**
 * Retry function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param initialDelay - Initial delay in milliseconds
 * @returns Promise that resolves when function succeeds
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Wait for custom condition
 * @param page - Playwright Page object
 * @param condition - Custom condition function
 * @param timeout - Optional timeout in milliseconds
 * @param pollingInterval - Optional polling interval in milliseconds
 * @returns Promise that resolves when condition is met
 */
export async function waitForCondition(
  page: Page,
  condition: () => Promise<boolean>,
  timeout: number = TIMEOUTS.DEFAULT,
  pollingInterval: number = 500
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await page.waitForTimeout(pollingInterval);
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Wait for animation to complete on element
 * @param page - Playwright Page object
 * @param selector - CSS selector or data-test attribute
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise that resolves when animation is complete
 */
export async function waitForAnimationComplete(
  page: Page,
  selector: string,
  timeout: number = TIMEOUTS.MEDIUM
): Promise<void> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'attached', timeout });
  await element.evaluate((el) => {
    return new Promise<void>((resolve) => {
      if (el.getAnimations().length === 0) {
        resolve();
        return;
      }

      const animations = el.getAnimations();
      Promise.all(animations.map((anim) => anim.finished)).then(() => resolve());
    });
  });
}
