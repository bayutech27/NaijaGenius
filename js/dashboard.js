// dashboard.js – Firebase Modular SDK v12.14.0
import { auth, db } from "/js/firebase.config.js";
import { logoutUser } from "./auth.js";

import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getCountFromServer,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { renderShop, setupAdButton } from "./shop.js";
import { logNavigation, logLevelUp } from "./analytics.js";
import {
  setSoundEnabled,
  isSoundEnabled,
  setMasterVolume,
} from "./sound.js";

// ========== WEEK ID HELPER (ISO) ==========
function getCurrentWeekId(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'success', duration = 10000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, duration);
}

// ========== CAPITALISE HELPER ==========
function capitaliseFirst(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
const activeChallengesContainer = document.getElementById("activeChallenges");

// ========== DOM ELEMENTS (My Stats page) ==========
const correctAnswersStats = document.getElementById("correctAnswersStats");
const bestScoreStats = document.getElementById("bestScoreStats");
const livesStats = document.getElementById("livesStats");
const coinsStats = document.getElementById("coinsStats");
const levelStats = document.getElementById("levelStats");

// ----- Avatar elements -----
const userAvatarBtn = document.getElementById("userAvatarBtn");
const avatarFileInput = document.getElementById("avatarFileInput");
const userAvatarImg = document.getElementById("userAvatarImg");
const userInitialsSpan = document.getElementById("userInitials");

// ========== HEADER TOGGLE ==========
const appHeader = document.querySelector(".app-header");

function toggleHeaderVisibility(sectionId) {
  if (!appHeader) return;
  if (sectionId === "home" || sectionId === "homeSection") {
    appHeader.classList.remove("hidden");
  } else {
    appHeader.classList.add("hidden");
  }
  logNavigation(sectionId);
}

// ========== LEVEL DEFINITIONS ==========
const LEVELS = [
  { min: 0, max: 300, name: "Ajebutter", badge: "ajebutter.png" },
  { min: 301, max: 1000, name: "Naija Pikin", badge: "naija-pikin.png" },
  { min: 1001, max: 3000, name: "Ogbonge", badge: "ogbonge.png" },
  { min: 3001, max: 6000, name: "Oga Patapata", badge: "oga-patapata.png" },
  { min: 6001, max: Infinity, name: "De Genius", badge: "de-genius.png" },
];

let previousLevel = null;

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

  const xpBar = document.getElementById("xpBar");
  const xpText = document.getElementById("xpText");
  if (xpBar && xpText) {
    let maxVal = level.max;
    if (maxVal === Infinity) {
      maxVal = correctCount + 1;
    }
    const progress = Math.min(100, ((correctCount - level.min) / (maxVal - level.min)) * 100);
    xpBar.style.width = Math.min(100, progress) + "%";
    if (level.max === Infinity) {
      xpText.textContent = `${correctCount}+ / ∞`;
    } else {
      xpText.textContent = `${correctCount} / ${level.max}`;
    }
  }

  if (previousLevel !== level.name) {
    logLevelUp(level.name);
    previousLevel = level.name;
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

// ========== LEADERBOARD (with pagination) ==========
const leaderboardFilter = document.getElementById("leaderboardFilter");
const fullLeaderboard = document.getElementById("fullLeaderboard");
let currentUserUid = null;
let leaderboardLastDoc = null;
let leaderboardHasMore = true;
const LEADERBOARD_PAGE_SIZE = 20;
let currentFilter = "all";

function getOrderField(filter) {
  switch (filter) {
    case "monthly": return "monthlyCorrectAnswers";
    case "weekly": return "weeklyCorrectAnswers";
    default: return "totalCorrectAnswers";
  }
}

function getScoreField(filter) { return getOrderField(filter); }

function ensureRankDisplay() {
  let rankDisplay = document.getElementById("userRankDisplay");
  if (!rankDisplay) {
    const sectionHeader = document.querySelector("#leaderboardSection .section-header");
    if (sectionHeader) {
      rankDisplay = document.createElement("span");
      rankDisplay.id = "userRankDisplay";
      rankDisplay.style.cssText =
        "font-size:0.8rem;font-weight:600;color:#FFD700;margin-left:0.5rem;white-space:nowrap;";
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

async function computeUserRank(uid, filter) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;
    const userScore = userSnap.data()[getScoreField(filter)] || 0;
    const q = query(collection(db, "users"), where(getScoreField(filter), ">", userScore));
    const snapshot = await getCountFromServer(q);
    return { rank: snapshot.data().count + 1, score: userScore };
  } catch (err) {
    console.warn("Failed to compute rank:", err);
    return null;
  }
}

/**
 * Fetch the immediate higher‑ranked user for a given filter and score.
 * Returns null if the user is already #1.
 */
async function getNextHigherUser(filter, userScore) {
  try {
    const field = getScoreField(filter);
    const q = query(
      collection(db, "users"),
      where(field, ">", userScore),
      orderBy(field, "asc"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docData = snap.docs[0].data();
    return {
      name: capitaliseFirst(docData.displayName || docData.username || "Anonymous"),
      score: docData[field] || 0,
    };
  } catch (err) {
    console.warn("Failed to fetch next higher user:", err);
    return null;
  }
}

function renderLeaderboardItems(users, offset) {
  const listContainer = document.getElementById("leaderboardItems") || fullLeaderboard;
  if (!listContainer) return;
  if (offset === 0) listContainer.innerHTML = "";
  let html = "";
  users.forEach((user, index) => {
    const rank = offset + index + 1;
    let rankClass = "rank-badge";
    if (rank === 1) rankClass += " rank-1";
    else if (rank === 2) rankClass += " rank-2";
    else if (rank === 3) rankClass += " rank-3";
    html += `
      <div class="leaderboard-item">
          <span class="${rankClass}">${rank}</span>
          <span class="leaderboard-name" style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:#FFFFFF;">${user.displayName}</span>
          <span class="leaderboard-level" style="flex:1;min-width:0;text-align:center;color:#C9B6FF;font-weight:600;">${user.level}</span>
          <span class="leaderboard-score" style="font-family:'Orbitron',monospace;font-weight:700;color:#FFD700;min-width:40px;text-align:right;">${user.correct}</span>
      </div>
    `;
  });
  listContainer.innerHTML += html;
  const loadMoreContainer = document.getElementById("leaderboardLoadMore");
  if (loadMoreContainer) {
    if (leaderboardHasMore) {
      loadMoreContainer.style.display = "block";
      loadMoreContainer.innerHTML = '<button id="loadMoreBtn" class="load-more-btn">Load More</button>';
      document.getElementById("loadMoreBtn")?.addEventListener("click", loadMoreLeaderboard);
    } else {
      loadMoreContainer.style.display = "none";
    }
  }
}

async function loadLeaderboard(filter = "all", reset = true) {
  if (!fullLeaderboard) return;
  if (reset) {
    leaderboardLastDoc = null;
    leaderboardHasMore = true;
    fullLeaderboard.innerHTML = '<div class="loading-skeleton">Loading leaderboard…</div>';
  } else {
    const loadMoreContainer = document.getElementById("leaderboardLoadMore");
    if (loadMoreContainer) {
      loadMoreContainer.innerHTML = '<div class="loading-skeleton" style="padding:0.5rem;">Loading more…</div>';
    }
  }
  const rankDisplay = ensureRankDisplay();
  if (reset && rankDisplay) rankDisplay.textContent = "";
  try {
    const orderField = getOrderField(filter);
    const q = query(collection(db, "users"), orderBy(orderField, "desc"), limit(LEADERBOARD_PAGE_SIZE + 1));
    let queryRef = q;
    if (leaderboardLastDoc) {
      queryRef = query(q, startAfter(leaderboardLastDoc));
    }
    const snapshot = await getDocs(queryRef);
    const docs = snapshot.docs;
    const hasMore = docs.length > LEADERBOARD_PAGE_SIZE;
    const users = docs.slice(0, LEADERBOARD_PAGE_SIZE).map((doc) => {
      const data = doc.data();
      const name = capitaliseFirst(data.displayName || data.username || "Anonymous");
      return {
        uid: doc.id,
        displayName: name,
        correct: data[orderField] || 0,
        level: getLevel(data.totalCorrectAnswers || 0).name,
      };
    });
    if (users.length > 0) {
      leaderboardLastDoc = docs[LEADERBOARD_PAGE_SIZE - 1];
    } else {
      leaderboardLastDoc = null;
    }
    leaderboardHasMore = hasMore;
    const offset = reset ? 0 : (fullLeaderboard.querySelectorAll(".leaderboard-item").length || 0);
    if (reset) {
      fullLeaderboard.innerHTML = `<div id="leaderboardItems"></div><div id="leaderboardLoadMore"></div>`;
    }
    renderLeaderboardItems(users, offset);
    if (users.length === 0 && reset) {
      const list = document.getElementById("leaderboardItems");
      if (list) list.innerHTML = '<div class="loading-skeleton">No players found.</div>';
    }

    // ===== RANK DISPLAY WITH MOVEMENT INDICATOR + GAP TO NEXT =====
    if (reset && currentUserUid) {
      const rankData = await computeUserRank(currentUserUid, filter);
      if (!rankDisplay || !rankData) return;
      const rank = rankData.rank;
      const userScore = rankData.score;
      const baseText = rank !== null ? `🏆 Your Rank: #${rank}` : "🏆 Unranked";

      // Build overtake message (for both weekly and all-time)
      let overtakeHTML = "";
      if (rank > 1) {
        const nextUser = await getNextHigherUser(filter, userScore);
        if (nextUser) {
          const diff = nextUser.score - userScore;
          overtakeHTML = `<br><span style="color:#C9D3EE;font-size:0.7rem;">You need ${diff} more correct ${diff === 1 ? "answer" : "answers"} to overtake ${nextUser.name} (#${rank - 1})</span>`;
        }
      }

      if (filter === "weekly" && rank !== null) {
        let storedRank = null;
        let storedPeriod = null;
        let delta = null;
        try {
          const currentWeek = getCurrentWeekId();
          const userRef = doc(db, "users", currentUserUid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            storedRank = data.lastSeenRank_weekly;
            storedPeriod = data.lastSeenRankPeriodId;
            if (storedPeriod === currentWeek && typeof storedRank === "number") {
              const change = storedRank - rank;
              if (change > 0) delta = { text: `▲${change}`, color: "#4caf50" };
              else if (change < 0) delta = { text: `▼${Math.abs(change)}`, color: "#f44336" };
              else delta = { text: "—", color: "#9e9e9e" };
            }
          }
          // clear and rebuild (include overtake message)
          rankDisplay.innerHTML = "";
          rankDisplay.appendChild(document.createTextNode(baseText + " "));
          if (delta) {
            const span = document.createElement("span");
            span.style.cssText = `color:${delta.color};margin-left:0.25em;`;
            span.textContent = delta.text;
            rankDisplay.appendChild(span);
          } else {
            const span = document.createElement("span");
            span.style.cssText = "color:#9e9e9e;margin-left:0.25em;";
            span.textContent = "New";
            rankDisplay.appendChild(span);
          }
          // Append overtake info
          if (overtakeHTML) {
            rankDisplay.innerHTML += overtakeHTML;
          }
          // write back new rank only if changed
          if (rank !== storedRank || storedPeriod !== currentWeek) {
            await updateDoc(userRef, {
              lastSeenRank_weekly: rank,
              lastSeenRankPeriodId: currentWeek
            }).catch(e => console.warn("Failed to update last seen rank:", e));
          }
        } catch (err) {
          console.warn("Rank movement error:", err);
          rankDisplay.textContent = baseText;
          if (overtakeHTML) rankDisplay.innerHTML += overtakeHTML;
        }
      } else {
        // All-time (or non-weekly) – no movement, just rank + overtake
        rankDisplay.innerHTML = baseText + overtakeHTML;
      }
    }
  } catch (error) {
    console.error("Failed to load leaderboard:", error);
    if (reset) {
      fullLeaderboard.innerHTML = '<div class="loading-skeleton">Failed to load leaderboard. Please try again.</div>';
    } else {
      const loadMoreContainer = document.getElementById("leaderboardLoadMore");
      if (loadMoreContainer) {
        loadMoreContainer.innerHTML =
          '<div class="loading-skeleton" style="padding:0.5rem;">Failed to load more. <button id="retryLoadMoreBtn" class="load-more-btn">Retry</button></div>';
        document.getElementById("retryLoadMoreBtn")?.addEventListener("click", loadMoreLeaderboard);
      }
    }
  }
}

function loadMoreLeaderboard() {
  if (!leaderboardHasMore) return;
  loadLeaderboard(currentFilter, false);
}

if (leaderboardFilter) {
  leaderboardFilter.addEventListener("change", () => {
    currentFilter = leaderboardFilter.value;
    loadLeaderboard(currentFilter, true);
  });
}

// ========== AUTH GUARD & DATA LOADING ==========
onAuthStateChanged(auth, async (user) => {
  console.log("🔐 Auth state changed (dashboard):", user ? `User: ${user.uid}` : "No user");
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
      const displayName = capitaliseFirst(user.email || "Player");
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

    // GREETING – capitalise first letter
    const displayName = capitaliseFirst(userData.displayName || userData.username || user.email || "Player");
    const greeting = getGreeting();
    if (greetingText) {
      greetingText.innerHTML = `${greeting}, <span id="greetingName">${displayName}</span>`;
    }
    const initials = displayName.slice(0, 2).toUpperCase();
    if (userInitialsSpan) userInitialsSpan.textContent = initials;

    // AVATAR
    if (userData.avatar) {
      userAvatarImg.src = userData.avatar;
      userAvatarImg.style.display = "block";
      userInitialsSpan.style.display = "none";
    } else {
      userAvatarImg.style.display = "none";
      userInitialsSpan.style.display = "flex";
    }

    // COINS & LIVES
    let coins = userData.coins || 0;
    let lives = userData.lives ?? 2;
    let lastRenewal = userData.lastLiveRenewal?.toDate?.() || new Date(0);
    const now = new Date();
    const hoursSince = (now - lastRenewal) / (1000 * 60 * 60);
    if (hoursSince >= 24) {
      lives = 2;
      await updateDoc(userRef, { lives: 2, lastLiveRenewal: serverTimestamp() });
      console.log("🔄 Lives renewed to 2");
    }
    updateHeaderUI(coins, lives);
    if (shopCoinsDisplay) shopCoinsDisplay.textContent = coins;

    // ===== CHECK FOR WELCOME BONUS NOTIFICATION =====
    if (userData.hasReceivedBonus === true && userData.bonusNotified !== true) {
        setTimeout(() => {
            showToast('🎉 Congratulations! You earned 1000 bonus coins for being one of our first 200 users!', 'success', 15000);
        }, 1000);
        await updateDoc(userRef, { bonusNotified: true });
    }

    // GAME STATS
    const totalCorrect = userData.totalCorrectAnswers || 0;
    if (totalGamesPlayed) totalGamesPlayed.textContent = userData.lifetimeRoundPlayed || 0;
    if (correctAnswersEl) correctAnswersEl.textContent = totalCorrect;
    updateLevel(totalCorrect);
    let best = 0;
    const categories = userData.categoryStats || {};
    Object.values(categories).forEach((cat) => {
      if (cat.bestScore > best) best = cat.bestScore;
    });
    if (bestScoreValue) bestScoreValue.textContent = best;

    // UPDATE MY STATS PAGE
    if (correctAnswersStats) correctAnswersStats.textContent = totalCorrect;
    if (bestScoreStats) bestScoreStats.textContent = best;
    if (livesStats) livesStats.textContent = lives;
    if (coinsStats) coinsStats.textContent = coins;
    if (levelStats) {
      const level = getLevel(totalCorrect);
      levelStats.textContent = level.name;
    }

    // Hide level badge image entirely (keep level name + XP bar)
    const levelBadge = document.getElementById("levelBadge");
    if (levelBadge) levelBadge.style.display = "none";

    // SHOP INIT
    renderShop(coins);
    setupAdButton(userRef, updateHeaderUI);

    // ACTIVE CHALLENGE SPACE
    if (activeChallengesContainer) {
      activeChallengesContainer.innerHTML = "";
    }

    // REAL‑TIME UPDATES
    onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const updated = docSnap.data();
        const newCoins = updated.coins || 0;
        const newLives = updated.lives ?? 2;
        const newCorrect = updated.totalCorrectAnswers || 0;
        updateHeaderUI(newCoins, newLives);
        if (shopCoinsDisplay) shopCoinsDisplay.textContent = newCoins;
        if (totalGamesPlayed) totalGamesPlayed.textContent = updated.lifetimeRoundPlayed || 0;
        if (correctAnswersEl) correctAnswersEl.textContent = newCorrect;
        updateLevel(newCorrect);
        let newBest = 0;
        const cats = updated.categoryStats || {};
        Object.values(cats).forEach((c) => {
          if (c.bestScore > newBest) newBest = c.bestScore;
        });
        if (bestScoreValue) bestScoreValue.textContent = newBest;
        if (correctAnswersStats) correctAnswersStats.textContent = newCorrect;
        if (bestScoreStats) bestScoreStats.textContent = newBest;
        if (livesStats) livesStats.textContent = newLives;
        if (coinsStats) coinsStats.textContent = newCoins;
        if (levelStats) {
          const level = getLevel(newCorrect);
          levelStats.textContent = level.name;
        }
        if (updated.avatar) {
          userAvatarImg.src = updated.avatar;
          userAvatarImg.style.display = "block";
          userInitialsSpan.style.display = "none";
        }
        const newName = capitaliseFirst(updated.displayName || updated.username || user.email || "Player");
        if (greetingText) {
          const currentGreeting = getGreeting();
          greetingText.innerHTML = `${currentGreeting}, <span id="greetingName">${newName}</span>`;
        }
      }
    });

    // AVATAR UPLOAD HANDLERS
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

    // SETTINGS – Sound & Volume wiring (background music removed)
    const volumeSlider = document.getElementById("volumeSlider");
    const volumeValue = document.getElementById("volumeValue");
    if (volumeSlider && volumeValue) {
      setMasterVolume(parseInt(volumeSlider.value, 10));
      volumeSlider.addEventListener("input", () => {
        const newVolume = parseInt(volumeSlider.value, 10);
        volumeValue.textContent = newVolume + "%";
        setMasterVolume(newVolume);
      });
    }
    const soundToggle = document.getElementById("soundToggle");
    if (soundToggle) {
      soundToggle.checked = isSoundEnabled();
      soundToggle.addEventListener("change", () => {
        setSoundEnabled(soundToggle.checked);
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
          await updateDoc(userRef, { displayName: newName, username: newName });
          showToast("Name updated successfully!", "success");
          editNameInput.value = "";
          const currentGreeting = getGreeting();
          greetingText.innerHTML = `${currentGreeting}, <span id="greetingName">${capitaliseFirst(newName)}</span>`;
          const initials = newName.slice(0, 2).toUpperCase();
          if (userInitialsSpan) userInitialsSpan.textContent = initials;
        } catch (err) {
          console.error("Update name failed:", err);
          showToast("Failed to update name. Please try again.", "error");
        }
      });
    }

    // LOAD LEADERBOARD (background music removed)
    ensureRankDisplay();
    currentFilter = leaderboardFilter ? leaderboardFilter.value : "all";
    loadLeaderboard(currentFilter, true);

    // SETUP ANNOUNCEMENT LISTENER
    setupAnnouncementListener();
  } catch (error) {
    console.error("Error loading user data:", error);
    if (greetingText) greetingText.textContent = "Good Day, Player";
    if (greetingName) greetingName.textContent = "Player";
  }
});

