# PetPals — User Requirements, User Stories, and Acceptance Criteria

This document describes **user-facing** requirements for the PetPals web application (pet products e-commerce), written from the perspective of end users and admins.

---

## 1. Personas

### 1.1 Guest (Unauthenticated Shopper)
A visitor who can browse products and marketing pages but is not signed in.

### 1.2 Customer (Authenticated Shopper)
A signed-in user who can manage profile, wishlist, checkout, and view orders.

### 1.3 Admin
A privileged user who manages products and orders and monitors store performance.

---

## 2. Glossary

- **Product**: An item for sale (food, toys, supplements) for cats/dogs/both.
- **Cart**: A temporary list of products and quantities the shopper intends to buy.
- **Order**: A confirmed purchase created from the cart.
- **Payment**: The payment record associated with an order (Midtrans Snap).
- **Wishlist**: A saved list of products a customer wants to revisit.
- **Order status**: Lifecycle state (e.g., PENDING → PROCESSING → SHIPPED → DELIVERED; CANCELLED).

---

## 3. User Requirements (User Point of View)

### UR-01 — Marketing & informational pages
**As a visitor**, I want to access informational pages so I can learn about the store and policies.

- Pages include: About, Contact, Privacy, Terms.

**Priority:** Medium

---

### UR-02 — Home page discovery
**As a visitor**, I want to see featured products and quick entry points so I can start shopping quickly.

- Home page highlights featured products.
- Home page provides curated sections for cat and dog products.
- Home page provides prominent navigation to the shop.

**Priority:** High

---

### UR-03 — Browse catalog (Shop)
**As a shopper**, I want to browse all products so I can discover items to buy.

- I can open a shop page that lists products.
- I can navigate through multiple pages of results.

**Priority:** High

---

### UR-04 — Filter, search, and sort products
**As a shopper**, I want to filter/search/sort products so I can find relevant items faster.

- Filter by category (Food, Toys, Supplements).
- Filter by pet (Cat, Dog, Both).
- Filter by price range.
- Search by keyword.
- Sort by price, rating, and newest.

**Priority:** High

---

### UR-05 — View product details
**As a shopper**, I want to view product details so I can decide whether to purchase.

- Product detail page shows name, price, description, rating, and imagery.
- Product detail page supports adding to cart.

**Priority:** High

---

### UR-06 — Cart management
**As a shopper**, I want to manage my cart so I can control what I’m buying.

- Add items to cart.
- Adjust quantities.
- Remove items.
- See updated totals.

**Priority:** High

---

### UR-07 — Checkout and shipping address
**As a shopper**, I want to enter shipping details and review totals so I can place an order.

- Provide shipping address (street, city, state, zip code, country).
- Review subtotal, tax, shipping, and total.

**Priority:** High

---

### UR-08 — Place order
**As a customer**, I want to place an order so my purchase is recorded and can be fulfilled.

- Order is created from cart items.
- Stock availability is validated.
- Order confirmation includes an order identifier.

**Priority:** High

---

### UR-09 — Pay for an order (Midtrans)
**As a customer**, I want to pay online so my order can be processed.

- Start payment from checkout.
- Return to the app after payment attempt.
- See payment/order status.

**Priority:** High

---

### UR-10 — View order history and details
**As a customer**, I want to view my orders so I can track purchases.

- View list of orders.
- View order details including items and totals.

**Priority:** High

---

### UR-11 — Wishlist
**As a customer**, I want to save products to a wishlist so I can buy them later.

- Add/remove products.
- View wishlist.

**Priority:** Medium

---

### UR-12 — Account registration and sign-in
**As a user**, I want to create an account and sign in so I can manage orders and wishlist.

- Sign up with name/email/password.
- Sign in with email/password.

**Priority:** High

---

### UR-13 — Profile management
**As a customer**, I want to view and update my profile so my account information is correct.

- View profile.
- Update display name.

**Priority:** Medium

---

### UR-14 — Password recovery
**As a user**, I want to reset my password if I forget it so I can regain access.

- Request password reset.
- Set a new password.

**Priority:** High

---

### UR-15 — Admin: Product management
**As an admin**, I want to manage products so the catalog stays accurate.

- Create products.
- Update products.
- Delete products.

**Priority:** High

---

### UR-16 — Admin: Order management
**As an admin**, I want to manage orders so fulfillment is controlled.

- View all orders.
- Filter orders by status.
- Update order status with valid transitions.

**Priority:** High

---

### UR-17 — Admin: Dashboard insights
**As an admin**, I want to see store metrics so I can monitor performance.

- Total orders, revenue, products, low-stock count.
- Recent orders.
- Chart-ready aggregates.

**Priority:** Medium

---

## 4. User Stories and Acceptance Criteria

> Notes:
> - Acceptance criteria are written in a testable format.
> - “Customer” implies authenticated user.
> - “Admin” implies authenticated user with admin role.

