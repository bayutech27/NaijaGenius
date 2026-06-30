// dashboard.js – Firebase Modular SDK v12.14.0
import { auth, db } from "/js/firebase.config.js";
import { doc, getDoc, onSnapshot, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { showFunFactModal } from './fun-facts.js';
import { renderShop, setupAdButton } from './shop.js';

// ========== DOM ELEMENTS ==========
const walletBalance = document.getElementById("walletBalance");
const totalGamesPlayed = document.getElementById("totalGamesPlayed");
const correctAnswersEl = document.getElementById("correctAnswers");
const bestScoreValue = document.getElementById("bestScoreValue");
const userInitials = document.getElementById("userInitials");
const greetingName = document.getElementById("greetingName");
const greetingText = document.getElementById("greetingText");
const headerCoinsValue = document.getElementById("headerCoinsValue");
const headerLivesValue = document.getElementById("headerLivesValue");
const shopCoinsDisplay = document.getElementById("shopCoinsDisplay");

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
            const displayName = user.email || "Player";
            const greeting = getGreeting();
            if (greetingText) greetingText.textContent = greeting + ",";
            if (greetingName) greetingName.textContent = displayName;
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
        const initials = displayName.slice(0, 2).toUpperCase();
        if (userInitials) userInitials.textContent = initials;

        // ===== COINS & LIVES =====
        let coins = userData.coins || 0;
        let lives = userData.lives ?? 2;
        let lastRenewal = userData.lastLiveRenewal?.toDate?.() || new Date(0);

        // Check if 24 hours have passed since last renewal
        const now = new Date();
        const hoursSince = (now - lastRenewal) / (1000 * 60 * 60);
        if (hoursSince >= 24) {
            lives = 2;
            await updateDoc(userRef, {
                lives: 2,
                lastLiveRenewal: serverTimestamp()
            });
            console.log('🔄 Lives renewed to 2');
        }

        // Update UI
        updateHeaderUI(coins, lives);
        if (walletBalance) walletBalance.textContent = coins;
        if (shopCoinsDisplay) shopCoinsDisplay.textContent = coins;

        // ===== GAME STATS =====
        if (totalGamesPlayed) totalGamesPlayed.textContent = userData.lifetimeRoundPlayed || 0;
        if (correctAnswersEl) correctAnswersEl.textContent = userData.totalCorrectAnswers || 0;

        let best = 0;
        const categories = userData.categoryStats || {};
        Object.values(categories).forEach(cat => {
            if (cat.bestScore > best) best = cat.bestScore;
        });
        if (bestScoreValue) bestScoreValue.textContent = best;

        // ===== SHOP INIT =====
        renderShop(coins);
        setupAdButton(userRef, updateHeaderUI);

        // ===== FUN FACT =====
        setTimeout(() => {
            showFunFactModal(displayName, true);
        }, 1500);

        // ===== REAL‑TIME UPDATES =====
        onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const updated = docSnap.data();
                const newCoins = updated.coins || 0;
                const newLives = updated.lives ?? 2;
                updateHeaderUI(newCoins, newLives);
                if (walletBalance) walletBalance.textContent = newCoins;
                if (shopCoinsDisplay) shopCoinsDisplay.textContent = newCoins;
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
        if (greetingText) greetingText.textContent = "Good Day,";
        if (greetingName) greetingName.textContent = "Player";
    }
});

// ========== UI HELPERS ==========
function updateHeaderUI(coins, lives) {
    if (headerCoinsValue) headerCoinsValue.textContent = coins;
    if (headerLivesValue) headerLivesValue.textContent = lives;
}

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
document.getElementById("oneChanceBtn")?.addEventListener("click", () => {
    window.location.href = "games.html?type=one_chance";
});
document.getElementById("oneChanceBtnPlay")?.addEventListener("click", () => {
    window.location.href = "games.html?type=one_chance";
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