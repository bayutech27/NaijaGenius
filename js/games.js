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

// ========== DYNAMIC IMPORT FOR FUN-FACTS (with fallback) ==========
let showFunFactModal = () => {};
try {
  const funFactModule = await import('./fun-facts.js');
  if (funFactModule.showFunFactModal) {
    showFunFactModal = funFactModule.showFunFactModal;
    console.log('✅ fun-facts.js loaded successfully');
  }
} catch (e) {
  console.warn('⚠️ fun-facts.js not found – using dummy function.');
}

console.log('🎮 games.js loaded');

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
let lifelineCounts = { fifty_fifty: 0, ask_crowd: 0, skip: 0 };
let currentStreak = 0;
let streakDirection = null; // 'win' | 'loss' | null
let roundEnded = false;
let isNewBest = false;
let funFactTimer = null;
let funFactPending = false;
let gameRoundActive = false;
let questionAnswered = false;
let lifelinesDisabled = false;

const MAX_SCORE_PER_QUESTION = 15; // max points = time left at answer = 15
const TOTAL_QUESTIONS = 10;

// ========== DOM REFS ==========
const $ = (id) => document.getElementById(id);
const gameType       = $('gameType');
const gameCategory   = $('gameCategory');
const gameDifficulty = $('gameDifficulty');
const timerSeconds   = $('timerSeconds');
const timerPath      = $('timerPath');
const progressBar    = $('progressBar');
const progressLabel  = $('progressLabel');
const questionNumber = $('questionNumber');
const questionText   = $('questionText');
const optionBtns  = { A: $('optionA'),     B: $('optionB'),     C: $('optionC'),     D: $('optionD')     };
const optionTexts = { A: $('optionAText'), B: $('optionBText'), C: $('optionCText'), D: $('optionDText') };
const countFiftyFifty = $('countFiftyFifty');
const countAskCrowd   = $('countAskCrowd');
const countSkip       = $('countSkip');
const lifelineFifty   = $('lifelineFiftyFifty');
const lifelineAsk     = $('lifelineAskCrowd');
const lifelineSkip    = $('lifelineSkip');
const nextBtn         = $('nextBtn');
const crowdPanel      = $('crowdPanel');
const crowdBarA  = $('crowdBarA');  const crowdBarB  = $('crowdBarB');
const crowdBarC  = $('crowdBarC');  const crowdBarD  = $('crowdBarD');
const crowdPercentA = $('crowdPercentA'); const crowdPercentB = $('crowdPercentB');
const crowdPercentC = $('crowdPercentC'); const crowdPercentD = $('crowdPercentD');

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

// ========== FUN FACT TIMER ==========
function startFunFactTimer() {
  clearInterval(funFactTimer);
  funFactTimer = setInterval(() => {
    if (gameRoundActive) {
      funFactPending = true;
    } else {
      showFunFactModal('', false);
      funFactPending = false;
    }
  }, 600000);
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
    startFunFactTimer();

  } catch (err) {
    console.error('Init error:', err);
    showErrorOnScreen('Failed to start game: ' + (err.message || 'Unknown error'));
    setTimeout(() => window.location.href = '/app/dashboard.html', 3000);
  }
});

// ========== LOAD LIFELINES ==========
async function loadLifelines() {
  if (questionType === 'regular') {
    lifelineCounts = { fifty_fifty: 1, ask_crowd: 1, skip: 1 };
    updateLifelineUI();
    return;
  }
  try {
    if (!currentUserData) throw new Error('User data not loaded.');
    lifelineCounts.fifty_fifty = currentUserData.lifeline?.fifty_fifty ?? 3;
    lifelineCounts.ask_crowd   = currentUserData.lifeline?.ask_crowd   ?? 3;
    lifelineCounts.skip        = currentUserData.lifeline?.skip        ?? 3;
    updateLifelineUI();
  } catch (err) {
    console.error('Failed to load lifelines:', err);
    showErrorOnScreen('Could not load lifelines. Please refresh.');
    throw err;
  }
}

