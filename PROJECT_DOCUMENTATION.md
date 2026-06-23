# ur.url - System Documentation

This document contains a comprehensive, complete reference of the **ur.url** codebase. It covers the project architecture, detailed database schemas, authentication workflows, complete API routes, view templates, configuration details, and development guides.

---

## 1. Project Overview & Features
**ur.url** is a Node.js & Express-based URL-shortening web application that lets registered users shrink destination links, track click counts, and manage their links through a dashboard.

### Core Features:
- **JWT-Based Authentication**: Secure cookie sessions utilizing JWT.
- **Email OTP Verification**: Two-step email verification via Nodemailer/SMTP for account signup and password recovery.
- **Dynamic Short URLs & Custom Aliases**: Users can let the system generate random 8-character strings, or specify their own alphanumeric slugs (3–30 characters).
- **Real-Time Analytics**: Tracks total visits (`visitCount`) for shortened links.
- **Interactive Dashboard**:
  - Search/filter shortened URLs client-side.
  - Interactive clipboard copy tool.
  - Instant scannable QR Code generation.
  - Live modal prompt deletions.
  - Dual-theme system (Light/Dark mode syncs with `localStorage`).

---

## 2. Directory & Codebase Structure

```
d:/AllProjects (almost)/SEM6FS/urlShortner/
├── .env                  # Project environment variables
├── .gitignore            # Git exclusion file
├── vercel.json           # Vercel serverless functions configuration
├── index.js              # Server bootstrapper & application configuration
├── package.json          # Node dependencies and project scripts
├── controllers/          # Business logic handlers
│   ├── staticController.js
│   ├── urlController.js
│   └── userController.js
├── css/                  # Styling files (legacy or login specific)
│   └── login.css
├── middlewares/          # Request pre-processors and authentication guards
│   └── userAccess.js
├── models/               # MongoDB Mongoose Schema definitions
│   ├── urlModel.js
│   └── userModel.js
├── public/               # Static assets folder
│   ├── favicon.svg
│   └── css/
│       └── style.css     # Core responsive modern stylesheets
├── routes/               # Express routing controllers
│   ├── staticRoute.js
│   ├── urlRoute.js
│   └── userRoute.js
├── service/              # Utility services
│   ├── auth.js           # JWT signing/validation routines
│   └── mailService.js    # SMTP Nodemailer integration for OTPs
└── views/                # EJS template templates
    ├── 404.ejs           # Not Found error display page
    ├── index.ejs         # Legacy simplistic landing page (inactive)
    ├── landing.ejs       # Premium public landing page
    ├── dashboard.ejs     # User statistics, control panel & link database
    ├── login.ejs         # User sign-in interface
    ├── signup.ejs        # User registration interface
    ├── verify-otp.ejs    # OTP prompt for email verification
    ├── forgot-password.ejs # Account lookup for password recovery
    └── reset-password.ejs  # OTP and Password override input fields
```

---

## 3. Database Models & Schema Definitions

The application connects to a MongoDB database using **Mongoose**.

### 3.1. User Model (`models/userModel.js`)
Stores account credentials, verification state, and temporary validation codes.

* **Collection Name**: `users`
* **Schema Schema**:
  ```javascript
  {
      username: {
          type: String,
          required: true
      },
      email: {
          type: String,
          required: true,
          unique: true
      },
      password: {
          type: String,
          required: true // Bcrypt hashed password
      },
      isVerified: {
          type: Boolean,
          default: false
      },
      otp: {
          code: String,    // 6-digit verification / reset numeric code
          expiry: Date,    // Verification expiry timestamp (10 minutes)
          purpose: {
              type: String,
              enum: ['verification', 'reset']
          }
      }
  }
  ```
* **Timestamps**: Enabled (`createdAt`, `updatedAt` are auto-populated).

### 3.2. URL Model (`models/urlModel.js`)
Keeps records of shortened links and metadata about their usage.

* **Collection Name**: `urls`
* **Schema Schema**:
  ```javascript
  {
      original_url: {
          type: String,
          required: true
      },
      short_url: {
          type: String,
          required: true,
          unique: true
      },
      visitCount: {
          type: Number,
          required: true,
          default: 0
      },
      createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users"
      }
  }
  ```
* **Timestamps**: Enabled (`createdAt`, `updatedAt` are auto-populated).

---

## 4. Middlewares (`middlewares/userAccess.js`)

Used to protect specific endpoints or check login cookies.

* **`validUser(req, res, next)`**:
  - Reads `req.cookies.uid` token.
  - Verifies token via JWT. If valid, attaches user context to `req.user` and calls `next()`.
  - If token is missing, expired, or invalid, forces redirect to `/login`.
