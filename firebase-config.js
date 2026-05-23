// ===== CLOUDINARY CONFIGURATION (جاهزة وشغالة!) =====
const CLOUDINARY_CLOUD_NAME = 'dc1mpgsvb';
const CLOUDINARY_UPLOAD_PRESET = 'dyudqhcg';

// ===== FIREBASE CONFIGURATION (ضع كودك هنا عندما تكون جاهزاً) =====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "rouh-masrya.firebaseapp.com",
  projectId: "rouh-masrya",
  storageBucket: "rouh-masrya.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
