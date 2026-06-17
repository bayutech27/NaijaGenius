// dashboard.js – Firebase Modular SDK v12.14.0
import { auth, db } from "/js/firebase.config.js";
import { doc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { showFunFactModal } from './fun-fact.js';

// ========== DOM ELEMENTS ==========
const walletBalance = document.getElementById("walletBalance");
const totalGamesPlayed = document.getElementById("totalGamesPlayed");
const winRate = document.getElementById("winRate");
const bestScoreValue = document.getElementById("bestScoreValue");
const referralCode = document.getElementById("referralCode");

// Profile elements
const profileInitials = document.getElementById("profileInitials");
const profileName = document.getElementById("profileName");
const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");
const profileState = document.getElementById("profileState");
const profileReferralCode = document.getElementById("profileReferralCode");
const profileGamesPlayed = document.getElementById("profileGamesPlayed");
const profileWinRate = document.getElementById("profileWinRate");
const profileStreak = document.getElementById("profileStreak");
const profileBestScore = document.getElementById("profileBestScore");
const userInitials = document.getElementById("userInitials");

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

        // ===== POPULATE DASHBOARD =====
        if (walletBalance) {
            walletBalance.textContent = userData.balance || 0;
        }

        if (totalGamesPlayed) {
            totalGamesPlayed.textContent = userData.lifetimeRoundPlayed || 0;
        }
        if (winRate) {
            winRate.textContent = "0%";
        }

        let best = 0;
        if (bestScoreValue) {
            const categories = userData.categoryStats || {};
            Object.values(categories).forEach(cat => {
                if (cat.bestScore > best) best = cat.bestScore;
            });
            bestScoreValue.textContent = best;
        }

        if (referralCode) {
            referralCode.textContent = userData.referralCode || "N/A";
        }

        // ===== POPULATE PROFILE =====
        const displayName = userData.displayName || "User";
        const initials = displayName.slice(0, 2).toUpperCase();
        if (profileInitials) profileInitials.textContent = initials;
        if (userInitials) userInitials.textContent = initials;
        if (profileName) profileName.textContent = displayName;
        if (profileUsername) profileUsername.textContent = `@${displayName.toLowerCase().replace(/\s/g, "")}`;

        if (profileEmail) profileEmail.textContent = userData.email || "-";
        if (profilePhone) profilePhone.textContent = userData.phone || "-";
        if (profileState) profileState.textContent = userData.state || "-";
        if (profileReferralCode) profileReferralCode.textContent = userData.referralCode || "-";

        if (profileGamesPlayed) profileGamesPlayed.textContent = userData.lifetimeRoundPlayed || 0;
        if (profileWinRate) profileWinRate.textContent = "0%";
        if (profileStreak) profileStreak.textContent = userData.loginStreak || 0;
        if (profileBestScore) profileBestScore.textContent = best;

        // Show fun fact modal after a short delay
        setTimeout(() => {
            showFunFactModal(displayName, true);
        }, 1500);

        // ===== SET UP REAL‑TIME UPDATES =====
        onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const updated = docSnap.data();
                if (walletBalance) walletBalance.textContent = updated.balance || 0;
                if (totalGamesPlayed) totalGamesPlayed.textContent = updated.lifetimeRoundPlayed || 0;
                if (profileStreak) profileStreak.textContent = updated.loginStreak || 0;
                let newBest = 0;
                const cats = updated.categoryStats || {};
                Object.values(cats).forEach(c => { if (c.bestScore > newBest) newBest = c.bestScore; });
                if (bestScoreValue) bestScoreValue.textContent = newBest;
                if (profileBestScore) profileBestScore.textContent = newBest;
            }
        });

    } catch (error) {
        console.error("Error loading user data:", error);
    }
});

// ========== LOGOUT ==========
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = "/index.html";
        } catch (error) {
            console.error("Logout error:", error);
            alert("Failed to logout. Please try again.");
        }
    });
}

// ========== COPY REFERRAL CODE ==========
const copyBtn = document.getElementById("copyReferralBtn");
if (copyBtn) {
    copyBtn.addEventListener("click", () => {
        const code = document.getElementById("referralCode")?.textContent;
        if (code && code !== "LOADING") {
            navigator.clipboard?.writeText(code).then(() => {
                alert("Referral code copied!");
            }).catch(() => {
                const textarea = document.createElement("textarea");
                textarea.value = code;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                textarea.remove();
                alert("Referral code copied!");
            });
        }
    });
}

// ========== COPY PROFILE REFERRAL ==========
const copyProfileBtn = document.getElementById("copyProfileReferral");
if (copyProfileBtn) {
    copyProfileBtn.addEventListener("click", () => {
        const code = document.getElementById("profileReferralCode")?.textContent;
        if (code && code !== "-") {
            navigator.clipboard?.writeText(code).then(() => {
                alert("Referral code copied!");
            }).catch(() => {
                const textarea = document.createElement("textarea");
                textarea.value = code;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                textarea.remove();
                alert("Referral code copied!");
            });
        }
    });
}

console.log("Dashboard initialized successfully.");