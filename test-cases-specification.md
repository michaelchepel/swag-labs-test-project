# High-Priority End-to-End Test Cases Specification

## Overview
This document defines 5 high-priority automation test cases designed to validate the core end-to-end functionality of the Swag Labs web application. Each test case follows the Given-When-Then format for clarity in automation script implementation.

---

## Test Case 1: Secure Login with Valid Credentials

### Test ID: TC-E2E-001
### Priority: P0 (Critical)
### Category: Authentication & Security

#### Description
Verifies that a user can successfully authenticate with valid credentials and access the main application interface securely.

#### Pre-Conditions
- Application is running and accessible at the base URL
- User has valid credentials (username and password)
- Browser is in a clean state (no active sessions)
- Network connection is stable

---

### Given-When-Then Structure

#### GIVEN
- The user is on the login page
- The login form is fully loaded and visible
- All form elements (username field, password field, login button) are accessible and enabled

#### WHEN
- The user enters a valid username in the username input field
- The user enters a valid password in the password input field
- The user clicks the "Login" button

#### THEN
- The user is successfully authenticated and redirected to the inventory page
- The inventory page is fully loaded within 3 seconds
- The URL contains the inventory path (`/inventory.html`)
- The cart icon is visible in the header
- The cart badge is hidden (indicating empty cart)
- All product items are displayed on the page (6 products)
- The user's session is established and active
- No error messages are displayed

---

### Execution Steps (Automation Script)

1. **Navigate to Login Page**
   - Open browser and navigate to base URL
   - Wait for login page to load completely
   - Verify page title contains "Swag Labs"

2. **Verify Login Page Elements**
   - Assert username input field is visible and enabled
   - Assert password input field is visible and enabled
   - Assert login button is visible and enabled
   - Assert login button text is "LOGIN"

3. **Enter Valid Credentials**
   - Clear username field (if needed)
   - Type valid username: `standard_user`
   - Clear password field (if needed)
   - Type valid password: `secret_sauce`

4. **Submit Login Form**
   - Click login button
   - Wait for navigation to complete

5. **Verify Successful Login**
   - Assert current URL contains `/inventory.html`
   - Assert inventory page is loaded
   - Assert cart icon is visible in header
   - Assert cart badge is not visible (empty cart)
   - Assert at least 1 product is displayed
   - Assert no error message is visible

---

### Verification Criteria

| Checkpoint | Expected Result | Validation Method |
|------------|----------------|-------------------|
| Page Navigation | Redirected to inventory page | URL assertion |
| Page Load Time | < 3 seconds | Performance timing |
| Product Display | 6 products visible | Element count |
| Cart Visibility | Cart icon visible, badge hidden | Element visibility |
| Session State | User authenticated | Cookie/token check |
| Error Messages | None displayed | Element absence |

---

### Test Data

| Parameter | Value | Source |
|-----------|-------|--------|
| Username | `standard_user` | credentials.json |
| Password | `secret_sauce` | credentials.json |
| Expected URL | `/inventory.html` | constants.ts |
| Product Count | 6 | products.json |

---

### Edge Cases & Considerations
- Invalid credentials should show appropriate error message
- Empty fields should trigger validation errors
- Locked out user should receive specific error message
- Session timeout handling
- Multiple concurrent login attempts

---

## Test Case 2: Browse Products and Add to Cart

### Test ID: TC-E2E-002
### Priority: P0 (Critical)
### Category: Navigation & Product Selection

#### Description
Verifies that a logged-in user can browse available products, view product details, and successfully add items to their shopping cart.

#### Pre-Conditions
- User is successfully logged in with valid credentials
- User is on the inventory page
- Cart is empty initially
- All products are available and in stock

---

### Given-When-Then Structure

#### GIVEN
- The user is logged into the application
- The user is on the inventory/products page
- The inventory displays all available products
- The cart is empty (cart badge not visible)

#### WHEN
- The user browses through the product list
- The user views product details (name, price, description)
- The user selects 2-3 products to purchase
- The user clicks "Add to cart" button for each selected product

#### THEN
- Each product is successfully added to the cart
- Cart badge appears in the header
- Cart badge count matches the number of added items
- "Add to cart" button changes to "Remove" for added products
- Product information remains accurate and consistent
- Cart items persist when navigating between pages
- No errors or unexpected behavior occurs

