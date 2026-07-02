// ========== IMPORTS ==========
import { auth, db } from '/js/firebase.config.js';
import {
  doc, getDoc, updateDoc, addDoc, collection,
  serverTimestamp, increment
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
import { evaluateChallenge, applyReward, markChallengeCompleted, showCongratulationsModal } from './challenge.js';

console.log('🎮 games.js loaded');

// ========== SHARED EXPORT MAP ==========
const SHARED_EXPORT_MAP = {
  'afrobeats':        { file: 'afrobeats.js',        export: 'afrobeats'        },
  'nollywood':        { file: 'nollywood.js',        export: 'nollywood'        },
  'nigeriaHistory':   { file: 'nigeria-history.js',  export: 'nigeriaHistory'   },
  'nigeriaCulture':   { file: 'nigeria-culture.js',  export: 'nigeriaCulture'   },
  'nigeriaFood':      { file: 'nigeria-food.js',     export: 'nigeriaFood'      },
  'nigeriaGeography': { file: 'nigeria-geography.js',export: 'nigeriaGeography' },
  'nigeriaSports':    { file: 'nigeria-sports.js',   export: 'nigeriaSports'    },
  'lagosSlang':       { file: 'lagos-slangs.js',     export: 'lagosSlang'       },
  'nigeriaProverbs':  { file: 'nigeria-proverbs.js', export: 'nigeriaProverbs'  },
  'superEagles':      { file: 'super-eagles.js',     export: 'superEagles'      }
};

// ========== TOURNAMENT DETECTION ==========
const params = new URLSearchParams(window.location.search);
const rawCategory = params.get('category');
const rawType = params.get('type') || 'regular';
const exportName = params.get('export');
const isTournament = (rawCategory === 'tournament' || rawType === 'tournament');

console.log('📋 URL Params:', { rawCategory, rawType, exportName, isTournament });

// ========== MODULE STATE ==========
let currentUserUID = null;
let currentUserData = null;
let category = null;
let questionType = 'regular';
let currentQuestions = [];
let currentQuestionIndex = 0;
let roundScore = 0;
let correctCount = 0;
let timerInterval = null;
let timeLeft = 15;
let lifelineCounts = { fifty_fifty: 0, ask_crowd: 0, callFriend: 0 };
let currentStreak = 0;
let streakDirection = null;
let roundEnded = false;
let isNewBest = false;
let gameRoundActive = false;
let questionAnswered = false;
let lifelinesDisabled = false;
let oneChanceMissed = false;
let roundCoins = 0;
let livesRemaining = 0;
let freeLifelines = { fifty_fifty: true, ask_crowd: true, callFriend: true };
let displayedCoins = 0;

// Challenge tracking
let lifelineUsed = null;             // 'fifty_fifty', 'ask_crowd', 'callFriend', 'both', 'all'
let isCorrectAfterLifeline = false;

// Variables for delayed feedback (used only in non‑One‑Chance modes)
let pendingSelectedLetter = null;
let pendingCorrectLetter = null;

const MAX_SCORE_PER_QUESTION = 15;
const TOTAL_QUESTIONS = 10;

// ========== DOM REFS ==========
const $ = (id) => document.getElementById(id);
const timerSeconds   = $('timerSeconds');
const timerPath      = $('timerPath');
const progressBar    = $('progressBar');
const progressLabel  = $('progressLabel');
const questionNumber = $('questionNumber');
const questionText   = $('questionText');
const gameCoinsValue = $('gameCoinsValue');
const optionBtns  = { A: $('optionA'),     B: $('optionB'),     C: $('optionC'),     D: $('optionD')     };
const optionTexts = { A: $('optionAText'), B: $('optionBText'), C: $('optionCText'), D: $('optionDText') };
const countFiftyFifty = $('countFiftyFifty');
const countAskCrowd   = $('countAskCrowd');
const countCallFriend = $('countCallFriend');
const lifelineFifty   = $('lifelineFiftyFifty');
const lifelineAsk     = $('lifelineAskCrowd');
const lifelineCallFriend = $('lifelineCallFriend');
const nextBtn         = $('nextBtn');

// ========== DEDICATED ERROR DISPLAY ==========
function showErrorOnScreen(message) {
  const oldError = document.getElementById('gameErrorPanel');
  if (oldError) oldError.remove();

  const panel = document.createElement('div');
  panel.id = 'gameErrorPanel';
  panel.style.cssText = `
    background: rgba(255,0,0,0.15); border: 2px solid #ff4444;
    border-radius: 12px; padding: 1rem 1.5rem; margin-bottom: 1rem;
    color: #ff6b6b; font-weight: 600; font-family: 'Poppins', sans-serif;
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem; flex-wrap: wrap;
  `;
  panel.innerHTML = `
    <span><i class="fas fa-exclamation-circle"></i> ${message}</span>
    <button id="errorRetryBtn" style="
      background:#ff4444; border:none; padding:0.4rem 1.2rem;
      border-radius:30px; color:white; font-weight:700; cursor:pointer;
      font-family:'Poppins',sans-serif;
    ">Retry</button>
  `;

  const container = document.querySelector('.game-container');
  if (container) container.prepend(panel);
  else document.body.prepend(panel);

  document.getElementById('errorRetryBtn')?.addEventListener('click', () => {
    window.location.reload();
  });

  if (questionText) {
    questionText.textContent = '⚠️ ' + message;
    questionText.style.color = '#ff6b6b';
    questionText.style.fontWeight = '600';
  }
  if (questionNumber) questionNumber.textContent = 'Error';
  ['A', 'B', 'C', 'D'].forEach(letter => {
    const btn = optionBtns[letter];
    if (btn) btn.style.display = 'none';
  });
}

// ========== TOAST ==========
function showToast(message, type = 'success', duration = 4000) {
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

// ========== GLOBAL ERROR HANDLING ==========
window.onerror = function (message, source, lineno, colno, error) {
  console.error('Global error:', message, error);
  showErrorOnScreen('Unexpected error: ' + (error?.message || message));
  return true;
};

window.addEventListener('unhandledrejection', function (event) {
  console.error('Unhandled promise rejection:', event.reason);
  showErrorOnScreen('Unhandled error: ' + (event.reason?.message || 'Unknown'));
  event.preventDefault();
});

// ========== FORMAT CATEGORY NAME ==========
function formatCategoryName(raw) {
  const map = {
    'afrobeats':        'Afrobeats',
    'nollywood':        'Nollywood',
    'lagos_slang':      'Lagos Slang',
    'super_eagles':     'Super Eagles',
    'nigeria_history':  'Naija History',
    'nigeria_food':     'Nigerian Food',
    'nigeria_culture':  'Naija Culture',
    'nigeria_proverbs': 'Naija Proverbs',
    'nigeria_geography':'Naija Geography',
    'nigeria_sports':   'Naija Sports',
    'naija_pikin':      'Naija Pikin',
    'ogbonge_naija':    'Ogbonge Naija'
  };
  return map[raw] || raw.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ========== FISHER-YATES SHUFFLE ==========
function fisherYatesShuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ========== REUSABLE IMPORT HELPER ==========
async function importQuestionBank(mapping) {
  let questionBank = null;
  let lastError = null;
  const attemptedPaths = [];

  const base = new URL('.', import.meta.url).href;
  const pathsToTry = [
    `/js/questions/${mapping.file}`,
    `./questions/${mapping.file}`,
    new URL(`questions/${mapping.file}`, base).href,
    `${window.location.origin}/js/questions/${mapping.file}`,
  ];

  for (const path of pathsToTry) {
    attemptedPaths.push(path);
    console.log('📦 Attempting import from:', path);
    try {
      const module = await import(path);
      questionBank = module[mapping.export] || module.default;
      if (questionBank) {
        console.log('✅ Import succeeded from:', path);
        break;
      }
    } catch (e) {
      lastError = e;
      console.warn('❌ Import failed:', e.message);
    }
  }

  if (!questionBank) {
    try {
      const fetchPath = pathsToTry[0];
      const response = await fetch(fetchPath);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const blob = new Blob([text], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      const module = await import(blobUrl);
      questionBank = module[mapping.export] || module.default;
      URL.revokeObjectURL(blobUrl);
      console.log('✅ Import succeeded via fetch+blob from:', fetchPath);
    } catch (fetchErr) {
      lastError = fetchErr;
      console.warn('❌ Fetch fallback failed:', fetchErr);
    }
  }

  if (!questionBank) {
    console.error(`Failed to load question bank for ${mapping.export}:`, lastError?.message);
    return null;
  }

  if (!Array.isArray(questionBank) || questionBank.length === 0) {
    console.warn(`Question bank for ${mapping.export} is empty or invalid.`);
    return null;
  }

  return questionBank;
}

// ========== AUTH ==========
onAuthStateChanged(auth, async (user) => {
  console.log('🔐 Auth state changed (games):', user ? `User: ${user.uid}` : 'No user');

  if (!user) {
    showErrorOnScreen('Please log in to play.');
    setTimeout(() => window.location.href = '/login.html', 3000);
    return;
  }

  currentUserUID = user.uid;

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      showErrorOnScreen('User profile not found. Please complete registration.');
      setTimeout(() => window.location.href = '/app/dashboard.html', 3000);
      return;
    }

    currentUserData = userSnap.data();
    console.log('✅ User data loaded:', currentUserData);
    livesRemaining = currentUserData.lives ?? 2;

    // ===== COINS (Firestore users/{uid}.coins → header badge) =====
    displayedCoins = currentUserData.coins || 0;
    if (gameCoinsValue) gameCoinsValue.textContent = displayedCoins.toLocaleString();

    if (isTournament) {
      try {
        await import('./tournament.js');
      } catch (err) {
        showErrorOnScreen('Tournament mode unavailable.');
        setTimeout(() => window.location.href = '/app/dashboard.html', 3000);
      }
      return;
    }

    await loadLifelines();
    await readParamsFromURL();

  } catch (err) {
    console.error('Init error:', err);
    showErrorOnScreen('Failed to start game: ' + (err.message || 'Unknown error'));
    setTimeout(() => window.location.href = '/app/dashboard.html', 3000);
  }
});

// ========== LOAD LIFELINES (from Firestore + free 1) ==========
async function loadLifelines() {
  try {
    if (!currentUserUID) throw new Error('User not authenticated');
    const userRef = doc(db, 'users', currentUserUID);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      lifelineCounts = { fifty_fifty: 1, ask_crowd: 1, callFriend: 1 };
      freeLifelines = { fifty_fifty: true, ask_crowd: true, callFriend: true };
      updateLifelineUI();
      return;
    }
    const data = userSnap.data();
    const extras = data.lifeline || {};
    lifelineCounts = {
      fifty_fifty: 1 + (extras.fifty_fifty || 0),
      ask_crowd:   1 + (extras.ask_crowd || 0),
      callFriend:  1 + (extras.callFriend || 0)
    };
    freeLifelines = {
      fifty_fifty: true,
      ask_crowd:   true,
      callFriend:  true
    };
    updateLifelineUI();
    console.log('🔄 Lifelines loaded:', lifelineCounts, 'extras:', extras);
  } catch (err) {
    console.error('Failed to load lifelines from Firestore:', err);
    lifelineCounts = { fifty_fifty: 1, ask_crowd: 1, callFriend: 1 };
    freeLifelines = { fifty_fifty: true, ask_crowd: true, callFriend: true };
    updateLifelineUI();
  }
}

// ========== UPDATE LIFELINE UI ==========
function updateLifelineUI() {
  const forceDisable = lifelinesDisabled;

  if (countFiftyFifty) countFiftyFifty.textContent = lifelineCounts.fifty_fifty;
  if (countAskCrowd)   countAskCrowd.textContent   = lifelineCounts.ask_crowd;
  if (countCallFriend) countCallFriend.textContent = lifelineCounts.callFriend;

  lifelineFifty.classList.toggle('disabled', lifelineCounts.fifty_fifty <= 0 || forceDisable);
  lifelineAsk.classList.toggle('disabled',   lifelineCounts.ask_crowd   <= 0 || forceDisable);
  lifelineCallFriend.classList.toggle('disabled', lifelineCounts.callFriend <= 0 || forceDisable);
}

// ========== READ PARAMS FROM URL ==========
function readParamsFromURL() {
  const urlParams       = new URLSearchParams(window.location.search);
  const rawCat          = urlParams.get('category');
  const rawT            = urlParams.get('type') || 'regular';
  const exportNameParam = urlParams.get('export');

  console.log('📖 Reading params:', { rawCat, rawT, exportNameParam });

  if (rawCat) {
    category     = rawCat;
    questionType = rawT;

    if (exportNameParam) {
      loadQuestionsFromJS(exportNameParam);
    } else {
      showErrorOnScreen('Missing question bank. Redirecting...');
      setTimeout(() => window.location.href = '/app/dashboard.html', 3000);
      throw new Error('Missing export parameter');
    }
  } else {
    questionType = rawT;
    category = 'mixed';
    loadMixedQuestions();
  }
}

// ========== LOAD QUESTIONS FROM JS BANK ==========
async function loadQuestionsFromJS(exportNameParam) {
  console.log('📚 Loading questions for export:', exportNameParam);

  try {
    const mapping = SHARED_EXPORT_MAP[exportNameParam];
    if (!mapping) {
      throw new Error(`Question bank '${exportNameParam}' not found.`);
    }

    const questionBank = await importQuestionBank(mapping);
    if (!questionBank) {
      const errorMsg = `Failed to load question bank for '${exportNameParam}'.`;
      console.error(errorMsg);
      showErrorOnScreen(errorMsg);
      showToast('Question bank loading failed. Please refresh or contact support.', 'error', 20000);
      setTimeout(() => window.location.href = '/app/dashboard.html', 5000);
      return;
    }

    console.log('📚 Questions loaded:', questionBank?.length || 0, 'questions');

    const shuffled = fisherYatesShuffle([...questionBank]);
    const selected = shuffled.slice(0, Math.min(TOTAL_QUESTIONS, shuffled.length));

    console.log('✅ Selected', selected.length, 'questions for game');

    if (selected.length < TOTAL_QUESTIONS) {
      showToast(`Only ${selected.length} questions available. Starting game.`, 'warning', 6000);
    }

    currentQuestions = selected;

    roundCoins = 0;
    lifelineUsed = null;
    isCorrectAfterLifeline = false;
    showCountdown(() => loadQuestion(0));

  } catch (err) {
    console.error('❌ Error loading question bank:', err);
    const msg = err.message || 'Failed to load questions.';
    showErrorOnScreen(msg);
    showToast(msg, 'error', 20000);
    setTimeout(() => {
      if (!roundEnded) window.location.href = '/app/dashboard.html';
    }, 5000);
  }
}

// ========== LOAD MIXED QUESTIONS ==========
async function loadMixedQuestions() {
  console.log('🔄 Loading mixed-category questions...');
  const mixedQuestions = [];

  for (const [key, mapping] of Object.entries(SHARED_EXPORT_MAP)) {
    try {
      const bank = await importQuestionBank(mapping);
      if (bank && bank.length > 0) {
        const randomIndex = Math.floor(Math.random() * bank.length);
        const question = bank[randomIndex];
        mixedQuestions.push(question);
        console.log(`✅ Added one question from ${key}`);
      } else {
        console.warn(`⚠️ Skipping ${key} – bank empty or failed to load.`);
      }
    } catch (err) {
      console.warn(`⚠️ Skipping ${key} due to error:`, err.message);
    }
  }

  if (mixedQuestions.length === 0) {
    showErrorOnScreen('No questions could be loaded. Please try again.');
    showToast('Failed to load any questions. Redirecting...', 'error', 20000);
    setTimeout(() => window.location.href = '/app/dashboard.html', 5000);
    return;
  }

  const shuffledMixed = fisherYatesShuffle(mixedQuestions);
  const selected = shuffledMixed.slice(0, Math.min(TOTAL_QUESTIONS, shuffledMixed.length));

  console.log(`✅ Selected ${selected.length} mixed questions for game`);

  if (selected.length < TOTAL_QUESTIONS) {
    showToast(`Only ${selected.length} questions available. Starting game.`, 'warning', 6000);
  }

  currentQuestions = selected;

  roundCoins = 0;
  lifelineUsed = null;
  isCorrectAfterLifeline = false;
  showCountdown(() => loadQuestion(0));
}

// ========== COUNTDOWN OVERLAY ==========
function showCountdown(callback) {
  const overlay = document.createElement('div');
  overlay.id = 'countdownOverlay';
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.85); backdrop-filter:blur(8px);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    z-index:10001; font-family:'Orbitron',monospace;
  `;

  const numberContainer = document.createElement('div');
  numberContainer.style.cssText = `
    font-size:8rem; font-weight:800; color:#FFD700;
    text-shadow:0 0 40px rgba(255,215,0,0.3);
    animation:countPulse 1s ease-in-out;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes countPulse {
      0%   { transform:scale(1.5); opacity:0; }
      50%  { transform:scale(1);   opacity:1; }
      100% { transform:scale(1.1); opacity:0.8; }
    }
    @keyframes goPulse {
      0%   { transform:scale(1.2); opacity:0; }
      50%  { transform:scale(1);   opacity:1; }
      100% { transform:scale(1.1); opacity:0.9; }
    }
  `;
  document.head.appendChild(style);
  overlay.appendChild(numberContainer);

  const label = document.createElement('div');
  label.style.cssText = `
    color:#a0b3d9; font-size:1.2rem; font-weight:400;
    font-family:'Poppins',sans-serif; margin-top:1rem; letter-spacing:0.15em;
  `;
  label.textContent = 'Get ready!';
  overlay.appendChild(label);
  document.body.appendChild(overlay);

  let count = 3;
  const interval = setInterval(() => {
    if (count > 0) {
      numberContainer.textContent = count;
      numberContainer.style.animation = 'none';
      void numberContainer.offsetHeight;
      numberContainer.style.animation = 'countPulse 1s ease-in-out';
      count--;
    } else {
      clearInterval(interval);
      numberContainer.textContent = 'GO!';
      numberContainer.style.color = '#3ED6B7';
      numberContainer.style.textShadow = '0 0 40px rgba(62,214,183,0.3)';
      numberContainer.style.animation = 'goPulse 0.8s ease-in-out';
      label.textContent = "Let's go!";
      setTimeout(() => {
        overlay.remove();
        if (typeof callback === 'function') callback();
      }, 800);
    }
  }, 1000);
}

// ========== LOAD QUESTION ==========
function loadQuestion(index) {
  console.log('📝 Loading question', index + 1, 'of', currentQuestions.length);

  const errorPanel = document.getElementById('gameErrorPanel');
  if (errorPanel) errorPanel.remove();

  gameRoundActive   = true;
  questionAnswered  = false;
  lifelinesDisabled = false;
  oneChanceMissed = false;
  nextBtn.disabled  = true;

  // Reset lifeline usage tracking for the new question
  lifelineUsed = null;
  isCorrectAfterLifeline = false;

  nextBtn.innerHTML = (index === TOTAL_QUESTIONS - 1)
    ? '<i class="fas fa-flag-checkered"></i> Finish'
    : '<i class="fas fa-forward"></i> Next';

  if (!currentQuestions || index >= currentQuestions.length) {
    endRound();
    return;
  }

  const q = currentQuestions[index];
  console.log('📖 Current question:', q);

  if (questionNumber) questionNumber.textContent = `Question ${index + 1}`;
  if (questionText) {
    questionText.textContent    = q.question;
    questionText.style.color    = '';
    questionText.style.fontWeight = '';
  }

  if (optionTexts.A) optionTexts.A.textContent = q.optionA;
  if (optionTexts.B) optionTexts.B.textContent = q.optionB;
  if (optionTexts.C) optionTexts.C.textContent = q.optionC;
  if (optionTexts.D) optionTexts.D.textContent = q.optionD;

  const progress = ((index + 1) / TOTAL_QUESTIONS * 100);
  if (progressBar)  progressBar.style.width       = progress + '%';
  if (progressLabel) progressLabel.textContent    = `Question ${index + 1} of ${TOTAL_QUESTIONS}`;

  // Reset all option buttons
  ['A', 'B', 'C', 'D'].forEach(letter => {
    const btn = optionBtns[letter];
    if (btn) {
      btn.classList.remove('correct', 'wrong', 'disabled');
      btn.style.visibility  = 'visible';
      btn.style.background  = '';
      btn.style.color       = '';
      btn.style.borderColor = '';
      btn.disabled          = false;
      btn.style.display     = '';
    }
  });

  // Hide crowd bars
  document.querySelectorAll('.option-crowd').forEach(el => {
    el.style.display = 'none';
  });

  // Reset pending wrong-answer variables
  pendingSelectedLetter = null;
  pendingCorrectLetter = null;

  updateLifelineUI();
  startTimer();
}

// ========== TIMER ==========
const TIMER_CIRCUMFERENCE = 2 * Math.PI * 18;

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = MAX_SCORE_PER_QUESTION;
  if (timerSeconds) timerSeconds.textContent = timeLeft;

  if (timerPath) {
    timerPath.style.strokeDasharray  = TIMER_CIRCUMFERENCE;
    timerPath.style.strokeDashoffset = 0;
  }

  timerInterval = setInterval(timerTick, 1000);
}

// Freezes the countdown in place (used while the Call a Friend modal is open)
function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// Resumes the countdown from exactly where it was paused — does not reset timeLeft
function resumeTimer() {
  if (questionAnswered) return;
  if (timerInterval) return; // already running
  timerInterval = setInterval(timerTick, 1000);
}

function timerTick() {
  timeLeft--;
  if (timerSeconds) timerSeconds.textContent = Math.max(0, timeLeft);

  if (timerPath) {
    const offset = TIMER_CIRCUMFERENCE * (1 - (Math.max(0, timeLeft) / MAX_SCORE_PER_QUESTION));
    timerPath.style.strokeDashoffset = offset;
  }

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    questionAnswered  = true;
    lifelinesDisabled = true;
    updateLifelineUI();

    // Lock all option buttons
    ['A', 'B', 'C', 'D'].forEach(letter => {
      const btn = optionBtns[letter];
      if (btn) {
        btn.disabled = true;
        btn.classList.add('disabled');
      }
    });

    const correctAns = currentQuestions[currentQuestionIndex]?.correctAnswer;

    // ── ONE CHANCE: immediate feedback & end round ──
    if (questionType === 'one_chance') {
      // Reveal correct answer in green
      if (correctAns && optionBtns[correctAns]) {
        applyCorrectStyle(optionBtns[correctAns]);
      }
      // Streak update (wrong)
      const comment = handleStreakUpdate(false);
      if (comment) showCommentModal(comment);
      // End round immediately
      endRound();
      return;
    }

    // ── OTHER MODES (Jollof Mix, Pick Your Lane): delayed feedback ──
    if (correctAns) {
      pendingCorrectLetter = correctAns;
      pendingSelectedLetter = null;
    }
    // Streak update (wrong)
    const comment = handleStreakUpdate(false);
    if (comment) showCommentModal(comment);
    // Handle wrong answer (replay or delayed feedback)
    handleWrongAnswer();
  }
}

// ========== APPLY ANSWER HIGHLIGHT STYLES ==========
function applyCorrectStyle(btn) {
  btn.style.background  = '#3ED6B7';
  btn.style.color       = '#ffffff';
  btn.style.borderColor = '#3ED6B7';
  btn.classList.add('correct');
  btn.classList.remove('wrong');
}

function applyWrongStyle(btn) {
  btn.style.background  = '#ff4444';
  btn.style.color       = '#ffffff';
  btn.style.borderColor = '#ff4444';
  btn.classList.add('wrong');
  btn.classList.remove('correct');
}

// ========== STREAK LOGIC ==========
function handleStreakUpdate(isCorrect) {
  let commentText = null;

  if (isCorrect) {
    if (streakDirection === 'loss') {
      const previousLossCount = Math.abs(currentStreak);
      currentStreak   = 1;
      streakDirection = 'win';
      if (previousLossCount >= 3) {
        commentText = onCorrectAfterStreak();
      }
    } else if (streakDirection === 'win') {
      currentStreak += 1;
      if (currentStreak === 2) {
        commentText = onTwoStreakWin();
      } else if (currentStreak === 5) {
        commentText = onFiveStreakWin();
      }
    } else {
      currentStreak   = 1;
      streakDirection = 'win';
    }
  } else {
    if (streakDirection === 'win') {
      currentStreak   = -1;
      streakDirection = 'loss';
    } else if (streakDirection === 'loss') {
      currentStreak -= 1;
      const lossCount = Math.abs(currentStreak);
      if (lossCount === 3) {
        commentText = onThreeStreakLoss();
      } else if (lossCount === 5) {
        commentText = onFiveStreakLoss();
      }
    } else {
      currentStreak   = -1;
      streakDirection = 'loss';
    }
  }

  return commentText;
}

// ========== REPLAY MODAL ==========
function showReplayModal(onYes, onNo) {
  const existing = document.getElementById('replayModal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'replayModal';
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.85); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    z-index:10004; padding:1rem;
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    background:rgba(20,25,40,0.95);
    border:1px solid rgba(62,214,183,0.4);
    border-radius:2rem; padding:2rem 1.5rem;
    max-width:400px; width:100%;
    text-align:center; font-family:'Poppins',sans-serif;
  `;

  const livesLeft = livesRemaining > 0 ? livesRemaining : 0;
  const canReplay = livesLeft > 0;

  card.innerHTML = `
    <div style="font-size:3rem; margin-bottom:0.5rem;">
      <i class="fas fa-heart" style="color:#ff6b6b;"></i>
    </div>
    <h3 style="color:#f0f3fa; font-size:1.3rem; margin-bottom:0.3rem;">Oops! Wrong Answer</h3>
    <p style="color:#a0b3d9; font-size:1rem; margin-bottom:1rem;">
      You have <strong style="color:#ff6b6b;">${livesLeft}</strong> life${livesLeft !== 1 ? 's' : ''} remaining.
    </p>
    ${canReplay ? `
      <p style="color:#a0b3d9; font-size:0.9rem; margin-bottom:1.5rem;">
        Would you like to use one life to replay this question?
      </p>
    ` : `
      <p style="color:#ff6b6b; font-size:0.9rem; margin-bottom:1.5rem;">
        No lives left! You'll have to continue.
      </p>
    `}
    <div style="display:flex; gap:0.8rem; justify-content:center;">
      <button id="replayYesBtn" ${!canReplay ? 'disabled' : ''} style="
        background:${canReplay ? 'linear-gradient(135deg,#3ED6B7,#259c84)' : '#4a4a5a'};
        border:none; border-radius:40px; padding:0.6rem 1.8rem;
        font-weight:700; font-size:1rem; color:${canReplay ? '#0a0f1e' : '#888'};
        cursor:${canReplay ? 'pointer' : 'not-allowed'};
        font-family:'Poppins',sans-serif;
        transition: transform 0.2s;
      ">${canReplay ? 'Yes, Replay' : 'No Lives'}</button>
      <button id="replayNoBtn" style="
        background:rgba(255,255,255,0.1);
        border:1.5px solid #a0b3d9;
        border-radius:40px; padding:0.6rem 1.8rem;
        font-weight:700; font-size:1rem; color:#f0f3fa;
        cursor:pointer; font-family:'Poppins',sans-serif;
      ">No, Continue</button>
    </div>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  document.getElementById('replayYesBtn').addEventListener('click', () => {
    overlay.remove();
    if (onYes) onYes();
  });

  document.getElementById('replayNoBtn').addEventListener('click', () => {
    overlay.remove();
    if (onNo) onNo();
  });
}

// ========== APPLY WRONG FEEDBACK (called after "No" or when lives = 0) ==========
function applyWrongFeedback(selectedLetter, correctLetter) {
  if (selectedLetter && optionBtns[selectedLetter]) {
    applyWrongStyle(optionBtns[selectedLetter]);
  }
  if (correctLetter && optionBtns[correctLetter]) {
    applyCorrectStyle(optionBtns[correctLetter]);
  }
}

// ========== HANDLE WRONG ANSWER (replay or continue – only for non‑One‑Chance) ==========
function handleWrongAnswer() {
  const hasLives = livesRemaining > 0;

  if (hasLives) {
    showReplayModal(
      // Yes: replay the question
      async () => {
        try {
          const userRef = doc(db, 'users', currentUserUID);
          await updateDoc(userRef, {
            lives: increment(-1)
          });
          livesRemaining = Math.max(0, livesRemaining - 1);
          // Reset question state
          questionAnswered = false;
          ['A', 'B', 'C', 'D'].forEach(letter => {
            const btn = optionBtns[letter];
            if (btn) {
              btn.disabled = false;
              btn.classList.remove('disabled', 'correct', 'wrong');
              btn.style.background = '';
              btn.style.color = '';
              btn.style.borderColor = '';
            }
          });
          startTimer();
          lifelinesDisabled = false;
          updateLifelineUI();
          nextBtn.disabled = true;
          document.querySelectorAll('.option-crowd').forEach(el => {
            el.style.display = 'none';
          });
          pendingSelectedLetter = null;
          pendingCorrectLetter = null;
          console.log('🔄 Replaying question with fresh timer.');
        } catch (err) {
          console.error('Failed to decrement lives:', err);
          showToast('Failed to use life. Please try again.', 'error');
          applyWrongFeedback(pendingSelectedLetter, pendingCorrectLetter);
          proceedAfterWrong();
        }
      },
      // No: continue, show feedback now
      () => {
        applyWrongFeedback(pendingSelectedLetter, pendingCorrectLetter);
        proceedAfterWrong();
      }
    );
  } else {
    // No lives – immediately show feedback and continue
    applyWrongFeedback(pendingSelectedLetter, pendingCorrectLetter);
    proceedAfterWrong();
  }
}

function proceedAfterWrong() {
  questionAnswered = true;
  lifelinesDisabled = true;
  updateLifelineUI();
  nextBtn.disabled = false;
}

// ========== ANSWER SELECTION ==========
function attachOptionListener() {
  const optionsGrid = document.querySelector('.options-grid');
  if (!optionsGrid) {
    console.error('❌ .options-grid not found in DOM — answer selection will not work.');
    showErrorOnScreen('Game UI failed to initialize (options grid missing).');
    return;
  }

  optionsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.option-btn');
    if (!btn) return;
    if (btn.disabled || btn.classList.contains('disabled')) return;
    if (questionAnswered) return;
    if (!gameRoundActive) return;

    // ── 1. Stop timer ──
    clearInterval(timerInterval);
    const pointsEarned = Math.max(0, timeLeft);

    // ── 2. Lock options ──
    ['A', 'B', 'C', 'D'].forEach(letter => {
      const b = optionBtns[letter];
      if (b) {
        b.disabled = true;
        b.classList.add('disabled');
      }
    });

    // ── 3. Validate ──
    const selectedLetter = btn.dataset.option;
    const currentQ = currentQuestions[currentQuestionIndex];
    if (!currentQ) {
      console.error('❌ No current question at index', currentQuestionIndex);
      return;
    }

    const correctLetter = currentQ.correctAnswer;
    const isCorrect = (selectedLetter === correctLetter);

    // ── 4. Handle correct answer (immediate feedback) ──
    if (isCorrect) {
      applyCorrectStyle(btn);
      const coinsEarned = (timeLeft <= 7) ? 10 : 15;
      roundCoins += coinsEarned;
      roundScore += pointsEarned;
      correctCount += 1;
      console.log(`✅ Correct! +${pointsEarned} pts, +${coinsEarned} coins`);

      // Live-update the coins badge immediately (Firestore write happens in background at endRound)
      displayedCoins += coinsEarned;
      if (gameCoinsValue) gameCoinsValue.textContent = displayedCoins.toLocaleString();

      // If a lifeline was used and the answer is correct, mark it
      if (lifelineUsed) {
        isCorrectAfterLifeline = true;
      }

      const comment = handleStreakUpdate(true);
      if (comment) showCommentModal(comment);

      questionAnswered = true;
      lifelinesDisabled = true;
      updateLifelineUI();
      nextBtn.disabled = false;
    } else {
      // ── 5. Wrong answer ──
      // ── ONE CHANCE: immediate feedback & end round ──
      if (questionType === 'one_chance') {
        // Highlight selected as wrong
        applyWrongStyle(btn);
        // Highlight correct answer in green
        if (correctLetter && optionBtns[correctLetter]) {
          applyCorrectStyle(optionBtns[correctLetter]);
        }
        // Streak update (wrong)
        const comment = handleStreakUpdate(false);
        if (comment) showCommentModal(comment);
        // End round immediately
        endRound();
        return;
      }

      // ── OTHER MODES: store info for delayed feedback ──
      pendingSelectedLetter = selectedLetter;
      pendingCorrectLetter = correctLetter;

      // Streak update (wrong)
      const comment = handleStreakUpdate(false);
      if (comment) showCommentModal(comment);

      // Handle wrong answer (replay or delayed feedback)
      handleWrongAnswer();
    }
  });

  console.log('✅ Option click listener attached.');
}

attachOptionListener();

// ========== NEXT BUTTON ==========
nextBtn.addEventListener('click', () => {
  if (nextBtn.disabled) return;
  if (questionAnswered) {
    if (oneChanceMissed) {
      endRound();
    } else {
      nextQuestion();
    }
  }
});

// ========== NEXT QUESTION ==========
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length && currentQuestionIndex < TOTAL_QUESTIONS) {
    loadQuestion(currentQuestionIndex);
  } else {
    nextBtn.disabled = true;
    endRound();
  }
}

// ========== LIFELINES – 50:50 ==========
lifelineFifty?.addEventListener('click', async () => {
  if (lifelineFifty.classList.contains('disabled')) return;
  if (questionAnswered) return;

  const currentQ = currentQuestions[currentQuestionIndex];
  if (!currentQ) return;

  // Track lifeline usage for challenge
  if (lifelineUsed === null) lifelineUsed = 'fifty_fifty';
  else if (lifelineUsed === 'ask_crowd') lifelineUsed = 'both';
  else if (lifelineUsed === 'callFriend') lifelineUsed = 'both';
  else if (lifelineUsed === 'both') lifelineUsed = 'all';
  // else remains 'all' or whatever

  if (lifelineCounts.fifty_fifty <= 0) return;
  lifelineCounts.fifty_fifty--;
  updateLifelineUI();

  if (!freeLifelines.fifty_fifty) {
    try {
      const userRef = doc(db, 'users', currentUserUID);
      await updateDoc(userRef, { 'lifeline.fifty_fifty': increment(-1) });
      console.log('💾 Decremented fifty_fifty extra in Firestore');
    } catch (err) {
      console.error('Failed to update lifeline in Firestore:', err);
      showToast('Could not save lifeline usage.', 'error', 20000);
    }
  } else {
    freeLifelines.fifty_fifty = false;
    console.log('🆓 Used free fifty_fifty');
  }

  const correct = currentQ.correctAnswer;
  const wrongOptions = ['A', 'B', 'C', 'D'].filter(l => l !== correct);
  const toHide = fisherYatesShuffle(wrongOptions).slice(0, 2);
  toHide.forEach(letter => {
    const btn = optionBtns[letter];
    if (btn) btn.style.visibility = 'hidden';
  });
});

// ========== LIFELINES – Ask Crowd ==========
lifelineAsk?.addEventListener('click', async () => {
  if (lifelineAsk.classList.contains('disabled')) return;
  if (questionAnswered) return;

  const currentQ = currentQuestions[currentQuestionIndex];
  if (!currentQ) return;

  // Track lifeline usage
  if (lifelineUsed === null) lifelineUsed = 'ask_crowd';
  else if (lifelineUsed === 'fifty_fifty') lifelineUsed = 'both';
  else if (lifelineUsed === 'callFriend') lifelineUsed = 'both';
  else if (lifelineUsed === 'both') lifelineUsed = 'all';

  if (lifelineCounts.ask_crowd <= 0) return;
  lifelineCounts.ask_crowd--;
  updateLifelineUI();

  if (!freeLifelines.ask_crowd) {
    try {
      const userRef = doc(db, 'users', currentUserUID);
      await updateDoc(userRef, { 'lifeline.ask_crowd': increment(-1) });
      console.log('💾 Decremented ask_crowd extra in Firestore');
    } catch (err) {
      console.error('Failed to update lifeline in Firestore:', err);
      showToast('Could not save lifeline usage.', 'error', 20000);
    }
  } else {
    freeLifelines.ask_crowd = false;
    console.log('🆓 Used free ask_crowd');
  }

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
  others.forEach((letter, idx) => { result[letter] = dist[idx] || 0; });

  const letters = ['A', 'B', 'C', 'D'];
  letters.forEach(letter => {
    const container = document.querySelector(`#option${letter} .option-crowd`);
    const bar = document.getElementById(`crowdBar${letter}`);
    const pct = document.getElementById(`crowdPercent${letter}`);
    if (container) container.style.display = 'flex';
    if (bar) bar.style.width = (result[letter] || 0) + '%';
    if (pct) pct.textContent = (result[letter] || 0) + '%';
  });
});

