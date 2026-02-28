import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, PAGE_TITLES, SUCCESS_MESSAGES } from '../utils/constants';

export class CheckoutCompletePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async getCompleteHeader(): Promise<string> {
    await this.waitForElement(SELECTORS.COMPLETE_HEADER);
    return await this.getElementText(SELECTORS.COMPLETE_HEADER);
  }

  async getCompleteText(): Promise<string> {
    await this.waitForElement(SELECTORS.COMPLETE_TEXT);
    return await this.getElementText(SELECTORS.COMPLETE_TEXT);
  }

  async clickBackHome(): Promise<void> {
    await this.clickElement(SELECTORS.BACK_HOME_BUTTON);
  }

  async areSuccessMessagesDisplayed(): Promise<boolean> {
    const header = await this.getCompleteHeader();
    const text = await this.getCompleteText();
    return (
      header === SUCCESS_MESSAGES.ORDER_COMPLETE &&
      text === SUCCESS_MESSAGES.ORDER_DISPATCHED
    );
  }

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