// ========== ANNOUNCEMENT ==========
function showAnnouncement(announcement) {
  if (!announcement || !announcement.message) {
    hideAnnouncement();
    return;
  }
  const container = document.getElementById('announcementContainer');
  if (!container) return;
  const message = announcement.message || '';
  const type = announcement.type || 'info';
  container.innerHTML = `
    <div class="announcement-banner announcement-${type}">
      <span class="announcement-text">${message}</span>
      <button class="announcement-close" id="announcementCloseBtn">&times;</button>
    </div>
  `;
  container.style.display = 'block';
  const closeBtn = document.getElementById('announcementCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideAnnouncement);
  }
}

function hideAnnouncement() {
  const container = document.getElementById('announcementContainer');
  if (container) {
    container.style.display = 'none';
  }
}

function setupAnnouncementListener() {
  try {
    const announcementRef = doc(db, 'announcement', 'current');
    onSnapshot(announcementRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        showAnnouncement(data);
      } else {
        hideAnnouncement();
      }
    }, (error) => {
      console.error('Announcement listener error:', error);
    });
  } catch (err) {
    console.error('Failed to set up announcement listener:', err);
  }
}

// ========== UI HELPERS ==========
function updateHeaderUI(coins, lives) {
  if (headerCoinsValue) headerCoinsValue.textContent = coins;
  if (headerLivesValue) headerLivesValue.textContent = lives;
}

