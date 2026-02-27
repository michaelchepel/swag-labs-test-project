import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { getStandardUserCredentials, getRandomProducts, calculateTotalPrice } from '../utils/data-helper';

/**
 * Test Suite: Shopping Cart Functionality
 * Tests for adding products to cart and cart management
 */

test.describe('Cart Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    // Login before each test
    const credentials = getStandardUserCredentials();
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.username, credentials.password);
    await inventoryPage.assertInventoryPageLoaded();
  });

  /**
   * Add Multiple Products to Cart
   * Verifies that multiple products can be added to the cart
   */
  test('Add multiple products to cart', async ({ page }) => {
    // Get 3 random products
    const products = getRandomProducts(3);
    const productNames = products.map(p => p.name);

    // Add all products to cart
    for (const product of products) {
      await inventoryPage.addProductToCart(product.name);
    }

    // Verify cart badge shows correct count
    expect(await inventoryPage.isCartBadgeVisible()).toBeTruthy();
    expect(await inventoryPage.getCartItemCount()).toBe(3);

    // Navigate to cart page
    await inventoryPage.clickCartIcon();
    await cartPage.assertCartPageLoaded();

    // Verify all products are in cart
    expect(await cartPage.verifyItemsInCart(productNames)).toBeTruthy();

    // Verify cart has 3 items
    expect(await cartPage.getCartItemCount()).toBe(3);

    // Verify cart total calculation
    const cartTotal = await cartPage.calculateCartTotal();
    const expectedTotal = calculateTotalPrice(productNames);
    expect(cartTotal).toBeCloseTo(expectedTotal, 2);
  });
});
