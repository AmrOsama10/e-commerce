# ShopAPI 🛒

A **full-featured e-commerce REST API** built with NestJS — handling everything from product management and order processing to payment integration and Google OAuth, built on a clean Repository Pattern architecture.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup/login with token-based auth
- 🔑 **Google OAuth** — Sign in with Google for a seamless user experience
- 🛍️ **Product Management** — Full CRUD for products with category and inventory support
- 🛒 **Cart & Orders** — Add to cart, place orders, and track order status
- 🏷️ **Coupon System** — Discount coupon validation and application at checkout
- 💳 **Paymob Integration** — Real payment gateway for card-based transactions
- ⭐ **Reviews & Ratings** — Users can review and rate purchased products
- 📁 **Repository Pattern** — Clean data access layer separating business logic from DB queries

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (TypeScript) |
| Database | MongoDB + Mongoose |
| Auth | JWT + Passport.js + Google OAuth |
| Payment | Paymob Payment Gateway |
| Architecture | Repository Pattern |

---

## 📁 Project Structure

```
src/
├── auth/           # JWT auth, Google OAuth, guards
├── users/          # User module & schema
├── products/       # Product CRUD & inventory
├── categories/     # Category management
├── cart/           # Cart logic
├── orders/         # Order placement & tracking
├── coupons/        # Coupon validation & discount logic
├── reviews/        # Product reviews & ratings
├── payment/        # Paymob integration & webhooks
└── common/         # Repository base, pipes, filters
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Paymob account (for payment integration)
- Google OAuth credentials

### Installation

```bash
git clone https://github.com/AmrOsama10/e-commerce.git
cd e-commerce
npm install
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=

DB_URL=

EMAIL=
PASSWORD=

JWT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

PAYMOB_API_KEY=
PAYMOB_INTEGRATION_ID=
PAYMOB_IFRAME_ID=
PAYMOB_HMAC_SECRET=
```

### Run the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

---

## 🧠 Architecture Overview

```
HTTP Request
     │
     ▼
Controller (Route Handler)
     │
     ▼
Service (Business Logic)
     │
     ▼
Repository (Data Access Layer)
     │
     ▼
Mongoose Model ──► MongoDB
```

---

## 💳 Payment Flow (Paymob)

```
User places order
     │
     ▼
Create Paymob order ──► Get payment token
     │
     ▼
Redirect to Paymob iframe (card payment)
     │
     ▼
Paymob webhook ──► Verify HMAC signature
     │
     ▼
Update order status in DB
```

---

## 📌 Key Technical Decisions

- **Repository Pattern** — Abstracts Mongoose queries behind a repository interface, making services cleaner and easier to test
- **Google OAuth** — Passport.js strategy handles the OAuth flow; new users are auto-registered on first Google login
- **Paymob Webhook Verification** — HMAC signature validation on every webhook to ensure payment events are authentic
- **Coupon Validation at Checkout** — Coupons are validated for expiry, usage limits, and minimum order value before being applied
- **Modular NestJS Structure** — Each domain (products, orders, payments) is a self-contained module with its own repository and service

---

## 👨‍💻 Author

**Amr Osama** — Backend Developer
[GitHub](https://github.com/AmrOsama10) · [LinkedIn](#)
