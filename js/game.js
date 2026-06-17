// ========== IMPORTS ==========
import { auth, db } from './firebase.config.js';
import {
    doc, getDoc, setDoc, updateDoc, addDoc, collection,
    query, where, getDocs, serverTimestamp, arrayUnion,
    increment, deleteDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

// ========== MODULE STATE ==========
let currentUser = null;
let currentUserUID = null;
let category = null;                 // raw, e.g. "afrobeats"
let categoryDisplay = '';
let gameQuestions = null;            // full document data (includes all rounds)
let currentRound = 0;               // 1-20
let currentQuestions = [];          // array of 10 question objects for this round
let currentQuestionIndex = 0;
let roundScore = 0;
let timerInterval = null;
let timeLeft = 12;
let lifelineCounts = { fifty_fifty: 0, ask_crowd: 0, skip: 0 };
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
const optionBtns = {
    A: $('optionA'),
    B: $('optionB'),
    C: $('optionC'),
    D: $('optionD')
};
const optionTexts = {
    A: $('optionAText'),
    B: $('optionBText'),
    C: $('optionCText'),
    D: $('optionDText')
};
const countFiftyFifty = $('countFiftyFifty');
const countAskCrowd = $('countAskCrowd');
const countSkip = $('countSkip');
const lifelineFifty = $('lifelineFiftyFifty');
const lifelineAsk = $('lifelineAskCrowd');
const lifelineSkip = $('lifelineSkip');
const crowdPanel = $('crowdPanel');
const crowdBarA = $('crowdBarA');
const crowdBarB = $('crowdBarB');
const crowdBarC = $('crowdBarC');
const crowdBarD = $('crowdBarD');
const crowdPercentA = $('crowdPercentA');
const crowdPercentB = $('crowdPercentB');
const crowdPercentC = $('crowdPercentC');
const crowdPercentD = $('crowdPercentD');

// ========== TOAST ==========
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        // fallback: create container if missing
        const c = document.createElement('div');
        c.id = 'toastContainer';
        c.className = 'toast-container';
        document.body.appendChild(c);
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
        'nigeria_geography': 'Naija Geography'
    };
    return map[raw] || raw.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ========== AUTH VALIDATION ==========
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = '/login.html';
        return;
    }
    currentUser = user;
    currentUserUID = user.uid;
    try {
        await loadLifelines();
        await readCategoryFromURL();
    } catch (err) {
        console.error('Init error:', err);
        showToast('Failed to start game. Please try again.', 'error');
        setTimeout(() => window.location.href = '/app/dashboard.html', 2000);
    }
});

// ========== STEP 1: LOAD LIFELINES ==========
async function loadLifelines() {
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
    // Disable if zero
    lifelineFifty.classList.toggle('disabled', lifelineCounts.fifty_fifty <= 0);
    lifelineAsk.classList.toggle('disabled', lifelineCounts.ask_crowd <= 0);
    lifelineSkip.classList.toggle('disabled', lifelineCounts.skip <= 0);
}

// ========== STEP 2: READ CATEGORY FROM URL ==========
function readCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('category');
    if (!raw) {
        showToast('No category selected. Redirecting...', 'error');
        setTimeout(() => window.location.href = '/app/dashboard.html', 1500);
        throw new Error('Missing category');
    }
    category = raw;
    categoryDisplay = formatCategoryName(raw);
    if (gameCategory) gameCategory.textContent = categoryDisplay;
    if (gameType) gameType.textContent = 'Regular';
    // Continue to load questions
    return loadQuestionsForCategory();
}

// ========== STEP 3: FETCH QUESTIONS ==========
async function loadQuestionsForCategory() {
    try {
        const q = query(collection(db, 'regular_questions'), where('category', '==', category));
        const snap = await getDocs(q);
        if (snap.empty) {
            showToast('Questions not available yet for this category.', 'error');
            setTimeout(() => window.location.href = '/app/dashboard.html', 2000);
            return;
        }
        // Assuming only one document per category
        const docSnap = snap.docs[0];
        gameQuestions = docSnap.data();
        // Validate structure: has questions.round1 etc.
        if (!gameQuestions.questions || typeof gameQuestions.questions !== 'object') {
            showToast('Invalid question format.', 'error');
            setTimeout(() => window.location.href = '/app/dashboard.html', 2000);
            return;
        }
        // Proceed to round tracking
        await initializeRoundTracking();
    } catch (err) {
        console.error('Error loading questions:', err);
        showToast('Failed to load questions. Please try again.', 'error');
        setTimeout(() => window.location.href = '/app/dashboard.html', 2000);
    }
}

