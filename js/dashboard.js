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

// ----- Challenge card elements -----
const challengeTitle = document.getElementById("challengeTitle");
const challengeDesc = document.getElementById("challengeDesc");
const challengeProgressBar = document.getElementById("challengeProgressBar");
const challengeProgressText = document.getElementById("challengeProgressText");
const challengeRewardAmount = document.querySelector(".challenge-reward-amount");
const challengeRewardIcon = document.querySelector(".challenge-reward i");

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
            this.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,5 90,25 90,65 50,95 10,65 10,25' fill='%231A1D2E' stroke='%23FFD700' stroke-width='4'/></svg>";
        };
    }

    // Update XP progress bar and text (no "XP" label)
    const xpBar = document.getElementById("xpBar");
    const xpText = document.getElementById("xpText");
    if (xpBar && xpText) {
        // Calculate progress: (correctCount - level.min) / (level.max - level.min)
        // For De Genius (Infinity), we set max to correctCount + 1 to show full bar
        let maxVal = level.max;
        if (maxVal === Infinity) {
            maxVal = correctCount + 1; // always show full bar
        }
        const progress = Math.min(100, ((correctCount - level.min) / (maxVal - level.min)) * 100);
        xpBar.style.width = Math.min(100, progress) + '%';
        // Display "correctCount / level.max" (or "correctCount+" for De Genius)
        if (level.max === Infinity) {
            xpText.textContent = `${correctCount}+ / ∞`;
        } else {
            xpText.textContent = `${correctCount} / ${level.max}`;
        }
    }
}

// ========== HELPER: TIME-BASED GREETING (no "Good") ==========
function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    return "Evening";
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

        // ===== GREETING (time‑based, no "Good") =====
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
    if (!challenge) {
        if (challengeTitle) challengeTitle.textContent = "No Active Challenge";
        if (challengeDesc) challengeDesc.textContent = "Complete a round to unlock your first challenge!";
        if (challengeProgressBar) challengeProgressBar.style.width = "0%";
        if (challengeProgressText) challengeProgressText.textContent = "0 / 0 Questions";
        return;
    }

    if (challengeTitle) challengeTitle.textContent = challenge.title || "Daily Challenge";
    if (challengeDesc) {
        challengeDesc.textContent = challenge.description || "Answer questions and earn rewards!";
    }

    if (challengeRewardIcon) {
        if (challenge.rewardType === 'coins') {
            challengeRewardIcon.className = 'fas fa-coins';
            challengeRewardIcon.style.color = '#FFD700';
        } else {
            const icons = {
                fifty_fifty: 'fa-percent',
                ask_crowd: 'fa-users',
                callFriend: 'fa-phone'
            };
            challengeRewardIcon.className = `fas ${icons[challenge.rewardValue] || 'fa-gift'}`;
            challengeRewardIcon.style.color = '#9B6BFF';
        }
    }
    if (challengeRewardAmount) {
        if (challenge.rewardType === 'coins') {
            challengeRewardAmount.textContent = challenge.rewardValue;
        } else {
            const labels = {
                fifty_fifty: '50:50',
                ask_crowd: 'Crowd',
                callFriend: 'Call'
            };
            challengeRewardAmount.textContent = `+1 ${labels[challenge.rewardValue] || 'Lifeline'}`;
        }
    }

    const isCompleted = userData.challenge?.completed || false;
    if (isCompleted) {
        if (challengeProgressBar) challengeProgressBar.style.width = "100%";
        if (challengeProgressText) challengeProgressText.textContent = "Completed!";
    } else {
        if (challengeProgressText) challengeProgressText.textContent = "Incomplete";
    }
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