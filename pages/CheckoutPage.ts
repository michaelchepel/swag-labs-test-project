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
   * Navigate to checkout page
   */
  async navigateToCheckout(): Promise<void> {
    await this.navigateTo(APP_URLS.CHECKOUT);
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
   * Get first name input value
   * @returns First name input value
   */
  async getFirstNameValue(): Promise<string> {
    await this.waitForElement(SELECTORS.FIRST_NAME_INPUT);
    const input = this.getLocator(SELECTORS.FIRST_NAME_INPUT);
    return await input.inputValue();
  }

  /**
   * Get last name input value
   * @returns Last name input value
   */
  async getLastNameValue(): Promise<string> {
    await this.waitForElement(SELECTORS.LAST_NAME_INPUT);
    const input = this.getLocator(SELECTORS.LAST_NAME_INPUT);
    return await input.inputValue();
  }

  /**
   * Get postal code input value
   * @returns Postal code input value
   */
  async getPostalCodeValue(): Promise<string> {
    await this.waitForElement(SELECTORS.POSTAL_CODE_INPUT);
    const input = this.getLocator(SELECTORS.POSTAL_CODE_INPUT);
    return await input.inputValue();
  }

  /**
   * Clear all checkout form fields
   */
  async clearCheckoutForm(): Promise<void> {
    await this.clearAndFillInput(SELECTORS.FIRST_NAME_INPUT, '');
    await this.clearAndFillInput(SELECTORS.LAST_NAME_INPUT, '');
    await this.clearAndFillInput(SELECTORS.POSTAL_CODE_INPUT, '');
  }

  /**
   * Check if continue button is visible
   * @returns True if continue button is visible, false otherwise
   */
  async isContinueButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.CONTINUE_BUTTON);
  }

  /**
   * Check if continue button is enabled
   * @returns True if continue button is enabled, false otherwise
   */
  async isContinueButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(SELECTORS.CONTINUE_BUTTON);
  }

  /**
   * Check if cancel button is visible
   * @returns True if cancel button is visible, false otherwise
   */
  async isCancelButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.CANCEL_BUTTON);
  }

  /**
   * Check if first name input is visible
   * @returns True if first name input is visible, false otherwise
   */
  async isFirstNameInputVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.FIRST_NAME_INPUT);
  }

  /**
   * Check if last name input is visible
   * @returns True if last name input is visible, false otherwise
   */
  async isLastNameInputVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.LAST_NAME_INPUT);
  }

  /**
   * Check if postal code input is visible
   * @returns True if postal code input is visible, false otherwise
   */
  async isPostalCodeInputVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.POSTAL_CODE_INPUT);
  }

  /**
   * Check if error message is displayed
   * @returns True if error message is visible, false otherwise
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.ERROR_MESSAGE);
  }

  /**
   * Get error message text
   * @returns Error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText(SELECTORS.ERROR_MESSAGE);
  }

  /**
   * Close error message by clicking the error button
   */
  async closeErrorMessage(): Promise<void> {
    if (await this.isErrorMessageVisible()) {
      await this.clickElement(SELECTORS.ERROR_BUTTON);
    }
  }

  /**
   * Verify that checkout page is loaded
   * @returns True if checkout page is loaded, false otherwise
   */
  async isPageLoaded(): Promise<boolean> {
    const isFirstNameVisible = await this.isFirstNameInputVisible();
    const isLastNameVisible = await this.isLastNameInputVisible();
    const isPostalCodeVisible = await this.isPostalCodeInputVisible();
    const isContinueVisible = await this.isContinueButtonVisible();
    const isCancelVisible = await this.isCancelButtonVisible();
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