// ========== STEP 4: ROUND TRACKING & CACHING ==========
async function initializeRoundTracking() {
    const progressRef = doc(db, 'regular_progress', currentUserUID);
    try {
        const snap = await getDoc(progressRef);
        let completedRounds = [];
        if (!snap.exists()) {
            // Create document with empty array for this category
            await setDoc(progressRef, {
                [category + '_completed_rounds']: []
            }, { merge: true });
        } else {
            completedRounds = snap.data()[category + '_completed_rounds'] || [];
        }

        // Find the lowest round not in completedRounds
        let nextRound = 1;
        const allRounds = new Set(completedRounds);
        while (nextRound <= 20 && allRounds.has(nextRound)) {
            nextRound++;
        }
        if (nextRound > 20) {
            // All rounds done: reset the array in Firestore and start from 1
            await updateDoc(progressRef, {
                [category + '_completed_rounds']: []
            });
            nextRound = 1;
        }
        currentRound = nextRound;
        // Load the round's questions from the already fetched gameQuestions
        loadRoundQuestions(currentRound);
    } catch (err) {
        console.error('Error initializing round tracking:', err);
        showToast('Could not track progress. Please try again.', 'error');
        setTimeout(() => window.location.href = '/app/dashboard.html', 2000);
    }
}

function loadRoundQuestions(roundNumber) {
    const roundKey = 'round' + roundNumber;
    const roundData = gameQuestions.questions[roundKey];
    if (!roundData) {
        showToast('Round data missing. Redirecting...', 'error');
        setTimeout(() => window.location.href = '/app/dashboard.html', 1500);
        return;
    }
    // Convert roundData (object with question1..question10) to ordered array
    const qArray = [];
    for (let i = 1; i <= 10; i++) {
        const q = roundData['question' + i];
        if (q) {
            qArray.push({
                id: q.id,
                question: q.question,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
                correctAnswer: q.correctAnswer
            });
        } else {
            // fallback: create dummy to avoid breakage
            qArray.push({
                id: i,
                question: 'Missing question',
                optionA: 'A',
                optionB: 'B',
                optionC: 'C',
                optionD: 'D',
                correctAnswer: 'A'
            });
        }
    }
    currentQuestions = qArray;
    currentQuestionIndex = 0;
    roundScore = 0;
    // Start the game
    loadQuestion(0);
}

// ========== STEP 6: LOAD QUESTION ==========
function loadQuestion(index) {
    if (!currentQuestions || index >= currentQuestions.length) {
        endRound();
        return;
    }
    const q = currentQuestions[index];
    // Update UI
    if (questionNumber) questionNumber.textContent = `Question ${index + 1}`;
    if (questionText) questionText.textContent = q.question;
    if (optionTexts.A) optionTexts.A.textContent = q.optionA;
    if (optionTexts.B) optionTexts.B.textContent = q.optionB;
    if (optionTexts.C) optionTexts.C.textContent = q.optionC;
    if (optionTexts.D) optionTexts.D.textContent = q.optionD;
    // Update progress
    const progress = ((index + 1) / TOTAL_QUESTIONS * 100);
    if (progressBar) progressBar.style.width = progress + '%';
    if (progressLabel) progressLabel.textContent = `Question ${index + 1} of ${TOTAL_QUESTIONS}`;

    // Reset option button states
    ['A', 'B', 'C', 'D'].forEach(letter => {
        const btn = optionBtns[letter];
        if (btn) {
            btn.classList.remove('correct', 'wrong', 'disabled');
            btn.style.visibility = 'visible'; // restore 50:50 hidden
            btn.disabled = false;
        }
    });

    // Hide crowd panel
    if (crowdPanel) crowdPanel.classList.remove('show');

    // Start timer
    startTimer();
}

// ========== STEP 7: TIMER ==========
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = MAX_SCORE_PER_QUESTION;
    if (timerSeconds) timerSeconds.textContent = timeLeft;
    const circumference = 2 * Math.PI * 18; // r=18
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
            // Time's up: disable options, show correct answer
            ['A', 'B', 'C', 'D'].forEach(letter => {
                const btn = optionBtns[letter];
                if (btn) {
                    btn.disabled = true;
                    btn.classList.add('disabled');
                }
            });
            // Highlight correct answer
            const correctAns = currentQuestions[currentQuestionIndex]?.correctAnswer;
            if (correctAns && optionBtns[correctAns]) {
                optionBtns[correctAns].classList.add('correct');
            }
            setTimeout(() => nextQuestion(), 1500);
        }
    }, 1000);
}

