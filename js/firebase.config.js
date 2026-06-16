// js/core/firebase.js

// ── IMPORTS ──
import { initializeApp }        from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAnalytics }         from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
import { getFirestore }         from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth }              from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getStorage }           from "https://www.gstatic.com/firebasejs/12.14.0/firebase-storage.js";

// ── CONFIG ──
const firebaseConfig = {
  apiKey:            "AIzaSyBlHz7dMs1afMQyj-7lsmpvJAVfERUhGjk",
  authDomain:        "naijagenius-16390.firebaseapp.com",
  projectId:         "naijagenius-16390",
  storageBucket:     "naijagenius-16390.firebasestorage.app",
  messagingSenderId: "249254233044",
  appId:             "1:249254233044:web:605395373b95fa8c3e4c41",
  measurementId:     "G-LFFFDMT1BZ"
};

// ── INITIALISE ──
const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db        = getFirestore(app);
const auth      = getAuth(app);
const storage   = getStorage(app);

// ── EXPORTS ──
export { app, analytics, db, auth, storage };