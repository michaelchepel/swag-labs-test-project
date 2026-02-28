import { Page } from '@playwright/test';
import { TIMEOUTS } from './constants';

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

export async function waitForURL(
  page: Page,
  pattern: string | RegExp,
  timeout: number = TIMEOUTS.PAGE_LOAD
): Promise<void> {
  await page.waitForURL(pattern, { timeout });
}

export async function waitForPageLoad(
  page: Page,
  timeout: number = TIMEOUTS.PAGE_LOAD
): Promise<void> {
  await page.waitForLoadState('domcontentloaded', { timeout });
  await page.waitForLoadState('networkidle', { timeout });
}

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
