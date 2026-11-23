import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, checkFirebaseConfigStatus } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [customClaims, setCustomClaims] = useState({});
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const { isConfigured, missingVars } = checkFirebaseConfigStatus();

  /**
   * Helper to retrieve user profile and role securely
   * Custom claims assigned by Admin SDK serve as the primary authority!
   * Never trust client-controlled Firestore role for Admin or Coach access.
   */
  const fetchRoleAndProfile = async (user) => {
    try {
      // 1. Force refresh the user ID token to fetch the latest verified custom claims
      const tokenResult = await user.getIdTokenResult(true);
      const claims = tokenResult.claims || {};
      setCustomClaims(claims);

      let verifiedRole = null;

      // Authoritative role evaluation exclusively via Firebase Custom Claims
      if (claims.role === 'admin') {
        verifiedRole = 'admin';
      } else if (claims.role === 'coach') {
        verifiedRole = 'coach';
      } else if (claims.role === 'member') {
        verifiedRole = 'member';
      }

      // 2. Fetch Firestore Profile
      let profileData = null;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          profileData = userDoc.data();
        }
      } catch (firestoreErr) {
        console.warn('Firestore profile fetch warning:', firestoreErr.message);
      }

      // Safe handling of missing role claims:
      // Never grant privileged access (Admin or Coach) without verified custom claim!
      // Only permit standard 'member' (Student) tier.
      if (!verifiedRole) {
        verifiedRole = 'member';
      }

      setUserRole(verifiedRole);
      setUserProfile(profileData || {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        fullName: user.displayName || user.email.split('@')[0],
        chessUsername: user.email.split('@')[0],
        username: user.email.split('@')[0],
        role: verifiedRole,
        rating: 1200,
        title: 'Club Member'
      });

      return verifiedRole;
    } catch (err) {
      console.error('Error in fetchRoleAndProfile:', err);
      setUserRole('member');
      return 'member';
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchRoleAndProfile(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUserProfile(null);
        setCustomClaims({});
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Login action with real Firebase Authentication
   */
  const login = async (email, password, rememberMe = true) => {
    setAuthError(null);

    if (!isConfigured) {
      const err = new Error(
        `Firebase is not yet configured with real credentials. Missing: ${missingVars.join(', ')}. Please update your .env file with values from Firebase Console.`
      );
      err.code = 'auth/api-key-not-valid';
      throw err;
    }

    try {
      // Set session persistence
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      // Real Firebase Authentication sign in
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      setCurrentUser(user);
      
      // Securely fetch role from custom claims or Firestore
      const role = await fetchRoleAndProfile(user);
      return { user, role };
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  /**
   * Register action with real Firebase Authentication
   * All publicly registered users strictly receive the 'member' role!
   */
  const register = async (email, password, fullName, chessUsername) => {
    setAuthError(null);

    if (!isConfigured) {
      const err = new Error(
        `Firebase is not yet configured with real credentials. Missing: ${missingVars.join(', ')}. Please update your .env file with values from Firebase Console.`
      );
      err.code = 'auth/api-key-not-valid';
      throw err;
    }

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Update Firebase Auth Display Name
      await updateProfile(user, { displayName: fullName.trim() });

      // 3. Save user profile in Cloud Firestore under users/{uid}
      // Never store password! Role is strictly 'member'
      const userProfileData = {
        uid: user.uid,
        email: email.toLowerCase().trim(),
        displayName: fullName.trim(),
        fullName: fullName.trim(),
        chessUsername: chessUsername.trim(),
        username: chessUsername.trim(),
        role: 'member', // Strictly Member
        rating: 1200,
        fideRating: null,
        title: 'Club Member',
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${chessUsername.trim()}`,
        status: 'active',
        createdAt: serverTimestamp(),
        bio: 'Passionate chess enthusiast seeking mastery of the 64 squares.'
      };

      await setDoc(doc(db, 'users', user.uid), userProfileData);

      // 4. Attempt to notify trusted backend to provision 'member' custom claim
      try {
        const idToken = await user.getIdToken();
        const adminApiUrl = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api';
        await fetch(`${adminApiUrl}/provision-default-member`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          }
        });
      } catch (backendErr) {
        // Safe: If backend is offline, role 'member' is still securely enforced by Firestore rules
        console.info('Backend claim provision note:', backendErr.message);
      }

      // 5. Force refresh token to check custom claims
      await user.getIdTokenResult(true);

      setCurrentUser(user);
      setUserRole('member');
      setUserProfile(userProfileData);
      setCustomClaims({ role: 'member' });

      return { user, role: 'member' };
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  /**
   * Real Sign Out action
   */
  const logout = async () => {
    try {
      localStorage.removeItem('chess_club_demo_session');
      await signOut(auth);
    } catch (err) {
      console.error('Error during signOut:', err);
      throw err;
    } finally {
      setCurrentUser(null);
      setUserRole(null);
      setUserProfile(null);
      setCustomClaims({});
    }
  };

  /**
   * Real Password Reset via Firebase Auth
   */
  const resetPassword = async (email) => {
    if (!isConfigured) {
      const err = new Error('Firebase credentials are required in .env to send real password reset emails.');
      err.code = 'auth/api-key-not-valid';
      throw err;
    }
    return await sendPasswordResetEmail(auth, email.trim());
  };

  /**
   * Refresh custom claims
   */
  const refreshUserClaims = async () => {
    if (currentUser) {
      const refreshedRole = await fetchRoleAndProfile(currentUser);
      return refreshedRole;
    }
    return userRole;
  };

  const value = {
    currentUser,
    userRole,
    userProfile,
    customClaims,
    loading,
    authError,
    login,
    register,
    logout,
    resetPassword,
    refreshUserClaims,
    isFirebaseConfigured: isConfigured,
    missingConfigVars: missingVars
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
