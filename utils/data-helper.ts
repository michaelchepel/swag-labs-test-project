import products from '../data/products.json';
import testData from '../data/test-data.json';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export interface UserCredentials {
  username: string;
  password: string;
}

export interface Product {
  name: string;
  price: string;
  description: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export function getStandardUserCredentials(): UserCredentials {
  const username = process.env.STANDARD_USER || 'standard_user';
  const password = process.env.PASSWORD || 'secret_sauce';
  return { username, password };
}

export function getAllProducts(): Product[] {
  return products.products;
}

export function getRandomProducts(count: number): Product[] {
  const allProducts = [...getAllProducts()];
  const shuffled = allProducts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, allProducts.length));
}

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

export function getCheckoutInfo(): CheckoutInfo {
  return testData.checkoutInfo;
}

export function getOrderCompleteMessage(): string {
  return testData.successMessages.orderComplete;
}

export function getOrderDispatchedMessage(): string {
  return testData.successMessages.orderDispatched;
}
