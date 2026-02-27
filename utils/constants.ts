/**
 * Application constants and common selectors for Swag Labs
 */

/**
 * Application URLs
 */
const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com';

export const APP_URLS = {
  BASE: BASE_URL,
  LOGIN: `${BASE_URL}/`,
  INVENTORY: `${BASE_URL}/inventory.html`,
  CART: `${BASE_URL}/cart.html`,
  CHECKOUT: `${BASE_URL}/checkout-step-one.html`,
  CHECKOUT_OVERVIEW: `${BASE_URL}/checkout-step-two.html`,
  CHECKOUT_COMPLETE: `${BASE_URL}/checkout-complete.html`,
} as const;

/**
 * Common timeout values (in milliseconds)
 */
export const TIMEOUTS = {
  DEFAULT: 30000,
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 60000,
  ELEMENT_LOAD: 5000,
  PAGE_LOAD: 30000,
} as const;

/**
 * Page titles
 */
export const PAGE_TITLES = {
  LOGIN: 'Swag Labs',
  INVENTORY: 'Swag Labs',
  CART: 'Swag Labs',
  CHECKOUT: 'Swag Labs',
  CHECKOUT_OVERVIEW: 'Swag Labs',
  CHECKOUT_COMPLETE: 'Swag Labs',
} as const;

/**
 * Common selectors (data-test attributes used by Swag Labs)
 */
export const SELECTORS = {
  // Common
  HEADER: '.header_container',
  TITLE: '.title',
  ERROR_MESSAGE: '[data-test="error"]',
  ERROR_BUTTON: '.error-button',

  // Login page
  USERNAME_INPUT: '[data-test="username"]',
  PASSWORD_INPUT: '[data-test="password"]',
  LOGIN_BUTTON: '[data-test="login-button"]',

  // Inventory page
  INVENTORY_LIST: '.inventory_list',
  INVENTORY_ITEM: '.inventory_item',
  INVENTORY_ITEM_NAME: '.inventory_item_name',
  INVENTORY_ITEM_PRICE: '.inventory_item_price',
  INVENTORY_ITEM_DESC: '.inventory_item_desc',
  ADD_TO_CART_BUTTON: '[data-test^="add-to-cart"]',
  REMOVE_BUTTON: '[data-test^="remove"]',
  SHOPPING_CART_LINK: '[data-test="shopping-cart-link"]',
  CART_BADGE: '[data-test="shopping-cart-badge"]',
  PRODUCT_SORT: '[data-test="product-sort-container"]',

  // Cart page
  CART_ITEMS: '.cart_item',
  CART_ITEM_NAME: '.inventory_item_name',
  CART_ITEM_PRICE: '.inventory_item_price',
  CART_ITEM_QUANTITY: '.cart_quantity',
  CART_ITEM_REMOVE: '[data-test^="remove"]',
  CHECKOUT_BUTTON: '[data-test="checkout"]',
  CONTINUE_SHOPPING_BUTTON: '[data-test="continue-shopping"]',

  // Checkout page
  FIRST_NAME_INPUT: '[data-test="firstName"]',
  LAST_NAME_INPUT: '[data-test="lastName"]',
  POSTAL_CODE_INPUT: '[data-test="postalCode"]',
  CONTINUE_BUTTON: '[data-test="continue"]',
  CANCEL_BUTTON: '[data-test="cancel"]',

  // Checkout overview page
  CHECKOUT_SUMMARY: '.summary_info',
  SUBTOTAL_LABEL: '.summary_subtotal_label',
  TAX_LABEL: '.summary_tax_label',
  TOTAL_LABEL: '.summary_total_label',
  FINISH_BUTTON: '[data-test="finish"]',
  CANCEL_CHECKOUT_BUTTON: '[data-test="cancel"]',

  // Checkout complete page
  COMPLETE_HEADER: '.complete-header',
  COMPLETE_TEXT: '.complete-text',
  BACK_HOME_BUTTON: '[data-test="back-to-products"]',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  LOCKED_OUT_USER: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match',
  EMPTY_USERNAME: 'Epic sadface: Username is required',
  EMPTY_PASSWORD: 'Epic sadface: Password is required',
  EMPTY_FIRST_NAME: 'Epic sadface: First Name is required',
  EMPTY_LAST_NAME: 'Epic sadface: Last Name is required',
  EMPTY_POSTAL_CODE: 'Epic sadface: Postal Code is required',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  ORDER_COMPLETE: 'Thank you for your order!',
  ORDER_DISPATCHED: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
} as const;

/**
 * Sort options
 */
export const SORT_OPTIONS = {
  NAME_A_TO_Z: 'az',
  NAME_Z_TO_A: 'za',
  PRICE_LOW_TO_HIGH: 'lohi',
  PRICE_HIGH_TO_LOW: 'hilo',
} as const;

/**
 * User types
 */
export const USER_TYPES = {
  STANDARD: 'standard_user',
  LOCKED_OUT: 'locked_out_user',
  PROBLEM: 'problem_user',
  PERFORMANCE_GLITCH: 'performance_glitch_user',
  ERROR: 'error_user',
  VISUAL: 'visual_user',
} as const;
