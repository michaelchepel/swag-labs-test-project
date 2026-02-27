import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import {
  getStandardUserCredentials,
  getRandomProducts,
  getCheckoutInfo,
} from '../utils/data-helper';

/**
 * Test Suite: End-to-End Scenarios
 * Comprehensive tests covering multiple user flows
 */

test.describe('End-to-End Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let checkoutCompletePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);
  });

  /**
   * Complete User Journey - Browse, Add to Cart, and Purchase
   * Verifies the complete user journey from login to order completion
   */
  test('Complete user journey - browse, add to cart, and purchase', async ({ page }) => {
    // Step 1: Login
    const credentials = getStandardUserCredentials();
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.username, credentials.password);
    await inventoryPage.assertInventoryPageLoaded();

    // Step 2: Browse products
    const products = await inventoryPage.getProductList();
    expect(products.length).toBeGreaterThan(0);

    // Step 3: Add products to cart
    const selectedProducts = getRandomProducts(2);
    for (const product of selectedProducts) {
      await inventoryPage.addProductToCart(product.name);
    }

    // Verify cart badge
    expect(await inventoryPage.isCartBadgeVisible()).toBeTruthy();
    expect(await inventoryPage.getCartItemCount()).toBe(2);

    // Step 4: Review cart
    await inventoryPage.clickCartIcon();
    await cartPage.assertCartPageLoaded();

    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems).toEqual(selectedProducts.map(p => p.name));

    // Step 5: Proceed to checkout
    await cartPage.clickCheckout();
    await checkoutPage.assertCheckoutPageLoaded();

    // Step 6: Fill checkout information
    const checkoutInfo = getCheckoutInfo();
    await checkoutPage.fillCheckoutForm(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );

    // Step 7: Review order
    await checkoutPage.clickContinue();
    await checkoutOverviewPage.assertCheckoutOverviewPageLoaded();

    expect(await checkoutOverviewPage.verifyItemsInCheckout(cartItems)).toBeTruthy();
    expect(await checkoutOverviewPage.verifyTotalCalculation()).toBeTruthy();

    // Step 8: Complete order
    await checkoutOverviewPage.clickFinish();
    await checkoutCompletePage.assertCheckoutCompletePageLoaded();

    expect(await checkoutCompletePage.areSuccessMessagesDisplayed()).toBeTruthy();

    // Step 9: Return to shopping
    await checkoutCompletePage.clickBackHome();
    await inventoryPage.assertInventoryPageLoaded();
  });
});