// ========== MODE BUTTON NAVIGATION ==========
document.getElementById("jollofMixBtn")?.addEventListener("click", () => {
  window.location.replace("games.html");
});
document.getElementById("jollofMixBtnPlay")?.addEventListener("click", () => {
  window.location.replace("games.html");
});
document.getElementById("oneChanceBtn")?.addEventListener("click", () => {
  window.location.replace("games.html?type=one_chance");
});
document.getElementById("oneChanceBtnPlay")?.addEventListener("click", () => {
  window.location.replace("games.html?type=one_chance");
});

// ========== PICK YOUR LANE ==========
document.getElementById("chooseLaneBtn")?.addEventListener("click", () => {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active-section");
  });
  document.getElementById("laneSection")?.classList.add("active-section");
  document.querySelectorAll(".nav-item, .sidebar-item").forEach((item) => {
    item.classList.remove("active");
  });
  toggleHeaderVisibility("laneSection");
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
  toggleHeaderVisibility("home");
});

document.querySelectorAll("#laneSection .lane-card").forEach((card) => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    const exportName = card.dataset.export;
    if (category && exportName) {
      window.location.replace(`/app/games.html?category=${category}&export=${exportName}`);
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
  toggleHeaderVisibility("settingsSection");
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
  toggleHeaderVisibility("home");
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
      toggleHeaderVisibility(target);
    }
  });
});

