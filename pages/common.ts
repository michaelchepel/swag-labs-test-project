import { Page, Locator, expect } from '@playwright/test';
import { TIMEOUTS } from '../utils/constants';
import {
  waitForElementVisible,
  waitForElementEnabled,
  waitForURL,
  waitForPageLoad,
  waitForText,
} from '../utils/wait-strategies';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  async navigateToBase(): Promise<void> {
    await this.navigateTo('/');
  }

  async waitForPageLoad(): Promise<void> {
    await waitForPageLoad(this.page);
  }

  async waitForElement(selector: string, timeout: number = TIMEOUTS.ELEMENT_LOAD): Promise<void> {
    await waitForElementVisible(this.page, selector, timeout);
  }

  async waitForElementToBeClickable(
    selector: string,
    timeout: number = TIMEOUTS.ELEMENT_LOAD
  ): Promise<void> {
    await waitForElementEnabled(this.page, selector, timeout);
  }

  async clickElement(selector: string, options?: { timeout?: number }): Promise<void> {
    await this.waitForElementToBeClickable(selector, options?.timeout);
    await this.page.click(selector, options);
  }

  async clickLocator(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout });
    await locator.click(options);
  }

  async fillInput(selector: string, value: string, options?: { timeout?: number }): Promise<void> {
    await this.waitForElement(selector, options?.timeout);
    await this.page.fill(selector, value);
  }

  async clearAndFillInput(selector: string, value: string, options?: { timeout?: number }): Promise<void> {
    await this.waitForElement(selector, options?.timeout);
    await this.page.fill(selector, '');
    await this.page.fill(selector, value);
  }

  async getElementText(selector: string): Promise<string> {
    await this.waitForElement(selector);
    const element = this.page.locator(selector);
    return await element.textContent() || '';
  }

  async getLocatorText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() || '';
  }

  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    await this.waitForElement(selector);
    const element = this.page.locator(selector);
    return await element.getAttribute(attribute);
  }

  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      return true;
    } catch {
      return false;
    }
  }

  async isElementEnabled(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      return await element.isEnabled();
    } catch {
      return false;
    }
  }

  async isElementPresent(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT });
      return true;
    } catch {
      return false;
    }
  }

  async waitForURL(pattern: string | RegExp, timeout: number = TIMEOUTS.PAGE_LOAD): Promise<void> {
    await waitForURL(this.page, pattern, timeout);
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  async selectDropdownOption(selector: string, value: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.selectOption(selector, value);
  }

  async selectDropdownOptionByLabel(selector: string, label: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.selectOption(selector, { label });
  }

  async scrollIntoView(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.scrollIntoViewIfNeeded();
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async waitForText(selector: string, text: string, timeout: number = TIMEOUTS.ELEMENT_LOAD): Promise<void> {
    await waitForText(this.page, selector, text, timeout);
  }

  async getElementCount(selector: string): Promise<number> {
    const elements = this.page.locator(selector);
    return await elements.count();
  }

  async getAllElements(selector: string): Promise<Locator[]> {
    const elements = this.page.locator(selector);
    const count = await elements.count();
    const result: Locator[] = [];
    for (let i = 0; i < count; i++) {
      result.push(elements.nth(i));
    }
    return result;
  }

  async hoverElement(selector: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.hover(selector);
  }

  async doubleClickElement(selector: string): Promise<void> {
    await this.waitForElementToBeClickable(selector);
    await this.page.dblclick(selector);
  }

  async rightClickElement(selector: string): Promise<void> {
    await this.waitForElementToBeClickable(selector);
    await this.page.click(selector, { button: 'right' });
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async typeWithDelay(selector: string, text: string, delay: number = 100): Promise<void> {
    await this.waitForElement(selector);
    await this.page.type(selector, text, { delay });
  }

  async reloadPage(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async assertElementVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async assertElementNotVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).not.toBeVisible();
  }

  async assertElementContainsText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  async assertElementHasText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(text);
  }

  async assertURLContains(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  abstract isPageLoaded(): Promise<boolean>;
}
