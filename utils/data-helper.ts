import products from '../data/products.json';
import testData from '../data/test-data.json';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Data helper utility for accessing test data
 * Provides convenient methods to retrieve test data from JSON files
 */

/**
 * User credentials interface
 */
export interface UserCredentials {
  username: string;
  password: string;
}

/**
 * Product interface
 */
export interface Product {
  name: string;
  price: string;
  description: string;
}

/**
 * Checkout info interface
 */
export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Get standard user credentials
 * @returns Standard user credentials
 */
export function getStandardUserCredentials(): UserCredentials {
  const username = process.env.STANDARD_USER || 'standard_user';
  const password = process.env.PASSWORD || 'secret_sauce';
  return { username, password };
}

/**
 * Get all products
 * @returns Array of all products
 */
export function getAllProducts(): Product[] {
  return products.products;
}

/**
 * Get random products
 * @param count - Number of random products to return
 * @returns Array of random products
 */
export function getRandomProducts(count: number): Product[] {
  const allProducts = [...getAllProducts()];
  const shuffled = allProducts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, allProducts.length));
}

/**
 * Calculate total price for products
 * @param productNames - Array of product names
 * @returns Total price as a number
 */
export function calculateTotalPrice(productNames: string[]): number {
  let total = 0;
  for (const name of productNames) {
    const product = products.products.find(p => p.name === name);
    if (!product) {
      console.warn(`Product "${name}" not found in products.json`);
      continue;
    }
    total += parseFloat(product.price.replace('$', ''));
  }
  return total;
}

/**
 * Get checkout information
 * @returns Checkout information object
 */
export function getCheckoutInfo(): CheckoutInfo {
  return testData.checkoutInfo;
}

/**
 * Get order complete message
 * @returns Order complete message
 */
export function getOrderCompleteMessage(): string {
  return testData.successMessages.orderComplete;
}

/**
 * Get order dispatched message
 * @returns Order dispatched message
 */
export function getOrderDispatchedMessage(): string {
  return testData.successMessages.orderDispatched;
}
