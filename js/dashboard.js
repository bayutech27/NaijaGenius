// dashboard.js – Firebase Modular SDK v12.14.0
import { auth, db } from "/js/firebase.config.js";
import { doc, getDoc, onSnapshot, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { showFunFactModal } from './fun-facts.js';
import { renderShop, setupAdButton } from './shop.js';
import { getCurrentChallenge } from './challenge.js';

// ========== DOM ELEMENTS ==========
const totalGamesPlayed = document.getElementById("totalGamesPlayed");
const correctAnswersEl = document.getElementById("correctAnswers");
const bestScoreValue = document.getElementById("bestScoreValue");
const userInitials = document.getElementById("userInitials");
const greetingName = document.getElementById("greetingName");
const greetingText = document.getElementById("greetingText");
const headerCoinsValue = document.getElementById("headerCoinsValue");
const headerLivesValue = document.getElementById("headerLivesValue");
const shopCoinsDisplay = document.getElementById("shopCoinsDisplay");
const levelNameEl = document.getElementById("levelName");
const levelBadgeEl = document.getElementById("levelBadge");
const activeChallengesContainer = document.getElementById("activeChallenges");

// ========== LEVEL DEFINITIONS ==========
const LEVELS = [
    { min: 0, max: 300, name: 'Ajebutter', badge: 'ajebutter.png' },
    { min: 301, max: 1000, name: 'Naija Pikin', badge: 'naija-pikin.png' },
    { min: 1001, max: 3000, name: 'Ogbonge', badge: 'ogbonge.png' },
    { min: 3001, max: 6000, name: 'Oga Patapata', badge: 'oga-patapata.png' },
    { min: 6001, max: Infinity, name: 'De Genius', badge: 'de-genius.png' }
];

function getLevel(correctCount) {
    for (let lv of LEVELS) {
        if (correctCount >= lv.min && correctCount <= lv.max) {
            return lv;
        }
    }
    return LEVELS[0];
}

function updateLevel(correctCount) {
    const level = getLevel(correctCount);
    if (levelNameEl) levelNameEl.textContent = level.name;
    if (levelBadgeEl) {
        levelBadgeEl.src = `/assets/${level.badge}`;
        levelBadgeEl.onerror = function() {
            this.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%23333'/><text x='50' y='58' font-size='40' text-anchor='middle' fill='%23FFD700'>?</text></svg>";
        };
    }
}

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

        updateHeaderUI(coins, lives);
        if (shopCoinsDisplay) shopCoinsDisplay.textContent = coins;

        // ===== GAME STATS =====
        const totalCorrect = userData.totalCorrectAnswers || 0;
        if (totalGamesPlayed) totalGamesPlayed.textContent = userData.lifetimeRoundPlayed || 0;
        if (correctAnswersEl) correctAnswersEl.textContent = totalCorrect;
        updateLevel(totalCorrect);

        let best = 0;
        const categories = userData.categoryStats || {};
        Object.values(categories).forEach(cat => {
            if (cat.bestScore > best) best = cat.bestScore;
        });
        if (bestScoreValue) bestScoreValue.textContent = best;

        // ===== SHOP INIT =====
        renderShop(coins);
        setupAdButton(userRef, updateHeaderUI);

        // ===== CHALLENGE =====
        const challenge = await getCurrentChallenge(userData, user.uid, db);
        displayActiveChallenge(challenge, userData);

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
                if (shopCoinsDisplay) shopCoinsDisplay.textContent = newCoins;
                if (totalGamesPlayed) totalGamesPlayed.textContent = updated.lifetimeRoundPlayed || 0;
                const newCorrect = updated.totalCorrectAnswers || 0;
                if (correctAnswersEl) correctAnswersEl.textContent = newCorrect;
                updateLevel(newCorrect);

                let newBest = 0;
                const cats = updated.categoryStats || {};
                Object.values(cats).forEach(c => { if (c.bestScore > newBest) newBest = c.bestScore; });
                if (bestScoreValue) bestScoreValue.textContent = newBest;

                // Update challenge display (in case it changed)
                getCurrentChallenge(updated, user.uid, db).then(ch => {
                    displayActiveChallenge(ch, updated);
                });
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

// ========== DISPLAY ACTIVE CHALLENGE ==========
function displayActiveChallenge(challenge, userData) {
    if (!activeChallengesContainer) return;

    // Remove any existing "View All" button (the section-link)
    const viewAll = activeChallengesContainer.querySelector('.section-link');
    if (viewAll) viewAll.remove();

    if (!challenge) {
        activeChallengesContainer.innerHTML = `
            <div class="challenge-card" style="background:rgba(20,25,40,0.6);">
                <i class="fas fa-tasks" style="font-size:1.5rem; color:#a0b3d9; margin-right:0.8rem;"></i>
                <span style="color:#a0b3d9;">Complete a round to unlock your first challenge!</span>
            </div>
        `;
        return;
    }

    const isCompleted = userData.challenge?.completed || false;
    const rewardText = challenge.rewardType === 'coins' 
        ? `+${challenge.rewardValue} coins` 
        : `+1 ${challenge.rewardValue}`;
    const statusText = isCompleted ? '✅ Completed!' : '🔥 Incomplete';
    const statusColor = isCompleted ? '#3ED6B7' : '#FF6B6B';

    activeChallengesContainer.innerHTML = `
        <div class="challenge-card" style="display:flex; align-items:center; gap:0.8rem; background:rgba(20,25,40,0.6); border:1px solid rgba(255,215,0,0.15);">
            <i class="fas ${challenge.icon}" style="font-size:2rem; color:#FFD700; flex-shrink:0;"></i>
            <div style="flex:1; min-width:0;">
                <div style="font-weight:700; font-size:1rem; color:#f0f3fa;">${challenge.title}</div>
                <div style="font-size:0.8rem; color:#a0b3d9;">${rewardText}</div>
            </div>
            <div style="font-size:0.8rem; font-weight:600; color:${statusColor}; flex-shrink:0;">
                ${statusText}
            </div>
        </div>
    `;
}

// ========== MODE BUTTON NAVIGATION ==========
document.getElementById("jollofMixBtn")?.addEventListener("click", () => {
    window.location.href = "games.html";
});
document.getElementById("jollofMixBtnPlay")?.addEventListener("click", () => {
    window.location.href = "games.html";
});
document.getElementById("chooseLaneBtn")?.addEventListener("click", () => {
    window.location.href = "pick-your-lane.html";
});
document.getElementById("chooseLaneBtnPlay")?.addEventListener("click", () => {
    window.location.href = "pick-your-lane.html";
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