// ========== UPDATE LIFELINE UI ==========
function updateLifelineUI() {
  const forceDisable = lifelinesDisabled;

  if (countFiftyFifty) countFiftyFifty.textContent = lifelineCounts.fifty_fifty;
  if (countAskCrowd)   countAskCrowd.textContent   = lifelineCounts.ask_crowd;
  if (countSkip)       countSkip.textContent        = lifelineCounts.skip;

  lifelineFifty.classList.toggle('disabled', lifelineCounts.fifty_fifty <= 0 || forceDisable);
  lifelineAsk.classList.toggle('disabled',   lifelineCounts.ask_crowd   <= 0 || forceDisable);
  lifelineSkip.classList.toggle('disabled',  lifelineCounts.skip        <= 0 || forceDisable);
}

// ========== READ PARAMS FROM URL ==========
function readParamsFromURL() {
  const urlParams       = new URLSearchParams(window.location.search);
  const rawCat          = urlParams.get('category');
  const rawT            = urlParams.get('type') || 'regular';
  const exportNameParam = urlParams.get('export');

  console.log('📖 Reading params:', { rawCat, rawT, exportNameParam });

  if (!rawCat) {
    showErrorOnScreen('No category selected. Redirecting...');
    setTimeout(() => window.location.href = '/app/dashboard.html', 3000);
    throw new Error('Missing category');
  }

  category     = rawCat;
  questionType = rawT;

  const displayName = formatCategoryName(category);
  if (gameCategory) gameCategory.textContent = displayName;
  if (gameType)     gameType.textContent     = questionType === 'regular' ? 'Regular' : 'Tournament';

  if (exportNameParam) {
    loadQuestionsFromJS(exportNameParam);
  } else {
    showErrorOnScreen('Missing question bank. Redirecting...');
    setTimeout(() => window.location.href = '/app/dashboard.html', 3000);
    throw new Error('Missing export parameter');
  }
}

// ========== LOAD QUESTIONS FROM JS BANK ==========
async function loadQuestionsFromJS(exportNameParam) {
  console.log('📚 Loading questions for export:', exportNameParam);

  try {
    const exportMap = {
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

    const mapping = exportMap[exportNameParam];
    if (!mapping) {
      throw new Error(`Question bank '${exportNameParam}' not found.`);
    }

    let questionBank = null;
    let lastError    = null;
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

    // Fetch + blob URL fallback
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
      const errorMsg = `Failed to load question bank. Tried paths: ${attemptedPaths.join(', ')}. Last error: ${lastError?.message || 'Unknown'}`;
      console.error(errorMsg);
      showErrorOnScreen(errorMsg);
      showToast('Question bank loading failed. Please refresh or contact support.', 'error', 20000);
      setTimeout(() => window.location.href = '/app/dashboard.html', 5000);
      return;
    }

    console.log('📚 Questions loaded:', questionBank?.length || 0, 'questions');

    if (!Array.isArray(questionBank) || questionBank.length === 0) {
      throw new Error('Question bank is empty or invalid.');
    }

    const shuffled = fisherYatesShuffle([...questionBank]);
    const selected = shuffled.slice(0, Math.min(TOTAL_QUESTIONS, shuffled.length));

    console.log('✅ Selected', selected.length, 'questions for game');

    if (selected.length < TOTAL_QUESTIONS) {
      showToast(`Only ${selected.length} questions available. Starting game.`, 'warning', 6000);
    }

    currentQuestions = selected;

    if (currentQuestions.length > 0 && gameDifficulty) {
      const firstQ = currentQuestions[0];
      const raw = firstQ.difficulty || 'Easy';
      gameDifficulty.textContent = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    }

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
  nextBtn.disabled  = true;

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

  if (gameDifficulty) {
    const raw = q.difficulty || 'Easy';
    gameDifficulty.textContent = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
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

  if (crowdPanel) crowdPanel.classList.remove('show');
  updateLifelineUI();
  startTimer();
}

// ========== TIMER ==========
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = MAX_SCORE_PER_QUESTION;
  if (timerSeconds) timerSeconds.textContent = timeLeft;

  const circumference = 2 * Math.PI * 18;
  if (timerPath) {
    timerPath.style.strokeDasharray  = circumference;
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
      // Time expired — lock everything, reveal correct answer, score = 0 for this question
      clearInterval(timerInterval);
      questionAnswered  = true;
      lifelinesDisabled = true;
      updateLifelineUI();
      nextBtn.disabled  = false;

      ['A', 'B', 'C', 'D'].forEach(letter => {
        const btn = optionBtns[letter];
        if (btn) {
          btn.disabled = true;
          btn.classList.add('disabled');
        }
      });

      // Reveal correct answer in green
      const correctAns = currentQuestions[currentQuestionIndex]?.correctAnswer;
      if (correctAns && optionBtns[correctAns]) {
        applyCorrectStyle(optionBtns[correctAns]);
      }

      // No points added — timeLeft is 0 so pointsEarned would be 0
      // Streak: treat timeout as a wrong answer
      handleStreakUpdate(false);
    }
  }, 1000);
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