---

### US-01 — Navigate informational pages
**Story:** As a visitor, I want to access About/Contact/Privacy/Terms so I can understand the store and policies.

**Acceptance criteria**
- Given I am on the site, when I navigate to About, then I see the About page content.
- Given I am on the site, when I navigate to Contact, then I see the Contact page content.
- Given I am on the site, when I navigate to Privacy, then I see the Privacy policy content.
- Given I am on the site, when I navigate to Terms, then I see the Terms content.

---

### US-02 — Discover products from home
**Story:** As a visitor, I want to see featured and curated products on the home page so I can start shopping quickly.

**Acceptance criteria**
- Given I open the home page, then I see a featured products section.
- Given I open the home page, then I see curated sections for cat products and dog products.
- Given I click a “Shop” call-to-action, then I am taken to the shop page.

---

### US-03 — Browse the shop catalog
**Story:** As a shopper, I want to browse products so I can discover items to buy.

**Acceptance criteria**
- Given I open the shop page, then I see a list/grid of products.
- Given there are more products than fit on one page, when I navigate pagination, then I see the next/previous page of products.

---

### US-04 — Filter products by category and pet
**Story:** As a shopper, I want to filter products by category and pet so I can find relevant items.

**Acceptance criteria**
- Given I select a category filter, when results refresh, then only products in that category are shown.
- Given I select a pet filter, when results refresh, then only products matching that pet type are shown.
- Given I clear filters, when results refresh, then I see the full catalog again.

---

### US-05 — Search products
**Story:** As a shopper, I want to search products by keyword so I can find items quickly.

**Acceptance criteria**
- Given I enter a keyword, when I submit the search, then I see products whose name or description matches the keyword.
- Given no products match, then I see an empty state indicating no results.

---

### US-06 — Filter by price range
**Story:** As a shopper, I want to filter by price range so I can stay within budget.

**Acceptance criteria**
- Given I set a minimum price, then all shown products have price ≥ minimum.
- Given I set a maximum price, then all shown products have price ≤ maximum.
- Given I set both, then all shown products fall within the range.

---

### US-07 — Sort products
**Story:** As a shopper, I want to sort products so I can prioritize what matters to me.

**Acceptance criteria**
- Given I choose “Price: Low to High”, then products are ordered by ascending price.
- Given I choose “Price: High to Low”, then products are ordered by descending price.
- Given I choose “Rating”, then products are ordered by descending rating.
- Given I choose “Newest”, then newer products are prioritized.

---

### US-08 — View product details
**Story:** As a shopper, I want to open a product page so I can decide whether to buy.

**Acceptance criteria**
- Given I click a product, then I see a product detail page.
- Given I am on the product detail page, then I see name, price, and description.
- Given the product cannot be found, then I see a not-found/error state.

---

### US-09 — Add to cart
**Story:** As a shopper, I want to add products to my cart so I can purchase them.

**Acceptance criteria**
- Given I am viewing a product, when I click “Add to cart”, then the product appears in my cart.
- Given the product is already in my cart, when I add it again, then the quantity increases (or I am prompted to adjust quantity).

---

### US-10 — Update cart quantities
**Story:** As a shopper, I want to adjust quantities so I can buy the right amount.

**Acceptance criteria**
- Given an item is in my cart, when I increase quantity, then the cart updates and totals increase accordingly.
- Given an item is in my cart, when I decrease quantity, then the cart updates and totals decrease accordingly.
- Given I reduce quantity to zero (or click remove), then the item is removed from the cart.

---

### US-11 — Proceed to checkout
**Story:** As a shopper, I want to proceed to checkout so I can place my order.

**Acceptance criteria**
- Given my cart has items, when I click “Checkout”, then I am taken to the checkout page.
- Given my cart is empty, when I attempt checkout, then I am prevented and shown an appropriate message.

---

### US-12 — Enter shipping address
**Story:** As a shopper, I want to enter shipping details so my order can be delivered.

**Acceptance criteria**
- Given I am on checkout, when I enter shipping address fields, then the form accepts valid inputs.
- Given required fields are missing, then I am prompted to complete them before placing an order.

---

### US-13 — Place an order
**Story:** As a customer, I want to place an order so it is recorded for fulfillment.

**Acceptance criteria**
- Given I am signed in and my cart has items, when I place an order, then an order is created and I receive an order confirmation (order id).
- Given any cart item is out of stock, when I place an order, then I see an error indicating insufficient stock.
- Given a cart item no longer exists, when I place an order, then I see an error instructing me to clear/update my cart.

---

### US-14 — Review totals (subtotal/tax/shipping/total)
**Story:** As a shopper, I want to see a clear cost breakdown so I understand what I’m paying.

**Acceptance criteria**
- Given I am on checkout, then I can see subtotal, tax, shipping, and total.
- Given my subtotal meets the free-shipping threshold, then shipping cost is shown as 0.

---

