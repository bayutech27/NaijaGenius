// ========== IMPORTS ==========
import { auth, db } from '/js/firebase.config.js';
import {
    doc, getDoc, setDoc, updateDoc, addDoc, collection,
    query, where, getDocs, serverTimestamp, increment,
    deleteDoc
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js';
import {
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js';

// ========== MODULE STATE ==========
let currentUserUID = null;
let category = null;                 // e.g. "afrobeats" or "naija_pikin"
let questionType = 'regular';        // 'regular' or 'tournament'
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

// ========== LOAD LIFELINES ==========
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
    lifelineFifty.classList.toggle('disabled', lifelineCounts.fifty_fifty <= 0);
    lifelineAsk.classList.toggle('disabled', lifelineCounts.ask_crowd <= 0);
    lifelineSkip.classList.toggle('disabled', lifelineCounts.skip <= 0);
}

// ========== READ PARAMETERS FROM URL ==========
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

    // Update UI
    const displayName = formatCategoryName(category);
    if (gameCategory) gameCategory.textContent = displayName;
    if (gameType) gameType.textContent = questionType === 'regular' ? 'Regular' : 'Tournament';

    // Load questions
    loadRandomQuestions();
}

// ========== LOAD RANDOM QUESTIONS ==========
async function loadRandomQuestions() {
    const collectionName = questionType === 'regular' ? 'questions_regular' : 'questions_tournament';
    try {
        const q = query(collection(db, collectionName), where('category', '==', category));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            showToast('No questions found for this category.', 'error');
            setTimeout(() => window.location.href = '/app/dashboard.html', 2000);
            return;
        }

        // Convert to array of question objects
        const allQuestions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Shuffle and pick 10
        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, TOTAL_QUESTIONS);

        if (selected.length < TOTAL_QUESTIONS) {
            showToast(`Only ${selected.length} questions available. Starting game.`, 'warning');
        }

        currentQuestions = selected;
        currentQuestionIndex = 0;
        roundScore = 0;

        // Start the game
        loadQuestion(0);
    } catch (err) {
        console.error('Error loading questions:', err);
        showToast('Failed to load questions. Please try again.', 'error');
        setTimeout(() => window.location.href = '/app/dashboard.html', 2000);
    }
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

    // Reset option buttons
    ['A', 'B', 'C', 'D'].forEach(letter => {
        const btn = optionBtns[letter];
        if (btn) {
            btn.classList.remove('correct', 'wrong', 'disabled');
            btn.style.visibility = 'visible';
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
            ['A', 'B', 'C', 'D'].forEach(letter => {
                const btn = optionBtns[letter];
                if (btn) {
                    btn.disabled = true;
                    btn.classList.add('disabled');
                }
            });
            const correctAns = currentQuestions[currentQuestionIndex]?.correctAnswer;
            if (correctAns && optionBtns[correctAns]) {
                optionBtns[correctAns].classList.add('correct');
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
            clearInterval(timerInterval);
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
            if (selectedLetter === correct) {
                btn.classList.add('correct');
                roundScore += pointsEarned;
            } else {
                btn.classList.add('wrong');
                if (optionBtns[correct]) {
                    optionBtns[correct].classList.add('correct');
                }
            }
            setTimeout(() => nextQuestion(), 1500);
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
    try {
        const userRef = doc(db, 'users', currentUserUID);
        await updateDoc(userRef, { 'lifeline.fifty_fifty': increment(-1) });
    } catch (err) {
        console.error('Failed to update lifeline:', err);
        showToast('Could not save lifeline usage.', 'error');
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
    try {
        const userRef = doc(db, 'users', currentUserUID);
        await updateDoc(userRef, { 'lifeline.ask_crowd': increment(-1) });
    } catch (err) {
        console.error('Failed to update lifeline:', err);
        showToast('Could not save lifeline usage.', 'error');
    }
});

lifelineSkip?.addEventListener('click', async () => {
    if (lifelineSkip.classList.contains('disabled')) return;
    clearInterval(timerInterval);
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
    setTimeout(() => nextQuestion(), 500);
});

// ========== END ROUND ==========
async function endRound() {
    clearInterval(timerInterval);
    if (typeof endRound.called !== 'undefined') return;
    endRound.called = true;

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
            await updateDoc(userRef, {
                [`categoryStats.${catKey}.played`]: increment(1),
                [`categoryStats.${catKey}.bestScore`]: newBest
            });
        }
    } catch (err) {
        console.error('Error saving round data:', err);
        showToast('Some data could not be saved, but your round is complete.', 'warning');
    }

    showRoundEndModal();
}

// ========== ROUND END MODAL ==========
function showRoundEndModal() {
    const overlay = document.createElement('div');
    overlay.id = 'roundEndModal';
    overlay.style.cssText = `
        position: fixed; top:0; left:0; width:100%; height:100%;
        background: rgba(0,0,0,0.85);
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
    closeBtn.addEventListener('click', () => overlay.remove());
    card.appendChild(closeBtn);

    const logo = document.createElement('div');
    logo.style.cssText = `
        font-family: 'Orbitron', monospace;
        font-weight: 800;
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
    `;
    logo.innerHTML = `<span style="color:#ffffff;">Naija</span><span style="color:#3ED6B7;">Genius</span>`;
    card.appendChild(logo);

    const title = document.createElement('h2');
    title.textContent = `Round Complete!`;
    title.style.cssText = `
        font-family: 'Exo 2', sans-serif;
        font-size: 1.8rem;
        color: #FFD700;
        margin: 0.5rem 0 0.8rem;
    `;
    card.appendChild(title);

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

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = `
        display: flex;
        gap: 0.8rem;
        justify-content: center;
        flex-wrap: wrap;
    `;
    const playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = 'Play Again';
    playAgainBtn.style.cssText = `
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
    playAgainBtn.addEventListener('mouseenter', () => playAgainBtn.style.transform = 'scale(1.02)');
    playAgainBtn.addEventListener('mouseleave', () => playAgainBtn.style.transform = 'scale(1)');
    playAgainBtn.addEventListener('click', () => {
        overlay.remove();
        endRound.called = false;
        // Reset and load new random questions
        loadRandomQuestions();
    });
    btnContainer.appendChild(playAgainBtn);

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
    dashBtn.addEventListener('mouseenter', () => dashBtn.style.background = 'rgba(62,214,183,0.1)');
    dashBtn.addEventListener('mouseleave', () => dashBtn.style.background = 'transparent');
    dashBtn.addEventListener('click', () => {
        window.location.href = '/app/dashboard.html';
    });
    btnContainer.appendChild(dashBtn);
    card.appendChild(btnContainer);

    overlay.appendChild(card);
    document.body.appendChild(overlay);
}