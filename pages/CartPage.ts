import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, APP_URLS, PAGE_TITLES } from '../utils/constants';

/**
 * Cart page object for Swag Labs
 * Handles cart functionality and related operations
 */
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to cart page
   */
  async navigateToCart(): Promise<void> {
    await this.navigateTo(APP_URLS.CART);
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
      const removeButton = item.locator(SELECTORS.CART_ITEM_REMOVE);
      
      cartItems.push({
        name: name?.trim() || '',
        price: price?.trim() || '',
        quantity: quantity?.trim() || '0',
        removeButton
      });
    }
    return cartItems;
  }

  /**
   * Get cart item by name
   * @param itemName - Name of the item to find
   * @returns Cart item object or null if not found
   */
  async getCartItemByName(itemName: string) {
    const items = await this.getCartItems();
    return items.find(item => item.name === itemName) || null;
  }

  /**
   * Check if an item exists in the cart
   * @param itemName - Name of the item to check
   * @returns True if item exists in cart, false otherwise
   */
  async isItemInCart(itemName: string): Promise<boolean> {
    const item = await this.getCartItemByName(itemName);
    return item !== null;
  }

  /**
   * Get the price of a specific item in the cart
   * @param itemName - Name of the item
   * @returns Price of the item as a string
   */
  async getItemPrice(itemName: string): Promise<string> {
    const item = await this.getCartItemByName(itemName);
    if (!item) {
      throw new Error(`Item "${itemName}" not found in cart`);
    }
    return item.price;
  }

  /**
   * Get the quantity of a specific item in the cart
   * @param itemName - Name of the item
   * @returns Quantity of the item as a string
   */
  async getItemQuantity(itemName: string): Promise<string> {
    const item = await this.getCartItemByName(itemName);
    if (!item) {
      throw new Error(`Item "${itemName}" not found in cart`);
    }
    return item.quantity;
  }

  /**
   * Remove a specific item from the cart
   * @param itemName - Name of the item to remove
   */
  async removeItem(itemName: string): Promise<void> {
    const items = this.page.locator(SELECTORS.CART_ITEMS);
    const count = await items.count();
    
    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const name = await item.locator(SELECTORS.CART_ITEM_NAME).textContent();
      if (name?.trim() === itemName) {
        const removeButton = item.locator(SELECTORS.CART_ITEM_REMOVE);
        await removeButton.click();
        return;
      }
    }
    
    throw new Error(`Item "${itemName}" not found in cart`);
  }

  /**
   * Remove all items from the cart
   */
  async removeAllItems(): Promise<void> {
    const itemCount = await this.getCartItemCount();
    for (let i = 0; i < itemCount; i++) {
      const removeButton = this.page.locator(SELECTORS.CART_ITEM_REMOVE).first();
      await removeButton.click();
    }
  }

  /**
   * Click the checkout button to proceed to checkout
   */
  async clickCheckout(): Promise<void> {
    await this.clickElement(SELECTORS.CHECKOUT_BUTTON);
  }

  /**
   * Click the continue shopping button to return to inventory
   */
  async clickContinueShopping(): Promise<void> {
    await this.clickElement(SELECTORS.CONTINUE_SHOPPING_BUTTON);
  }

  /**
   * Check if checkout button is visible
   * @returns True if checkout button is visible, false otherwise
   */
  async isCheckoutButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.CHECKOUT_BUTTON);
  }

  /**
   * Check if checkout button is enabled
   * @returns True if checkout button is enabled, false otherwise
   */
  async isCheckoutButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(SELECTORS.CHECKOUT_BUTTON);
  }

  /**
   * Check if continue shopping button is visible
   * @returns True if continue shopping button is visible, false otherwise
   */
  async isContinueShoppingButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.CONTINUE_SHOPPING_BUTTON);
  }

  /**
   * Check if cart is empty
   * @returns True if cart is empty, false otherwise
   */
  async isCartEmpty(): Promise<boolean> {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }

  /**
   * Verify that cart page is loaded
   * @returns True if cart page is loaded, false otherwise
   */
  async isPageLoaded(): Promise<boolean> {
    const isCheckoutVisible = await this.isCheckoutButtonVisible();
    const isContinueShoppingVisible = await this.isContinueShoppingButtonVisible();
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
   * Wait for cart items to be loaded
   * @param expectedCount - Expected number of items (optional)
   */
  async waitForCartItems(expectedCount?: number): Promise<void> {
    await this.waitForElement(SELECTORS.CART_ITEMS);
    
    if (expectedCount !== undefined) {
      const actualCount = await this.getCartItemCount();
      if (actualCount !== expectedCount) {
        throw new Error(`Expected ${expectedCount} items in cart, but found ${actualCount}`);
      }
    }
  }

  /**
   * Verify that specific items are in the cart
   * @param itemNames - Array of item names to verify
   * @returns True if all items are in cart, false otherwise
   */
  async verifyItemsInCart(itemNames: string[]): Promise<boolean> {
    for (const itemName of itemNames) {
      if (!(await this.isItemInCart(itemName))) {
        return false;
      }
    }
    return true;
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