* **`checkAuth(req, res, next)`**:
  - Non-blocking credentials extraction.
  - Reads `req.cookies.uid` token.
  - Decodes user session. Attaches data to `req.user` (or `null` if guest) and invokes `next()`.

---

## 5. System Services

### 5.1. Authentication Service (`service/auth.js`)
Manages JSON Web Tokens (JWT) for session creation and parsing.

* **Token Payload**: `{ _id, username, email }`
* **Expiration**: `12h`
* **Session Cookie**: Cookie named `uid` with a maxAge of 12 hours. Uses the environment variable `SECRET_KEY` for verification/signing.

### 5.2. Email Mailer Service (`service/mailService.js`)
Sends OTP emails via the **Resend API** using native `fetch`. Nodemailer/SMTP has been fully removed.

* **Configuration**:
  - `RESEND_API_KEY`: API key for the Resend service.
* **`sendOtpMail(toEmail, otpCode, purpose)`**:
  - Sends a modern HTML-formatted message containing a 6-digit OTP code.
  - Adapts content based on `purpose` (`'verification'` vs `'reset'`).
  - Codes are marked to expire within 10 minutes.

---

## 6. Route Handler & Controller Specifications

### 6.1. HTML Views Routes (`routes/staticRoute.js` -> `controllers/staticController.js`)

| HTTP Method | Route | Middleware | Controller Function | Renders View | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | `checkAuth` | `showHomePage` | `dashboard` or `landing` | Renders `dashboard.ejs` with user links if logged in, otherwise renders `landing.ejs` guest interface. |
| **GET** | `/signup` | *None* | `showSignUp` | `signup` | Registration interface. |
| **GET** | `/login` | *None* | `showLogIn` | `login` | Sign-in interface. |
| **GET** | `/verify-otp`| *None* | `showVerifyOtp` | `verify-otp` | Prompts input for 6-digit OTP code. Requires `email` query param. |
| **GET** | `/forgot-password` | *None* | `showForgotPassword` | `forgot-password` | Form to trigger password recovery email. |
| **GET** | `/reset-password` | *None* | `showResetPassword` | `reset-password` | Page to submit OTP code and override password. Requires `email` query param. |

---

### 6.2. User Management API (`routes/userRoute.js` -> `controllers/userController.js`)

#### `POST /user/signup`
* Registers new accounts.
* **Fields**: `username`, `email`, `password`, `confirmPassword`.
* **Flow**:
  1. Validates matches & presence.
  2. Hashes password using Bcrypt.
  3. If user exists but is not verified: updates password/username and fires a fresh OTP.
  4. If user does not exist: writes new user with `isVerified: false` and OTP config.
  5. Relays SMTP mail. Redirects to `/verify-otp?email=...`.

#### `POST /user/login`
* Authenticates and logs in users.
* **Fields**: `email`, `password`.
* **Flow**:
  1. Authenticates against user model.
  2. Compares Bcrypt hash.
  3. If credentials match but user is **unverified**: Generates a fresh OTP, emails user, and redirects to `/verify-otp` with alert.
  4. If verified: sets the `uid` session cookie and redirects to `/`.

#### `GET /user/logout`
* Logs out users by executing `res.clearCookie("uid")` and redirecting to `/`.

#### `POST /user/verify-otp`
* Checks validation OTP.
* **Fields**: `email`, `otp`.
* **Flow**:
  1. Validates OTP values and checks expiration.
  2. Flags user `isVerified: true` and clears the OTP configuration.
  3. Configures JWT cookie session and redirects to `/`.

#### `GET /user/resend-otp`
* Regens and emails a fresh OTP validation code. Requires `email` via request query or body.

#### `POST /user/forgot-password`
* Triggers password reset code request.
* **Fields**: `email`.
* **Flow**: Generates OTP of purpose `'reset'`, updates schema, sends email alert, and redirects to `/reset-password?email=...`.

#### `POST /user/reset-password`
* Processes password override.
* **Fields**: `email`, `otp`, `password`, `confirmPassword`.
* **Flow**: Verifies OTP purpose `'reset'`, hashes new password, sets password field, deletes otp field, and redirects to `/login` with success banner.

---

### 6.3. URL Management API (`routes/urlRoute.js` -> `controllers/urlController.js`)

#### `POST /url`
* Shortens a long URL destination.
* **Middleware**: `validUser`
* **Fields**: `oriurl`, `customAlias` (optional).
* **Flow**:
  1. Validates format. Automatically prepends `https://` if protocol prefix is missing.
  2. If `customAlias` is passed: validates alphanumeric format (3-30 chars). Confirms availability in DB.
  3. If no alias is passed: loops to generate a unique random 8-character ID.
  4. Saves schema setting `createdBy` to `req.user._id` and redirects to `/` with success message.

