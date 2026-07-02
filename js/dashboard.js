// dashboard.js – Firebase Modular SDK v12.14.0
import { auth, db } from "/js/firebase.config.js";
import { doc, getDoc, onSnapshot, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { renderShop, setupAdButton } from './shop.js';
import { getCurrentChallenge } from './challenge.js';

// ========== DOM ELEMENTS (Home page) ==========
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

// ========== DOM ELEMENTS (My Stats page) ==========
const correctAnswersStats = document.getElementById("correctAnswersStats");
const bestScoreStats = document.getElementById("bestScoreStats");
const livesStats = document.getElementById("livesStats");
const coinsStats = document.getElementById("coinsStats");
const levelStats = document.getElementById("levelStats");

// ----- Challenge card elements -----
const challengeTitle = document.getElementById("challengeTitle");
const challengeDesc = document.getElementById("challengeDesc");
const challengeProgressBar = document.getElementById("challengeProgressBar");
const challengeProgressText = document.getElementById("challengeProgressText");
const challengeRewardAmount = document.querySelector(".challenge-reward-amount");
const challengeRewardIcon = document.querySelector(".challenge-reward i");

// ----- Avatar elements -----
const userAvatarBtn = document.getElementById("userAvatarBtn");
const avatarEditBtn = document.getElementById("avatarEditBtn");
const avatarFileInput = document.getElementById("avatarFileInput");
const userAvatarImg = document.getElementById("userAvatarImg");
const userInitialsSpan = document.getElementById("userInitials");

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

    const xpBar = document.getElementById("xpBar");
    const xpText = document.getElementById("xpText");
    if (xpBar && xpText) {
        let maxVal = level.max;
        if (maxVal === Infinity) {
            maxVal = correctCount + 1;
        }
        const progress = Math.min(100, ((correctCount - level.min) / (maxVal - level.min)) * 100);
        xpBar.style.width = Math.min(100, progress) + '%';
        if (level.max === Infinity) {
            xpText.textContent = `${correctCount}+ / ∞`;
        } else {
            xpText.textContent = `${correctCount} / ${level.max}`;
        }
    }
}

// ========== HELPER: TIME-BASED GREETING ==========
function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    return "Evening";
}

