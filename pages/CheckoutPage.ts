import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, APP_URLS, PAGE_TITLES } from '../utils/constants';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async fillCheckoutForm(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.fillInput(SELECTORS.FIRST_NAME_INPUT, firstName);
    await this.fillInput(SELECTORS.LAST_NAME_INPUT, lastName);
    await this.fillInput(SELECTORS.POSTAL_CODE_INPUT, postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.clickElement(SELECTORS.CONTINUE_BUTTON);
  }

  async clickCancel(): Promise<void> {
    await this.clickElement(SELECTORS.CANCEL_BUTTON);
  }

  async isPageLoaded(): Promise<boolean> {
    const isFirstNameVisible = await this.isElementVisible(SELECTORS.FIRST_NAME_INPUT);
    const isLastNameVisible = await this.isElementVisible(SELECTORS.LAST_NAME_INPUT);
    const isPostalCodeVisible = await this.isElementVisible(SELECTORS.POSTAL_CODE_INPUT);
    const isContinueVisible = await this.isElementVisible(SELECTORS.CONTINUE_BUTTON);
    const isCancelVisible = await this.isElementVisible(SELECTORS.CANCEL_BUTTON);
    const pageTitle = await this.getPageTitle();

    return (
      isFirstNameVisible &&
      isLastNameVisible &&
      isPostalCodeVisible &&
      isContinueVisible &&
      isCancelVisible &&
      pageTitle === PAGE_TITLES.CHECKOUT
    );
  }

  async assertCheckoutPageLoaded(): Promise<void> {
    await this.assertElementVisible(SELECTORS.FIRST_NAME_INPUT);
    await this.assertElementVisible(SELECTORS.LAST_NAME_INPUT);
    await this.assertElementVisible(SELECTORS.POSTAL_CODE_INPUT);
    await this.assertElementVisible(SELECTORS.CONTINUE_BUTTON);
    await this.assertElementVisible(SELECTORS.CANCEL_BUTTON);
    const pageTitle = await this.getPageTitle();
    if (pageTitle !== PAGE_TITLES.CHECKOUT) {
      throw new Error(`Expected page title "${PAGE_TITLES.CHECKOUT}", got "${pageTitle}"`);
    }
  }

  async assertOnCheckoutPage(): Promise<void> {
    await this.assertURLContains(APP_URLS.CHECKOUT);
  }
}