### US-15 — Start payment (Midtrans)
**Story:** As a customer, I want to pay online so my order can be processed.

**Acceptance criteria**
- Given I have a pending order, when I start payment, then I am provided a payment token/redirect to the payment provider.
- Given I attempt to pay for a non-pending order, then I see an error indicating payment cannot be started.
- Given I return from the payment provider, then I see a success/failure/pending state.

---

### US-16 — Payment status updates
**Story:** As a customer, I want my order status to reflect payment outcomes so I know what happens next.

**Acceptance criteria**
- Given payment succeeds, then my order status becomes “Processing”.
- Given payment is pending, then my order remains “Pending”.
- Given payment fails/expires/cancels, then my order becomes “Cancelled”.

---

### US-17 — View my orders
**Story:** As a customer, I want to view my order history so I can track purchases.

**Acceptance criteria**
- Given I am signed in, when I open Orders, then I see a list of my orders.
- Given I open an order, then I see items, quantities, and totals.
- Given I try to access another user’s order, then access is denied.

---

### US-18 — Wishlist products
**Story:** As a customer, I want to wishlist products so I can revisit them later.

**Acceptance criteria**
- Given I am signed in, when I add a product to wishlist, then it appears in my wishlist.
- Given a product is already wishlisted, when I try to add it again, then I am prevented and informed.
- Given I remove a product from wishlist, then it no longer appears in my wishlist.

---

### US-19 — Sign up
**Story:** As a new user, I want to create an account so I can place orders and manage wishlist.

**Acceptance criteria**
- Given I provide name/email/password, when I submit sign-up, then my account is created.
- Given the email is already registered, when I submit sign-up, then I see an error indicating the email is in use.

---

### US-20 — Sign in
**Story:** As a returning user, I want to sign in so I can access my account.

**Acceptance criteria**
- Given I provide valid credentials, when I sign in, then I am authenticated and can access account features.
- Given credentials are invalid, when I sign in, then I see an error message.

---

### US-21 — View and update profile
**Story:** As a customer, I want to view and update my profile so my name is correct.

**Acceptance criteria**
- Given I am signed in, when I open Account, then I see my profile details.
- Given I update my name with a non-empty value, then the updated name is saved and displayed.

---

### US-22 — Forgot password
**Story:** As a user, I want to request a password reset so I can regain access.

**Acceptance criteria**
- Given I enter my email, when I request a reset, then I see a confirmation message.
- Given the email does not exist, then I still see the same confirmation message (to protect privacy).

---

### US-23 — Reset password
**Story:** As a user, I want to set a new password so I can sign in again.

**Acceptance criteria**
- Given I have a valid reset token, when I set a new password, then the password is updated.
- Given the token is invalid/expired, when I attempt reset, then I see an error and can request a new reset.

---

## 5. Admin Stories and Acceptance Criteria

### AS-01 — Admin product management
**Story:** As an admin, I want to create/update/delete products so the catalog stays accurate.

**Acceptance criteria**
- Given I am an admin, when I create a product with valid fields, then it appears in the catalog.
- Given I am an admin, when I update a product, then changes are reflected in the catalog.
- Given I am an admin, when I delete a product, then it is removed from the catalog.

---

### AS-02 — Admin view all orders
**Story:** As an admin, I want to view all orders so I can manage fulfillment.

**Acceptance criteria**
- Given I am an admin, when I open the admin orders page, then I see orders across all customers.
- Given I filter by status, then only orders with that status are shown.
- Given there are many orders, then I can paginate through results.

---

### AS-03 — Admin update order status
**Story:** As an admin, I want to update order status so I can reflect fulfillment progress.

**Acceptance criteria**
- Given I am an admin, when I change an order status using an allowed transition, then the status updates.
- Given I attempt an invalid transition, then I see an error and the status does not change.
- Given I cancel an order, then stock for its items is restored.

---

### AS-04 — Admin dashboard
**Story:** As an admin, I want to see store metrics so I can monitor performance.

**Acceptance criteria**
- Given I am an admin, when I open the dashboard, then I see total orders, total revenue, total products, and low-stock count.
- Given I open the dashboard, then I see recent orders.
- Given I open the dashboard, then I see chart-ready data for revenue/orders over time.

---

## 6. Non-functional requirements (NFRs)

### NFR-01 — Security & privacy
- Authentication is required for customer-only features (orders, wishlist, profile).
- Customers cannot access other customers’ orders.
- Password reset flow must not reveal whether an email exists.

### NFR-02 — Data integrity
- Order totals are computed server-side.
- Stock is validated at order creation.
- Stock is decremented on successful order creation and restored on cancellation.

### NFR-03 — Reliability
- Payment webhook acknowledges receipt even if internal processing fails, to prevent repeated provider retries.

### NFR-04 — Usability
- Empty states are shown for no search results, empty cart, and empty wishlist.
- Errors are presented in a user-understandable way.