// ========== STREAK LOGIC (extracted for reuse) ==========
// Call this after every answer (isCorrect = true/false).
// Returns the comment string if one should be shown, otherwise null.
function handleStreakUpdate(isCorrect) {
  let commentText = null;

  if (isCorrect) {
    if (streakDirection === 'loss') {
      // Was on a losing streak — check how bad it was before resetting
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
      // null / first question
      currentStreak   = 1;
      streakDirection = 'win';
    }
  } else {
    // Wrong or timeout
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
      // null / first question
      currentStreak   = -1;
      streakDirection = 'loss';
    }
  }

  return commentText;
}

// ========== ANSWER SELECTION ==========
// IMPORTANT: This module uses a top-level `await import('./fun-facts.js')` near
// the top of the file. Because of that top-level await, this module's body does
// not finish executing until that import resolves — by which point the browser
// has frequently ALREADY fired `DOMContentLoaded` (module scripts are deferred,
// and DOMContentLoaded can fire before a slow/async module finishes running).
// The old code attached this listener inside a `DOMContentLoaded` handler, so on
// many loads the listener was registered AFTER the event already fired and it
// never ran — which is why clicking an option appeared to do nothing at all,
// and every downstream feature (scoring, streaks, comments, Firestore save)
// silently never triggered. Fix: attach directly. By the time this module's
// synchronous code runs (after any top-level awaits), the DOM (parsed via
// normal HTML parsing, before deferred module scripts execute) is already
// available, so querying it directly here is always safe.
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

    // ── 1. Stop the timer at the EXACT moment of selection ──
    clearInterval(timerInterval);
    const pointsEarned = Math.max(0, timeLeft); // time remaining at click = score

    // ── 2. Lock ALL option buttons instantly so no second click can register ──
    ['A', 'B', 'C', 'D'].forEach(letter => {
      const b = optionBtns[letter];
      if (b) {
        b.disabled = true;
        b.classList.add('disabled');
      }
    });

    // ── 3. Validate selected letter against currentQ.correctAnswer ──
    const selectedLetter = btn.dataset.option;
    const currentQ = currentQuestions[currentQuestionIndex];
    if (!currentQ) {
      console.error('❌ No current question found at index', currentQuestionIndex);
      return;
    }

    const correctLetter = currentQ.correctAnswer;
    const isCorrect      = (selectedLetter === correctLetter);

    // ── 4. Apply full background highlight: green if correct, red if wrong,
    //        and ALWAYS reveal the true correct option in green ──
    if (isCorrect) {
      applyCorrectStyle(btn);
    } else {
      applyWrongStyle(btn);
      if (optionBtns[correctLetter]) {
        applyCorrectStyle(optionBtns[correctLetter]);
      }
    }

    // ── 5. Save progress: accumulate correct count + running score ──
    if (isCorrect) {
      roundScore   += pointsEarned;
      correctCount += 1;
      console.log(`✅ Correct! +${pointsEarned} pts (time left at click) → round total: ${roundScore}/${TOTAL_QUESTIONS * MAX_SCORE_PER_QUESTION}`);
    } else {
      console.log(`❌ Wrong. Correct was: ${correctLetter}. +0 pts → round total: ${roundScore}`);
    }

    // ── 6. Mark answered, disable lifelines for this question, enable Next ──
    questionAnswered  = true;
    lifelinesDisabled = true;
    updateLifelineUI();
    nextBtn.disabled  = false;

    // ── 7. Evaluate streak rules and show the matching comment modal ──
    const commentText = handleStreakUpdate(isCorrect);
    if (commentText) {
      showCommentModal(commentText);
    }
  });

  console.log('✅ Option click listener attached to .options-grid');
}

// Attach immediately — do NOT wait for DOMContentLoaded (see comment above).
attachOptionListener();