// ========== STEP 8: ANSWER SELECTION (delegated) ==========
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
            const selectedLetter = btn.dataset.option; // A, B, C, D
            const currentQ = currentQuestions[currentQuestionIndex];
            if (!currentQ) return;
            const correct = currentQ.correctAnswer;
            const pointsEarned = Math.max(0, timeLeft);
            if (selectedLetter === correct) {
                // Correct
                btn.classList.add('correct');
                roundScore += pointsEarned;
            } else {
                // Wrong
                btn.classList.add('wrong');
                // Highlight correct answer
                if (optionBtns[correct]) {
                    optionBtns[correct].classList.add('correct');
                }
            }
            // Wait then next question
            setTimeout(() => nextQuestion(), 1500);
        });
    }
});

// ========== STEP 9: NEXT QUESTION ==========
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < TOTAL_QUESTIONS) {
        loadQuestion(currentQuestionIndex);
    } else {
        endRound();
    }
}

// ========== STEP 10: LIFELINES ==========
// 50:50
lifelineFifty?.addEventListener('click', async () => {
    if (lifelineFifty.classList.contains('disabled')) return;
    const currentQ = currentQuestions[currentQuestionIndex];
    if (!currentQ) return;
    const correct = currentQ.correctAnswer;
    const wrongOptions = ['A', 'B', 'C', 'D'].filter(letter => letter !== correct);
    // Shuffle and pick two to hide
    const shuffled = wrongOptions.sort(() => Math.random() - 0.5);
    const toHide = shuffled.slice(0, 2);
    toHide.forEach(letter => {
        const btn = optionBtns[letter];
        if (btn) btn.style.visibility = 'hidden';
    });
    // Decrement lifeline
    lifelineCounts.fifty_fifty--;
    if (countFiftyFifty) countFiftyFifty.textContent = lifelineCounts.fifty_fifty;
    if (lifelineCounts.fifty_fifty <= 0) lifelineFifty.classList.add('disabled');
    // Write to Firestore
    try {
        const userRef = doc(db, 'users', currentUserUID);
        await updateDoc(userRef, { 'lifeline.fifty_fifty': increment(-1) });
    } catch (err) {
        console.error('Failed to update lifeline:', err);
        showToast('Could not save lifeline usage.', 'error');
    }
});

// Ask Crowd
lifelineAsk?.addEventListener('click', async () => {
    if (lifelineAsk.classList.contains('disabled')) return;
    const currentQ = currentQuestions[currentQuestionIndex];
    if (!currentQ) return;
    const correct = currentQ.correctAnswer;
    // Generate percentages: correct gets 45-70%, others split remainder
    const correctPct = Math.floor(Math.random() * 26) + 45; // 45-70
    let remaining = 100 - correctPct;
    const others = ['A', 'B', 'C', 'D'].filter(l => l !== correct);
    // Distribute remaining randomly among the three
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
    // Build result map
    const result = {};
    result[correct] = correctPct;
    others.forEach((letter, idx) => {
        result[letter] = dist[idx] || 0;
    });
    // Update UI
    if (crowdPanel) crowdPanel.classList.add('show');
    if (crowdBarA) crowdBarA.style.width = (result.A || 0) + '%';
    if (crowdBarB) crowdBarB.style.width = (result.B || 0) + '%';
    if (crowdBarC) crowdBarC.style.width = (result.C || 0) + '%';
    if (crowdBarD) crowdBarD.style.width = (result.D || 0) + '%';
    if (crowdPercentA) crowdPercentA.textContent = (result.A || 0) + '%';
    if (crowdPercentB) crowdPercentB.textContent = (result.B || 0) + '%';
    if (crowdPercentC) crowdPercentC.textContent = (result.C || 0) + '%';
    if (crowdPercentD) crowdPercentD.textContent = (result.D || 0) + '%';
    // Decrement lifeline
    lifelineCounts.ask_crowd--;
    if (countAskCrowd) countAskCrowd.textContent = lifelineCounts.ask_crowd;
    if (lifelineCounts.ask_crowd <= 0) lifelineAsk.classList.add('disabled');
    try {
        const userRef = doc(db, 'users', currentUserUID);
        await updateDoc(userRef, { 'lifeline.ask_crowd': increment(-1) });
    } catch (err) {
        console.error('Failed to update lifeline:', err);
        showToast('Could not save lifeline usage.', 'error');
    }
});