---

### Execution Steps (Automation Script)

1. **Verify Initial State**
   - Assert inventory page is loaded
   - Assert cart badge is not visible (empty cart)
   - Get list of all available products

2. **Browse and Verify Products**
   - Iterate through each product
   - Assert product name is displayed
   - Assert product price is displayed and valid format
   - Assert product description is displayed
   - Assert product image is visible
   - Assert "Add to cart" button is visible and enabled

3. **Select and Add Products**
   - Select first product (e.g., "Sauce Labs Backpack")
   - Click "Add to cart" button
   - Wait for cart badge to appear
   - Assert cart badge count is 1
   - Assert button changed to "Remove"

   - Select second product (e.g., "Sauce Labs Bike Light")
   - Click "Add to cart" button
   - Assert cart badge count is 2
   - Assert button changed to "Remove"

   - Select third product (e.g., "Sauce Labs Bolt T-Shirt")
   - Click "Add to cart" button
   - Assert cart badge count is 3
   - Assert button changed to "Remove"

4. **Verify Cart Persistence**
   - Navigate to cart page
   - Verify all 3 products are in cart
   - Return to inventory page
   - Verify cart badge still shows count of 3
   - Verify "Remove" buttons persist for added products

5. **Verify Product Details Accuracy**
   - For each added product, verify:
     - Name matches inventory display
     - Price matches inventory display
     - Description matches inventory display

---

### Verification Criteria

| Checkpoint | Expected Result | Validation Method |
|------------|----------------|-------------------|
| Product Display | All products visible with complete info | Element count & content |
| Add to Cart | Items added successfully | Cart badge increment |
| Button State | "Add to cart" → "Remove" | Button text assertion |
| Cart Badge | Accurate count displayed | Number comparison |
| Cart Persistence | Items persist across navigation | Cart page verification |
| Product Accuracy | Details match inventory | Data comparison |

---

### Test Data

| Parameter | Value | Source |
|-----------|-------|--------|
| Product 1 | "Sauce Labs Backpack" | products.json |
| Product 2 | "Sauce Labs Bike Light" | products.json |
| Product 3 | "Sauce Labs Bolt T-Shirt" | products.json |
| Expected Cart Count | 3 | Calculation |
| Button Text (Add) | "Add to cart" | constants.ts |
| Button Text (Remove) | "Remove" | constants.ts |

---

### Edge Cases & Considerations
- Adding duplicate products (should not increment count)
- Removing products from cart
- Adding all available products
- Product availability changes
- Network interruptions during add operation
- Concurrent cart operations

---

## Test Case 3: Complete Purchase Transaction

### Test ID: TC-E2E-003
### Priority: P0 (Critical)
### Category: Transaction Completion

#### Description
Verifies the complete end-to-end purchase flow from adding products to cart, providing checkout information, reviewing order, and completing the transaction.

#### Pre-Conditions
- User is logged in with valid credentials
- User has added at least 2 products to cart
- User has valid checkout information (name, address, postal code)
- Payment processing system is operational

---

### Given-When-Then Structure

#### GIVEN
- The user is logged into the application
- The user has 2-3 products in their shopping cart
- The cart badge shows the correct number of items
- The user is on the inventory page

#### WHEN
- The user clicks the cart icon to view cart
- The user reviews items in the cart
- The user clicks "Checkout" button
- The user fills in checkout form with valid information
  - First Name: valid name
  - Last Name: valid name
  - Postal Code: valid postal code
- The user clicks "Continue" to proceed
- The user reviews order summary on checkout overview page
- The user clicks "Finish" to complete purchase
- The user views order completion confirmation

#### THEN
- Cart page displays all added products correctly
- Checkout form validation accepts valid information
- Checkout overview page shows accurate order summary
  - All items listed correctly
  - Subtotal calculated correctly
  - Tax calculated correctly
  - Total calculated correctly (subtotal + tax)
- Order is successfully completed
- Checkout complete page displays success message
- Success header: "THANK YOU FOR YOUR ORDER"
- Success text: "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
- Cart is cleared after order completion
- User can return to products page
- Order confirmation is generated

---

### Execution Steps (Automation Script)

