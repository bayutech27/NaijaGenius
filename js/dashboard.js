// dashboard.js – Firebase Modular SDK v12.14.0
import { auth, db } from "/js/firebase.config.js";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { renderShop, setupAdButton } from "./shop.js";

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

// ----- Avatar elements -----
const userAvatarBtn = document.getElementById("userAvatarBtn");
const avatarEditBtn = document.getElementById("avatarEditBtn");
const avatarFileInput = document.getElementById("avatarFileInput");
const userAvatarImg = document.getElementById("userAvatarImg");
const userInitialsSpan = document.getElementById("userInitials");

// ========== LEVEL DEFINITIONS ==========
const LEVELS = [
  { min: 0, max: 300, name: "Ajebutter", badge: "ajebutter.png" },
  { min: 301, max: 1000, name: "Naija Pikin", badge: "naija-pikin.png" },
  { min: 1001, max: 3000, name: "Ogbonge", badge: "ogbonge.png" },
  { min: 3001, max: 6000, name: "Oga Patapata", badge: "oga-patapata.png" },
  { min: 6001, max: Infinity, name: "De Genius", badge: "de-genius.png" },
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
    levelBadgeEl.onerror = function () {
      this.src =
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,5 90,25 90,65 50,95 10,65 10,25' fill='%231A1D2E' stroke='%23FFD700' stroke-width='4'/></svg>";
    };
  }

  const xpBar = document.getElementById("xpBar");
  const xpText = document.getElementById("xpText");
  if (xpBar && xpText) {
    let maxVal = level.max;
    if (maxVal === Infinity) {
      maxVal = correctCount + 1;
    }
    const progress = Math.min(
      100,
      ((correctCount - level.min) / (maxVal - level.min)) * 100
    );
    xpBar.style.width = Math.min(100, progress) + "%";
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
        const canvas = document.createElement("canvas");
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
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        let quality = 0.9;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length > maxSizeMB * 1024 * 1024 && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
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
    const userRef = doc(db, "users", userUID);
    await updateDoc(userRef, { avatar: compressedBase64 });
    userAvatarImg.src = compressedBase64;
    userAvatarImg.style.display = "block";
    userInitialsSpan.style.display = "none";
    showToast("Avatar updated successfully!", "success");
  } catch (err) {
    console.error("Avatar upload failed:", err);
    showToast("Failed to upload avatar. Please try again.", "error");
  }
}

// ========== LEADERBOARD ==========
const leaderboardFilter = document.getElementById("leaderboardFilter");
const fullLeaderboard = document.getElementById("fullLeaderboard");
let currentUserUid = null;

// Create a rank display element if it doesn't exist
function ensureRankDisplay() {
  let rankDisplay = document.getElementById("userRankDisplay");
  if (!rankDisplay) {
    const sectionHeader = document.querySelector("#leaderboardSection .section-header");
    if (sectionHeader) {
      rankDisplay = document.createElement("span");
      rankDisplay.id = "userRankDisplay";
      rankDisplay.style.cssText =
        "font-size:0.8rem;font-weight:600;color:#FFD700;margin-left:0.5rem;white-space:nowrap;";
      // Insert after the filter select (which is a child of section-header)
      const filter = sectionHeader.querySelector(".filter-select");
      if (filter) {
        filter.parentNode.insertBefore(rankDisplay, filter.nextSibling);
      } else {
        sectionHeader.appendChild(rankDisplay);
      }
    }
  }
  return rankDisplay;
}