// ========== AVATAR UPLOAD & COMPRESSION ==========
function compressImage(file, maxSizeMB = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (file.size > 1024 * 1024) {
                    const maxDim = 800;
                    if (width > height) {
                        if (width > maxDim) {
                            height = Math.round(height * (maxDim / width));
                            width = maxDim;
                        }
                    } else {
                        if (height > maxDim) {
                            width = Math.round(width * (maxDim / height));
                            height = maxDim;
                        }
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                let quality = 0.9;
                let dataUrl = canvas.toDataURL('image/jpeg', quality);
                while (dataUrl.length > maxSizeMB * 1024 * 1024 && quality > 0.1) {
                    quality -= 0.1;
                    dataUrl = canvas.toDataURL('image/jpeg', quality);
                }
                resolve(dataUrl);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

async function handleAvatarUpload(file, userUID) {
    try {
        const compressedBase64 = await compressImage(file, 0.8);
        const userRef = doc(db, 'users', userUID);
        await updateDoc(userRef, { avatar: compressedBase64 });
        userAvatarImg.src = compressedBase64;
        userAvatarImg.style.display = 'block';
        userInitialsSpan.style.display = 'none';
        showToast('Avatar updated successfully!', 'success');
    } catch (err) {
        console.error('Avatar upload failed:', err);
        showToast('Failed to upload avatar. Please try again.', 'error');
    }
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
            if (greetingText) {
                greetingText.innerHTML = `${greeting}, <span id="greetingName">${displayName}</span>`;
            }
            const initials = displayName.slice(0, 2).toUpperCase();
            if (userInitialsSpan) userInitialsSpan.textContent = initials;
            return;
        }

        const userData = userSnap.data();
        console.log('✅ User data loaded:', userData);

        // ===== GREETING =====
        const displayName = userData.displayName || userData.username || user.email || "Player";
        const greeting = getGreeting();
        if (greetingText) {
            greetingText.innerHTML = `${greeting}, <span id="greetingName">${displayName}</span>`;
        }
        const initials = displayName.slice(0, 2).toUpperCase();
        if (userInitialsSpan) userInitialsSpan.textContent = initials;

        // ===== AVATAR =====
        if (userData.avatar) {
            userAvatarImg.src = userData.avatar;
            userAvatarImg.style.display = 'block';
            userInitialsSpan.style.display = 'none';
        } else {
            userAvatarImg.style.display = 'none';
            userInitialsSpan.style.display = 'flex';
        }

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

        // Update header and shop
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

        // ===== UPDATE MY STATS PAGE =====
        if (correctAnswersStats) correctAnswersStats.textContent = totalCorrect;
        if (bestScoreStats) bestScoreStats.textContent = best;
        if (livesStats) livesStats.textContent = lives;
        if (coinsStats) coinsStats.textContent = coins;
        if (levelStats) {
            const level = getLevel(totalCorrect);
            levelStats.textContent = level.name;
        }

        // ===== SHOP INIT =====
        renderShop(coins);
        setupAdButton(userRef, updateHeaderUI);

        // ===== CHALLENGE =====
        const challenge = await getCurrentChallenge(userData, user.uid, db);
        displayActiveChallenge(challenge, userData);

        // ===== REAL‑TIME UPDATES =====
        onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const updated = docSnap.data();
                const newCoins = updated.coins || 0;
                const newLives = updated.lives ?? 2;
                const newCorrect = updated.totalCorrectAnswers || 0;

                // Update header & shop
                updateHeaderUI(newCoins, newLives);
                if (shopCoinsDisplay) shopCoinsDisplay.textContent = newCoins;

                // Update home page stats
                if (totalGamesPlayed) totalGamesPlayed.textContent = updated.lifetimeRoundPlayed || 0;
                if (correctAnswersEl) correctAnswersEl.textContent = newCorrect;
                updateLevel(newCorrect);

                let newBest = 0;
                const cats = updated.categoryStats || {};
                Object.values(cats).forEach(c => { if (c.bestScore > newBest) newBest = c.bestScore; });
                if (bestScoreValue) bestScoreValue.textContent = newBest;

                // Update My Stats page
                if (correctAnswersStats) correctAnswersStats.textContent = newCorrect;
                if (bestScoreStats) bestScoreStats.textContent = newBest;
                if (livesStats) livesStats.textContent = newLives;
                if (coinsStats) coinsStats.textContent = newCoins;
                if (levelStats) {
                    const level = getLevel(newCorrect);
                    levelStats.textContent = level.name;
                }

                // Update avatar if changed
                if (updated.avatar) {
                    userAvatarImg.src = updated.avatar;
                    userAvatarImg.style.display = 'block';
                    userInitialsSpan.style.display = 'none';
                }

                // Update greeting name if displayName changed
                const newName = updated.displayName || updated.username || user.email || "Player";
                if (greetingText) {
                    const currentGreeting = getGreeting();
                    greetingText.innerHTML = `${currentGreeting}, <span id="greetingName">${newName}</span>`;
                }

                getCurrentChallenge(updated, user.uid, db).then(ch => {
                    displayActiveChallenge(ch, updated);
                });
            }
        });

        // ===== AVATAR UPLOAD HANDLERS =====
        avatarFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                showToast('Please select an image file.', 'error');
                return;
            }
            await handleAvatarUpload(file, user.uid);
            avatarFileInput.value = '';
        });

        userAvatarBtn.addEventListener('click', () => {
            avatarFileInput.click();
        });
        avatarEditBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            avatarFileInput.click();
        });

        // ===== SETTINGS: VOLUME, SOUND, EDIT NAME =====
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        if (volumeSlider && volumeValue) {
            volumeSlider.addEventListener('input', () => {
                volumeValue.textContent = volumeSlider.value + '%';
            });
        }

        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', () => {
                console.log('Sound:', soundToggle.checked ? 'ON' : 'OFF');
            });
        }

        const editNameInput = document.getElementById('editNameInput');
        const saveNameBtn = document.getElementById('saveNameBtn');
        if (editNameInput && saveNameBtn) {
            saveNameBtn.addEventListener('click', async () => {
                const newName = editNameInput.value.trim();
                if (!newName) {
                    showToast('Please enter a name.', 'error');
                    return;
                }
                try {
                    await updateDoc(userRef, { displayName: newName });
                    showToast('Name updated successfully!', 'success');
                    editNameInput.value = '';
                    // Update greeting immediately
                    const currentGreeting = getGreeting();
                    greetingText.innerHTML = `${currentGreeting}, <span id="greetingName">${newName}</span>`;
                    // Also update initials and My Stats level (if changed?)
                    const initials = newName.slice(0, 2).toUpperCase();
                    if (userInitialsSpan) userInitialsSpan.textContent = initials;
                    // Real-time update will also handle it.
                } catch (err) {
                    console.error('Update name failed:', err);
                    showToast('Failed to update name. Please try again.', 'error');
                }
            });
        }

    } catch (error) {
        console.error("Error loading user data:", error);
        if (greetingText) greetingText.textContent = "Good Day, Player";
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
document.getElementById("oneChanceBtn")?.addEventListener("click", () => {
    window.location.href = "games.html?type=one_chance";
});
document.getElementById("oneChanceBtnPlay")?.addEventListener("click", () => {
    window.location.href = "games.html?type=one_chance";
});

// ========== PICK YOUR LANE (merged tab — no longer a separate page) ==========
// Opens the in-page laneSection tab instead of redirecting to pick-your-lane.html
document.getElementById("chooseLaneBtn")?.addEventListener("click", () => {
    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.remove("active-section");
    });
    document.getElementById("laneSection")?.classList.add("active-section");
    document.querySelectorAll(".nav-item, .sidebar-item").forEach(item => {
        item.classList.remove("active");
    });
});

