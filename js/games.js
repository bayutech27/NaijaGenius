// ========== IMPORTS ==========
import { auth, db } from '/js/firebase.config.js';
import {
  doc, getDoc, setDoc, updateDoc, addDoc, collection,
  query, where, getDocs, serverTimestamp, increment, deleteDoc
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js';
import {
  onThreeStreakLoss,
  onFiveStreakLoss,
  onCorrectAfterStreak,
  onTwoStreakWin,
  onFiveStreakWin,
  getEndOfRoundComment
} from './comments.js';

// ========== MODULE STATE ==========
let currentUserUID = null;
let category = null;
let questionType = 'regular';
let currentQuestions = [];
let currentQuestionIndex = 0;
let roundScore = 0;
let timerInterval = null;
let timeLeft = 12;
let lifelineCounts = { fifty_fifty: 0, ask_crowd: 0, skip: 0 };
let currentStreak = 0;
let streakDirection = null; // 'win' or 'loss'
let roundEnded = false;
let isNewBest = false;          // track if current round set a new best

const MAX_SCORE_PER_QUESTION = 12;
const TOTAL_QUESTIONS = 10;

// ========== DOM REFS ==========
const $ = (id) => document.getElementById(id);
const gameType = $('gameType');
const gameCategory = $('gameCategory');
const timerSeconds = $('timerSeconds');
const timerPath = $('timerPath');
const progressBar = $('progressBar');
const progressLabel = $('progressLabel');
const questionNumber = $('questionNumber');
const questionText = $('questionText');
const optionBtns = { A: $('optionA'), B: $('optionB'), C: $('optionC'), D: $('optionD') };
const optionTexts = { A: $('optionAText'), B: $('optionBText'), C: $('optionCText'), D: $('optionDText') };
const countFiftyFifty = $('countFiftyFifty');
const countAskCrowd = $('countAskCrowd');
const countSkip = $('countSkip');
const lifelineFifty = $('lifelineFiftyFifty');
const lifelineAsk = $('lifelineAskCrowd');
const lifelineSkip = $('lifelineSkip');
const crowdPanel = $('crowdPanel');
const crowdBarA = $('crowdBarA'); const crowdBarB = $('crowdBarB');
const crowdBarC = $('crowdBarC'); const crowdBarD = $('crowdBarD');
const crowdPercentA = $('crowdPercentA'); const crowdPercentB = $('crowdPercentB');
const crowdPercentC = $('crowdPercentC'); const crowdPercentD = $('crowdPercentD');

// ========== TOAST ==========
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ========== HELPER: FORMAT CATEGORY NAME ==========
function formatCategoryName(raw) {
  const map = {
    'afrobeats': 'Afrobeats',
    'nollywood': 'Nollywood',
    'lagos_slang': 'Lagos Slang',
    'super_eagles': 'Super Eagles',
    'nigeria_history': 'Naija History',
    'nigeria_food': 'Nigerian Food',
    'nigeria_culture': 'Naija Culture',
    'nigeria_proverbs': 'Naija Proverbs',
    'nigeria_geography': 'Naija Geography',
    'naija_pikin': 'Naija Pikin',
    'ogbonge_naija': 'Ogbonge Naija'
  };
  return map[raw] || raw.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ========== FISHER-YATES SHUFFLE ==========
function fisherYatesShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ========== AUTH VALIDATION ==========
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '/login.html';
    return;
  }
  currentUserUID = user.uid;
  try {
    await loadLifelines();
    await readParamsFromURL();
  } catch (err) {
    console.error('Init error:', err);
    showToast('Failed to start game. Please try again.', 'error');
    setTimeout(() => window.location.href = '/app/dashboard.html', 2000);
  }
});

// ========== LOAD LIFELINES (regular always 1 each, tournament from Firestore) ==========
async function loadLifelines() {
  // For regular game, always reset lifelines to 1 each
  if (questionType === 'regular') {
    lifelineCounts = { fifty_fifty: 1, ask_crowd: 1, skip: 1 };
    updateLifelineUI();
    return;
  }

  // For tournament, read from Firestore
  const userRef = doc(db, 'users', currentUserUID);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    showToast('User profile not found.', 'error');
    window.location.href = '/app/dashboard.html';
    return;
  }
  const data = snap.data();
  lifelineCounts.fifty_fifty = data.lifeline?.fifty_fifty ?? 3;
  lifelineCounts.ask_crowd = data.lifeline?.ask_crowd ?? 3;
  lifelineCounts.skip = data.lifeline?.skip ?? 3;
  updateLifelineUI();
}