// Skip
lifelineSkip?.addEventListener('click', async () => {
    if (lifelineSkip.classList.contains('disabled')) return;
    clearInterval(timerInterval);
    // Add 0 points for this question
    // Proceed to next question after a short delay
    lifelineCounts.skip--;
    if (countSkip) countSkip.textContent = lifelineCounts.skip;
    if (lifelineCounts.skip <= 0) lifelineSkip.classList.add('disabled');
    try {
        const userRef = doc(db, 'users', currentUserUID);
        await updateDoc(userRef, { 'lifeline.skip': increment(-1) });
    } catch (err) {
        console.error('Failed to update lifeline:', err);
        showToast('Could not save lifeline usage.', 'error');
    }
    // Wait and go to next question
    setTimeout(() => nextQuestion(), 500);
});

// ========== STEP 11: END ROUND ==========
async function endRound() {
    clearInterval(timerInterval);
    // Prevent multiple calls
    if (typeof endRound.called !== 'undefined') return;
    endRound.called = true;

    // Perform Firestore writes
    try {
        // Write 1: Add round result to regular_points
        const pointRef = collection(db, 'regular_points');
        await addDoc(pointRef, {
            uid: currentUserUID,
            gameType: 'regular',
            category: category,
            round: currentRound,
            point: roundScore,
            time: serverTimestamp()
        });
        // Write 2: Update user totals (lifetimeRoundPlayed, totalScore)
        const userRef = doc(db, 'users', currentUserUID);
        await updateDoc(userRef, {
            lifetimeRoundPlayed: increment(1),
            totalScore: increment(roundScore)
        });
        // Write 3: Update category stats
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            const catStats = data.categoryStats || {};
            const catKey = category;
            if (!catStats[catKey]) catStats[catKey] = { played: 0, bestScore: 0, mastery: 0 };
            const currentBest = catStats[catKey].bestScore || 0;
            const newBest = roundScore > currentBest ? roundScore : currentBest;
            const updateObj = {
                [`categoryStats.${catKey}.played`]: increment(1),
                [`categoryStats.${catKey}.bestScore`]: newBest
            };
            await updateDoc(userRef, updateObj);
        }
        // Write 4: Mark round as completed in regular_progress
        const progressRef = doc(db, 'regular_progress', currentUserUID);
        const field = category + '_completed_rounds';
        await updateDoc(progressRef, {
            [field]: arrayUnion(currentRound)
        });
    } catch (err) {
        console.error('Error saving round data:', err);
        showToast('Some data could not be saved, but your round is complete.', 'warning');
    }

    // Show modal
    showRoundEndModal();
}

