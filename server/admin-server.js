/**
 * ============================================================================
 * CHESS CLUB - ADMIN & ROLE MANAGEMENT BACKEND SERVER
 * ============================================================================
 * 
 * Provides secure server-side endpoints for privileged role operations:
 * - Setting Firebase Auth Custom Claims (`role: admin|coach|member`)
 * - Trusted endpoint for auto-provisioning the default 'member' claim upon registration
 * - Verifying caller's JWT ID Token
 * - Auditing role promotions and demotions
 * 
 * Run with: `node server/admin-server.js` or `npm run server`
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccountPath = path.resolve(__dirname, '..', 'serviceAccountKey.json');
let adminInitialized = false;

if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    adminInitialized = true;
    console.log('[Firebase Admin] Initialized with serviceAccountKey.json');
  } catch (err) {
    console.warn('[Firebase Admin] Failed loading serviceAccountKey.json:', err.message);
  }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    admin.initializeApp();
    adminInitialized = true;
    console.log('[Firebase Admin] Initialized with GOOGLE_APPLICATION_CREDENTIALS');
  } catch (err) {
    console.warn('[Firebase Admin] Error initializing with default credentials:', err.message);
  }
} else {
  console.log('[Firebase Admin] Notice: serviceAccountKey.json not present in project root.');
}

// Middleware: Authenticate Firebase ID Token and enforce Admin role
async function verifyAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  if (!adminInitialized) {
    return res.status(503).json({
      error: 'Firebase Admin SDK not initialized. Please provide serviceAccountKey.json on the server.'
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Check if caller has 'admin' claim
    if (decodedToken.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden. Only administrators can perform this privileged operation.'
      });
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ error: 'Invalid or expired Firebase ID token.' });
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Chess Club Role Authority API',
    adminInitialized,
    timestamp: new Date().toISOString()
  });
});

/**
 * Trusted endpoint: Assign initial 'member' custom claim to freshly registered user
 * Verifies user ID token and strictly sets claim to 'member' (never admin or coach!)
 */
app.post('/api/provision-default-member', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  if (!adminInitialized) {
    // If Admin SDK not initialized yet, allow client fallback
    return res.status(200).json({
      success: true,
      role: 'member',
      note: 'Admin SDK offline; member role enforced via Firestore security rules'
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // If user already has a role (e.g. admin or coach), do not overwrite with member
    const currentClaims = decodedToken.role;
    if (currentClaims && currentClaims !== 'member') {
      return res.json({
        success: true,
        role: currentClaims,
        message: `Preserved existing privileged role: ${currentClaims}`
      });
    }

    // Set custom claim strictly to 'member'
    await admin.auth().setCustomUserClaims(uid, {
      role: 'member',
      provisionedAt: new Date().toISOString()
    });

    // Ensure Firestore document reflects role
    const db = admin.firestore();
    await db.collection('users').doc(uid).set({
      role: 'member',
      roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return res.json({
      success: true,
      role: 'member',
      message: 'Successfully assigned Member custom claim via Admin SDK'
    });
  } catch (err) {
    console.error('Error provisioning member claim:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Admin endpoint: Set Custom Claims (promote to coach, etc.)
app.post('/api/set-role', verifyAdminAuth, async (req, res) => {
  const { targetUid, newRole } = req.body;

  if (!targetUid || !newRole) {
    return res.status(400).json({ error: 'targetUid and newRole are required fields.' });
  }

  const validRoles = ['admin', 'coach', 'member'];
  if (!validRoles.includes(newRole.toLowerCase())) {
    return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
  }

  try {
    // 1. Set Custom User Claims on Firebase Auth
    await admin.auth().setCustomUserClaims(targetUid, {
      role: newRole.toLowerCase(),
      assignedBy: req.user.uid,
      updatedAt: new Date().toISOString()
    });

    // 2. Synchronize with Firestore document
    const db = admin.firestore();
    await db.collection('users').doc(targetUid).update({
      role: newRole.toLowerCase(),
      roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: req.user.email || req.user.uid
    });

    // 3. Log audit record
    await db.collection('admin_logs').add({
      type: 'ROLE_MODIFIED',
      adminUid: req.user.uid,
      adminEmail: req.user.email || 'admin',
      targetUid,
      newRole: newRole.toLowerCase(),
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.json({
      success: true,
      message: `User ${targetUid} successfully assigned role "${newRole}".`,
      role: newRole.toLowerCase()
    });
  } catch (err) {
    console.error('Error setting custom claim:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Admin endpoint: Fetch all club users with their claims
app.get('/api/users', verifyAdminAuth, async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers(100);
    const users = listUsersResult.users.map(u => ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      customClaims: u.customClaims,
      role: u.customClaims?.role || 'member',
      disabled: u.disabled,
      creationTime: u.metadata.creationTime,
      lastSignInTime: u.metadata.lastSignInTime
    }));

    res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error('Error listing users:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Chess Club Role Authority Server] running on http://localhost:${PORT}`);
});