1. **Navigate to Cart**
   - Click cart icon in header
   - Wait for cart page to load
   - Assert cart page is loaded

2. **Verify Cart Contents**
   - Get list of cart items
   - Assert expected number of items (2-3)
   - Verify each item's name, price, and quantity
   - Calculate expected subtotal

3. **Initiate Checkout**
   - Click "Checkout" button
   - Wait for checkout page to load
   - Assert checkout page is loaded

4. **Fill Checkout Form**
   - Enter first name: "John"
   - Enter last name: "Doe"
   - Enter postal code: "12345"
   - Assert all fields are filled

5. **Proceed to Order Review**
   - Click "Continue" button
   - Wait for checkout overview page to load
   - Assert checkout overview page is loaded

6. **Verify Order Summary**
   - Verify all items are listed in order summary
   - Verify item names match cart
   - Verify item prices match cart
   - Get and verify subtotal matches calculation
   - Get and verify tax is calculated (8% of subtotal)
   - Get and verify total equals subtotal + tax
   - Verify payment information is displayed
   - Verify shipping information is displayed

7. **Complete Purchase**
   - Click "Finish" button
   - Wait for checkout complete page to load
   - Assert checkout complete page is loaded

8. **Verify Order Completion**
   - Assert success header: "THANK YOU FOR YOUR ORDER"
   - Assert success text contains "dispatched"
   - Assert order completion image is displayed
   - Assert "Back Home" button is visible

9. **Verify Cart Cleared**
   - Click "Back Home" button
   - Wait for inventory page to load
   - Assert cart badge is not visible (cart empty)
   - Assert user is back on inventory page

---

### Verification Criteria

| Checkpoint | Expected Result | Validation Method |
|------------|----------------|-------------------|
| Cart Display | All items visible with correct details | Element count & content |
| Checkout Form | Accepts valid input | Form submission |
| Order Summary | Accurate item list | Data comparison |
| Subtotal | Correct calculation | Math verification |
| Tax | 8% of subtotal | Math verification |
| Total | Subtotal + Tax | Math verification |
| Success Message | "THANK YOU FOR YOUR ORDER" | Text assertion |
| Cart State | Empty after completion | Badge absence |
| Navigation | Returns to inventory | URL assertion |

---

### Test Data

| Parameter | Value | Source |
|-----------|-------|--------|
| First Name | "John" | test-data.json |
| Last Name | "Doe" | test-data.json |
| Postal Code | "12345" | test-data.json |
| Tax Rate | 8% | constants.ts |
| Success Header | "THANK YOU FOR YOUR ORDER" | constants.ts |
| Success Text | "Your order has been dispatched..." | constants.ts |

---

### Edge Cases & Considerations
- Empty checkout form fields should show validation errors
- Invalid postal code format
- Network timeout during checkout
- Payment processing failures
- Concurrent checkout attempts
- Cart modifications during checkout process

---

## Test Case 4: Sort and Filter Products

### Test ID: TC-E2E-004
### Priority: P1 (High)
### Category: Navigation & Product Discovery

#### Description
Verifies that users can sort products by different criteria (name A-Z, name Z-A, price low to high, price high to low) and that the sorting functionality works correctly.

#### Pre-Conditions
- User is logged in with valid credentials
- User is on the inventory page
- All products are available and displayed
- Products have varying names and prices

---

### Given-When-Then Structure

#### GIVEN
- The user is logged into the application
- The user is on the inventory page
- The product sort dropdown is visible and accessible
- All 6 products are displayed on the page

#### WHEN
- The user clicks the product sort dropdown
- The user selects "Name (A to Z)" sort option
- The user observes the product list order
- The user clicks the product sort dropdown again
- The user selects "Name (Z to A)" sort option
- The user observes the product list order
- The user clicks the product sort dropdown again
- The user selects "Price (low to high)" sort option
- The user observes the product list order
- The user clicks the product sort dropdown again
- The user selects "Price (high to low)" sort option
- The user observes the product list order

#### THEN
- Products are sorted alphabetically by name (A to Z)
  - First product: "Sauce Labs Backpack"
  - Last product: "Test.allTheThings() T-Shirt (Red)"
- Products are sorted alphabetically by name (Z to A)
  - First product: "Test.allTheThings() T-Shirt (Red)"
  - Last product: "Sauce Labs Backpack"
