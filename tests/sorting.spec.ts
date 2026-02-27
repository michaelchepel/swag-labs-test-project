import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { getStandardUserCredentials } from '../utils/data-helper';
import { SORT_OPTIONS } from '../utils/constants';

/**
 * Test Suite: Product Sorting Functionality
 * Tests for product sorting on the inventory page
 */

test.describe('Product Sorting Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Login before each test
    const credentials = getStandardUserCredentials();
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.username, credentials.password);
    await inventoryPage.assertInventoryPageLoaded();
  });

  /**
   * Sort Products by Name (A to Z)
   * Verifies that products are sorted alphabetically from A to Z
   */
  test('Sort products by name (A to Z)', async ({ page }) => {
    // Sort products by name A to Z
    await inventoryPage.sortProducts(SORT_OPTIONS.NAME_A_TO_Z);

    // Get product list
    const products = await inventoryPage.getProductList();

    // Verify products are sorted A to Z
    const productNames = products.map(p => p.name);
    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
  });
});