// ========== NEXT BUTTON ==========
nextBtn.addEventListener('click', () => {
  if (nextBtn.disabled) return;
  if (questionAnswered) {
    nextQuestion();
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

// ========== LIFELINES ==========
lifelineFifty?.addEventListener('click', async () => {
  if (lifelineFifty.classList.contains('disabled')) return;
  if (questionAnswered) return;

  const currentQ = currentQuestions[currentQuestionIndex];
  if (!currentQ) return;

  const correct      = currentQ.correctAnswer;
  const wrongOptions = ['A', 'B', 'C', 'D'].filter(l => l !== correct);
  const toHide       = fisherYatesShuffle(wrongOptions).slice(0, 2);

  toHide.forEach(letter => {
    const btn = optionBtns[letter];
    if (btn) btn.style.visibility = 'hidden';
  });

  lifelineCounts.fifty_fifty--;
  if (countFiftyFifty) countFiftyFifty.textContent = lifelineCounts.fifty_fifty;
  if (lifelineCounts.fifty_fifty <= 0) lifelineFifty.classList.add('disabled');

  if (questionType !== 'regular') {
    try {
      const userRef = doc(db, 'users', currentUserUID);
      await updateDoc(userRef, { 'lifeline.fifty_fifty': increment(-1) });
    } catch (err) {
      console.error('Failed to update lifeline:', err);
      showToast('Could not save lifeline usage.', 'error', 20000);
    }
  }
});

lifelineAsk?.addEventListener('click', async () => {
  if (lifelineAsk.classList.contains('disabled')) return;
  if (questionAnswered) return;

  const currentQ = currentQuestions[currentQuestionIndex];
  if (!currentQ) return;

  const correct     = currentQ.correctAnswer;
  const correctPct  = Math.floor(Math.random() * 26) + 45; // 45–70%
  let remaining     = 100 - correctPct;
  const others      = ['A', 'B', 'C', 'D'].filter(l => l !== correct);
  const dist        = [];

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

  if (crowdPanel) crowdPanel.classList.add('show');
  if (crowdBarA)     crowdBarA.style.width     = (result.A || 0) + '%';
  if (crowdBarB)     crowdBarB.style.width     = (result.B || 0) + '%';
  if (crowdBarC)     crowdBarC.style.width     = (result.C || 0) + '%';
  if (crowdBarD)     crowdBarD.style.width     = (result.D || 0) + '%';
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
      showToast('Could not save lifeline usage.', 'error', 20000);
    }
  }
});

lifelineSkip?.addEventListener('click', async () => {
  if (lifelineSkip.classList.contains('disabled')) return;
  if (questionAnswered) return;

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
      showToast('Could not save lifeline usage.', 'error', 20000);
    }
  }

  // Skip counts as neither correct nor wrong — don't trigger streak
  questionAnswered  = true;
  lifelinesDisabled = true;
  updateLifelineUI();
  nextQuestion();
});

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

  if (funFactPending) {
    funFactPending = false;
    clearInterval(funFactTimer);
    setTimeout(() => {
      showFunFactModal('', false);
      startFunFactTimer();
    }, 2000);
  }

  showLoader('Calculating your score... Please wait.');

  // Read previous best before saving
  let previousBest = 0;
  try {
    const userRef  = doc(db, 'users', currentUserUID);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data    = userSnap.data();
      const catStats = data.categoryStats || {};
      previousBest  = catStats[category]?.bestScore || 0;
    }
  } catch (err) {
    console.warn('Could not read previous best:', err);
  }

  // Save round to Firestore
  try {
    // 1. Save round record
    const pointRef = collection(db, 'regular_points');
    await addDoc(pointRef, {
      uid:            currentUserUID,
      gameType:       questionType,
      category:       category,
      point:          roundScore,
      correctAnswers: correctCount,
      totalQuestions: TOTAL_QUESTIONS,
      time:           serverTimestamp()
    });

    // 2. Update user lifetime stats
    const userRef = doc(db, 'users', currentUserUID);
    await updateDoc(userRef, {
      lifetimeRoundPlayed:  increment(1),
      totalScore:           increment(roundScore),
      totalCorrectAnswers:  increment(correctCount)
    });

    // 3. Update category stats — compute new best correctly
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
        [`categoryStats.${catKey}.bestScore`]: newBest   // set the actual value, not increment
      });

      if (roundScore > previousBest) {
        isNewBest = true;
      }
    }

    console.log(`✅ Round saved. Score: ${roundScore}, Correct: ${correctCount}/${TOTAL_QUESTIONS}, New best: ${isNewBest}`);

  } catch (err) {
    console.error('Error saving round data:', err);
    showToast('Some data could not be saved, but your round is complete.', 'warning', 6000);
  }

  hideLoader();
  showRoundEndModal(isNewBest);
}

