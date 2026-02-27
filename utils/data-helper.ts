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
 * Get credentials for a specific user type
 * @param userType - Type of user (standardUser, lockedOutUser, etc.)
 * @returns User credentials object
 */
export function getCredentials(userType: string): UserCredentials {
  const password = getDefaultPassword();
  
  // Map user types to environment variable names
  const userEnvMap: Record<string, string> = {
    standardUser: 'STANDARD_USER',
    lockedOutUser: 'LOCKED_OUT_USER',
    problemUser: 'PROBLEM_USER',
    performanceGlitchUser: 'PERFORMANCE_GLITCH_USER',
    errorUser: 'ERROR_USER',
    visualUser: 'VISUAL_USER'
  };
  
  const envVarName = userEnvMap[userType];
  if (!envVarName) {
    throw new Error(`User type "${userType}" not found`);
  }
  
  const username = getEnvVar(envVarName);
  
  return { username, password };
}

/**
 * Get standard user credentials
 * @returns Standard user credentials
 */
export function getStandardUserCredentials(): UserCredentials {
  return getCredentials('standardUser');
}

/**
 * Get locked out user credentials
 * @returns Locked out user credentials
 */
export function getLockedOutUserCredentials(): UserCredentials {
  return getCredentials('lockedOutUser');
}

/**
 * Get problem user credentials
 * @returns Problem user credentials
 */
export function getProblemUserCredentials(): UserCredentials {
  return getCredentials('problemUser');
}

/**
 * Get performance glitch user credentials
 * @returns Performance glitch user credentials
 */
export function getPerformanceGlitchUserCredentials(): UserCredentials {
  return getCredentials('performanceGlitchUser');
}

/**
 * Get all available user types
 * @returns Array of user type names
 */
export function getAllUserTypes(): string[] {
  return [
    'standardUser',
    'lockedOutUser',
    'problemUser',
    'performanceGlitchUser',
    'errorUser',
    'visualUser'
  ];
}

/**
 * Get all products
 * @returns Array of all products
 */
export function getAllProducts(): Product[] {
  return products.products;
}

/**
 * Get product by name
 * @param productName - Name of the product
 * @returns Product object or undefined if not found
 */
export function getProductByName(productName: string): Product | undefined {
  return products.products.find(p => p.name === productName);
}

/**
 * Get random product
 * @returns Random product object
 */
export function getRandomProduct(): Product {
  const allProducts = getAllProducts();
  if (allProducts.length === 0) {
    throw new Error('No products available');
  }
  const randomIndex = Math.floor(Math.random() * allProducts.length);
  return allProducts[randomIndex]!;
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
 * Get product names
 * @returns Array of product names
 */
export function getProductNames(): string[] {
  return getAllProducts().map(p => p.name);
}

/**
 * Get product price as number
 * @param productName - Name of the product
 * @returns Price as a number
 */
export function getProductPrice(productName: string): number {
  const product = getProductByName(productName);
  if (!product) {
    throw new Error(`Product "${productName}" not found`);
  }
  return parseFloat(product.price.replace('$', ''));
}

/**
 * Calculate total price for products
 * @param productNames - Array of product names
 * @returns Total price as a number
 */
export function calculateTotalPrice(productNames: string[]): number {
  let total = 0;
  for (const name of productNames) {
    total += getProductPrice(name);
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
 * Get error message by type
 * @param errorType - Type of error message
 * @returns Error message string
 */
export function getErrorMessage(errorType: string): string {
  const error = testData.errorMessages[errorType as keyof typeof testData.errorMessages];
  if (!error) {
    throw new Error(`Error type "${errorType}" not found in test-data.json`);
  }
  return error;
}

/**
 * Get success message by type
 * @param messageType - Type of success message
 * @returns Success message string
 */
export function getSuccessMessage(messageType: string): string {
  const message = testData.successMessages[messageType as keyof typeof testData.successMessages];
  if (!message) {
    throw new Error(`Message type "${messageType}" not found in test-data.json`);
  }
  return message;
}

/**
 * Get order complete message
 * @returns Order complete message
 */
export function getOrderCompleteMessage(): string {
  return getSuccessMessage('orderComplete');
}

/**
 * Get order dispatched message
 * @returns Order dispatched message
 */
export function getOrderDispatchedMessage(): string {
  return getSuccessMessage('orderDispatched');
}

/**
 * Format price string to number
 * @param priceString - Price string (e.g., "$29.99")
 * @returns Price as a number
 */
export function formatPriceToNumber(priceString: string): number {
  return parseFloat(priceString.replace('$', ''));
}

/**
 * Format number to price string
 * @param priceNumber - Price number
 * @returns Price string (e.g., "$29.99")
 */
export function formatNumberToPrice(priceNumber: number): string {
  return `$${priceNumber.toFixed(2)}`;
}

/**
 * Get environment variable
 * @param key - Environment variable key
 * @param defaultValue - Default value if not found
 * @returns Environment variable value
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable "${key}" not found`);
  }
  return value || defaultValue || '';
}

/**
 * Get base URL from environment
 * @returns Base URL
 */
export function getBaseUrl(): string {
  return getEnvVar('BASE_URL', 'https://www.saucedemo.com');
}

/**
 * Get default password from environment
 * @returns Default password
 */
export function getDefaultPassword(): string {
  return getEnvVar('PASSWORD', 'secret_sauce');
}

/**
 * Generate random string
 * @param length - Length of the string
 * @returns Random string
 */
export function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random email
 * @returns Random email address
 */
export function generateRandomEmail(): string {
  return `test${generateRandomString(8)}@example.com`;
}

/**
 * Generate random phone number
 * @returns Random phone number
 */
export function generateRandomPhoneNumber(): string {
  return `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
}