- Products are sorted by price ascending (low to high)
  - First product: "$7.99" (Sauce Labs Onesie)
  - Last product: "$49.99" (Sauce Labs Fleece Jacket)
- Products are sorted by price descending (high to low)
  - First product: "$49.99" (Sauce Labs Fleece Jacket)
  - Last product: "$7.99" (Sauce Labs Onesie)
- All products remain visible after each sort
- Product count remains constant (6 products)
- Product details (name, price, description) remain accurate
- No products are lost or duplicated during sorting
- Sorting is instantaneous or completes within 2 seconds

---

### Execution Steps (Automation Script)

1. **Verify Initial State**
   - Assert inventory page is loaded
   - Get initial list of all products
   - Assert 6 products are displayed
   - Verify sort dropdown is visible

2. **Sort by Name (A to Z)**
   - Click sort dropdown
   - Select "Name (A to Z)" option
   - Wait for products to re-sort
   - Get sorted product list
   - Verify products are sorted alphabetically A to Z
   - Assert first product name is "Sauce Labs Backpack"
   - Assert last product name contains "Test.allTheThings()"

3. **Sort by Name (Z to A)**
   - Click sort dropdown
   - Select "Name (Z to A)" option
   - Wait for products to re-sort
   - Get sorted product list
   - Verify products are sorted alphabetically Z to A
   - Assert first product name contains "Test.allTheThings()"
   - Assert last product name is "Sauce Labs Backpack"

4. **Sort by Price (Low to High)**
   - Click sort dropdown
   - Select "Price (low to high)" option
   - Wait for products to re-sort
   - Get sorted product list with prices
   - Verify products are sorted by price ascending
   - Assert first product price is "$7.99"
   - Assert last product price is "$49.99"
   - Verify each subsequent product price >= previous

5. **Sort by Price (High to Low)**
   - Click sort dropdown
   - Select "Price (high to low)" option
   - Wait for products to re-sort
   - Get sorted product list with prices
   - Verify products are sorted by price descending
   - Assert first product price is "$49.99"
   - Assert last product price is "$7.99"
   - Verify each subsequent product price <= previous

6. **Verify Product Integrity**
   - After each sort, verify:
     - All 6 products are still displayed
     - No products are duplicated
     - Product names remain accurate
     - Product prices remain accurate
     - Product descriptions remain accurate

7. **Verify Cart State**
   - Assert cart state is not affected by sorting
   - Cart badge count remains unchanged

---

### Verification Criteria

| Checkpoint | Expected Result | Validation Method |
|------------|----------------|-------------------|
| Sort A-Z | Alphabetical order | String comparison |
| Sort Z-A | Reverse alphabetical | String comparison |
| Sort Low-High | Ascending price | Numeric comparison |
| Sort High-Low | Descending price | Numeric comparison |
| Product Count | 6 products constant | Element count |
| Product Data | Accurate and consistent | Data validation |
| Sort Performance | < 2 seconds | Performance timing |
| Cart State | Unaffected | Badge count check |

---

### Test Data

| Parameter | Value | Source |
|-----------|-------|--------|
| Total Products | 6 | products.json |
| Sort Option 1 | "Name (A to Z)" | constants.ts |
| Sort Option 2 | "Name (Z to A)" | constants.ts |
| Sort Option 3 | "Price (low to high)" | constants.ts |
| Sort Option 4 | "Price (high to low)" | constants.ts |
| Min Price | $7.99 | products.json |
| Max Price | $49.99 | products.json |
| First Product (A-Z) | "Sauce Labs Backpack" | products.json |
| Last Product (A-Z) | "Test.allTheThings() T-Shirt (Red)" | products.json |

---

### Edge Cases & Considerations
- Products with same name (should sort by secondary criteria)
- Products with same price (should sort by name)
- Empty product list
- Single product in list
- Rapid sort option changes
- Network latency during sort operation

---

## Test Case 5: Cart Management and Checkout Validation

### Test ID: TC-E2E-005
### Priority: P0 (Critical)
### Category: Cart Operations & Validation

#### Description
Verifies comprehensive cart management functionality including adding/removing items, updating quantities, viewing cart details, and validating checkout form inputs.

