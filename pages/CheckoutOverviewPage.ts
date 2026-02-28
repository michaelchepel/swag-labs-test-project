import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, APP_URLS, PAGE_TITLES } from '../utils/constants';

export class CheckoutOverviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async getCartItems() {
    const items = this.page.locator(SELECTORS.CART_ITEMS);
    const count = await items.count();
    const cartItems = [];

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const name = await item.locator(SELECTORS.CART_ITEM_NAME).textContent();
      const price = await item.locator(SELECTORS.CART_ITEM_PRICE).textContent();
      const quantity = await item.locator(SELECTORS.CART_ITEM_QUANTITY).textContent();

      cartItems.push({
        name: name?.trim() || '',
        price: price?.trim() || '',
        quantity: quantity?.trim() || '0',
      });
    }

    return cartItems;
  }

  async getCartItemNames(): Promise<string[]> {
    const items = await this.getCartItems();
    return items.map(item => item.name);
  }

  async clickFinish(): Promise<void> {
    await this.clickElement(SELECTORS.FINISH_BUTTON);
  }

  async verifyTotalCalculation(): Promise<boolean> {
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();
    const expectedTotal = subtotal + tax;

    // Allow small floating point difference
    return Math.abs(total - expectedTotal) < 0.01;
  }

  async verifyItemsInCheckout(itemNames: string[]): Promise<boolean> {
    const actualItems = await this.getCartItemNames();
    return itemNames.every(name => actualItems.includes(name));
  }

  async isPageLoaded(): Promise<boolean> {
    const isSummaryVisible = await this.isElementVisible(SELECTORS.CHECKOUT_SUMMARY);
    const isFinishVisible = await this.isElementVisible(SELECTORS.FINISH_BUTTON);
    const isCancelVisible = await this.isElementVisible(SELECTORS.CANCEL_CHECKOUT_BUTTON);
    const pageTitle = await this.getPageTitle();

    return (
      isSummaryVisible &&
      isFinishVisible &&
      isCancelVisible &&
      pageTitle === PAGE_TITLES.CHECKOUT_OVERVIEW
    );
  }

  async assertCheckoutOverviewPageLoaded(): Promise<void> {
    await this.assertElementVisible(SELECTORS.CHECKOUT_SUMMARY);
    await this.assertElementVisible(SELECTORS.FINISH_BUTTON);
    await this.assertElementVisible(SELECTORS.CANCEL_CHECKOUT_BUTTON);
    const pageTitle = await this.getPageTitle();
    if (pageTitle !== PAGE_TITLES.CHECKOUT_OVERVIEW) {
      throw new Error(`Expected page title "${PAGE_TITLES.CHECKOUT_OVERVIEW}", got "${pageTitle}"`);
    }
  }

  async assertOnCheckoutOverviewPage(): Promise<void> {
    await this.assertURLContains(APP_URLS.CHECKOUT_OVERVIEW);
  }

  async getSubtotal(): Promise<number> {
    await this.waitForElement(SELECTORS.SUBTOTAL_LABEL);
    const text = await this.getElementText(SELECTORS.SUBTOTAL_LABEL);
    const match = text.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1] || '0') : 0;
  }

  async getTax(): Promise<number> {
    await this.waitForElement(SELECTORS.TAX_LABEL);
    const text = await this.getElementText(SELECTORS.TAX_LABEL);
    const match = text.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1] || '0') : 0;
  }

  async getTotal(): Promise<number> {
    await this.waitForElement(SELECTORS.TOTAL_LABEL);
    const text = await this.getElementText(SELECTORS.TOTAL_LABEL);
    const match = text.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1] || '0') : 0;
  }
}
