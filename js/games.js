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

const MAX_SCORE_PER_QUESTION = 15;
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
const countCallFriend = $('countCallFriend');
const lifelineFifty   = $('lifelineFiftyFifty');
const lifelineAsk     = $('lifelineAskCrowd');
const lifelineCallFriend = $('lifelineCallFriend');
const nextBtn         = $('nextBtn');

// ========== DEDICATED ERROR DISPLAY ==========
function showErrorOnScreen(message) {
  // ... unchanged ...
}

// ========== TOAST ==========
function showToast(message, type = 'success', duration = 4000) {
  // ... unchanged ...
}

// ========== GLOBAL ERROR HANDLING ==========
window.onerror = function (message, source, lineno, colno, error) {
  // ... unchanged ...
};
window.addEventListener('unhandledrejection', function (event) {
  // ... unchanged ...
});

// ========== FORMAT CATEGORY NAME ==========
function formatCategoryName(raw) {
  // ... unchanged ...
}

// ========== FISHER-YATES SHUFFLE ==========
function fisherYatesShuffle(array) {
  // ... unchanged ...
}

// ========== REUSABLE IMPORT HELPER ==========
async function importQuestionBank(mapping) {
  // ... unchanged ...
}

// ========== AUTH ==========
onAuthStateChanged(auth, async (user) => {
  // ... unchanged except reading livesRemaining ...
  if (!user) { /* ... */ }
  currentUserUID = user.uid;
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) { /* ... */ }
    currentUserData = userSnap.data();
    livesRemaining = currentUserData.lives ?? 2;
    // ... rest unchanged
  } catch (err) { /* ... */ }
});

// ========== LOAD LIFELINES ==========
async function loadLifelines() {
  // ... unchanged ...
}

// ========== UPDATE LIFELINE UI ==========
function updateLifelineUI() {
  // ... unchanged ...
}

// ========== READ PARAMS FROM URL ==========
function readParamsFromURL() {
  // ... unchanged ...
}

// ========== LOAD QUESTIONS FROM JS BANK ==========
async function loadQuestionsFromJS(exportNameParam) {
  // ... unchanged but roundCoins = 0 added ...
  roundCoins = 0;
  // ...
}

// ========== LOAD MIXED QUESTIONS ==========
async function loadMixedQuestions() {
  // ... unchanged but roundCoins = 0 added ...
  roundCoins = 0;
  // ...
}

// ========== COUNTDOWN OVERLAY ==========
function showCountdown(callback) {
  // ... unchanged ...
}

// ========== LOAD QUESTION ==========
function loadQuestion(index) {
  // ... unchanged ...
}

// ========== TIMER ==========
function startTimer() {
  // ... unchanged (calls handleWrongAnswer on timeout) ...
}

// ========== APPLY ANSWER HIGHLIGHT STYLES ==========
function applyCorrectStyle(btn) {
  // ... unchanged ...
}
function applyWrongStyle(btn) {
  // ... unchanged ...
}

// ========== STREAK LOGIC ==========
function handleStreakUpdate(isCorrect) {
  // ... unchanged ...
}

// ========== REPLAY MODAL ==========
function showReplayModal(onYes, onNo) {
  // ... unchanged ...
}

// ========== HANDLE WRONG ANSWER (replay or continue) ==========
function handleWrongAnswer() {
  // Only show replay modal if lives > 0
  if (livesRemaining > 0) {
    showReplayModal(
      // Yes callback: replay the question
      async () => {
        // Decrement lives in Firestore
        try {
          const userRef = doc(db, 'users', currentUserUID);
          await updateDoc(userRef, {
            lives: increment(-1)
          });
          // Update local lives count
          livesRemaining = Math.max(0, livesRemaining - 1);
          // Reload the current question with fresh state
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
          console.log('🔄 Replaying question with fresh timer.');
        } catch (err) {
          console.error('Failed to decrement lives:', err);
          showToast('Failed to use life. Please try again.', 'error');
          // Continue as if no replay.
          proceedAfterWrong();
        }
      },
      // No callback: continue to next question
      () => {
        proceedAfterWrong();
      }
    );
  } else {
    // No lives – proceed directly
    proceedAfterWrong();
  }
}

function proceedAfterWrong() {
  // Record wrong answer, enable Next, etc.
  questionAnswered = true;
  lifelinesDisabled = true;
  updateLifelineUI();
  nextBtn.disabled = false;
}

// ========== ANSWER SELECTION ==========
function attachOptionListener() {
  // ... unchanged except wrong branch now calls handleWrongAnswer() ...
  // In the wrong branch:
  // handleStreakUpdate(false); // already called
  // showReplayModal(...) replaced by handleWrongAnswer()
  // We'll adjust: after streak update, call handleWrongAnswer() which will decide replay.
  // We need to remove the direct replay modal call from click handler.
  // In the click handler, we call handleWrongAnswer() after streak update.
}

// We'll need to modify the click handler accordingly. I'll include the full attachOptionListener with the change.
// I'll rewrite attachOptionListener completely to avoid duplication.