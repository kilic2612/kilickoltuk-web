// ============================================
// FIREBASE CONFIGURATION — Kılıç Koltuk Mobilya
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyBlqDbATJYYqwVHzDGaEQQQAJmaMo2c-Vs",
    authDomain: "kilic-koltuk.firebaseapp.com",
    projectId: "kilic-koltuk",
    storageBucket: "kilic-koltuk.firebasestorage.app",
    messagingSenderId: "880750375886",
    appId: "1:880750375886:web:90894e249506ab79ec319f",
    measurementId: "G-4PSLX6GJSB"
};

// Initialize Firebase (compat SDK ile)
firebase.initializeApp(firebaseConfig);

// Firestore veritabanı bağlantısı
window.db = firebase.firestore();

// Analytics (isteğe bağlı)
try {
    window.fbAnalytics = firebase.analytics();
} catch(e) { /* Analytics desteklenmiyorsa sessizce geç */ }

console.log('%c🔥 Firebase Firestore bağlandı — kilickoltuk', 'color: #D4AF37; font-weight: bold;');
