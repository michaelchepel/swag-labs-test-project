import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, APP_URLS, PAGE_TITLES } from '../utils/constants';

/**
 * Inventory page object for Swag Labs
 * Handles product listing and shopping cart operations
 */
export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Get list of all products
   * @returns Array of product objects with name, price, and description
   */
  async getProductList(): Promise<Array<{ name: string; price: string; description: string }>> {
    const products: Array<{ name: string; price: string; description: string }> = [];
    const productElements = await this.getAllElements(SELECTORS.INVENTORY_ITEM);

    for (const product of productElements) {
      const name = await product.locator(SELECTORS.INVENTORY_ITEM_NAME).textContent();
      const price = await product.locator(SELECTORS.INVENTORY_ITEM_PRICE).textContent();
      const description = await product.locator(SELECTORS.INVENTORY_ITEM_DESC).textContent();

      if (name && price && description) {
        products.push({
          name: name.trim(),
          price: price.trim(),
          description: description.trim(),
        });
      }
    }

    return products;
  }

  /**
   * Add a product to the shopping cart by name
   * @param productName - Name of the product to add
   */
  async addProductToCart(productName: string): Promise<void> {
    const productElements = await this.getAllElements(SELECTORS.INVENTORY_ITEM);

    for (const product of productElements) {
      const name = await product.locator(SELECTORS.INVENTORY_ITEM_NAME).textContent();
      if (name?.trim() === productName) {
        const addButton = product.locator(SELECTORS.ADD_TO_CART_BUTTON);
        await this.clickLocator(addButton);
        break;
      }
    }
  }

  /**
   * Get the number of items in the shopping cart
   * @returns Number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    if (await this.isElementVisible(SELECTORS.CART_BADGE)) {
      const cartBadge = this.getLocator(SELECTORS.CART_BADGE);
      const text = await cartBadge.textContent();
      return text ? parseInt(text, 10) : 0;
    }
    return 0;
  }

  /**
   * Sort products by the specified option
   * @param sortOption - Sort option (az, za, lohi, hilo)
   */
  async sortProducts(sortOption: string): Promise<void> {
    await this.selectDropdownOption(SELECTORS.PRODUCT_SORT, sortOption);
  }

  /**
   * Click on the shopping cart icon to navigate to cart page
   */
  async clickCartIcon(): Promise<void> {
    await this.clickElement(SELECTORS.SHOPPING_CART_LINK);
  }

  /**
   * Check if shopping cart badge is visible
   * @returns True if cart badge is visible, false otherwise
   */
  async isCartBadgeVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.CART_BADGE);
  }

  /**
   * Assert that inventory page is loaded
   */
  async assertInventoryPageLoaded(): Promise<void> {
    await this.assertElementVisible(SELECTORS.INVENTORY_LIST);
    await this.assertElementVisible(SELECTORS.SHOPPING_CART_LINK);
    const pageTitle = await this.getPageTitle();
    if (pageTitle !== PAGE_TITLES.INVENTORY) {
      throw new Error(`Expected page title "${PAGE_TITLES.INVENTORY}", got "${pageTitle}"`);
    }
  }

  /**
   * Assert that URL contains inventory path
   */
  async assertOnInventoryPage(): Promise<void> {
    await this.assertURLContains(APP_URLS.INVENTORY);
  }

  /**
   * Verify that inventory page is loaded
   * @returns True if inventory page is loaded, false otherwise
   */
  async isPageLoaded(): Promise<boolean> {
    const isInventoryListVisible = await this.isElementVisible(SELECTORS.INVENTORY_LIST);
    const isCartIconVisible = await this.isElementVisible(SELECTORS.SHOPPING_CART_LINK);
    const pageTitle = await this.getPageTitle();

    return (
      isInventoryListVisible &&
      isCartIconVisible &&
      pageTitle === PAGE_TITLES.INVENTORY
    );
  }
}