// ========== LIFELINES – Call a Friend ==========
lifelineCallFriend?.addEventListener('click', async () => {
  if (lifelineCallFriend.classList.contains('disabled')) return;
  if (questionAnswered) return;

  const currentQ = currentQuestions[currentQuestionIndex];
  if (!currentQ) return;

  // Track lifeline usage
  if (lifelineUsed === null) lifelineUsed = 'callFriend';
  else if (lifelineUsed === 'fifty_fifty') lifelineUsed = 'both';
  else if (lifelineUsed === 'ask_crowd') lifelineUsed = 'both';
  else if (lifelineUsed === 'both') lifelineUsed = 'all';

  if (lifelineCounts.callFriend <= 0) return;
  lifelineCounts.callFriend--;
  updateLifelineUI();

  if (!freeLifelines.callFriend) {
    try {
      const userRef = doc(db, 'users', currentUserUID);
      await updateDoc(userRef, { 'lifeline.callFriend': increment(-1) });
      console.log('💾 Decremented callFriend extra in Firestore');
    } catch (err) {
      console.error('Failed to update lifeline in Firestore:', err);
      showToast('Could not save lifeline usage.', 'error', 20000);
    }
  } else {
    freeLifelines.callFriend = false;
    console.log('🆓 Used free callFriend');
  }

  const correctLetter = currentQ.correctAnswer;
  pauseTimer();
  showCallFriendModal(correctLetter);
});