async function loadLeaderboard(filter = "all") {
  if (!fullLeaderboard) return;
  fullLeaderboard.innerHTML =
    '<div class="loading-skeleton">Loading leaderboard…</div>';

  const rankDisplay = ensureRankDisplay();
  if (rankDisplay) rankDisplay.textContent = "";

  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const allUsers = [];
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      // Skip anonymous: require a displayName or username
      const name = data.displayName || data.username;
      if (!name || name.trim() === "" || name === "Anonymous") return;

      let correct = 0;
      if (filter === "all") {
        correct = data.totalCorrectAnswers || 0;
      } else if (filter === "monthly") {
        correct =
          data.monthlyCorrectAnswers !== undefined
            ? data.monthlyCorrectAnswers
            : data.totalCorrectAnswers || 0;
      } else if (filter === "weekly") {
        correct =
          data.weeklyCorrectAnswers !== undefined
            ? data.weeklyCorrectAnswers
            : data.totalCorrectAnswers || 0;
      }
      allUsers.push({
        uid: doc.id,
        displayName: name,
        avatar: data.avatar || null,
        correct: correct,
        level: getLevel(correct).name,
      });
    });

    // Sort by correct descending
    allUsers.sort((a, b) => b.correct - a.correct);

    // Take top 50
    const top50 = allUsers.slice(0, 50);

    if (top50.length === 0) {
      fullLeaderboard.innerHTML =
        '<div class="loading-skeleton">No players found.</div>';
      return;
    }

    let html = "";
    top50.forEach((user, index) => {
      const rank = index + 1;
      let rankClass = "rank-badge";
      if (rank === 1) rankClass += " rank-1";
      else if (rank === 2) rankClass += " rank-2";
      else if (rank === 3) rankClass += " rank-3";

      let avatarHtml = "";
      if (user.avatar) {
        avatarHtml = `<img src="${user.avatar}" alt="avatar" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid #FFD700;">`;
      } else {
        const initials = user.displayName.slice(0, 2).toUpperCase();
        avatarHtml = `<span style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#FFD700,#FF9A3E);color:#0A0A0F;font-weight:700;font-size:0.8rem;">${initials}</span>`;
      }

      html += `
                <div class="leaderboard-item">
                    <span class="${rankClass}">${rank}</span>
                    <div class="leaderboard-avatar" style="flex-shrink:0;width:40px;display:flex;align-items:center;justify-content:center;">
                        ${avatarHtml}
                    </div>
                    <span class="leaderboard-name" style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:#FFFFFF;">${user.displayName}</span>
                    <span class="leaderboard-level" style="flex:1;min-width:0;text-align:center;color:#C9B6FF;font-weight:600;">${user.level}</span>
                    <span class="leaderboard-score" style="font-family:'Orbitron',monospace;font-weight:700;color:#FFD700;min-width:40px;text-align:right;">${user.correct}</span>
                </div>
            `;
    });

    fullLeaderboard.innerHTML = html;

    // ---- Compute current user's rank ----
    if (currentUserUid) {
      const userIndex = allUsers.findIndex((u) => u.uid === currentUserUid);
      if (userIndex !== -1) {
        const rank = userIndex + 1;
        if (rankDisplay) {
          rankDisplay.textContent = `🏆 Your Rank: #${rank}`;
        }
      } else {
        if (rankDisplay) rankDisplay.textContent = "🏆 Unranked";
      }
    }
  } catch (error) {
    console.error("Failed to load leaderboard:", error);
    fullLeaderboard.innerHTML =
      '<div class="loading-skeleton">Failed to load leaderboard. Please try again.</div>';
  }
}

// Set up filter change listener
if (leaderboardFilter) {
  leaderboardFilter.addEventListener("change", () => {
    const filter = leaderboardFilter.value;
    loadLeaderboard(filter);
  });
}