// ========== COMMENT MODAL ==========
// Displays a streak comment mid-round. Does NOT block the Next button —
// user dismisses it themselves and can proceed independently.
function showCommentModal(comment) {
  // If one is already open, remove it first
  const existing = document.getElementById('commentModal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'commentModal';
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.7); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    z-index:8888; padding:1rem;
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    background:rgba(20,25,40,0.95);
    border:1px solid rgba(62,214,183,0.3);
    border-radius:1.5rem; padding:2rem;
    max-width:420px; width:100%;
    text-align:center; font-family:'Poppins',sans-serif;
  `;

  const textP = document.createElement('p');
  textP.style.cssText = `
    font-size:1.3rem; font-weight:600; color:#f0f3fa;
    line-height:1.6; margin-bottom:1.5rem;
  `;
  textP.textContent = comment;
  card.appendChild(textP);

  const btn = document.createElement('button');
  btn.textContent = 'Got it! 👊';
  btn.style.cssText = `
    background:linear-gradient(135deg,#3ED6B7,#259c84);
    border:none; padding:0.65rem 2rem; border-radius:40px;
    font-weight:700; font-size:0.95rem; color:#0a0f1e;
    cursor:pointer; font-family:'Poppins',sans-serif;
  `;
  btn.addEventListener('click', () => overlay.remove());
  card.appendChild(btn);

  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

// ========== FIREWORKS ==========
function showFireworks() {
  const canvas = document.createElement('canvas');
  canvas.id = 'fireworksCanvas';
  canvas.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    pointer-events:none; z-index:9998;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w = canvas.width  = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  class Particle {
    constructor(x, y, color) {
      this.x = x; this.y = y; this.color = color;
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 8 + 2;
      this.vx    = Math.cos(angle) * speed;
      this.vy    = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = 0.015 + Math.random() * 0.02;
      this.size  = 4 + Math.random() * 6;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vx *= 0.98;   this.vy *= 0.98;
      this.alpha -= this.decay;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let particles = [];
  const colors  = ['#FFD700','#3ED6B7','#FFFFFF','#FF6B6B','#FFA94D','#A29BFE','#FFEAA7'];

  for (let e = 0; e < 6; e++) {
    const cx    = Math.random() * w * 0.6 + w * 0.2;
    const cy    = Math.random() * h * 0.5 + h * 0.1;
    const count = 80 + Math.floor(Math.random() * 60);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(cx, cy, colors[Math.floor(Math.random() * colors.length)]));
    }
  }

  let frameId   = null;
  const startTime = performance.now();
  const duration  = 3000;

  function animate(timestamp) {
    if (timestamp - startTime > duration) {
      if (frameId) cancelAnimationFrame(frameId);
      canvas.remove();
      return;
    }
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(ctx); });
    particles = particles.filter(p => p.alpha > 0);
    if (particles.length === 0) { canvas.remove(); return; }
    frameId = requestAnimationFrame(animate);
  }

  frameId = requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
}

// ========== ROUND END MODAL ==========
function showRoundEndModal(newBest = false) {
  const overlay = document.createElement('div');
  overlay.id = 'roundEndModal';
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.85); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    z-index:9999; padding:1rem;
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    background:rgba(20,25,40,0.95); backdrop-filter:blur(12px);
    border:1px solid rgba(62,214,183,0.3); border-radius:2rem;
    padding:2rem 1.5rem; max-width:500px; width:100%;
    position:relative; text-align:center; color:#f0f3fa;
    font-family:'Poppins',sans-serif;
  `;

  // Close → back to dashboard
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position:absolute; top:0.8rem; right:1.2rem;
    background:none; border:none; font-size:2rem;
    color:#a0b3d9; cursor:pointer; font-family:'Poppins',sans-serif;
  `;
  closeBtn.addEventListener('click', () => {
    window.location.href = '/app/dashboard.html#play';
  });
  card.appendChild(closeBtn);

  // Logo
  const logo = document.createElement('div');
  logo.style.cssText = `font-family:'Orbitron',monospace;font-weight:800;font-size:1.8rem;margin-bottom:0.5rem;`;
  logo.innerHTML = `<span style="color:#ffffff;">Naija</span><span style="color:#3ED6B7;">Genius</span>`;
  card.appendChild(logo);

  // New best badge
  if (newBest) {
    const badge = document.createElement('div');
    badge.textContent = '🏆 New Best Score!';
    badge.style.cssText = `
      font-family:'Orbitron',monospace; font-size:1.4rem; font-weight:700; color:#FFD700;
      background:rgba(255,215,0,0.12); border:1px solid rgba(255,215,0,0.3);
      border-radius:40px; padding:0.4rem 1.2rem; display:inline-block;
      margin-bottom:0.8rem; box-shadow:0 0 30px rgba(255,215,0,0.15);
    `;
    card.appendChild(badge);
  }

  // Title
  const title = document.createElement('h2');
  title.textContent = 'Round Complete!';
  title.style.cssText = `font-size:1.8rem;color:#FFD700;margin:0.5rem 0 0.8rem;`;
  card.appendChild(title);

  // Score display — score / max possible
  const maxPossible = TOTAL_QUESTIONS * MAX_SCORE_PER_QUESTION; // 150
  const scoreDiv    = document.createElement('div');
  scoreDiv.style.cssText = `
    font-family:'Orbitron',monospace; font-size:3rem; font-weight:800;
    color:#3ED6B7; margin:0.5rem 0;
  `;
  scoreDiv.textContent = `${roundScore} / ${maxPossible}`;
  card.appendChild(scoreDiv);

  // Correct answers sub-line
  const correctDiv = document.createElement('div');
  correctDiv.style.cssText = `
    font-size:0.95rem; color:#a0b3d9; margin-bottom:0.5rem;
  `;
  correctDiv.textContent = `${correctCount} of ${TOTAL_QUESTIONS} correct`;
  card.appendChild(correctDiv);

  // Comment from getEndOfRoundComment
  const endComment = getEndOfRoundComment(roundScore);
  const msgP       = document.createElement('p');
  msgP.textContent = endComment;
  msgP.style.cssText = `font-size:1.1rem;color:#f0f3fa;margin:0.8rem 0 1.5rem;font-weight:500;`;
  card.appendChild(msgP);

  // Buttons
  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = `display:flex;gap:0.8rem;justify-content:center;flex-wrap:wrap;`;

  const playAgainBtn = document.createElement('button');
  playAgainBtn.textContent = 'Play Again';
  playAgainBtn.style.cssText = `
    background:linear-gradient(135deg,#3ED6B7,#259c84);
    border:none; padding:0.7rem 1.8rem; border-radius:40px;
    font-weight:700; font-size:0.95rem; color:#0a0f1e;
    cursor:pointer; font-family:'Poppins',sans-serif;
    flex:1; min-width:140px;
  `;
  playAgainBtn.addEventListener('click', () => {
    overlay.remove();
    // Reset all round state
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

    const urlParams       = new URLSearchParams(window.location.search);
    const exportNameParam = urlParams.get('export');
    if (exportNameParam) {
      loadLifelines().then(() => loadQuestionsFromJS(exportNameParam));
    } else {
      window.location.href = '/app/dashboard.html';
    }
  });
  btnContainer.appendChild(playAgainBtn);

  const dashBtn = document.createElement('button');
  dashBtn.textContent = 'Back to Dashboard';
  dashBtn.style.cssText = `
    background:transparent; border:1.5px solid #3ED6B7;
    padding:0.7rem 1.8rem; border-radius:40px;
    font-weight:700; font-size:0.95rem; color:#3ED6B7;
    cursor:pointer; font-family:'Poppins',sans-serif;
    flex:1; min-width:140px;
  `;
  dashBtn.addEventListener('click', () => {
    window.location.href = '/app/dashboard.html';
  });
  btnContainer.appendChild(dashBtn);

  card.appendChild(btnContainer);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  if (newBest) {
    setTimeout(() => showFireworks(), 300);
  }
}