// ========== CALL FRIEND MODAL (3D, themed to match games.html/css) ==========
function showCallFriendModal(correctLetter) {
  ensureCommentModalAnimStyle();

  const existing = document.getElementById('callFriendModal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'callFriendModal';
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(6,4,16,0.8); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    z-index:10003; padding:1rem; perspective:1000px;
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    background: linear-gradient(160deg, rgba(48,38,84,0.92), rgba(20,16,42,0.96));
    backdrop-filter: blur(14px);
    border-radius: 24px;
    padding: 1.8rem 1.6rem;
    max-width: 400px; width: 100%;
    position: relative; text-align: center; color: #f0f3fa;
    font-family: 'Poppins', sans-serif;
    box-shadow:
      0 24px 50px rgba(0,0,0,0.5),
      0 6px 16px rgba(124,79,224,0.2),
      inset 0 1px 0 rgba(255,255,255,0.08);
    transform-style: preserve-3d;
    animation: commentPopIn3D 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;

  const borderRing = document.createElement('div');
  borderRing.style.cssText = `
    position:absolute; inset:-2px; border-radius:24px; padding:2px;
    background: linear-gradient(150deg, #FF9A3E 0%, #7C4FE0 45%, #3E63E8 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events:none; opacity:0.85; z-index:0;
  `;
  card.appendChild(borderRing);

  const inner = document.createElement('div');
  inner.style.cssText = `position:relative; z-index:1;`;
  card.appendChild(inner);

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position:absolute; top:0.6rem; right:1rem;
    background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1);
    width:34px; height:34px; border-radius:50%;
    font-size:1.4rem; line-height:1;
    color:#e4e8f5; cursor:pointer; font-family:'Poppins',sans-serif;
    z-index:2;
  `;
  card.appendChild(closeBtn);

  const icon = document.createElement('div');
  icon.innerHTML = '<i class="fas fa-phone-volume"></i>';
  icon.style.cssText = `
    font-size:2.4rem; color:#8B5CF6; margin-bottom:0.6rem;
    filter: drop-shadow(0 4px 10px rgba(139,92,246,0.4));
  `;
  inner.appendChild(icon);

  const msg = document.createElement('p');
  msg.style.cssText = `font-size:1.05rem; color:#c9d3ee; font-weight:500; margin:0.4rem 0 0.7rem;`;
  msg.textContent = 'Your friend says:';
  inner.appendChild(msg);

  const answer = document.createElement('p');
  answer.style.cssText = `
    font-family:'Orbitron',monospace; font-size:2.1rem; font-weight:800;
    background: linear-gradient(135deg, #FFD700, #FF9A3E);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    margin:0.2rem 0 0.9rem; letter-spacing:0.04em;
  `;
  answer.textContent = `The correct answer is ${correctLetter}!`;
  inner.appendChild(answer);

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  closeBtn.addEventListener('click', () => {
    overlay.remove();
    resumeTimer();
  });
}