function updateLifelineUI() {
  if (countFiftyFifty) countFiftyFifty.textContent = lifelineCounts.fifty_fifty;
  if (countAskCrowd) countAskCrowd.textContent = lifelineCounts.ask_crowd;
  if (countSkip) countSkip.textContent = lifelineCounts.skip;
  lifelineFifty.classList.toggle('disabled', lifelineCounts.fifty_fifty <= 0);
  lifelineAsk.classList.toggle('disabled', lifelineCounts.ask_crowd <= 0);
  lifelineSkip.classList.toggle('disabled', lifelineCounts.skip <= 0);
}

// ========== READ PARAMS FROM URL ==========
function readParamsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const rawCategory = params.get('category');
  const rawType = params.get('type') || 'regular';
  if (!rawCategory) {
    showToast('No category selected. Redirecting...', 'error');
    setTimeout(() => window.location.href = '/app/dashboard.html', 1500);
    throw new Error('Missing category');
  }
  category = rawCategory;
  questionType = rawType;
  const displayName = formatCategoryName(category);
  if (gameCategory) gameCategory.textContent = displayName;
  if (gameType) gameType.textContent = questionType === 'regular' ? 'Regular' : 'Tournament';

  // Reset lifelines based on type (already done in loadLifelines, but ensure)
  loadLifelines();
  loadRandomQuestions();
}

// ========== LOAD RANDOM QUESTIONS (with localStorage caching for regular) ==========
async function loadRandomQuestions() {
  // Reset round state
  roundEnded = false;
  currentQuestionIndex = 0;
  roundScore = 0;
  currentStreak = 0;
  streakDirection = null;
  isNewBest = false;

  // Reset lifelines to 1 each for regular (tournament already loaded)
  if (questionType === 'regular') {
    lifelineCounts = { fifty_fifty: 1, ask_crowd: 1, skip: 1 };
    updateLifelineUI();
  }

  // For tournament, always fetch fresh from Firestore
  if (questionType === 'tournament') {
    await fetchQuestionsFromFirestore();
    return;
  }

  // Regular game: try localStorage cache
  const cacheKeyQueue = `ng_queue_${category}`;
  const cacheKeyIndex = `ng_queue_${category}_index`;
  const cacheKeyCachedAt = `ng_queue_${category}_cached_at`;

  const cachedAt = localStorage.getItem(cacheKeyCachedAt);
  const now = Date.now();
  const expiry = 86400000; // 24 hours

  let useCache = false;
  let queue = null;
  let index = 0;

  if (cachedAt) {
    const age = now - parseInt(cachedAt, 10);
    if (age < expiry) {
      const queueRaw = localStorage.getItem(cacheKeyQueue);
      if (queueRaw) {
        try {
          queue = JSON.parse(queueRaw);
          if (Array.isArray(queue) && queue.length > 0) {
            const indexRaw = localStorage.getItem(cacheKeyIndex);
            index = parseInt(indexRaw, 10) || 0;
            useCache = true;
          }
        } catch (e) { /* ignore */ }
      }
    } else {
      // Cache expired: remove all keys
      localStorage.removeItem(cacheKeyQueue);
      localStorage.removeItem(cacheKeyIndex);
      localStorage.removeItem(cacheKeyCachedAt);
    }
  }

  if (useCache && queue && queue.length > 0) {
    // Use cached queue
    let selected = [];
    if (index + TOTAL_QUESTIONS <= queue.length) {
      selected = queue.slice(index, index + TOTAL_QUESTIONS);
      index += TOTAL_QUESTIONS;
    } else {
      // Wrap around: take remaining from end, then reshuffle and take the rest
      const remaining = queue.slice(index);
      const needed = TOTAL_QUESTIONS - remaining.length;
      // Reshuffle the entire queue
      queue = fisherYatesShuffle(queue);
      const firstPart = queue.slice(0, needed);
      selected = remaining.concat(firstPart);
      index = needed; // after taking firstPart, we've consumed 'needed' from the beginning
    }
    // Update localStorage with new index and reshuffled queue if we wrapped
    if (index >= queue.length) {
      // If we've reached end, reshuffle and reset index
      queue = fisherYatesShuffle(queue);
      index = 0;
    }
    localStorage.setItem(cacheKeyQueue, JSON.stringify(queue));
    localStorage.setItem(cacheKeyIndex, index.toString());

    currentQuestions = selected;
    if (currentQuestions.length < TOTAL_QUESTIONS) {
      showToast(`Only ${currentQuestions.length} questions available. Starting game.`, 'warning');
    }
    // Show countdown before first question
    showCountdown(() => loadQuestion(0));
    return;
  }

  // No cache or expired: fetch from Firestore
  await fetchQuestionsFromFirestore();
}

