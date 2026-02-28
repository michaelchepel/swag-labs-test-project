import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, PAGE_TITLES } from '../utils/constants';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async getCartItemCount(): Promise<number> {
    const items = this.page.locator(SELECTORS.CART_ITEMS);
    return await items.count();
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

  async clickCheckout(): Promise<void> {
    await this.clickElement(SELECTORS.CHECKOUT_BUTTON);
  }

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

  async assertCartPageLoaded(): Promise<void> {
    await this.assertElementVisible(SELECTORS.CHECKOUT_BUTTON);
    await this.assertElementVisible(SELECTORS.CONTINUE_SHOPPING_BUTTON);
    const pageTitle = await this.getPageTitle();
    if (pageTitle !== PAGE_TITLES.CART) {
      throw new Error(`Expected page title "${PAGE_TITLES.CART}", got "${pageTitle}"`);
    }
  }

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

  async verifyItemsInCart(itemNames: string[]): Promise<boolean> {
    const cartItemNames = await this.getCartItemNames();
    return itemNames.every(name => cartItemNames.includes(name));
  }

  async getCartItemNames(): Promise<string[]> {
    const items = await this.getCartItems();
    return items.map(item => item.name);
  }
}
