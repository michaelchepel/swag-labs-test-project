import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, APP_URLS, PAGE_TITLES } from '../utils/constants';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo(APP_URLS.LOGIN);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillInput(SELECTORS.USERNAME_INPUT, username);
    await this.fillInput(SELECTORS.PASSWORD_INPUT, password);
    await this.clickElement(SELECTORS.LOGIN_BUTTON);
  }

  async assertLoginPageLoaded(): Promise<void> {
    await this.assertElementVisible(SELECTORS.USERNAME_INPUT);
    await this.assertElementVisible(SELECTORS.PASSWORD_INPUT);
    await this.assertElementVisible(SELECTORS.LOGIN_BUTTON);
    const pageTitle = await this.getPageTitle();
    if (pageTitle !== PAGE_TITLES.LOGIN) {
      throw new Error(`Expected page title "${PAGE_TITLES.LOGIN}", got "${pageTitle}"`);
    }
  }

  async isPageLoaded(): Promise<boolean> {
    const isUsernameVisible = await this.isElementVisible(SELECTORS.USERNAME_INPUT);
    const isPasswordVisible = await this.isElementVisible(SELECTORS.PASSWORD_INPUT);
    const isLoginButtonVisible = await this.isElementVisible(SELECTORS.LOGIN_BUTTON);
    const pageTitle = await this.getPageTitle();

    return (
      isUsernameVisible &&
      isPasswordVisible &&
      isLoginButtonVisible &&
      pageTitle === PAGE_TITLES.LOGIN
    );
  }
}