// ========== FETCH QUESTIONS FROM FIRESTORE AND CACHE FOR REGULAR ==========
async function fetchQuestionsFromFirestore() {
  const collectionName = questionType === 'regular' ? 'questions_regular' : 'questions_tournament';
  try {
    const q = query(collection(db, collectionName), where('category', '==', category));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      showToast('No questions found for this category.', 'error');
      setTimeout(() => window.location.href = '/app/dashboard.html', 2000);
      return;
    }
    const allQuestions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Shuffle
    const shuffled = fisherYatesShuffle(allQuestions);

    // If regular, cache the full shuffled array
    if (questionType === 'regular') {
      const cacheKeyQueue = `ng_queue_${category}`;
      const cacheKeyIndex = `ng_queue_${category}_index`;
      const cacheKeyCachedAt = `ng_queue_${category}_cached_at`;
      localStorage.setItem(cacheKeyQueue, JSON.stringify(shuffled));
      localStorage.setItem(cacheKeyIndex, '0');
      localStorage.setItem(cacheKeyCachedAt, Date.now().toString());
    }

    // Take first 10
    const selected = shuffled.slice(0, TOTAL_QUESTIONS);
    if (selected.length < TOTAL_QUESTIONS) {
      showToast(`Only ${selected.length} questions available. Starting game.`, 'warning');
    }
    currentQuestions = selected;
    // Update index if cached
    if (questionType === 'regular') {
      localStorage.setItem(cacheKeyIndex, TOTAL_QUESTIONS.toString());
    }
    // Show countdown before first question
    showCountdown(() => loadQuestion(0));
  } catch (err) {
    console.error('Error loading questions:', err);
    showToast('Failed to load questions. Please try again.', 'error');
    setTimeout(() => window.location.href = '/app/dashboard.html', 2000);
  }
}