// ========== STEP 12: MODAL ==========
function showRoundEndModal() {
    // Create overlay and card
    const overlay = document.createElement('div');
    overlay.id = 'roundEndModal';
    overlay.style.cssText = `
        position: fixed; top:0; left:0; width:100%; height:100%;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999;
        padding: 1rem;
    `;
    const card = document.createElement('div');
    card.style.cssText = `
        background: rgba(20,25,40,0.95);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(62,214,183,0.3);
        border-radius: 2rem;
        padding: 2rem 1.5rem;
        max-width: 500px;
        width: 100%;
        position: relative;
        text-align: center;
        color: #f0f3fa;
        font-family: 'Poppins', sans-serif;
    `;
    // Close button (X)
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute; top: 0.8rem; right: 1.2rem;
        background: none; border: none;
        font-size: 2rem; color: #a0b3d9; cursor: pointer;
        transition: color 0.2s;
        font-family: 'Poppins', sans-serif;
    `;
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = '#FFD700');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = '#a0b3d9');
    closeBtn.addEventListener('click', () => {
        overlay.remove();
    });
    card.appendChild(closeBtn);

    // Logo
    const logo = document.createElement('div');
    logo.style.cssText = `
        font-family: 'Orbitron', monospace;
        font-weight: 800;
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
    `;
    logo.innerHTML = `<span style="color:#ffffff;">Naija</span><span style="color:#3ED6B7;">Genius</span>`;
    card.appendChild(logo);

    // Title
    const title = document.createElement('h2');
    title.textContent = `Round ${currentRound} Complete!`;
    title.style.cssText = `
        font-family: 'Orbitron', monospace;
        font-size: 1.8rem;
        color: #FFD700;
        margin: 0.5rem 0 0.8rem;
    `;
    card.appendChild(title);

    // Score
    const scoreDiv = document.createElement('div');
    scoreDiv.style.cssText = `
        font-family: 'Orbitron', monospace;
        font-size: 3rem;
        font-weight: 800;
        color: #3ED6B7;
        margin: 0.5rem 0;
    `;
    scoreDiv.textContent = roundScore + ' / 120';
    card.appendChild(scoreDiv);

    // Message
    let msg = '';
    if (roundScore >= 100) msg = '🏆 Odogwu! You sabi die!';
    else if (roundScore >= 70) msg = '🔥 Sharp guy! Not bad at all.';
    else if (roundScore >= 40) msg = '😅 You try, but e get as e be.';
    else msg = '😬 E shock you? Go read Naija things.';
    const msgP = document.createElement('p');
    msgP.textContent = msg;
    msgP.style.cssText = `
        font-size: 1.1rem;
        color: #f0f3fa;
        margin: 0.8rem 0 1.5rem;
        font-weight: 500;
    `;
    card.appendChild(msgP);

    // Buttons
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = `
        display: flex;
        gap: 0.8rem;
        justify-content: center;
        flex-wrap: wrap;
    `;
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Play Next Round';
    nextBtn.style.cssText = `
        background: linear-gradient(135deg, #3ED6B7, #259c84);
        border: none;
        padding: 0.7rem 1.8rem;
        border-radius: 40px;
        font-weight: 700;
        font-size: 0.95rem;
        color: #0a0f1e;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        font-family: 'Poppins', sans-serif;
        flex: 1;
        min-width: 140px;
    `;
    nextBtn.addEventListener('mouseenter', () => { nextBtn.style.transform = 'scale(1.02)'; });
    nextBtn.addEventListener('mouseleave', () => { nextBtn.style.transform = 'scale(1)'; });
    nextBtn.addEventListener('click', () => {
        overlay.remove();
        endRound.called = false; // reset flag
        startNextRound();
    });
    btnContainer.appendChild(nextBtn);

    const dashBtn = document.createElement('button');
    dashBtn.textContent = 'Back to Dashboard';
    dashBtn.style.cssText = `
        background: transparent;
        border: 1.5px solid #3ED6B7;
        padding: 0.7rem 1.8rem;
        border-radius: 40px;
        font-weight: 700;
        font-size: 0.95rem;
        color: #3ED6B7;
        cursor: pointer;
        transition: transform 0.2s, background 0.2s;
        font-family: 'Poppins', sans-serif;
        flex: 1;
        min-width: 140px;
    `;
    dashBtn.addEventListener('mouseenter', () => { dashBtn.style.background = 'rgba(62,214,183,0.1)'; });
    dashBtn.addEventListener('mouseleave', () => { dashBtn.style.background = 'transparent'; });
    dashBtn.addEventListener('click', () => {
        window.location.href = '/app/dashboard.html';
    });
    btnContainer.appendChild(dashBtn);
    card.appendChild(btnContainer);

    overlay.appendChild(card);
    document.body.appendChild(overlay);
}

// ========== STEP 13: START NEXT ROUND ==========
async function startNextRound() {
    // Re-read progress to get updated completed rounds
    try {
        const progressRef = doc(db, 'regular_progress', currentUserUID);
        const snap = await getDoc(progressRef);
        let completedRounds = [];
        if (snap.exists()) {
            completedRounds = snap.data()[category + '_completed_rounds'] || [];
        }
        let nextRound = 1;
        const allRounds = new Set(completedRounds);
        while (nextRound <= 20 && allRounds.has(nextRound)) {
            nextRound++;
        }
        if (nextRound > 20) {
            // Reset
            await updateDoc(progressRef, {
                [category + '_completed_rounds']: []
            });
            nextRound = 1;
        }
        currentRound = nextRound;
        // Load questions from cached gameQuestions
        loadRoundQuestions(currentRound);
    } catch (err) {
        console.error('Error starting next round:', err);
        showToast('Could not load next round. Please try again.', 'error');
        setTimeout(() => window.location.href = '/app/dashboard.html', 1500);
    }
}