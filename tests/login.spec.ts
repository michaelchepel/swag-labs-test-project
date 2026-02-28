import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { getStandardUserCredentials } from '../utils/data-helper';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('Successful login with valid credentials', async () => {
    // Get valid credentials
    const credentials = getStandardUserCredentials();

    // Perform login
    await loginPage.login(credentials.username, credentials.password);

    // Verify successful login by checking if inventory page is loaded
    await inventoryPage.assertInventoryPageLoaded();

    // Verify URL contains inventory path
    await inventoryPage.assertOnInventoryPage();

    // Verify cart icon is visible
    expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy(); // Cart should be empty initially

    // Verify products are displayed
    const products = await inventoryPage.getProductList();
    expect(products.length).toBeGreaterThan(0);
  });
});