// ========== COUNTDOWN OVERLAY ==========
function showCountdown(callback) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'countdownOverlay';
  overlay.style.cssText = `
    position: fixed; top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    z-index: 10001;
    font-family: 'Orbitron', monospace;
  `;

  // Container for the number
  const numberContainer = document.createElement('div');
  numberContainer.style.cssText = `
    font-size: 8rem;
    font-weight: 800;
    color: #FFD700;
    text-shadow: 0 0 40px rgba(255,215,0,0.3);
    animation: countPulse 1s ease-in-out;
  `;
  // Add keyframe animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes countPulse {
      0% { transform: scale(1.5); opacity: 0; }
      50% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.1); opacity: 0.8; }
    }
    @keyframes goPulse {
      0% { transform: scale(1.2); opacity: 0; }
      50% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.1); opacity: 0.9; }
    }
  `;
  document.head.appendChild(style);

  overlay.appendChild(numberContainer);

  // Optional small label
  const label = document.createElement('div');
  label.style.cssText = `
    color: #a0b3d9;
    font-size: 1.2rem;
    font-weight: 400;
    font-family: 'Poppins', sans-serif;
    margin-top: 1rem;
    letter-spacing: 0.15em;
  `;
  label.textContent = 'Get ready!';
  overlay.appendChild(label);

  document.body.appendChild(overlay);

  let count = 3;
  const interval = setInterval(() => {
    if (count > 0) {
      numberContainer.textContent = count;
      // Re-trigger animation
      numberContainer.style.animation = 'none';
      void numberContainer.offsetHeight; // reflow
      numberContainer.style.animation = 'countPulse 1s ease-in-out';
      count--;
    } else {
      clearInterval(interval);
      // Show "GO!" quickly
      numberContainer.textContent = 'GO!';
      numberContainer.style.color = '#3ED6B7';
      numberContainer.style.textShadow = '0 0 40px rgba(62,214,183,0.3)';
      numberContainer.style.animation = 'goPulse 0.8s ease-in-out';
      label.textContent = 'Let\'s go!';
      setTimeout(() => {
        overlay.remove();
        // Remove injected style if desired (optional)
        if (typeof callback === 'function') callback();
      }, 800);
    }
  }, 1000);
}

// ========== LOAD QUESTION ==========
function loadQuestion(index) {
  if (!currentQuestions || index >= currentQuestions.length) {
    endRound();
    return;
  }
  const q = currentQuestions[index];
  if (questionNumber) questionNumber.textContent = `Question ${index + 1}`;
  if (questionText) questionText.textContent = q.question;
  if (optionTexts.A) optionTexts.A.textContent = q.optionA;
  if (optionTexts.B) optionTexts.B.textContent = q.optionB;
  if (optionTexts.C) optionTexts.C.textContent = q.optionC;
  if (optionTexts.D) optionTexts.D.textContent = q.optionD;
  const progress = ((index + 1) / TOTAL_QUESTIONS * 100);
  if (progressBar) progressBar.style.width = progress + '%';
  if (progressLabel) progressLabel.textContent = `Question ${index + 1} of ${TOTAL_QUESTIONS}`;
  // Reset option buttons: remove classes and inline styles
  ['A', 'B', 'C', 'D'].forEach(letter => {
    const btn = optionBtns[letter];
    if (btn) {
      btn.classList.remove('correct', 'wrong', 'disabled');
      btn.style.visibility = 'visible';
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
      btn.disabled = false;
    }
  });
  if (crowdPanel) crowdPanel.classList.remove('show');
  startTimer();
}

// ========== TIMER ==========
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = MAX_SCORE_PER_QUESTION;
  if (timerSeconds) timerSeconds.textContent = timeLeft;
  const circumference = 2 * Math.PI * 18;
  if (timerPath) {
    timerPath.style.strokeDasharray = circumference;
    timerPath.style.strokeDashoffset = 0;
  }
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timerSeconds) timerSeconds.textContent = Math.max(0, timeLeft);
    if (timerPath) {
      const offset = circumference * (1 - (Math.max(0, timeLeft) / MAX_SCORE_PER_QUESTION));
      timerPath.style.strokeDashoffset = offset;
    }
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      // Disable all options
      ['A', 'B', 'C', 'D'].forEach(letter => {
        const btn = optionBtns[letter];
        if (btn) {
          btn.disabled = true;
          btn.classList.add('disabled');
        }
      });
      // Show correct answer with inline styles
      const correctAns = currentQuestions[currentQuestionIndex]?.correctAnswer;
      if (correctAns && optionBtns[correctAns]) {
        const correctBtn = optionBtns[correctAns];
        correctBtn.classList.add('correct');
        correctBtn.style.background = '#3ED6B7';
        correctBtn.style.color = '#ffffff';
        correctBtn.style.borderColor = '#3ED6B7';
      }
      setTimeout(() => nextQuestion(), 1500);
    }
  }, 1000);
}

// ========== ANSWER SELECTION ==========
document.addEventListener('DOMContentLoaded', () => {
  const optionsGrid = document.querySelector('.options-grid');
  if (optionsGrid) {
    optionsGrid.addEventListener('click', async (e) => {
      const btn = e.target.closest('.option-btn');
      if (!btn) return;
      if (btn.disabled || btn.classList.contains('disabled')) return;

      // Stop timer immediately
      clearInterval(timerInterval);

      // Disable all options
      ['A', 'B', 'C', 'D'].forEach(letter => {
        const b = optionBtns[letter];
        if (b) {
          b.disabled = true;
          b.classList.add('disabled');
        }
      });

      const selectedLetter = btn.dataset.option;
      const currentQ = currentQuestions[currentQuestionIndex];
      if (!currentQ) return;
      const correct = currentQ.correctAnswer;
      const pointsEarned = Math.max(0, timeLeft);

      // Determine if correct
      const isCorrect = (selectedLetter === correct);

      // Apply visual highlights
      if (isCorrect) {
        // Correct button
        btn.classList.add('correct');
        btn.style.background = '#3ED6B7';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#3ED6B7';
        roundScore += pointsEarned;
      } else {
        // Wrong button
        btn.classList.add('wrong');
        btn.style.background = 'rgba(255,92,92,0.25)';
        btn.style.color = '#ff5c5c';
        btn.style.borderColor = '#ff5c5c';
        // Show correct answer
        if (optionBtns[correct]) {
          const correctBtn = optionBtns[correct];
          correctBtn.classList.add('correct');
          correctBtn.style.background = '#3ED6B7';
          correctBtn.style.color = '#ffffff';
          correctBtn.style.borderColor = '#3ED6B7';
        }
      }

      // ---- Streak Tracking & Comment Modal ----
      const handleNext = () => {
        // after modal closes or no modal
        if (!commentTriggered) {
          setTimeout(() => nextQuestion(), 1500);
        }
      };
      let commentTriggered = false;

      if (isCorrect) {
        // Correct streak logic
        if (streakDirection === 'loss') {
          // Came back from loss
          const lossCount = Math.abs(currentStreak);
          if (lossCount >= 3) {
            const comment = onCorrectAfterStreak();
            showCommentModal(comment, nextQuestion);
            commentTriggered = true;
          }
          // Reset streak to 1 win
          currentStreak = 1;
          streakDirection = 'win';
        } else if (streakDirection === 'win') {
          currentStreak += 1;
          if (currentStreak === 2) {
            const comment = onTwoStreakWin();
            showCommentModal(comment, nextQuestion);
            commentTriggered = true;
          } else if (currentStreak === 5) {
            const comment = onFiveStreakWin();
            showCommentModal(comment, nextQuestion);
            commentTriggered = true;
          }
        } else {
          // first correct
          currentStreak = 1;
          streakDirection = 'win';
        }
      } else {
        // Wrong streak logic
        if (streakDirection === 'win') {
          currentStreak = -1;
          streakDirection = 'loss';
        } else if (streakDirection === 'loss') {
          currentStreak -= 1;
          const lossCount = Math.abs(currentStreak);
          if (lossCount === 3) {
            const comment = onThreeStreakLoss();
            showCommentModal(comment, nextQuestion);
            commentTriggered = true;
          } else if (lossCount === 5) {
            const comment = onFiveStreakLoss();
            showCommentModal(comment, nextQuestion);
            commentTriggered = true;
          }
        } else {
          // first wrong
          currentStreak = -1;
          streakDirection = 'loss';
        }
      }

      // If no comment triggered, schedule next question with delay
      if (!commentTriggered) {
        setTimeout(() => nextQuestion(), 1500);
      }
    });
  }
});

// ========== NEXT QUESTION ==========
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < TOTAL_QUESTIONS) {
    loadQuestion(currentQuestionIndex);
  } else {
    endRound();
  }
}

// ========== LIFELINES ==========
lifelineFifty?.addEventListener('click', async () => {
  if (lifelineFifty.classList.contains('disabled')) return;
  const currentQ = currentQuestions[currentQuestionIndex];
  if (!currentQ) return;
  const correct = currentQ.correctAnswer;
  const wrongOptions = ['A', 'B', 'C', 'D'].filter(letter => letter !== correct);
  const shuffled = wrongOptions.sort(() => Math.random() - 0.5);
  const toHide = shuffled.slice(0, 2);
  toHide.forEach(letter => {
    const btn = optionBtns[letter];
    if (btn) btn.style.visibility = 'hidden';
  });
  lifelineCounts.fifty_fifty--;
  if (countFiftyFifty) countFiftyFifty.textContent = lifelineCounts.fifty_fifty;
  if (lifelineCounts.fifty_fifty <= 0) lifelineFifty.classList.add('disabled');
  // Only update Firestore for tournament
  if (questionType !== 'regular') {
    try {
      const userRef = doc(db, 'users', currentUserUID);
      await updateDoc(userRef, { 'lifeline.fifty_fifty': increment(-1) });
    } catch (err) {
      console.error('Failed to update lifeline:', err);
      showToast('Could not save lifeline usage.', 'error');
    }
  }
});

lifelineAsk?.addEventListener('click', async () => {
  if (lifelineAsk.classList.contains('disabled')) return;
  const currentQ = currentQuestions[currentQuestionIndex];
  if (!currentQ) return;
  const correct = currentQ.correctAnswer;
  const correctPct = Math.floor(Math.random() * 26) + 45;
  let remaining = 100 - correctPct;
  const others = ['A', 'B', 'C', 'D'].filter(l => l !== correct);
  const dist = [];
  for (let i = 0; i < others.length; i++) {
    if (i === others.length - 1) {
      dist.push(remaining);
    } else {
      const val = Math.floor(Math.random() * remaining);
      dist.push(val);
      remaining -= val;
    }
  }
  const result = {};
  result[correct] = correctPct;
  others.forEach((letter, idx) => {
    result[letter] = dist[idx] || 0;
  });
  if (crowdPanel) crowdPanel.classList.add('show');
  if (crowdBarA) crowdBarA.style.width = (result.A || 0) + '%';
  if (crowdBarB) crowdBarB.style.width = (result.B || 0) + '%';
  if (crowdBarC) crowdBarC.style.width = (result.C || 0) + '%';
  if (crowdBarD) crowdBarD.style.width = (result.D || 0) + '%';
  if (crowdPercentA) crowdPercentA.textContent = (result.A || 0) + '%';
  if (crowdPercentB) crowdPercentB.textContent = (result.B || 0) + '%';
  if (crowdPercentC) crowdPercentC.textContent = (result.C || 0) + '%';
  if (crowdPercentD) crowdPercentD.textContent = (result.D || 0) + '%';
  lifelineCounts.ask_crowd--;
  if (countAskCrowd) countAskCrowd.textContent = lifelineCounts.ask_crowd;
  if (lifelineCounts.ask_crowd <= 0) lifelineAsk.classList.add('disabled');
  if (questionType !== 'regular') {
    try {
      const userRef = doc(db, 'users', currentUserUID);
      await updateDoc(userRef, { 'lifeline.ask_crowd': increment(-1) });
    } catch (err) {
      console.error('Failed to update lifeline:', err);
      showToast('Could not save lifeline usage.', 'error');
    }
  }
});

lifelineSkip?.addEventListener('click', async () => {
  if (lifelineSkip.classList.contains('disabled')) return;
  clearInterval(timerInterval);
  lifelineCounts.skip--;
  if (countSkip) countSkip.textContent = lifelineCounts.skip;
  if (lifelineCounts.skip <= 0) lifelineSkip.classList.add('disabled');
  if (questionType !== 'regular') {
    try {
      const userRef = doc(db, 'users', currentUserUID);
      await updateDoc(userRef, { 'lifeline.skip': increment(-1) });
    } catch (err) {
      console.error('Failed to update lifeline:', err);
      showToast('Could not save lifeline usage.', 'error');
    }
  }
  setTimeout(() => nextQuestion(), 500);
});

// ========== SHOW LOADER OVERLAY ==========
function showLoader(message = 'Wait a moment. Calculating your score...') {
  let overlay = document.getElementById('scoreLoader');
  if (overlay) return; // already exists
  overlay = document.createElement('div');
  overlay.id = 'scoreLoader';
  overlay.style.cssText = `
    position: fixed; top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    z-index: 10000;
    font-family: 'Poppins', sans-serif;
  `;
  // Circular loader (Windows style)
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    width: 60px; height: 60px;
    border: 6px solid rgba(255,255,255,0.1);
    border-top-color: #3ED6B7;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  `;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  const text = document.createElement('p');
  text.textContent = message;
  text.style.cssText = `
    color: #f0f3fa;
    font-size: 1.1rem;
    font-weight: 500;
    margin-top: 1.5rem;
    text-align: center;
    max-width: 300px;
  `;

  overlay.appendChild(spinner);
  overlay.appendChild(text);
  document.body.appendChild(overlay);
}

