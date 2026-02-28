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
  getOrderCompleteMessage,
  getOrderDispatchedMessage,
} from '../utils/data-helper';

test.describe('Checkout Tests', () => {
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

    // Login before each test
    const credentials = getStandardUserCredentials();
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.username, credentials.password);
    await inventoryPage.assertInventoryPageLoaded();
  });

  test('Complete checkout flow successfully', async () => {
    // Get random products and checkout info
    const products = getRandomProducts(2);
    const productNames = products.map(p => p.name);
    const checkoutInfo = getCheckoutInfo();

    // Add products to cart
    for (const product of products) {
      await inventoryPage.addProductToCart(product.name);
    }

    // Navigate to cart
    await inventoryPage.clickCartIcon();
    await cartPage.assertCartPageLoaded();

    // Verify products are in cart
    expect(await cartPage.verifyItemsInCart(productNames)).toBeTruthy();

    // Proceed to checkout
    await cartPage.clickCheckout();
    await checkoutPage.assertCheckoutPageLoaded();

    // Fill checkout form
    await checkoutPage.fillCheckoutForm(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );

    // Proceed to checkout overview
    await checkoutPage.clickContinue();
    await checkoutOverviewPage.assertCheckoutOverviewPageLoaded();

    // Verify products are in checkout overview
    expect(await checkoutOverviewPage.verifyItemsInCheckout(productNames)).toBeTruthy();

    // Verify total calculation
    expect(await checkoutOverviewPage.verifyTotalCalculation()).toBeTruthy();

    // Complete the order
    await checkoutOverviewPage.clickFinish();
    await checkoutCompletePage.assertCheckoutCompletePageLoaded();

    // Verify order completion messages
    expect(await checkoutCompletePage.areSuccessMessagesDisplayed()).toBeTruthy();
    expect(await checkoutCompletePage.getCompleteHeader()).toBe(getOrderCompleteMessage());
    expect(await checkoutCompletePage.getCompleteText()).toBe(getOrderDispatchedMessage());
  });
});