// ========== AUTH GUARD & DATA LOADING ==========
onAuthStateChanged(auth, async (user) => {
  console.log(
    "🔐 Auth state changed (dashboard):",
    user ? `User: ${user.uid}` : "No user"
  );

  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  currentUserUid = user.uid;

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
    console.log("✅ User data loaded:", userData);

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
      userAvatarImg.style.display = "block";
      userInitialsSpan.style.display = "none";
    } else {
      userAvatarImg.style.display = "none";
      userInitialsSpan.style.display = "flex";
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
        lastLiveRenewal: serverTimestamp(),
      });
      console.log("🔄 Lives renewed to 2");
    }

    // Update header and shop
    updateHeaderUI(coins, lives);
    if (shopCoinsDisplay) shopCoinsDisplay.textContent = coins;

    // ===== GAME STATS =====
    const totalCorrect = userData.totalCorrectAnswers || 0;
    if (totalGamesPlayed)
      totalGamesPlayed.textContent = userData.lifetimeRoundPlayed || 0;
    if (correctAnswersEl) correctAnswersEl.textContent = totalCorrect;
    updateLevel(totalCorrect);

    let best = 0;
    const categories = userData.categoryStats || {};
    Object.values(categories).forEach((cat) => {
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

    // ===== ACTIVE CHALLENGE SPACE – left empty for AdMob banner =====
    if (activeChallengesContainer) {
      activeChallengesContainer.innerHTML = ""; // empty container for ad
    }

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
        if (totalGamesPlayed)
          totalGamesPlayed.textContent = updated.lifetimeRoundPlayed || 0;
        if (correctAnswersEl) correctAnswersEl.textContent = newCorrect;
        updateLevel(newCorrect);

        let newBest = 0;
        const cats = updated.categoryStats || {};
        Object.values(cats).forEach((c) => {
          if (c.bestScore > newBest) newBest = c.bestScore;
        });
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
          userAvatarImg.style.display = "block";
          userInitialsSpan.style.display = "none";
        }

        // Update greeting name if displayName changed
        const newName = updated.displayName || updated.username || user.email || "Player";
        if (greetingText) {
          const currentGreeting = getGreeting();
          greetingText.innerHTML = `${currentGreeting}, <span id="greetingName">${newName}</span>`;
        }
      }
    });

    // ===== AVATAR UPLOAD HANDLERS =====
    avatarFileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file.", "error");
        return;
      }
      await handleAvatarUpload(file, user.uid);
      avatarFileInput.value = "";
    });

    userAvatarBtn.addEventListener("click", () => {
      avatarFileInput.click();
    });
    avatarEditBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      avatarFileInput.click();
    });

    // ===== SETTINGS: VOLUME, SOUND, EDIT NAME =====
    const volumeSlider = document.getElementById("volumeSlider");
    const volumeValue = document.getElementById("volumeValue");
    if (volumeSlider && volumeValue) {
      volumeSlider.addEventListener("input", () => {
        volumeValue.textContent = volumeSlider.value + "%";
      });
    }

    const soundToggle = document.getElementById("soundToggle");
    if (soundToggle) {
      soundToggle.addEventListener("change", () => {
        console.log("Sound:", soundToggle.checked ? "ON" : "OFF");
      });
    }

    const editNameInput = document.getElementById("editNameInput");
    const saveNameBtn = document.getElementById("saveNameBtn");
    if (editNameInput && saveNameBtn) {
      saveNameBtn.addEventListener("click", async () => {
        const newName = editNameInput.value.trim();
        if (!newName) {
          showToast("Please enter a name.", "error");
          return;
        }
        try {
          await updateDoc(userRef, {
            displayName: newName,
            username: newName,
          });
          showToast("Name updated successfully!", "success");
          editNameInput.value = "";
          const currentGreeting = getGreeting();
          greetingText.innerHTML = `${currentGreeting}, <span id="greetingName">${newName}</span>`;
          const initials = newName.slice(0, 2).toUpperCase();
          if (userInitialsSpan) userInitialsSpan.textContent = initials;
        } catch (err) {
          console.error("Update name failed:", err);
          showToast("Failed to update name. Please try again.", "error");
        }
      });
    }

    // ===== LOAD LEADERBOARD =====
    // Ensure rank display element exists
    ensureRankDisplay();
    loadLeaderboard("all");

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

// ========== PICK YOUR LANE (merged tab) ==========
document.getElementById("chooseLaneBtn")?.addEventListener("click", () => {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active-section");
  });
  document.getElementById("laneSection")?.classList.add("active-section");
  document.querySelectorAll(".nav-item, .sidebar-item").forEach((item) => {
    item.classList.remove("active");
  });
});

document.getElementById("laneBackBtn")?.addEventListener("click", () => {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active-section");
  });
  document.getElementById("homeSection")?.classList.add("active-section");
  document.querySelectorAll(".nav-item, .sidebar-item").forEach((item) => {
    item.classList.remove("active");
  });
  document.querySelectorAll('[data-nav="home"]').forEach((item) => {
    item.classList.add("active");
  });
});

document.querySelectorAll("#laneSection .lane-card").forEach((card) => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    const exportName = card.dataset.export;
    if (category && exportName) {
      window.location.href = `/app/games.html?category=${category}&export=${exportName}`;
    }
  });
});

// ========== SETTINGS: OPEN/CLOSE ==========
const settingsBtn = document.getElementById("settingsBtn");
const settingsCloseBtn = document.getElementById("settingsCloseBtn");

function openSettings() {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active-section");
  });
  document.getElementById("settingsSection")?.classList.add("active-section");
  document.querySelectorAll(".nav-item, .sidebar-item").forEach((item) => {
    item.classList.remove("active");
  });
}

function closeSettings() {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active-section");
  });
  document.getElementById("homeSection")?.classList.add("active-section");
  document.querySelectorAll(".nav-item, .sidebar-item").forEach((item) => {
    item.classList.remove("active");
  });
  document.querySelectorAll('[data-nav="home"]').forEach((item) => {
    item.classList.add("active");
  });
}

if (settingsBtn) {
  settingsBtn.addEventListener("click", openSettings);
}
if (settingsCloseBtn) {
  settingsCloseBtn.addEventListener("click", closeSettings);
}

// ========== NAVIGATION ==========
document.querySelectorAll("[data-nav]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const target = btn.getAttribute("data-nav");
    if (target) {
      document.querySelectorAll(".page-section").forEach((section) => {
        section.classList.remove("active-section");
      });
      const targetSection = document.getElementById(target + "Section");
      if (targetSection) {
        targetSection.classList.add("active-section");
      }
      document.querySelectorAll(".nav-item, .sidebar-item").forEach((item) => {
        item.classList.remove("active");
      });
      btn.classList.add("active");
    }
  });
});

console.log("Dashboard initialized successfully.");