import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, APP_URLS, PAGE_TITLES, SUCCESS_MESSAGES } from '../utils/constants';

/**
 * Checkout complete page object for Swag Labs
 * Handles order completion and confirmation
 */
export class CheckoutCompletePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to checkout complete page
   */
  async navigateToCheckoutComplete(): Promise<void> {
    await this.navigateTo(APP_URLS.CHECKOUT_COMPLETE);
  }

  /**
   * Get complete header text
   * @returns Complete header text
   */
  async getCompleteHeader(): Promise<string> {
    await this.waitForElement(SELECTORS.COMPLETE_HEADER);
    return await this.getElementText(SELECTORS.COMPLETE_HEADER);
  }

  /**
   * Get complete text message
   * @returns Complete text message
   */
  async getCompleteText(): Promise<string> {
    await this.waitForElement(SELECTORS.COMPLETE_TEXT);
    return await this.getElementText(SELECTORS.COMPLETE_TEXT);
  }

  /**
   * Check if complete header is visible
   * @returns True if complete header is visible, false otherwise
   */
  async isCompleteHeaderVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.COMPLETE_HEADER);
  }

  /**
   * Check if complete text is visible
   * @returns True if complete text is visible, false otherwise
   */
  async isCompleteTextVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.COMPLETE_TEXT);
  }

  /**
   * Check if back home button is visible
   * @returns True if back home button is visible, false otherwise
   */
  async isBackHomeButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.BACK_HOME_BUTTON);
  }

  /**
   * Check if back home button is enabled
   * @returns True if back home button is enabled, false otherwise
   */
  async isBackHomeButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(SELECTORS.BACK_HOME_BUTTON);
  }

  /**
   * Click back home button to return to inventory
   */
  async clickBackHome(): Promise<void> {
    await this.clickElement(SELECTORS.BACK_HOME_BUTTON);
  }

  /**
   * Verify that order completion message is displayed
   * @returns True if order completion message is displayed, false otherwise
   */
  async isOrderCompleteMessageDisplayed(): Promise<boolean> {
    const header = await this.getCompleteHeader();
    return header === SUCCESS_MESSAGES.ORDER_COMPLETE;
  }

  /**
   * Verify that order dispatched message is displayed
   * @returns True if order dispatched message is displayed, false otherwise
   */
  async isOrderDispatchedMessageDisplayed(): Promise<boolean> {
    const text = await this.getCompleteText();
    return text === SUCCESS_MESSAGES.ORDER_DISPATCHED;
  }

  /**
   * Verify that both success messages are displayed
   * @returns True if both success messages are displayed, false otherwise
   */
  async areSuccessMessagesDisplayed(): Promise<boolean> {
    return (
      await this.isOrderCompleteMessageDisplayed() &&
      await this.isOrderDispatchedMessageDisplayed()
    );
  }

  /**
   * Verify that checkout complete page is loaded
   * @returns True if checkout complete page is loaded, false otherwise
   */
  async isPageLoaded(): Promise<boolean> {
    const isHeaderVisible = await this.isCompleteHeaderVisible();
    const isTextVisible = await this.isCompleteTextVisible();
    const isBackHomeVisible = await this.isBackHomeButtonVisible();
    const pageTitle = await this.getPageTitle();

    return (
      isHeaderVisible &&
      isTextVisible &&
      isBackHomeVisible &&
      pageTitle === PAGE_TITLES.CHECKOUT_COMPLETE
    );
  }

  /**
   * Assert that checkout complete page is loaded
   */
  async assertCheckoutCompletePageLoaded(): Promise<void> {
    await this.assertElementVisible(SELECTORS.COMPLETE_HEADER);
    await this.assertElementVisible(SELECTORS.COMPLETE_TEXT);
    await this.assertElementVisible(SELECTORS.BACK_HOME_BUTTON);
    const pageTitle = await this.getPageTitle();
    if (pageTitle !== PAGE_TITLES.CHECKOUT_COMPLETE) {
      throw new Error(`Expected page title "${PAGE_TITLES.CHECKOUT_COMPLETE}", got "${pageTitle}"`);
    }
  }

  /**
   * Assert that URL contains checkout complete path
   */
  async assertOnCheckoutCompletePage(): Promise<void> {
    await this.assertURLContains(APP_URLS.CHECKOUT_COMPLETE);
  }

  /**
   * Assert that order completion message is displayed
   */
  async assertOrderComplete(): Promise<void> {
    await this.assertElementHasText(SELECTORS.COMPLETE_HEADER, SUCCESS_MESSAGES.ORDER_COMPLETE);
    await this.assertElementHasText(SELECTORS.COMPLETE_TEXT, SUCCESS_MESSAGES.ORDER_DISPATCHED);
  }
}
