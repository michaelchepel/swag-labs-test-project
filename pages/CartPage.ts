import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, PAGE_TITLES } from '../utils/constants';

/**
 * Cart page object for Swag Labs
 * Handles cart functionality and related operations
 */
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the number of items in the cart
   * @returns Number of items in the cart
   */
  async getCartItemCount(): Promise<number> {
    const items = this.page.locator(SELECTORS.CART_ITEMS);
    return await items.count();
  }

  /**
   * Get all cart items
   * @returns Array of cart item locators
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
   * Click the checkout button to proceed to checkout
   */
  async clickCheckout(): Promise<void> {
    await this.clickElement(SELECTORS.CHECKOUT_BUTTON);
  }

  /**
   * Verify that cart page is loaded
   * @returns True if cart page is loaded, false otherwise
   */
  async isPageLoaded(): Promise<boolean> {
    const isCheckoutVisible = await this.isElementVisible(SELECTORS.CHECKOUT_BUTTON);
    const isContinueShoppingVisible = await this.isElementVisible(SELECTORS.CONTINUE_SHOPPING_BUTTON);
    const pageTitle = await this.getPageTitle();

    return (
      isCheckoutVisible &&
      isContinueShoppingVisible &&
      pageTitle === PAGE_TITLES.CART
    );
  }

  /**
   * Assert that cart page is loaded
   */
  async assertCartPageLoaded(): Promise<void> {
    await this.assertElementVisible(SELECTORS.CHECKOUT_BUTTON);
    await this.assertElementVisible(SELECTORS.CONTINUE_SHOPPING_BUTTON);
    const pageTitle = await this.getPageTitle();
    if (pageTitle !== PAGE_TITLES.CART) {
      throw new Error(`Expected page title "${PAGE_TITLES.CART}", got "${pageTitle}"`);
    }
  }

  /**
   * Calculate the total price of all items in the cart
   * @returns Total price as a number
   */
  async calculateCartTotal(): Promise<number> {
    const items = await this.getCartItems();
    let total = 0;

    for (const item of items) {
      const price = parseFloat(item.price.replace('$', ''));
      const quantity = parseInt(item.quantity, 10);
      total += price * quantity;
    }

    return total;
  }

  /**
   * Verify that specific items are in the cart
   * @param itemNames - Array of item names to verify
   * @returns True if all items are in cart, false otherwise
   */
  async verifyItemsInCart(itemNames: string[]): Promise<boolean> {
    const cartItemNames = await this.getCartItemNames();
    return itemNames.every(name => cartItemNames.includes(name));
  }

  /**
   * Get cart item names as an array
   * @returns Array of item names in the cart
   */
  async getCartItemNames(): Promise<string[]> {
    const items = await this.getCartItems();
    return items.map(item => item.name);
  }
}