// Back button inside the lane tab returns to Home and restores the Home nav state
document.getElementById("laneBackBtn")?.addEventListener("click", () => {
    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.remove("active-section");
    });
    document.getElementById("homeSection")?.classList.add("active-section");
    document.querySelectorAll(".nav-item, .sidebar-item").forEach(item => {
        item.classList.remove("active");
    });
    document.querySelectorAll('[data-nav="home"]').forEach(item => {
        item.classList.add("active");
    });
});

// Category card clicks — same destination as before (games.html), no redirect page in between
document.querySelectorAll('#laneSection .lane-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        const exportName = card.dataset.export;
        if (category && exportName) {
            window.location.href = `/app/games.html?category=${category}&export=${exportName}`;
        }
    });
});

// ========== SETTINGS: OPEN/CLOSE ==========
const settingsBtn = document.getElementById('settingsBtn');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');

function openSettings() {
    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.remove("active-section");
    });
    document.getElementById("settingsSection")?.classList.add("active-section");
    document.querySelectorAll(".nav-item, .sidebar-item").forEach(item => {
        item.classList.remove("active");
    });
}

function closeSettings() {
    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.remove("active-section");
    });
    document.getElementById("homeSection")?.classList.add("active-section");
    document.querySelectorAll(".nav-item, .sidebar-item").forEach(item => {
        item.classList.remove("active");
    });
    document.querySelectorAll('[data-nav="home"]').forEach(item => {
        item.classList.add("active");
    });
}

if (settingsBtn) {
    settingsBtn.addEventListener('click', openSettings);
}
if (settingsCloseBtn) {
    settingsCloseBtn.addEventListener('click', closeSettings);
}

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