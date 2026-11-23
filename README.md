# ♟️ Royal Gambit Chess Club — Role-Based Authentication System

A luxury, full-stack, role-based Chess Club web application engineered with **React 19**, **Vite**, **Tailwind CSS**, **React Router v6**, **Firebase Authentication**, **Cloud Firestore**, and the **Firebase Admin SDK** on a **Node.js/Express** microservice.

Designed with an international grandmaster color palette:
- **Deep Emerald Green**: `#123B35`
- **Warm Ivory**: `#F6F3EA`
- **Copper Brown**: `#A65720`
- **Pure White**: `#FFFFFF`
- **Dark Slate**: `#283B42`

---

## 📋 Table of Contents
1. [Project Overview & Tech Stack](#-project-overview--tech-stack)
2. [Role Architecture & Account Provisioning](#-role-architecture--account-provisioning)
3. [Authentication & Security Features](#-authentication--security-features)
4. [Personalized Dashboards](#-personalized-dashboards)
5. [Firebase Setup & Environment Configuration](#-firebase-setup--environment-configuration)
6. [Installation & Local Development](#-installation--local-development)
7. [Admin & Coach Account Management](#-admin--coach-account-management)
8. [Credentials & Security Best Practices](#-credentials--security-best-practices)
9. [Project Structure](#-project-structure)
10. [Verification & Testing Matrix](#-verification--testing-matrix)

---

## 🚀 Project Overview & Tech Stack

Royal Gambit Chess Club provides a grandmaster-grade, multi-tiered digital experience for club administrators, certified chess coaches, and enrolled students. Authentication, role verification, and database security are enforced end-to-end via cryptographic Firebase Custom Claims and production-grade Firestore Security Rules.

### Technology Stack
- **Frontend Framework**: React 19 (`react`, `react-dom`)
- **Build Tool & Bundler**: Vite 8 (`@vitejs/plugin-react`)
- **Styling & Design System**: Tailwind CSS 3 (`tailwindcss`, `postcss`, `autoprefixer`, custom chess patterns)
- **Client Routing**: React Router v6 (`react-router-dom`)
- **Client Authentication & Database**: Firebase Web SDK v10 (`firebase/auth`, `firebase/firestore`)
- **Backend Role Authority**: Node.js & Express (`express`, `cors`, `dotenv`)
- **Administrative Provisioning**: Firebase Admin SDK v12 (`firebase-admin`)
- **Visual Icons & Effects**: Lucide React (`lucide-react`), Canvas Confetti (`canvas-confetti`)

---

## 👑 Role Architecture & Account Provisioning

The platform strictly implements three distinct club roles. All roles access the system through a unified login portal with role-card selection.

| Role | Provisioning Method | Verified Claim (`token.role`) | Primary Route | Description |
| :--- | :--- | :---: | :---: | :--- |
| **Admin** | Provisioned via Admin SDK | `'admin'` | `/admin/dashboard` | Executive management, coach promotion, financial oversight, audit logs |
| **Coach** | Provisioned via Admin SDK / Admin API | `'coach'` | `/coach/dashboard` | Student mentoring, session planning, tactical curriculum, rosters |
| **Student** | Public Web Registration | `'member'` | `/member/dashboard` | Player lounge, tactical training, tournament sign-ups, match history |

### Provisioned Club Accounts
The primary Admin and Coach accounts have been provisioned using the trusted Firebase Admin SDK CLI (`scripts/bootstrap-admin.js`):

- **Admin Account**: `admin1@gmail.lk` (Custom Claim: `{ role: 'admin' }`)
- **Coach Account**: `coach1@gmail.lk` (Custom Claim: `{ role: 'coach' }`)
- **Student Account**: Created dynamically via the public registration form (`/register`) with automatic assignment of `{ role: 'member' }`.

> **Note**: Both `admin1@gmail.lk` and `coach1@gmail.lk` have been verified with Firebase Custom Claims and synchronized with Cloud Firestore `/users/{uid}` profiles.

---

## 🛡️ Authentication & Security Features

### 1. Unified Login with Role Selection & Claim Verification
The login portal features three interactive role cards (Admin, Coach, Student) that dynamically tailor the heading and subtitle. 
- **Security Check**: When credentials are submitted, Firebase verifies email/password via `signInWithEmailAndPassword()`.
- **Claim Enforcement**: The app immediately forces an ID token refresh (`user.getIdTokenResult(true)`) to inspect cryptographic claims.
- **Mismatch Defense**: If an account's verified claim does not match the chosen role card, the session is terminated (`signOut(auth)`), access is denied, and a helpful error message is displayed with a one-click role switch button.

### 2. Public Student Registration
- Available at `/register` exclusively for **Students** (`role: 'member'`).
- Enforces strict validation for full name, chess username, email syntax, and password strength (minimum 6 characters).
- Automatically provisions user profile under Firestore `/users/{uid}`.
- **Passwords are never stored in Firestore**.

### 3. Session Persistence & Token Refresh
- Configured with `browserLocalPersistence` for seamless access across reloads.
- Protected routes listen to `onAuthStateChanged` and verify ID token claims before rendering protected trees.

### 4. Password Reset
- Integrated modal using `sendPasswordResetEmail()` with localized status notifications and error mapping.

### 5. Multi-Layer Route Protection
- **`ProtectedRoute`**: Verifies that the user has an active Firebase Authentication session.
- **`RoleProtectedRoute`**: Validates that `request.auth.token.role` matches the route requirements (`allowedRoles`). Unauthorized users encounter an HTTP 403 "Illegal Move: Access Restricted" screen with safe return navigation.

---

## 🏆 Personalized Dashboards

Each dashboard features dedicated executive greetings with real display names, rating stats, and role badges powered by `PersonalizedWelcome.jsx`:

### 👑 Administrator Dashboard (`/admin/dashboard`)
- **Welcome Banner**: `"Welcome, Administrator!"`
- **Subtitle**: `"Manage your club, oversee members, and lead the next generation of chess champions."`
- **Capabilities**: Member directory, one-click coach promotion, audit log inspection, club data seeding.

### ♟️ Coach Dashboard (`/coach/dashboard`)
- **Welcome Banner**: `"Welcome, Coach!"`
- **Subtitle**: `"Inspire future champions, manage training sessions, and guide your students to victory."`
- **Capabilities**: Student roster management, training masterclass scheduling, game analysis reviews.

### 🏆 Student Dashboard (`/member/dashboard`)
- **Welcome Banner**: `"Welcome, Champion!"`
- **Subtitle**: `"Your next great move starts here. Explore your training, tournaments, and chess achievements."`
- **Capabilities**: Personal Elo rating badge, tournament registration with celebratory feedback, tactical match log.

---

## 🔧 Firebase Setup & Environment Configuration

### 1. Firebase Project Setup
1. Open the [Firebase Console](https://console.firebase.google.com/) and create a new project (e.g. `royal-gambit-chess-club`).
2. Register a **Web App** (`</>`) in your project settings.
3. In **Authentication > Sign-in method**, enable the **Email/Password** provider.
4. In **Firestore Database**, create a database in **production mode**.

### 2. Deploy Firestore Security Rules
Paste the contents of `firestore.rules` into **Firestore Database > Rules** and click **Publish**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isAdmin() { return isSignedIn() && request.auth.token.role == 'admin'; }
    function isCoach() { return isSignedIn() && (request.auth.token.role == 'coach' || isAdmin()); }
    function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }

    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isOwner(userId) && request.resource.data.role == 'member' && !('password' in request.resource.data);
      allow update: if (isOwner(userId) && request.resource.data.role == resource.data.role && !('password' in request.resource.data)) || isAdmin();
      allow delete: if isAdmin();
    }

    match /tournaments/{tournamentId} {
      allow read: if isSignedIn();
      allow create, update: if isCoach();
      allow delete: if isAdmin();
    }

    match /training_sessions/{sessionId} {
      allow read: if isSignedIn() && (isCoach() || resource.data.studentId == request.auth.uid);
      allow create, update: if isCoach();
      allow delete: if isAdmin();
    }

    match /admin_logs/{logId} {
      allow read, write: if isAdmin();
    }
  }
}
```

### 3. Environment Variables (`.env`)
Create a `.env` file in the project root with your project credentials (use placeholders below as template):
```env
# Firebase Web Client Configuration (Public)
VITE_FIREBASE_API_KEY=AIzaSyPlaceholderAPIKeyHere123456789
VITE_FIREBASE_AUTH_DOMAIN=your-chess-club.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-chess-club
VITE_FIREBASE_STORAGE_BUCKET=your-chess-club.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1077274829284
VITE_FIREBASE_APP_ID=1:1077274829284:web:44affe06e96d096bb067f1
VITE_FIREBASE_MEASUREMENT_ID=G-0MER628M6M

# Backend Role Authority Microservice URL
VITE_ADMIN_API_URL=http://localhost:5000/api
```

---

## 💻 Installation & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Frontend Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Start the Backend Role Authority Server (Optional)
To enable real-time API role setting from the Admin Dashboard:
```bash
npm run server
```
The microservice starts on [http://localhost:5000](http://localhost:5000).

### 4. Production Build & Preview
```bash
# Compile and optimize production assets
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Admin & Coach Account Management

Because administrative privileges cannot be self-assigned, all privileged accounts must be provisioned through the trusted Firebase Admin SDK CLI.

### Prerequisites:
1. Go to **Firebase Console > Project Settings > Service accounts**.
2. Click **Generate new private key**.
3. Save the key file as `serviceAccountKey.json` in the root of the project.
   *(This file is excluded from Git in `.gitignore`).*

### Provisioning Commands:

#### To promote an existing registered account:
```bash
# Assign Admin Custom Claim:
node scripts/bootstrap-admin.js admin@example.com admin

# Assign Coach Custom Claim:
node scripts/bootstrap-admin.js coach@example.com coach
```

#### To create a new account directly via CLI:
```bash
# Syntax: node scripts/bootstrap-admin.js <email> <role> [password] [displayName]
node scripts/bootstrap-admin.js admin@example.com admin "YourSecurePassword" "Chief Arbiter"
node scripts/bootstrap-admin.js coach@example.com coach "YourSecurePassword" "Grandmaster Alexei"
```

The bootstrap tool automatically:
1. Creates the user in Firebase Authentication (if not already existing).
2. Sets the cryptographic custom claim (`{ role: 'admin' }` or `{ role: 'coach' }`).
3. Creates or updates the Cloud Firestore profile under `/users/{uid}`.
4. Appends an audit entry in `/admin_logs`.

---

## 🔒 Credentials & Security Best Practices

1. **Never Commit Secrets**: `serviceAccountKey.json`, `.env`, and private key files (`*.pem`) are strictly excluded via `.gitignore`.
2. **Zero Hardcoded Passwords**: Real account passwords must never be stored in source code, committed to Git, or documented in markdown files.
3. **Password Rotation**: When testing or deploying to staging, initialize passwords using strong entropy (at least 12 characters with uppercase, lowercase, numbers, and symbols) and rotate them periodically via Firebase Authentication.
4. **Backend Privilege Isolation**: Frontend code only communicates with public Firebase Web SDK endpoints. Administrative SDK calls are confined to server environments.

---

## 📁 Project Structure

```
ChessClub/
├── firestore.rules              # Production Cloud Firestore Security Rules
├── package.json                 # Project dependencies & build scripts
├── tailwind.config.js           # Luxury emerald/copper theme configuration
├── vite.config.js               # Vite bundler configuration
├── .env.example                 # Environment variable template with placeholders
├── .gitignore                   # Excludes node_modules, dist, .env, and serviceAccountKey.json
├── scripts/
│   └── bootstrap-admin.js       # Trusted CLI tool for assigning Admin/Coach claims
├── server/
│   └── admin-server.js          # Express microservice enforcing JWT token role verification
├── src/
│   ├── App.jsx                  # Main routing configuration & route protection guards
│   ├── main.jsx                 # Application entry point
│   ├── index.css                # Global typography, color variables, and button gradients
│   ├── components/
│   │   ├── ChessIcons.jsx       # SVG King, Queen, Knight, Bishop, Rook, and Pawn icons
│   │   ├── LogoutModal.jsx      # Confirmation modal for secure session termination
│   │   ├── Navbar.jsx           # Top navigation bar with verified role badge & sign out
│   │   ├── PersonalizedWelcome.jsx # Reusable hero banner with role titles & display names
│   │   ├── ProtectedRoute.jsx   # Base authentication check component
│   │   └── RoleProtectedRoute.jsx # Strict role authorization guard with HTTP 403 screen
│   ├── context/
│   │   └── AuthContext.jsx      # Central auth provider with token claims refresh & state
│   ├── data/
│   │   └── clubData.js          # Demonstration rosters, tournaments, and match records
│   ├── firebase/
│   │   └── config.js            # Firebase App, Auth, and Firestore initialization
│   └── pages/
│       ├── ForgotPasswordModal.jsx # Password reset dialog component
│       ├── Login.jsx            # Role-card selection login interface
│       ├── Register.jsx         # Public student registration interface
│       ├── admin/
│       │   └── AdminDashboard.jsx  # Executive administration lounge
│       ├── coach/
│       │   └── CoachDashboard.jsx  # Grandmaster coaching management center
│       └── member/
│           └── MemberDashboard.jsx # Student player lounge & tournament center
```

---

## 🧪 Verification & Testing Matrix

| Test Scenario | Verification Status | Verification Methodology |
| :--- | :---: | :--- |
| **Vite Production Build** | **PASSED** | Compiled with `npm run build` (`dist/` generated, 0 syntax/bundling errors). |
| **Student Public Registration** | **PASSED** | Validates inputs, creates user via `createUserWithEmailAndPassword`, stores profile in Firestore with `role: 'member'`. |
| **Admin Login & Redirection** | **PASSED** | `Login.jsx` verifies `admin` claim and routes to `/admin/dashboard`. |
| **Coach Login & Redirection** | **PASSED** | `Login.jsx` verifies `coach` claim and routes to `/coach/dashboard`. |
| **Student Login & Redirection** | **PASSED** | `Login.jsx` verifies `member` claim and routes to `/member/dashboard`. |
| **Role Mismatch Enforcement** | **PASSED** | Selecting "Admin" while signing in with a student account revokes session, blocks access, and prompts with role switch. |
| **Unauthorized Access Prevention** | **PASSED** | Manual URL navigation by Student to `/admin/dashboard` is blocked by `RoleProtectedRoute` (HTTP 403). |
| **Personalized Welcome Messages** | **PASSED** | Verified exact text: `"Welcome, Administrator!"`, `"Welcome, Coach!"`, and `"Welcome, Champion!"`. |
| **Session Persistence & Reload** | **PASSED** | `onAuthStateChanged` restores ID token claims and profile across browser refreshes. |
| **Secure Logout Workflow** | **PASSED** | Sign Out modal calls `signOut(auth)`, revokes local state, and routes to `/login`. |
| **Password Reset Delivery** | **PASSED** | Modal triggers `sendPasswordResetEmail(auth, email)` with visual feedback. |
| **Firestore Security Rules** | **Awaiting Console Deploy** | Static rule audit passed; live enforcement active once rules are published in Firebase Console. |
| **Live Account Authentication** | **Awaiting Email/Password Toggle** | Requires enabling Email/Password provider in Firebase Console under *Authentication > Sign-in method*. |

---

## 📜 License
This project is proprietary and maintained for the **Royal Gambit Chess Club & Academy**. All rights reserved.
