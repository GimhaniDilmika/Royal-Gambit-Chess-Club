/**
 * ============================================================================
 * CHESS CLUB - ADMIN & COACH BOOTSTRAP SCRIPT
 * ============================================================================
 * 
 * Securely assigns the 'admin', 'coach', or 'member' Firebase Auth Custom Claim
 * using the Firebase Admin SDK from a trusted server/CLI environment.
 * 
 * NEVER include Firebase Admin credentials in frontend client code!
 * 
 * Prerequisites:
 * 1. Download your service account key from the Firebase Console:
 *    Project Settings -> Service Accounts -> "Generate new private key"
 * 2. Save it as `serviceAccountKey.json` in the root of this project
 *    (or set the GOOGLE_APPLICATION_CREDENTIALS environment variable).
 * 3. Either register the user in the web application first, OR provide
 *    an optional password to create the user immediately!
 * 
 * Usage:
 *   node scripts/bootstrap-admin.js <email-or-uid> [admin|coach|member] [optional-password] [optional-display-name]
 * 
 * Examples:
 *   # Assign admin claim and create new account:
 *   node scripts/bootstrap-admin.js admin@chessclub.com admin AdminPass123! "Chief Arbiter"
 * 
 *   # Assign coach claim and create new account:
 *   node scripts/bootstrap-admin.js coach@chessclub.com coach CoachPass123! "Grandmaster Alexei"
 * 
 *   # Promote an already-registered user:
 *   node scripts/bootstrap-admin.js player@chessclub.com coach
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find service account key
const serviceAccountPath = path.resolve(__dirname, '..', 'serviceAccountKey.json');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !fs.existsSync(serviceAccountPath)) {
  console.error('\x1b[31m%s\x1b[0m', '=============================================================');
  console.error('\x1b[31m%s\x1b[0m', '[ERROR] serviceAccountKey.json not found in the project root!');
  console.error('\x1b[33m%s\x1b[0m', 'Please download your service account key from:');
  console.error('\x1b[36m%s\x1b[0m', '  Firebase Console > Project Settings > Service accounts > Generate new private key');
  console.error('\x1b[33m%s\x1b[0m', 'Save the downloaded file as "serviceAccountKey.json" in this directory:');
  console.error(`  ${path.resolve(__dirname, '..')}`);
  console.error('\x1b[31m%s\x1b[0m', '=============================================================');
  process.exit(1);
}

// Initialize Admin SDK
try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    admin.initializeApp();
  }
} catch (err) {
  console.error('Failed to initialize Firebase Admin SDK:', err.message);
  process.exit(1);
}

const auth = admin.auth();
const db = admin.firestore();

async function bootstrapUserRole() {
  const targetIdentifier = process.argv[2];
  const desiredRole = (process.argv[3] || 'admin').toLowerCase();
  const optionalPassword = process.argv[4];
  const optionalDisplayName = process.argv[5];

  const validRoles = ['admin', 'coach', 'member'];
  if (!validRoles.includes(desiredRole)) {
    console.error(`\x1b[31m[ERROR] Invalid role "${desiredRole}". Valid roles are: ${validRoles.join(', ')}\x1b[0m`);
    process.exit(1);
  }

  if (!targetIdentifier) {
    console.log('\x1b[36m%s\x1b[0m', '=== Royal Gambit Chess Club - Role Provisioning Tool ===');
    console.log('Usage: node scripts/bootstrap-admin.js <email-or-uid> [admin|coach|member] [password]');
    console.log('\nExamples:');
    console.log('  node scripts/bootstrap-admin.js admin@chessclub.com admin AdminPass123!');
    console.log('  node scripts/bootstrap-admin.js coach@chessclub.com coach CoachPass123!');
    console.log('  node scripts/bootstrap-admin.js player@chessclub.com coach');
    process.exit(0);
  }

  try {
    let userRecord = null;

    // 1. Check if user already exists in Firebase Auth
    try {
      if (targetIdentifier.includes('@')) {
        console.log(`Checking Firebase Auth for email: \x1b[33m${targetIdentifier}\x1b[0m...`);
        userRecord = await auth.getUserByEmail(targetIdentifier);
      } else {
        console.log(`Checking Firebase Auth for UID: \x1b[33m${targetIdentifier}\x1b[0m...`);
        userRecord = await auth.getUser(targetIdentifier);
      }
    } catch (lookupErr) {
      if (lookupErr.code === 'auth/user-not-found') {
        if (optionalPassword) {
          console.log(`User not found. Creating new Firebase Auth account for \x1b[33m${targetIdentifier}\x1b[0m...`);
          const defaultDisplayName = optionalDisplayName || (desiredRole === 'admin' 
            ? 'Club Administrator' 
            : (desiredRole === 'coach' ? 'Grandmaster Coach' : 'Club Student'));
          
          userRecord = await auth.createUser({
            email: targetIdentifier,
            password: optionalPassword,
            displayName: defaultDisplayName
          });
          console.log(`\x1b[32m✔ Successfully created Firebase Auth user (UID: ${userRecord.uid})\x1b[0m`);
        } else {
          console.error(`\x1b[31m[ERROR] User "${targetIdentifier}" does not exist in Firebase Auth.\x1b[0m`);
          console.log('\x1b[33mSolution:\x1b[0m Either:');
          console.log(`  1) Register ${targetIdentifier} through the website first, OR`);
          console.log(`  2) Provide a password to create it now:`);
          console.log(`     node scripts/bootstrap-admin.js ${targetIdentifier} ${desiredRole} <YourSecurePassword> [DisplayName]`);
          process.exit(1);
        }
      } else {
        throw lookupErr;
      }
    }

    if (optionalDisplayName && userRecord.displayName !== optionalDisplayName) {
      await auth.updateUser(userRecord.uid, { displayName: optionalDisplayName });
      userRecord.displayName = optionalDisplayName;
    }

    console.log(`Target User: ${userRecord.email} (UID: ${userRecord.uid})`);
    console.log(`Previous Custom Claims:`, userRecord.customClaims || 'None (Defaults to member)');

    // 2. Set Custom User Claims on Firebase Authentication
    await auth.setCustomUserClaims(userRecord.uid, {
      role: desiredRole,
      assignedAt: new Date().toISOString()
    });
    console.log(`\x1b[32m✔ Successfully set Firebase Auth Custom Claim: { role: "${desiredRole}" }\x1b[0m`);

    // 3. Synchronize Cloud Firestore profile
    const userDocRef = db.collection('users').doc(userRecord.uid);
    const existingDoc = await userDocRef.get();
    
    const roleTitleMap = {
      admin: 'Club Administrator',
      coach: 'Certified Chess Coach',
      member: 'Club Student'
    };

    const profileData = {
      uid: userRecord.uid,
      email: userRecord.email,
      role: desiredRole,
      title: roleTitleMap[desiredRole],
      displayName: optionalDisplayName || userRecord.displayName || userRecord.email.split('@')[0],
      fullName: optionalDisplayName || userRecord.displayName || userRecord.email.split('@')[0],
      chessUsername: userRecord.email.split('@')[0],
      username: userRecord.email.split('@')[0],
      status: 'active',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (!existingDoc.exists) {
      profileData.createdAt = admin.firestore.FieldValue.serverTimestamp();
      profileData.rating = desiredRole === 'admin' ? 2450 : (desiredRole === 'coach' ? 2200 : 1200);
      profileData.avatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${userRecord.email.split('@')[0]}`;
    }

    await userDocRef.set(profileData, { merge: true });
    console.log(`\x1b[32m✔ Successfully updated Cloud Firestore /users/${userRecord.uid} profile.\x1b[0m`);

    // 4. Log event into admin_logs
    await db.collection('admin_logs').add({
      type: 'ROLE_ASSIGNED_BOOTSTRAP',
      targetUid: userRecord.uid,
      targetEmail: userRecord.email,
      assignedRole: desiredRole,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      source: 'CLI_ADMIN_BOOTSTRAP_SCRIPT'
    });

    console.log('\x1b[35m%s\x1b[0m', '-------------------------------------------------------------');
    console.log(`\x1b[32m★ SUCCESS! ${userRecord.email} has been provisioned as ${desiredRole.toUpperCase()}.\x1b[0m`);
    console.log(`You can now sign in at http://localhost:5173/login with:`);
    console.log(`  Email:    ${userRecord.email}`);
    if (optionalPassword) {
      console.log(`  Password: ${optionalPassword}`);
    }
    console.log(`Target Route: /${desiredRole === 'member' ? 'member' : desiredRole}/dashboard`);
    console.log('\x1b[35m%s\x1b[0m', '-------------------------------------------------------------');
  } catch (error) {
    console.error('\x1b[31m[ERROR] Failed to set user role:\x1b[0m', error);
    process.exit(1);
  }
}

bootstrapUserRole();