#### Pre-Conditions
- User is logged in with valid credentials
- User is on the inventory page
- Cart is empty initially
- Multiple products are available for selection

---

### Given-When-Then Structure

#### GIVEN
- The user is logged into the application
- The user is on the inventory page
- The cart is empty (cart badge not visible)
- Multiple products are available for selection

#### WHEN
- The user adds 3 different products to the cart
- The user navigates to the cart page
- The user views cart item details
- The user removes 1 product from the cart
- The user returns to inventory page
- The user adds 1 more product to the cart
- The user navigates to cart page again
- The user clicks "Checkout" button
- The user attempts to submit checkout form with empty first name
- The user fills in valid first name and attempts with empty last name
- The user fills in valid last name and attempts with empty postal code
- The user fills in valid postal code and submits form
- The user reviews order summary
- The user cancels checkout and returns to cart
- The user proceeds to checkout again and completes purchase

#### THEN
- Cart badge shows count of 3 after initial adds
- Cart page displays all 3 products with correct details
- Cart shows correct subtotal calculation
- After removing 1 product, cart badge shows count of 2
- Removed product is no longer in cart
- After adding 1 more product, cart badge shows count of 3
- Checkout form validation prevents submission with empty first name
  - Error message: "Error: First Name is required"
- Checkout form validation prevents submission with empty last name
  - Error message: "Error: Last Name is required"
- Checkout form validation prevents submission with empty postal code
  - Error message: "Error: Postal Code is required"
- With all fields valid, user proceeds to checkout overview
- Order summary displays correct items and totals
- Cancel checkout returns user to cart page
- Cart items persist after cancel
- Final checkout completes successfully
- Order confirmation is displayed
- Cart is cleared after successful purchase

---

### Execution Steps (Automation Script)

1. **Add Initial Products**
   - Navigate to inventory page
   - Add product 1: "Sauce Labs Backpack"
   - Assert cart badge count = 1
   - Add product 2: "Sauce Labs Bike Light"
   - Assert cart badge count = 2
   - Add product 3: "Sauce Labs Bolt T-Shirt"
   - Assert cart badge count = 3

2. **Navigate to Cart and Verify**
   - Click cart icon
   - Wait for cart page to load
   - Assert cart page is loaded
   - Get cart items list
   - Assert 3 items in cart
   - Verify each item's name, price, and quantity
   - Calculate and verify subtotal

3. **Remove Product from Cart**
   - Click "Remove" button for product 2
   - Assert cart item count = 2
   - Assert product 2 is no longer in cart
   - Verify remaining items are product 1 and product 3

4. **Return to Inventory and Add More**
   - Click "Continue Shopping" button
   - Assert inventory page is loaded
   - Assert cart badge count = 2
   - Add product 4: "Sauce Labs Fleece Jacket"
   - Assert cart badge count = 3

5. **Navigate to Cart and Initiate Checkout**
   - Click cart icon
   - Wait for cart page to load
   - Assert cart page is loaded
   - Assert 3 items in cart
   - Click "Checkout" button
   - Wait for checkout page to load
   - Assert checkout page is loaded

6. **Validate Empty First Name**
   - Leave first name empty
   - Enter last name: "Doe"
   - Enter postal code: "12345"
   - Click "Continue" button
   - Assert error message is visible
   - Assert error text: "Error: First Name is required"
   - Assert user remains on checkout page

7. **Validate Empty Last Name**
   - Enter first name: "John"
   - Clear last name
   - Keep postal code: "12345"
   - Click "Continue" button
   - Assert error message is visible
   - Assert error text: "Error: Last Name is required"
   - Assert user remains on checkout page

8. **Validate Empty Postal Code**
   - Keep first name: "John"
   - Keep last name: "Doe"
   - Clear postal code
   - Click "Continue" button
   - Assert error message is visible
   - Assert error text: "Error: Postal Code is required"
   - Assert user remains on checkout page

9. **Submit Valid Checkout Form**
   - Keep first name: "John"
   - Keep last name: "Doe"
   - Enter postal code: "12345"
   - Click "Continue" button
   - Wait for checkout overview page to load
   - Assert checkout overview page is loaded