toggleHeaderVisibility("home");
console.log("Dashboard initialized successfully.");

// ========== SETTINGS: LOGOUT ==========
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logoutUser();
  });
}

// ========== FEEDBACK MODAL ==========
const feedbackBtn = document.getElementById("feedbackBtn");
const feedbackModal = document.getElementById("feedbackModal");
const closeFeedbackBtn = document.getElementById("closeFeedbackBtn");
const cancelFeedbackBtn = document.getElementById("cancelFeedbackBtn");
const sendFeedbackBtn = document.getElementById("sendFeedbackBtn");
const feedbackMessage = document.getElementById("feedbackMessage");

function openFeedbackModal() {
  if (feedbackModal) {
    feedbackModal.style.display = "flex";
    feedbackMessage.value = "";
    sendFeedbackBtn.disabled = false;
    feedbackMessage.focus();
  }
}

function closeFeedbackModal() {
  if (feedbackModal) feedbackModal.style.display = "none";
}

if (feedbackBtn) {
  feedbackBtn.addEventListener("click", openFeedbackModal);
}
if (closeFeedbackBtn) {
  closeFeedbackBtn.addEventListener("click", closeFeedbackModal);
}
if (cancelFeedbackBtn) {
  cancelFeedbackBtn.addEventListener("click", closeFeedbackModal);
}
if (feedbackModal) {
  feedbackModal.addEventListener("click", (e) => {
    if (e.target === feedbackModal) closeFeedbackModal();
  });
}