#### `GET /url/:shortUrl`
* Resolves short URLs and redirects.
* **Flow**:
  1. Searches for `short_url`.
  2. Atomically increments `visitCount` by 1 using Mongoose `$inc`.
  3. Redirects browser to `original_url`. Renders `404.ejs` if code is missing.

#### `DELETE /url/:id`
* Deletes shortened URL records.
* **Middleware**: `validUser`
* **Flow**:
  1. Finds target link.
  2. Validates that the request owner matches the creator's ID.
  3. Deletes record and returns `{ success: true }`.

---

## 7. Client UI Design & Templates (`views/`)

* **Primary Stylesheet**: `public/css/style.css`.
  - Tailored color palette utilizing HSL colors.
  - Supports dynamic light and dark theme modes responsive to client preference or manual triggers. Toggle status is recorded in browser `localStorage.theme`.
  - Custom UI Components: Smooth cards, dynamic badges for count tracking, custom layouts, notifications, and animations.
* **Toast & Notification Systems**:
  - Features custom dynamic banner modals.
  - `showToast(message, type)` injects animated SVG alerts.
* **Dynamic Table Filters**:
  - Real-time client-side search bar filters rows on `dashboard.ejs` without hitting servers.
* **QR Codes Generator**:
  - Invokes free global api `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=...` to generate dynamic scannable codes.
* **Confirm Modals**:
  - Safe user-experience confirmations for deletes or download tasks.

---

## 9. Detailed Core Processes & External Integrations

ur.url manages authentication, dynamic redirects, QR codes, and communications using standard procedures and external APIs:

### 9.1. Authentication & Session Management
- **Token Generation**: Upon successful credentials verification (verified against user email and bcrypt password hash), the server signs a JSON Web Token (JWT) with the payload `{ _id, username, email }` using `process.env.SECRET_KEY`.
- **Cookie Transport**: The JWT is set as an HTTP cookie named `uid` with a maximum age of 12 hours.
- **Access Guarding**: Custom middlewares inspect this cookie:
  - `validUser`: Blocking middleware that verifies the token. Attaches user context to `req.user` or redirects to `/login` if missing or invalid.
  - `checkAuth`: Non-blocking middleware that decodes active sessions to customize views (e.g. dashboard vs landing page) without interrupting request flows.
- **Session Destruction**: Clearing the cookie `uid` (`res.clearCookie("uid")`) logs out the user and destroys the session.

### 9.2. URL Processing Procedures
- **Protocol Normalization**: The system automatically validates incoming URLs to guarantee valid redirection. If a destination lacks `http://` or `https://`, it automatically prepends `https://`.
- **Short Slug Generation**:
  - Random Slugs: Uses a loop-controlled unique random 8-character string generator.
  - Custom Aliases: Users can choose custom paths (3-30 characters, alphanumeric). The system query-checks the database for availability first to prevent duplicates.
- **Atomic Visited Counters**: Clicking a short URL fetches the document, atomically increments `visitCount` by 1 using MongoDB's `$inc` operator, and redirects the client browser to the destination.

### 9.3. External APIs & Theme Syncing
- **Dynamic QR Code Generation**: Renders click-to-view QR codes by calling the third-party API `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=...` with the absolute URL string.
- **Visual Preference Syncing**: Supports light and dark mode toggles synced to client systems or custom override buttons, persisting choice parameters in the client's `localStorage.theme` key.
- **OTP Mailing Delivery**: Delivers account verification and password reset emails containing 6-digit OTP codes via the **Resend API** (utilizing native HTTP `fetch` to POST data securely to `https://api.resend.com/emails`).

---

## 10. Deployment and Environment Variables

### 10.1. Environment Variables Configuration (`.env`)
To run this application locally, configure a `.env` file in the root directory:

```env
PORT = 3000
MONGO_URI = <YOUR_MONGODB_CONNECTION_STRING>
base_URL = <YOUR_BASE_APP_URL_FOR_REDIRECTIONS>
SECRET_KEY = <YOUR_JWT_HMAC_SECRET_KEY>

# Email Service Config (Resend API)
RESEND_API_KEY = <YOUR_RESEND_API_KEY>
```

### 10.2. Vercel Configuration (`vercel.json`)
The application is pre-configured for serverless hosting on Vercel:
- **Serverless Entry**: The `index.js` startup file is processed using `@vercel/node`.
- **Wildcard Rewrite**: Configures Express routing as a catch-all mapping to route requests through Express route definitions.

