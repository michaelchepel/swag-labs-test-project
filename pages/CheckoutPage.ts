import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, APP_URLS, PAGE_TITLES } from '../utils/constants';

/**
 * Checkout page object for Swag Labs
 * Handles checkout form and related operations
 */
export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Fill checkout form with first name, last name, and postal code
   * @param firstName - First name
   * @param lastName - Last name
   * @param postalCode - Postal code
   */
  async fillCheckoutForm(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.fillInput(SELECTORS.FIRST_NAME_INPUT, firstName);
    await this.fillInput(SELECTORS.LAST_NAME_INPUT, lastName);
    await this.fillInput(SELECTORS.POSTAL_CODE_INPUT, postalCode);
  }

  /**
   * Click continue button to proceed to checkout overview
   */
  async clickContinue(): Promise<void> {
    await this.clickElement(SELECTORS.CONTINUE_BUTTON);
  }

  /**
   * Click cancel button to return to cart
   */
  async clickCancel(): Promise<void> {
    await this.clickElement(SELECTORS.CANCEL_BUTTON);
  }

  /**
   * Verify that checkout page is loaded
   * @returns True if checkout page is loaded, false otherwise
   */
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

  /**
   * Assert that checkout page is loaded
   */
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

  /**
   * Assert that URL contains checkout path
   */
  async assertOnCheckoutPage(): Promise<void> {
    await this.assertURLContains(APP_URLS.CHECKOUT);
  }
}