if (sendFeedbackBtn) {
  sendFeedbackBtn.addEventListener("click", async () => {
    const message = feedbackMessage.value.trim();
    if (!message) {
      showToast("Please type a message.", "error");
      return;
    }
    sendFeedbackBtn.disabled = true;
    sendFeedbackBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
    try {
      const userRef = doc(db, "users", currentUserUid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        showToast("User data not found.", "error");
        sendFeedbackBtn.disabled = false;
        sendFeedbackBtn.innerHTML = 'Send <i class="fas fa-paper-plane"></i>';
        return;
      }
      const userData = userSnap.data();

      let email = "";
      try {
        const privateRef = doc(db, "users", currentUserUid, "private", "info");
        const privateSnap = await getDoc(privateRef);
        if (privateSnap.exists()) {
          email = privateSnap.data().email || "";
        }
      } catch (privateErr) {
        console.warn("Could not fetch private email:", privateErr);
      }

      const feedbackData = {
        uid: currentUserUid,
        displayName: userData.displayName || "Anonymous",
        email: email,
        message: message,
        status: "new",
        timestamp: serverTimestamp()
      };
      await addDoc(collection(db, "feedback"), feedbackData);
      showToast("Feedback sent! Thank you 🙏", "success");
      closeFeedbackModal();
    } catch (err) {
      console.error("Error sending feedback:", err);
      showToast("Failed to send. Please try again.", "error");
    } finally {
      sendFeedbackBtn.disabled = false;
      sendFeedbackBtn.innerHTML = 'Send <i class="fas fa-paper-plane"></i>';
    }
  });
}