function hideLoader() {
  const overlay = document.getElementById('scoreLoader');
  if (overlay) overlay.remove();
}

// ========== END ROUND ==========
async function endRound() {
  if (roundEnded) return;
  roundEnded = true;
  clearInterval(timerInterval);

  // Show loader
  showLoader('Calculating your score... Please wait.');

  // Determine if new best before updating
  let previousBest = 0;
  try {
    const userRef = doc(db, 'users', currentUserUID);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      const catStats = data.categoryStats || {};
      const catKey = category;
      previousBest = catStats[catKey]?.bestScore || 0;
    }
  } catch (err) {
    console.warn('Could not read previous best:', err);
  }

  try {
    const pointRef = collection(db, 'regular_points');
    await addDoc(pointRef, {
      uid: currentUserUID,
      gameType: questionType,
      category: category,
      point: roundScore,
      time: serverTimestamp()
    });
    const userRef = doc(db, 'users', currentUserUID);
    await updateDoc(userRef, {
      lifetimeRoundPlayed: increment(1),
      totalScore: increment(roundScore)
    });
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      const catStats = data.categoryStats || {};
      const catKey = category;
      if (!catStats[catKey]) catStats[catKey] = { played: 0, bestScore: 0, mastery: 0 };
      const currentBest = catStats[catKey].bestScore || 0;
      const newBest = roundScore > currentBest ? roundScore : currentBest;
      // Update best score
      await updateDoc(userRef, {
        [`categoryStats.${catKey}.played`]: increment(1),
        [`categoryStats.${catKey}.bestScore`]: newBest
      });
      // Set new best flag if roundScore > previousBest (strictly greater)
      if (roundScore > previousBest) {
        isNewBest = true;
      }
    }
  } catch (err) {
    console.error('Error saving round data:', err);
    showToast('Some data could not be saved, but your round is complete.', 'warning');
  }

  // Hide loader and show modal
  hideLoader();
  showRoundEndModal(isNewBest);
}

