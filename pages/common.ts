import { Page, Locator, expect } from '@playwright/test';
import { TIMEOUTS } from '../utils/constants';
import {
  waitForElementVisible,
  waitForElementEnabled,
  waitForURL,
  waitForPageLoad,
  waitForText,
} from '../utils/wait-strategies';

/**
 * Abstract base page class that provides common functionality for all page objects
 * All page objects should extend this class to inherit shared methods
 */
export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url - URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to base URL
   */
  async navigateToBase(): Promise<void> {
    await this.navigateTo('/');
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await waitForPageLoad(this.page);
  }

  /**
   * Wait for element to be visible
   * @param selector - CSS selector or data-test attribute
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(selector: string, timeout: number = TIMEOUTS.ELEMENT_LOAD): Promise<void> {
    await waitForElementVisible(this.page, selector, timeout);
  }

  /**
   * Wait for element to be enabled/clickable
   * @param selector - CSS selector or data-test attribute
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElementToBeClickable(
    selector: string,
    timeout: number = TIMEOUTS.ELEMENT_LOAD
  ): Promise<void> {
    await waitForElementEnabled(this.page, selector, timeout);
  }

  /**
   * Click an element with retry logic
   * @param selector - CSS selector or data-test attribute
   * @param options - Optional click options
   */
  async clickElement(selector: string, options?: { timeout?: number }): Promise<void> {
    await this.waitForElementToBeClickable(selector, options?.timeout);
    await this.page.click(selector, options);
  }

  /**
   * Click a locator
   * @param locator - Playwright locator
   * @param options - Optional click options
   */
  async clickLocator(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout });
    await locator.click(options);
  }

  /**
   * Fill input field with validation
   * @param selector - CSS selector or data-test attribute
   * @param value - Value to fill
   * @param options - Optional fill options
   */
  async fillInput(selector: string, value: string, options?: { timeout?: number }): Promise<void> {
    await this.waitForElement(selector, options?.timeout);
    await this.page.fill(selector, value);
  }

  /**
   * Clear and fill input field
   * @param selector - CSS selector or data-test attribute
   * @param value - Value to fill
   * @param options - Optional fill options
   */
  async clearAndFillInput(selector: string, value: string, options?: { timeout?: number }): Promise<void> {
    await this.waitForElement(selector, options?.timeout);
    await this.page.fill(selector, '');
    await this.page.fill(selector, value);
  }

  /**
   * Get text content of an element
   * @param selector - CSS selector or data-test attribute
   * @returns Text content of element
   */
  async getElementText(selector: string): Promise<string> {
    await this.waitForElement(selector);
    const element = this.page.locator(selector);
    return await element.textContent() || '';
  }

  /**
   * Get text content of a locator
   * @param locator - Playwright locator
   * @returns Text content of element
   */
  async getLocatorText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() || '';
  }

  /**
   * Get attribute value of an element
   * @param selector - CSS selector or data-test attribute
   * @param attribute - Attribute name
   * @returns Attribute value
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    await this.waitForElement(selector);
    const element = this.page.locator(selector);
    return await element.getAttribute(attribute);
  }

  /**
   * Check if element is visible
   * @param selector - CSS selector or data-test attribute
   * @returns True if element is visible, false otherwise
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   * @param selector - CSS selector or data-test attribute
   * @returns True if element is enabled, false otherwise
   */
  async isElementEnabled(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      return await element.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Check if element exists in DOM
   * @param selector - CSS selector or data-test attribute
   * @returns True if element exists, false otherwise
   */
  async isElementPresent(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for URL to match pattern
   * @param pattern - URL pattern (string or RegExp)
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForURL(pattern: string | RegExp, timeout: number = TIMEOUTS.PAGE_LOAD): Promise<void> {
    await waitForURL(this.page, pattern, timeout);
  }

  /**
   * Get current page URL
   * @returns Current URL
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get page title
   * @returns Page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Take screenshot for debugging
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Select dropdown option by value
   * @param selector - CSS selector or data-test attribute
   * @param value - Option value to select
   */
  async selectDropdownOption(selector: string, value: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.selectOption(selector, value);
  }

  /**
   * Select dropdown option by label
   * @param selector - CSS selector or data-test attribute
   * @param label - Option label to select
   */
  async selectDropdownOptionByLabel(selector: string, label: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.selectOption(selector, { label });
  }

  /**
   * Scroll element into view
   * @param selector - CSS selector or data-test attribute
   */
  async scrollIntoView(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Wait for text to be present in element
   * @param selector - CSS selector or data-test attribute
   * @param text - Expected text
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForText(selector: string, text: string, timeout: number = TIMEOUTS.ELEMENT_LOAD): Promise<void> {
    await waitForText(this.page, selector, text, timeout);
  }

  /**
   * Get count of elements matching selector
   * @param selector - CSS selector or data-test attribute
   * @returns Number of matching elements
   */
  async getElementCount(selector: string): Promise<number> {
    const elements = this.page.locator(selector);
    return await elements.count();
  }

  /**
   * Get all elements matching selector
   * @param selector - CSS selector or data-test attribute
   * @returns Array of locators
   */
  async getAllElements(selector: string): Promise<Locator[]> {
    const elements = this.page.locator(selector);
    const count = await elements.count();
    const result: Locator[] = [];
    for (let i = 0; i < count; i++) {
      result.push(elements.nth(i));
    }
    return result;
  }

  /**
   * Hover over an element
   * @param selector - CSS selector or data-test attribute
   */
  async hoverElement(selector: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.hover(selector);
  }

  /**
   * Double click on an element
   * @param selector - CSS selector or data-test attribute
   */
  async doubleClickElement(selector: string): Promise<void> {
    await this.waitForElementToBeClickable(selector);
    await this.page.dblclick(selector);
  }

  /**
   * Right click on an element
   * @param selector - CSS selector or data-test attribute
   */
  async rightClickElement(selector: string): Promise<void> {
    await this.waitForElementToBeClickable(selector);
    await this.page.click(selector, { button: 'right' });
  }

  /**
   * Press keyboard key
   * @param key - Key to press
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Type text with delay between keystrokes
   * @param selector - CSS selector or data-test attribute
   * @param text - Text to type
   * @param delay - Delay between keystrokes in milliseconds
   */
  async typeWithDelay(selector: string, text: string, delay: number = 100): Promise<void> {
    await this.waitForElement(selector);
    await this.page.type(selector, text, { delay });
  }

  /**
   * Reload the current page
   */
  async reloadPage(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  /**
   * Get locator for selector
   * @param selector - CSS selector or data-test attribute
   * @returns Playwright locator
   */
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Assert that element is visible
   * @param selector - CSS selector or data-test attribute
   */
  async assertElementVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Assert that element is not visible
   * @param selector - CSS selector or data-test attribute
   */
  async assertElementNotVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).not.toBeVisible();
  }

  /**
   * Assert that element contains text
   * @param selector - CSS selector or data-test attribute
   * @param text - Expected text
   */
  async assertElementContainsText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  /**
   * Assert that element has exact text
   * @param selector - CSS selector or data-test attribute
   * @param text - Expected text
   */
  async assertElementHasText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(text);
  }

  /**
   * Assert that URL contains pattern
   * @param pattern - URL pattern (string or RegExp)
   */
  async assertURLContains(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  /**
   * Abstract method to verify page is loaded
   * Each page object should implement this
   */
  abstract isPageLoaded(): Promise<boolean>;
}
