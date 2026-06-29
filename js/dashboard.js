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
    console.log('🔐 Auth state changed (dashboard):', user ? `User: ${user.uid}` : 'No user');
    
    if (!user) {
        window.location.href = "/login.html";
        return;
    }

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.warn("User profile not found in Firestore.");
            // Use email as fallback
            const displayName = user.email || "Player";
            const greeting = getGreeting();
            if (greetingText) greetingText.textContent = greeting + ",";
            if (greetingName) greetingName.textContent = displayName;
            
            // Set initials from email
            const initials = displayName.slice(0, 2).toUpperCase();
            if (userInitials) userInitials.textContent = initials;
            return;
        }

        const userData = userSnap.data();
        console.log('✅ User data loaded:', userData);

        // ===== GREETING =====
        const displayName = userData.displayName || userData.username || user.email || "Player";
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
        // Fallback: show generic greeting
        if (greetingText) greetingText.textContent = "Good Day,";
        if (greetingName) greetingName.textContent = "Player";
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

// ========== NAVIGATION ==========
document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const target = btn.getAttribute("data-nav");
        if (target) {
            document.querySelectorAll(".page-section").forEach(section => {
                section.classList.remove("active-section");
            });
            const targetSection = document.getElementById(target + "Section");
            if (targetSection) {
                targetSection.classList.add("active-section");
            }
            document.querySelectorAll(".nav-item, .sidebar-item").forEach(item => {
                item.classList.remove("active");
            });
            btn.classList.add("active");
        }
    });
});

console.log("Dashboard initialized successfully.");