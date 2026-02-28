import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, PAGE_TITLES, SUCCESS_MESSAGES } from '../utils/constants';

/**
 * Checkout complete page object for Swag Labs
 * Handles order completion and confirmation
 */
export class CheckoutCompletePage extends BasePage {
  constructor(page: Page) {
    super(page);
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
   * Click back home button to return to inventory
   */
  async clickBackHome(): Promise<void> {
    await this.clickElement(SELECTORS.BACK_HOME_BUTTON);
  }

  /**
   * Verify that both success messages are displayed
   * @returns True if both success messages are displayed, false otherwise
   */
  async areSuccessMessagesDisplayed(): Promise<boolean> {
    const header = await this.getCompleteHeader();
    const text = await this.getCompleteText();
    return (
      header === SUCCESS_MESSAGES.ORDER_COMPLETE &&
      text === SUCCESS_MESSAGES.ORDER_DISPATCHED
    );
  }

  /**
   * Verify that checkout complete page is loaded
   * @returns True if checkout complete page is loaded, false otherwise
   */
  async isPageLoaded(): Promise<boolean> {
    const isHeaderVisible = await this.isElementVisible(SELECTORS.COMPLETE_HEADER);
    const isTextVisible = await this.isElementVisible(SELECTORS.COMPLETE_TEXT);
    const isBackHomeVisible = await this.isElementVisible(SELECTORS.BACK_HOME_BUTTON);
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
}