10. **Review Order Summary**
    - Verify all 3 items are listed
    - Verify item names match cart
    - Verify item prices match cart
    - Verify subtotal calculation
    - Verify tax calculation
    - Verify total calculation

11. **Cancel Checkout**
    - Click "Cancel" button
    - Wait for cart page to load
    - Assert cart page is loaded
    - Assert 3 items still in cart
    - Verify cart items persist

12. **Complete Purchase**
    - Click "Checkout" button
    - Fill form: "John", "Doe", "12345"
    - Click "Continue" button
    - Click "Finish" button
    - Wait for checkout complete page to load
    - Assert success message displayed
    - Click "Back Home" button
    - Assert cart badge not visible (cart empty)

---

### Verification Criteria

| Checkpoint | Expected Result | Validation Method |
|------------|----------------|-------------------|
| Add to Cart | Items added, badge updates | Count increment |
| Cart Display | All items with correct details | Data validation |
| Remove Item | Item removed, badge updates | Count decrement |
| Cart Persistence | Items persist after navigation | State verification |
| Empty First Name | Error: "First Name is required" | Error message |
| Empty Last Name | Error: "Last Name is required" | Error message |
| Empty Postal Code | Error: "Postal Code is required" | Error message |
| Valid Form | Proceeds to overview | Navigation |
| Order Summary | Accurate items and totals | Calculation |
| Cancel Checkout | Returns to cart, items persist | State preservation |
| Complete Purchase | Success message, cart cleared | Final state |

---

### Test Data

| Parameter | Value | Source |
|-----------|-------|--------|
| Product 1 | "Sauce Labs Backpack" | products.json |
| Product 2 | "Sauce Labs Bike Light" | products.json |
| Product 3 | "Sauce Labs Bolt T-Shirt" | products.json |
| Product 4 | "Sauce Labs Fleece Jacket" | products.json |
| First Name | "John" | test-data.json |
| Last Name | "Doe" | test-data.json |
| Postal Code | "12345" | test-data.json |
| Error: First Name | "Error: First Name is required" | constants.ts |
| Error: Last Name | "Error: Last Name is required" | constants.ts |
| Error: Postal Code | "Error: Postal Code is required" | constants.ts |

---

### Edge Cases & Considerations
- Adding same product multiple times
- Removing all products from cart
- Cart with single item
- Cart with maximum items
- Special characters in form fields
- Very long text in form fields
- Form submission with whitespace-only values
- Network timeout during checkout
- Browser back button during checkout process

---

## Summary

### Test Coverage Matrix

| Test Case | Priority | Category | Key Features Validated |
|-----------|----------|----------|----------------------|
| TC-E2E-001 | P0 | Authentication | Secure login, session management, error handling |
| TC-E2E-002 | P0 | Navigation | Product browsing, add to cart, cart persistence |
| TC-E2E-003 | P0 | Transaction | Complete purchase flow, order processing, confirmation |
| TC-E2E-004 | P1 | Discovery | Product sorting, navigation, data integrity |
| TC-E2E-005 | P0 | Cart Management | Cart operations, form validation, checkout flow |

### Execution Order Recommendation

1. **TC-E2E-001** - Login (must be first - prerequisite for all other tests)
2. **TC-E2E-002** - Browse and Add to Cart (builds on login)
3. **TC-E2E-004** - Sort and Filter (independent, can run parallel with TC-E2E-002)
4. **TC-E2E-005** - Cart Management (builds on cart operations)
5. **TC-E2E-003** - Complete Purchase (end-to-end validation)

### Automation Implementation Notes

- Use Page Object Model pattern for maintainability
- Implement proper wait strategies (explicit waits over implicit)
- Add retry logic for flaky network operations
- Include screenshot capture on failures
- Log all actions and assertions for debugging
- Use data-driven approach for test data management
- Implement test data cleanup between tests
- Add performance metrics collection
- Support parallel test execution where possible

### Success Criteria

All 5 test cases must pass with:
- 100% assertion success rate
- No critical or high-priority defects
- Test execution time within acceptable limits (< 5 minutes total)
- Stable and reproducible results across multiple runs
- Proper error handling and logging
- Clear failure diagnostics

---

**Document Version:** 1.0
**Last Updated:** 2025-02-27
**Author:** Test Automation Team
**Status:** Ready for Implementation
