import { Page } from '@playwright/test';
import { BasePage } from './common';
import { SELECTORS, APP_URLS, PAGE_TITLES } from '../utils/constants';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

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

  async getCartItemCount(): Promise<number> {
    if (await this.isElementVisible(SELECTORS.CART_BADGE)) {
      const cartBadge = this.getLocator(SELECTORS.CART_BADGE);
      const text = await cartBadge.textContent();
      return text ? parseInt(text, 10) : 0;
    }
    return 0;
  }

  async sortProducts(sortOption: string): Promise<void> {
    await this.selectDropdownOption(SELECTORS.PRODUCT_SORT, sortOption);
  }

  async clickCartIcon(): Promise<void> {
    await this.clickElement(SELECTORS.SHOPPING_CART_LINK);
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.isElementVisible(SELECTORS.CART_BADGE);
  }

  async assertInventoryPageLoaded(): Promise<void> {
    await this.assertElementVisible(SELECTORS.INVENTORY_LIST);
    await this.assertElementVisible(SELECTORS.SHOPPING_CART_LINK);
    const pageTitle = await this.getPageTitle();
    if (pageTitle !== PAGE_TITLES.INVENTORY) {
      throw new Error(`Expected page title "${PAGE_TITLES.INVENTORY}", got "${pageTitle}"`);
    }
  }

  async assertOnInventoryPage(): Promise<void> {
    await this.assertURLContains(APP_URLS.INVENTORY);
  }

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