// ========== LOADER ==========
function showLoader(message = 'Wait a moment. Calculating your score...') {
  if (document.getElementById('scoreLoader')) return;

  const overlay = document.createElement('div');
  overlay.id = 'scoreLoader';
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.7); backdrop-filter:blur(6px);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    z-index:10000; font-family:'Poppins',sans-serif;
  `;

  const spinner = document.createElement('div');
  spinner.style.cssText = `
    width:60px; height:60px;
    border:6px solid rgba(255,255,255,0.1);
    border-top-color:#3ED6B7;
    border-radius:50%;
    animation:spin 1s linear infinite;
  `;

  const spinStyle = document.createElement('style');
  spinStyle.textContent = `@keyframes spin { to { transform:rotate(360deg); } }`;
  document.head.appendChild(spinStyle);

  const text = document.createElement('p');
  text.textContent = message;
  text.style.cssText = `
    color:#f0f3fa; font-size:1.1rem; font-weight:500;
    margin-top:1.5rem; text-align:center; max-width:300px;
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
  roundEnded    = true;
  gameRoundActive = false;
  clearInterval(timerInterval);

  showRoundEndModal(false);

  // --- Background Firestore saves + challenge check ---
  (async () => {
    try {
      let previousBest = 0;
      try {
        const userRef = doc(db, 'users', currentUserUID);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const catStats = data.categoryStats || {};
          previousBest = catStats[category]?.bestScore || 0;
        }
      } catch (err) {
        console.warn('Could not read previous best:', err);
        previousBest = 0;
      }

      const pointRef = collection(db, 'regular_points');
      await addDoc(pointRef, {
        uid:              currentUserUID,
        gameType:         questionType,
        category:         category,
        point:            roundScore,
        correctAnswers:   correctCount,
        totalQuestions:   TOTAL_QUESTIONS,
        questionsReached: currentQuestionIndex + 1,
        coinsEarned:      roundCoins,
        time:             serverTimestamp()
      });

      const userRef = doc(db, 'users', currentUserUID);
      await updateDoc(userRef, {
        lifetimeRoundPlayed:  increment(1),
        totalScore:           increment(roundScore),
        totalCorrectAnswers:  increment(correctCount),
        coins:                increment(roundCoins)
      });

      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data     = userSnap.data();
        const catStats = data.categoryStats || {};
        const catKey   = category;
        if (!catStats[catKey]) catStats[catKey] = { played: 0, bestScore: 0 };

        const currentBest = catStats[catKey].bestScore || 0;
        const newBest     = roundScore > currentBest ? roundScore : currentBest;

        await updateDoc(userRef, {
          [`categoryStats.${catKey}.played`]:    increment(1),
          [`categoryStats.${catKey}.bestScore`]: newBest
        });

        if (roundScore > previousBest) {
          const container = document.getElementById('newBestBadgeContainer');
          if (container) {
            container.innerHTML = `
              <div style="font-family:'Orbitron',monospace; font-size:1.2rem; font-weight:700; color:#0A0A0F; background:linear-gradient(135deg,#FFD700,#FF9A3E); border-radius:40px; padding:0.45rem 1.3rem; display:inline-block; margin-bottom:0.8rem; box-shadow:0 6px 20px rgba(255,176,32,0.4);">
                🏆 New Best Score!
              </div>
            `;
          }
          setTimeout(() => showFireworks(), 300);
        }
      }

      // ========== CHALLENGE EVALUATION ==========
      // Build round stats (use what we have)
      const roundStats = {
        correctCount,
        wrongCount: Math.max(0, (currentQuestionIndex + 1) - correctCount),
        currentStreak,
        streakDirection,
        previousStreak: 0, // not tracked; kept for compatibility
        lifelinesUsed: lifelineUsed !== null ? (lifelineUsed === 'both' || lifelineUsed === 'all' ? 2 : 1) : 0,
        lifelineUsed: lifelineUsed,
        isCorrectAfterLifeline,
        lastAnswerTimeLeft: timeLeft,
        fastestAnswer: 0,
        totalTime: 0,
        totalQuestions: TOTAL_QUESTIONS,
        firstThreeCorrect: false,
        firstFiveCorrect: false,
        fastAnswersCount: 0,
        slowAnswersCount: 0,
        averageTime: 0,
        finalTimer: timeLeft,
      };

      // Re-fetch user data to get the latest challenge state
      const freshUserSnap = await getDoc(userRef);
      const freshUserData = freshUserSnap.exists() ? freshUserSnap.data() : currentUserData;

      const challengeResult = evaluateChallenge(roundStats, freshUserData);
      if (challengeResult && challengeResult.completed) {
        try {
          // Apply reward
          await applyReward(currentUserUID, challengeResult.rewardType, challengeResult.rewardValue, db);
          // Mark challenge completed
          await markChallengeCompleted(currentUserUID, db);
          // Show congratulations modal (after a short delay)
          setTimeout(() => {
            showCongratulationsModal(challengeResult.rewardType, challengeResult.rewardValue);
          }, 600);
        } catch (err) {
          console.error('Failed to apply challenge reward:', err);
        }
      }

    } catch (err) {
      console.error('Error saving round data:', err);
      showToast('Some data could not be saved, but your round is complete.', 'warning', 6000);
    }
  })();
}