// ========== SHOW COMMENT MODAL ==========
function showCommentModal(comment, onClose) {
  const overlay = document.createElement('div');
  overlay.id = 'commentModal';
  overlay.style.cssText = `
    position: fixed; top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 8888; padding: 1rem;
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    background: rgba(20,25,40,0.95); border: 1px solid rgba(62,214,183,0.3);
    border-radius: 1.5rem; padding: 2rem; max-width: 420px; width: 100%;
    text-align: center; font-family: 'Poppins', sans-serif;
  `;

  const textP = document.createElement('p');
  textP.style.cssText = `font-size: 1.3rem; font-weight: 600; color: #f0f3fa; line-height: 1.6; margin-bottom: 1.5rem;`;
  textP.textContent = comment;
  card.appendChild(textP);

  const btn = document.createElement('button');
  btn.textContent = 'Got it! 👊';
  btn.style.cssText = `
    background: linear-gradient(135deg, #3ED6B7, #259c84);
    border: none; padding: 0.65rem 2rem; border-radius: 40px;
    font-weight: 700; font-size: 0.95rem; color: #0a0f1e;
    cursor: pointer; font-family: 'Poppins', sans-serif;
  `;
  btn.addEventListener('click', () => {
    overlay.remove();
    if (typeof onClose === 'function') onClose();
  });
  card.appendChild(btn);

  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

// ========== FIREWORKS ANIMATION ==========
function showFireworks() {
  // Create canvas overlay
  const canvas = document.createElement('canvas');
  canvas.id = 'fireworksCanvas';
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 9998;
  `;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  // Particle class
  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 8 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = 0.015 + Math.random() * 0.02;
      this.size = 4 + Math.random() * 6;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.alpha -= this.decay;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let particles = [];
  const colors = ['#FFD700', '#3ED6B7', '#FFFFFF', '#FF6B6B', '#FFA94D', '#A29BFE', '#FFEAA7'];

  // Create multiple explosions
  const explosions = 6;
  for (let e = 0; e < explosions; e++) {
    const cx = Math.random() * w * 0.6 + w * 0.2;
    const cy = Math.random() * h * 0.5 + h * 0.1;
    const count = 80 + Math.floor(Math.random() * 60);
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push(new Particle(cx, cy, color));
    }
  }

  // Animation loop
  let frameId = null;
  let startTime = performance.now();
  const duration = 3000; // 3 seconds

  function animate(timestamp) {
    const elapsed = timestamp - startTime;
    if (elapsed > duration) {
      // Remove canvas and stop
      if (frameId) cancelAnimationFrame(frameId);
      canvas.remove();
      return;
    }
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    // Remove dead particles
    particles = particles.filter(p => p.alpha > 0);
    if (particles.length === 0) {
      canvas.remove();
      return;
    }
    frameId = requestAnimationFrame(animate);
  }
  frameId = requestAnimationFrame(animate);

  // Clean up on resize
  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
}

// ========== ROUND END MODAL (with new best detection) ==========
function showRoundEndModal(newBest = false) {
  const overlay = document.createElement('div');
  overlay.id = 'roundEndModal';
  overlay.style.cssText = `
    position: fixed; top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; padding: 1rem;
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    background: rgba(20,25,40,0.95); backdrop-filter: blur(12px);
    border: 1px solid rgba(62,214,183,0.3); border-radius: 2rem;
    padding: 2rem 1.5rem; max-width: 500px; width: 100%;
    position: relative; text-align: center; color: #f0f3fa;
    font-family: 'Poppins', sans-serif;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute; top: 0.8rem; right: 1.2rem;
    background: none; border: none; font-size: 2rem;
    color: #a0b3d9; cursor: pointer; font-family: 'Poppins', sans-serif;
  `;
  closeBtn.addEventListener('click', () => {
    window.location.href = '/app/dashboard.html#play';
  });
  card.appendChild(closeBtn);

  const logo = document.createElement('div');
  logo.style.cssText = `font-family:'Orbitron',monospace;font-weight:800;font-size:1.8rem;margin-bottom:0.5rem;`;
  logo.innerHTML = `<span style="color:#ffffff;">Naija</span><span style="color:#3ED6B7;">Genius</span>`;
  card.appendChild(logo);

  // New Best Badge
  if (newBest) {
    const badge = document.createElement('div');
    badge.textContent = '🏆 New Best Score!';
    badge.style.cssText = `
      font-family: 'Orbitron', monospace;
      font-size: 1.4rem;
      font-weight: 700;
      color: #FFD700;
      background: rgba(255,215,0,0.12);
      border: 1px solid rgba(255,215,0,0.3);
      border-radius: 40px;
      padding: 0.4rem 1.2rem;
      display: inline-block;
      margin-bottom: 0.8rem;
      box-shadow: 0 0 30px rgba(255,215,0,0.15);
    `;
    card.appendChild(badge);
  }

  const title = document.createElement('h2');
  title.textContent = `Round Complete!`;
  title.style.cssText = `font-size:1.8rem;color:#FFD700;margin:0.5rem 0 0.8rem;`;
  card.appendChild(title);

  const scoreDiv = document.createElement('div');
  scoreDiv.style.cssText = `font-family:'Orbitron',monospace;font-size:3rem;font-weight:800;color:#3ED6B7;margin:0.5rem 0;`;
  scoreDiv.textContent = roundScore + ' / 120';
  card.appendChild(scoreDiv);

  // Use comments.js for end-of-round comment
  const endComment = getEndOfRoundComment(roundScore);
  const msgP = document.createElement('p');
  msgP.textContent = endComment;
  msgP.style.cssText = `font-size:1.1rem;color:#f0f3fa;margin:0.8rem 0 1.5rem;font-weight:500;`;
  card.appendChild(msgP);

  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = `display:flex;gap:0.8rem;justify-content:center;flex-wrap:wrap;`;

  const playAgainBtn = document.createElement('button');
  playAgainBtn.textContent = 'Play Again';
  playAgainBtn.style.cssText = `
    background: linear-gradient(135deg, #3ED6B7, #259c84);
    border: none; padding: 0.7rem 1.8rem; border-radius: 40px;
    font-weight: 700; font-size: 0.95rem; color: #0a0f1e;
    cursor: pointer; font-family: 'Poppins', sans-serif;
    flex: 1; min-width: 140px;
  `;
  playAgainBtn.addEventListener('click', () => {
    overlay.remove();
    roundEnded = false;
    isNewBest = false;
    loadRandomQuestions();
  });
  btnContainer.appendChild(playAgainBtn);

  const dashBtn = document.createElement('button');
  dashBtn.textContent = 'Back to Dashboard';
  dashBtn.style.cssText = `
    background: transparent; border: 1.5px solid #3ED6B7;
    padding: 0.7rem 1.8rem; border-radius: 40px;
    font-weight: 700; font-size: 0.95rem; color: #3ED6B7;
    cursor: pointer; font-family: 'Poppins', sans-serif;
    flex: 1; min-width: 140px;
  `;
  dashBtn.addEventListener('click', () => {
    window.location.href = '/app/dashboard.html';
  });
  btnContainer.appendChild(dashBtn);

  card.appendChild(btnContainer);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  // If new best, trigger fireworks after a short delay
  if (newBest) {
    setTimeout(() => showFireworks(), 300);
  }
}