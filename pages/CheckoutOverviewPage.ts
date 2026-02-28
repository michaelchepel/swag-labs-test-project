import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, APP_URLS, PAGE_TITLES } from '../utils/constants';

/**
 * Checkout overview page object for Swag Labs
 * Handles order review and confirmation
 */
export class CheckoutOverviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Get all cart items in checkout overview
   * @returns Array of cart item objects
   */
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

  /**
   * Get cart item names as an array
   * @returns Array of item names
   */
  async getCartItemNames(): Promise<string[]> {
    const items = await this.getCartItems();
    return items.map(item => item.name);
  }

  /**
   * Click finish button to complete the order
   */
  async clickFinish(): Promise<void> {
    await this.clickElement(SELECTORS.FINISH_BUTTON);
  }

  /**
   * Verify that subtotal + tax equals total
   * @returns True if calculation is correct, false otherwise
   */
  async verifyTotalCalculation(): Promise<boolean> {
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();
    const expectedTotal = subtotal + tax;

    // Allow small floating point difference
    return Math.abs(total - expectedTotal) < 0.01;
  }

  /**
   * Verify that specific items are in the checkout
   * @param itemNames - Array of item names to verify
   * @returns True if all items are in checkout, false otherwise
   */
  async verifyItemsInCheckout(itemNames: string[]): Promise<boolean> {
    const actualItems = await this.getCartItemNames();
    return itemNames.every(name => actualItems.includes(name));
  }

  /**
   * Verify that checkout overview page is loaded
   * @returns True if checkout overview page is loaded, false otherwise
   */
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

  /**
   * Assert that checkout overview page is loaded
   */
  async assertCheckoutOverviewPageLoaded(): Promise<void> {
    await this.assertElementVisible(SELECTORS.CHECKOUT_SUMMARY);
    await this.assertElementVisible(SELECTORS.FINISH_BUTTON);
    await this.assertElementVisible(SELECTORS.CANCEL_CHECKOUT_BUTTON);
    const pageTitle = await this.getPageTitle();
    if (pageTitle !== PAGE_TITLES.CHECKOUT_OVERVIEW) {
      throw new Error(`Expected page title "${PAGE_TITLES.CHECKOUT_OVERVIEW}", got "${pageTitle}"`);
    }
  }

  /**
   * Assert that URL contains checkout overview path
   */
  async assertOnCheckoutOverviewPage(): Promise<void> {
    await this.assertURLContains(APP_URLS.CHECKOUT_OVERVIEW);
  }

  /**
   * Get subtotal price
   * @returns Subtotal price as a number
   */
  async getSubtotal(): Promise<number> {
    await this.waitForElement(SELECTORS.SUBTOTAL_LABEL);
    const text = await this.getElementText(SELECTORS.SUBTOTAL_LABEL);
    const match = text.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1] || '0') : 0;
  }

  /**
   * Get tax amount
   * @returns Tax amount as a number
   */
  async getTax(): Promise<number> {
    await this.waitForElement(SELECTORS.TAX_LABEL);
    const text = await this.getElementText(SELECTORS.TAX_LABEL);
    const match = text.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1] || '0') : 0;
  }

  /**
   * Get total price
   * @returns Total price as a number
   */
  async getTotal(): Promise<number> {
    await this.waitForElement(SELECTORS.TOTAL_LABEL);
    const text = await this.getElementText(SELECTORS.TOTAL_LABEL);
    const match = text.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1] || '0') : 0;
  }
}
