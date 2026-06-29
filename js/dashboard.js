// dashboard.js – Firebase Modular SDK v12.14.0
import { auth, db } from "/js/firebase.config.js";
import { doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { showFunFactModal } from './fun-facts.js';

// ========== DOM ELEMENTS ==========
const walletBalance = document.getElementById("walletBalance");
const totalGamesPlayed = document.getElementById("totalGamesPlayed");
const correctAnswersEl = document.getElementById("correctAnswers");
const bestScoreValue = document.getElementById("bestScoreValue");
const userInitials = document.getElementById("userInitials");
const greetingName = document.getElementById("greetingName");
const greetingText = document.getElementById("greetingText");

// ========== HELPER: TIME-BASED GREETING ==========
function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    return "Good Evening";
}

// ========== AUTH GUARD & DATA LOADING ==========
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.warn("User profile not found in Firestore.");
            return;
        }

        const userData = userSnap.data();

        // ===== GREETING =====
        const displayName = userData.displayName || userData.username || "Player";
        const greeting = getGreeting();
        if (greetingText) greetingText.textContent = greeting + ",";
        if (greetingName) greetingName.textContent = displayName;

        // ===== USER INITIALS (header avatar) =====
        const initials = displayName.slice(0, 2).toUpperCase();
        if (userInitials) userInitials.textContent = initials;

        // ===== WALLET BALANCE =====
        if (walletBalance) {
            walletBalance.textContent = userData.balance || 0;
        }

        // ===== GAMES PLAYED =====
        if (totalGamesPlayed) {
            totalGamesPlayed.textContent = userData.lifetimeRoundPlayed || 0;
        }

        // ===== CORRECT ANSWERS =====
        if (correctAnswersEl) {
            correctAnswersEl.textContent = userData.totalCorrectAnswers || 0;
        }

        // ===== BEST SCORE =====
        let best = 0;
        if (bestScoreValue) {
            const categories = userData.categoryStats || {};
            Object.values(categories).forEach(cat => {
                if (cat.bestScore > best) best = cat.bestScore;
            });
            bestScoreValue.textContent = best;
        }

        // ===== SHOW FUN FACT MODAL =====
        setTimeout(() => {
            showFunFactModal(displayName, true);
        }, 1500);

        // ===== REAL‑TIME UPDATES =====
        onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const updated = docSnap.data();
                if (walletBalance) walletBalance.textContent = updated.balance || 0;
                if (totalGamesPlayed) totalGamesPlayed.textContent = updated.lifetimeRoundPlayed || 0;
                if (correctAnswersEl) correctAnswersEl.textContent = updated.totalCorrectAnswers || 0;

                let newBest = 0;
                const cats = updated.categoryStats || {};
                Object.values(cats).forEach(c => { if (c.bestScore > newBest) newBest = c.bestScore; });
                if (bestScoreValue) bestScoreValue.textContent = newBest;
            }
        });

    } catch (error) {
        console.error("Error loading user data:", error);
    }
});

// ========== MODE BUTTON NAVIGATION ==========
document.getElementById("jollofMixBtn")?.addEventListener("click", () => {
    window.location.href = "games.html";
});
document.getElementById("jollofMixBtnPlay")?.addEventListener("click", () => {
    window.location.href = "games.html";
});

document.getElementById("chooseLaneBtn")?.addEventListener("click", () => {
    window.location.href = "choose-your-lane.html";
});
document.getElementById("chooseLaneBtnPlay")?.addEventListener("click", () => {
    window.location.href = "choose-your-lane.html";
});

console.log("Dashboard initialized successfully.");