// ========== COMMENT MODAL (3D, themed to match games.html/css) ==========
function ensureCommentModalAnimStyle() {
  if (document.getElementById('commentModalAnimStyle')) return;
  const style = document.createElement('style');
  style.id = 'commentModalAnimStyle';
  style.textContent = `
    @keyframes commentPopIn3D {
      0%   { transform: perspective(1000px) rotateX(-25deg) scale(0.7); opacity: 0; }
      60%  { transform: perspective(1000px) rotateX(5deg) scale(1.04); opacity: 1; }
      100% { transform: perspective(1000px) rotateX(0deg) scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

function showCommentModal(comment) {
  ensureCommentModalAnimStyle();

  const existing = document.getElementById('commentModal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'commentModal';
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(6,4,16,0.8); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    z-index:10002; padding:1rem; perspective:1000px;
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    background: linear-gradient(160deg, rgba(48,38,84,0.92), rgba(20,16,42,0.96));
    backdrop-filter: blur(14px);
    border-radius: 24px;
    padding: 1.8rem 1.6rem;
    max-width: 400px; width: 100%;
    position: relative; text-align: center; color: #f0f3fa;
    font-family: 'Poppins', sans-serif;
    box-shadow:
      0 24px 50px rgba(0,0,0,0.5),
      0 6px 16px rgba(124,79,224,0.2),
      inset 0 1px 0 rgba(255,255,255,0.08);
    transform-style: preserve-3d;
    animation: commentPopIn3D 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;

  const borderRing = document.createElement('div');
  borderRing.style.cssText = `
    position:absolute; inset:-2px; border-radius:24px; padding:2px;
    background: linear-gradient(150deg, #FF9A3E 0%, #7C4FE0 45%, #3E63E8 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events:none; opacity:0.85; z-index:0;
  `;
  card.appendChild(borderRing);

  const inner = document.createElement('div');
  inner.style.cssText = `position:relative; z-index:1;`;
  card.appendChild(inner);

  const icon = document.createElement('div');
  icon.innerHTML = '<i class="fas fa-bolt"></i>';
  icon.style.cssText = `
    font-size:2.2rem; color:#FFD700; margin-bottom:0.7rem;
    filter: drop-shadow(0 4px 10px rgba(255,215,0,0.4));
  `;
  inner.appendChild(icon);

  const textP = document.createElement('p');
  textP.style.cssText = `
    font-size:1.2rem; font-weight:600; color:#ffffff;
    line-height:1.55; margin-bottom:1.5rem;
  `;
  textP.textContent = comment;
  inner.appendChild(textP);

  const btn = document.createElement('button');
  btn.innerHTML = '<i class="fas fa-check"></i> Got it';
  btn.style.cssText = `
    background: linear-gradient(160deg, #3E7BFF 0%, #1A4FA0 100%);
    border:none; padding:0.65rem 2rem; border-radius:20px;
    font-weight:700; font-size:0.9rem; color:#ffffff;
    cursor:pointer; font-family:'Poppins',sans-serif;
    display:inline-flex; align-items:center; gap:0.5rem;
    box-shadow: 0 8px 20px rgba(62,123,255,0.35);
  `;
  btn.addEventListener('click', () => overlay.remove());
  inner.appendChild(btn);

  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

// ========== FIREWORKS (themed rocket-launch display, ~5s) ==========
function showFireworks() {
  const canvas = document.createElement('canvas');
  canvas.id = 'fireworksCanvas';
  canvas.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    pointer-events:none; z-index:10001;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w = canvas.width  = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  // Palette pulled straight from the games theme (question-box gradient border,
  // timer/coins gold, correct green, lifeline blue) instead of generic colors.
  const THEME_COLORS = ['#FFD700', '#FFB020', '#FF9A3E', '#7C4FE0', '#3E7BFF', '#2FBF5B'];

  class Spark {
    constructor(x, y, color) {
      this.x = x; this.y = y; this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = 0.008 + Math.random() * 0.012;
      this.size = 2 + Math.random() * 3;
      this.gravity = 0.045;
    }
    update() {
      this.vy += this.gravity;
      this.vx *= 0.985;
      this.vy *= 0.985;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(this.alpha, 0);
      ctx.shadowBlur = 14;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Rocket {
    constructor(x, targetY) {
      this.x = x;
      this.y = h + 10;
      this.targetY = targetY;
      this.vy = -(Math.random() * 3 + 9);
      this.color = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
      this.exploded = false;
      this.trail = [];
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 8) this.trail.shift();
      this.y += this.vy;
      this.vy += 0.05;
      if (this.y <= this.targetY) this.exploded = true;
    }
    draw(ctx) {
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      this.trail.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  let rockets = [];
  let sparks = [];

  function launchRocket() {
    const x = w * 0.15 + Math.random() * w * 0.7;
    const targetY = h * 0.15 + Math.random() * h * 0.35;
    rockets.push(new Rocket(x, targetY));
  }

  function explode(x, y, color) {
    const count = 60 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) sparks.push(new Spark(x, y, color));
    // white sparkle ring layered on top for a brighter, more premium burst
    for (let i = 0; i < 18; i++) sparks.push(new Spark(x, y, '#FFFFFF'));
  }

  const duration = 5000;
  launchRocket();
  const launchInterval = setInterval(launchRocket, 550);
  // Stop launching new rockets before the end so the last bursts can fade out cleanly
  setTimeout(() => clearInterval(launchInterval), duration - 1200);

  let frameId = null;
  const startTime = performance.now();

  function animate(timestamp) {
    if (timestamp - startTime > duration) {
      clearInterval(launchInterval);
      if (frameId) cancelAnimationFrame(frameId);
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, w, h);

    rockets.forEach(r => { r.update(); r.draw(ctx); });
    rockets = rockets.filter(r => {
      if (r.exploded) { explode(r.x, r.y, r.color); return false; }
      return true;
    });

    sparks.forEach(s => { s.update(); s.draw(ctx); });
    sparks = sparks.filter(s => s.alpha > 0);

    frameId = requestAnimationFrame(animate);
  }

  frameId = requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
}

// ========== ROUND END MODAL (3D, themed to match games.html/css) ==========
function showRoundEndModal(newBest = false) {
  // Inject the 3D pop-in keyframes once
  if (!document.getElementById('roundEndModalAnimStyle')) {
    const style = document.createElement('style');
    style.id = 'roundEndModalAnimStyle';
    style.textContent = `
      @keyframes roundEndPopIn3D {
        0%   { transform: perspective(1000px) rotateX(28deg) scale(0.75); opacity: 0; }
        60%  { transform: perspective(1000px) rotateX(-4deg) scale(1.03); opacity: 1; }
        100% { transform: perspective(1000px) rotateX(0deg) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement('div');
  overlay.id = 'roundEndModal';
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(6,4,16,0.85); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    z-index:9999; padding:1rem; perspective:1200px;
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    background: linear-gradient(160deg, rgba(48,38,84,0.92), rgba(20,16,42,0.96));
    backdrop-filter: blur(14px);
    border-radius: 28px;
    padding: 2rem 1.6rem;
    max-width: 440px; width: 100%;
    position: relative; text-align: center; color: #f0f3fa;
    font-family: 'Poppins', sans-serif;
    box-shadow:
      0 30px 60px rgba(0,0,0,0.55),
      0 8px 20px rgba(255,154,62,0.15),
      inset 0 1px 0 rgba(255,255,255,0.08);
    transform-style: preserve-3d;
    animation: roundEndPopIn3D 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;

  // Gradient border ring (matches question-box treatment)
  const borderRing = document.createElement('div');
  borderRing.style.cssText = `
    position:absolute; inset:-2px; border-radius:28px; padding:2px;
    background: linear-gradient(150deg, #FF9A3E 0%, #7C4FE0 45%, #3E63E8 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events:none; opacity:0.85; z-index:0;
  `;
  card.appendChild(borderRing);

  const inner = document.createElement('div');
  inner.style.cssText = `position:relative; z-index:1;`;
  card.appendChild(inner);

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position:absolute; top:0.6rem; right:1rem;
    background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1);
    width:34px; height:34px; border-radius:50%;
    font-size:1.4rem; line-height:1;
    color:#e4e8f5; cursor:pointer; font-family:'Poppins',sans-serif;
    z-index:2;
  `;
  closeBtn.addEventListener('click', () => {
    window.location.href = '/app/dashboard.html#play';
  });
  card.appendChild(closeBtn);

  const badgeContainer = document.createElement('div');
  badgeContainer.id = 'newBestBadgeContainer';
  if (newBest) {
    const badge = document.createElement('div');
    badge.textContent = '🏆 New Best Score!';
    badge.style.cssText = `font-family:'Orbitron',monospace; font-size:1.2rem; font-weight:700; color:#0A0A0F; background:linear-gradient(135deg,#FFD700,#FF9A3E); border-radius:40px; padding:0.45rem 1.3rem; display:inline-block; margin-bottom:0.8rem; box-shadow:0 6px 20px rgba(255,176,32,0.4);`;
    badgeContainer.appendChild(badge);
  }
  inner.appendChild(badgeContainer);

  const title = document.createElement('h2');
  title.textContent = 'Round Complete!';
  title.style.cssText = `font-family:'Orbitron',monospace; font-size:1.5rem; font-weight:800; color:#ffffff; margin:0.3rem 0 0.9rem; text-shadow:0 2px 8px rgba(0,0,0,0.4);`;
  inner.appendChild(title);

  const maxPossible = TOTAL_QUESTIONS * MAX_SCORE_PER_QUESTION;
  const scoreDiv    = document.createElement('div');
  scoreDiv.style.cssText = `
    font-family:'Orbitron',monospace; font-size:3rem; font-weight:800;
    background: linear-gradient(135deg, #FFB020, #FF6B6B);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    margin:0.4rem 0; text-shadow: 0 6px 18px rgba(255,107,107,0.25);
  `;
  scoreDiv.textContent = `${roundScore} / ${maxPossible}`;
  inner.appendChild(scoreDiv);

  // For One Chance, show correct count out of attempted questions
  let attempted = TOTAL_QUESTIONS;
  let correctOutOfText = '';
  if (questionType === 'one_chance') {
    attempted = Math.min(currentQuestionIndex + 1, TOTAL_QUESTIONS);
    correctOutOfText = `${correctCount} of ${attempted} correct`;
    const reachedDiv = document.createElement('div');
    reachedDiv.style.cssText = `font-size:0.9rem; color:#a9b3d6; margin-bottom:0.4rem;`;
    reachedDiv.textContent = `You reached question ${attempted} of ${TOTAL_QUESTIONS}`;
    inner.appendChild(reachedDiv);
  } else {
    correctOutOfText = `${correctCount} of ${TOTAL_QUESTIONS} correct`;
  }

  const correctDiv = document.createElement('div');
  correctDiv.style.cssText = `
    display:inline-block; font-size:0.85rem; font-weight:700; color:#ffffff;
    background: rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1);
    border-radius:20px; padding:0.3rem 0.9rem; margin-bottom:0.9rem;
  `;
  correctDiv.textContent = correctOutOfText;
  inner.appendChild(correctDiv);

  const endComment = getEndOfRoundComment(roundScore);
  const msgP       = document.createElement('p');
  msgP.textContent = endComment;
  msgP.style.cssText = `font-size:1.02rem; color:#e4e8f5; margin:0.6rem 0 1.5rem; font-weight:500; line-height:1.4;`;
  inner.appendChild(msgP);

  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = `display:flex; gap:0.7rem; justify-content:center; flex-wrap:wrap;`;

  const playAgainBtn = document.createElement('button');
  playAgainBtn.innerHTML = '<i class="fas fa-rotate-right"></i> Play Again';
  playAgainBtn.style.cssText = `
    background: linear-gradient(160deg, #3E7BFF 0%, #1A4FA0 100%);
    border:none; padding:0.75rem 1.6rem; border-radius:20px;
    font-weight:700; font-size:0.9rem; color:#ffffff;
    cursor:pointer; font-family:'Poppins',sans-serif;
    display:flex; align-items:center; gap:0.5rem; justify-content:center;
    box-shadow: 0 8px 20px rgba(62,123,255,0.35);
    flex:1; min-width:150px;
  `;
  playAgainBtn.addEventListener('click', () => {
    overlay.remove();
    roundEnded           = false;
    isNewBest            = false;
    roundScore           = 0;
    correctCount         = 0;
    currentQuestionIndex = 0;
    currentStreak        = 0;
    streakDirection      = null;
    currentQuestions     = [];
    questionAnswered     = false;
    lifelinesDisabled    = false;
    gameRoundActive      = false;
    oneChanceMissed      = false;
    roundCoins           = 0;
    lifelineUsed         = null;
    isCorrectAfterLifeline = false;

    const urlParams       = new URLSearchParams(window.location.search);
    const exportNameParam = urlParams.get('export');
    if (exportNameParam) {
      loadLifelines().then(() => loadQuestionsFromJS(exportNameParam));
    } else {
      const typeParam = urlParams.get('type') || 'regular';
      window.location.href = `games.html${typeParam === 'regular' ? '' : '?type=' + typeParam}`;
    }
  });
  btnContainer.appendChild(playAgainBtn);

  const dashBtn = document.createElement('button');
  dashBtn.innerHTML = '<i class="fas fa-house"></i> Dashboard';
  dashBtn.style.cssText = `
    background: rgba(255,255,255,0.06);
    border:1.5px solid rgba(255,255,255,0.15);
    padding:0.75rem 1.6rem; border-radius:20px;
    font-weight:700; font-size:0.9rem; color:#ffffff;
    cursor:pointer; font-family:'Poppins',sans-serif;
    display:flex; align-items:center; gap:0.5rem; justify-content:center;
    flex:1; min-width:150px;
  `;
  dashBtn.addEventListener('click', () => {
    window.location.href = '/app/dashboard.html';
  });
  btnContainer.appendChild(dashBtn);

  inner.appendChild(btnContainer);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}