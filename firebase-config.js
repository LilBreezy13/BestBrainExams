// firebase-config.js
// IMPORTANT: Replace the placeholders below with your Firebase project's config values.
// This scaffold uses the compat SDK for simplicity. For production, use modular SDK.

const firebaseConfig = {
  apiKey: "AIzaSyBgS5s6SHMj4RqZwq5MxM0crT2t-XT2vbs",
  authDomain: "scanparceltoday.firebaseapp.com",
  projectId: "scanparceltoday",
  storageBucket: "scanparceltoday.firebasestorage.app",
  messagingSenderId: "537794506429",
  appId: "1:537794506429:web:17b8d24e4ec5f770a9d1d4"
};

try {
  if (!window.firebase) {
    console.warn('Firebase SDK not loaded. Check your network or script tags.');
  } else {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
    window.auth = firebase.auth();
    console.log('Firebase initialized (compat).');
  }
} catch (e) {
  console.error('Firebase initialization error', e);
}
