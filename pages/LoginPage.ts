import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, APP_URLS, PAGE_TITLES } from '../utils/constants';

/**
 * Login page object for Swag Labs
 * Handles login functionality and related operations
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo(APP_URLS.LOGIN);
  }

  /**
   * Perform login with username and password
   * @param username - Username
   * @param password - Password
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillInput(SELECTORS.USERNAME_INPUT, username);
    await this.fillInput(SELECTORS.PASSWORD_INPUT, password);
    await this.clickElement(SELECTORS.LOGIN_BUTTON);
  }

  /**
   * Get error message text
   * @returns Error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText(SELECTORS.ERROR_MESSAGE);
  }

  /**
   * Check if error message is displayed
   * @returns True if error message is visible, false otherwise
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.ERROR_MESSAGE);
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
   * Check if login button is visible
   * @returns True if login button is visible, false otherwise
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.LOGIN_BUTTON);
  }

  /**
   * Check if login button is enabled
   * @returns True if login button is enabled, false otherwise
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(SELECTORS.LOGIN_BUTTON);
  }

  /**
   * Check if username input is visible
   * @returns True if username input is visible, false otherwise
   */
  async isUsernameInputVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.USERNAME_INPUT);
  }

  /**
   * Check if password input is visible
   * @returns True if password input is visible, false otherwise
   */
  async isPasswordInputVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.PASSWORD_INPUT);
  }

  /**
   * Get username input value
   * @returns Username input value
   */
  async getUsernameValue(): Promise<string> {
    await this.waitForElement(SELECTORS.USERNAME_INPUT);
    const input = this.getLocator(SELECTORS.USERNAME_INPUT);
    return await input.inputValue();
  }

  /**
   * Get password input value
   * @returns Password input value
   */
  async getPasswordValue(): Promise<string> {
    await this.waitForElement(SELECTORS.PASSWORD_INPUT);
    const input = this.getLocator(SELECTORS.PASSWORD_INPUT);
    return await input.inputValue();
  }

  /**
   * Clear username input
   */
  async clearUsernameInput(): Promise<void> {
    await this.clearAndFillInput(SELECTORS.USERNAME_INPUT, '');
  }

  /**
   * Clear password input
   */
  async clearPasswordInput(): Promise<void> {
    await this.clearAndFillInput(SELECTORS.PASSWORD_INPUT, '');
  }

  /**
   * Verify that login page is loaded
   * @returns True if login page is loaded, false otherwise
   */
  async isPageLoaded(): Promise<boolean> {
    const isUsernameVisible = await this.isUsernameInputVisible();
    const isPasswordVisible = await this.isPasswordInputVisible();
    const isLoginButtonVisible = await this.isLoginButtonVisible();
    const pageTitle = await this.getPageTitle();

    return (
      isUsernameVisible &&
      isPasswordVisible &&
      isLoginButtonVisible &&
      pageTitle === PAGE_TITLES.LOGIN
    );
  }

  /**
   * Assert that login page is loaded
   */
  async assertLoginPageLoaded(): Promise<void> {
    await this.assertElementVisible(SELECTORS.USERNAME_INPUT);
    await this.assertElementVisible(SELECTORS.PASSWORD_INPUT);
    await this.assertElementVisible(SELECTORS.LOGIN_BUTTON);
    const pageTitle = await this.getPageTitle();
    if (pageTitle !== PAGE_TITLES.LOGIN) {
      throw new Error(`Expected page title "${PAGE_TITLES.LOGIN}", got "${pageTitle}"`);
    }
  }
}
