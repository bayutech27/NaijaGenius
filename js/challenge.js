// challenge.js – Daily Seed-Based Challenges (Model 2)
// Fully front-end; completion stored in localStorage.

// ========== CHALLENGE DEFINITIONS ==========
export const CHALLENGES = [
  // === EASY (15) – reward 10–15 coins or one lifeline ===
  {
    id: 0,
    title: "5 in a Row",
    description: "Answer 5 questions correctly in a row.",
    icon: "fa-fire",
    rewardType: "coins",
    rewardValue: 10,
    difficulty: "easy",
    condition: (stats) => stats.currentStreak >= 5 && stats.streakDirection === 'win'
  },
  {
    id: 1,
    title: "3 in a Row",
    description: "Answer 3 questions correctly in a row.",
    icon: "fa-bolt",
    rewardType: "coins",
    rewardValue: 10,
    difficulty: "easy",
    condition: (stats) => stats.currentStreak >= 3 && stats.streakDirection === 'win'
  },
  {
    id: 2,
    title: "First Blood",
    description: "Get your first correct answer of the round.",
    icon: "fa-bullseye",
    rewardType: "coins",
    rewardValue: 10,
    difficulty: "easy",
    condition: (stats) => stats.correctCount >= 1
  },
  {
    id: 3,
    title: "Quick Learner",
    description: "Answer 2 questions correctly in a row.",
    icon: "fa-graduation-cap",
    rewardType: "coins",
    rewardValue: 10,
    difficulty: "easy",
    condition: (stats) => stats.currentStreak >= 2 && stats.streakDirection === 'win'
  },
  {
    id: 4,
    title: "Steady Hands",
    description: "Complete a round without using any lifelines.",
    icon: "fa-hand-paper",
    rewardType: "coins",
    rewardValue: 15,
    difficulty: "easy",
    condition: (stats) => stats.lifelinesUsed === 0
  },
  {
    id: 5,
    title: "Lucky Guess",
    description: "Get 1 correct answer with less than 3 seconds left.",
    icon: "fa-clock",
    rewardType: "coins",
    rewardValue: 12,
    difficulty: "easy",
    condition: (stats) => stats.lastAnswerTimeLeft < 3
  },
  {
    id: 6,
    title: "Comeback Kid",
    description: "Win a round after being on a losing streak of 2 or more.",
    icon: "fa-undo",
    rewardType: "coins",
    rewardValue: 15,
    difficulty: "easy",
    condition: (stats) => stats.streakDirection === 'win' && stats.previousStreak <= -2
  },
  {
    id: 7,
    title: "Halfway There",
    description: "Answer at least 5 questions correctly in a round.",
    icon: "fa-flag-checkered",
    rewardType: "coins",
    rewardValue: 15,
    difficulty: "easy",
    condition: (stats) => stats.correctCount >= 5
  },
  {
    id: 8,
    title: "Flawless Victory",
    description: "Answer 7 questions correctly without a wrong answer.",
    icon: "fa-shield-alt",
    rewardType: "coins",
    rewardValue: 15,
    difficulty: "easy",
    condition: (stats) => stats.correctCount >= 7 && stats.streakDirection === 'win'
  },
  {
    id: 9,
    title: "Knowledge Seeker",
    description: "Play a full round (all 10 questions).",
    icon: "fa-book",
    rewardType: "coins",
    rewardValue: 10,
    difficulty: "easy",
    condition: (stats) => stats.totalQuestions === 10
  },
  {
    id: 10,
    title: "No Time to Waste",
    description: "Finish a round with more than 5 seconds remaining on the timer.",
    icon: "fa-hourglass-end",
    rewardType: "coins",
    rewardValue: 10,
    difficulty: "easy",
    condition: (stats) => stats.finalTimer > 5
  },
  {
    id: 11,
    title: "Lucky Seven",
    description: "Answer exactly 7 questions correctly.",
    icon: "fa-dice",
    rewardType: "coins",
    rewardValue: 15,
    difficulty: "easy",
    condition: (stats) => stats.correctCount === 7
  },
  {
    id: 12,
    title: "One-Hit Wonder",
    description: "Get 1 correct answer and 1 wrong answer (minimum).",
    icon: "fa-meteor",
    rewardType: "coins",
    rewardValue: 10,
    difficulty: "easy",
    condition: (stats) => stats.correctCount === 1 && stats.wrongCount >= 1
  },

  // === MEDIUM (20) – reward 20–25 coins or one lifeline ===
  {
    id: 13,
    title: "7 in a Row",
    description: "Answer 7 questions correctly in a row.",
    icon: "fa-fire",
    rewardType: "coins",
    rewardValue: 20,
    difficulty: "medium",
    condition: (stats) => stats.currentStreak >= 7 && stats.streakDirection === 'win'
  },
  {
    id: 14,
    title: "Call a Friend",
    description: "Use the Call a Friend lifeline and still get the correct answer.",
    icon: "fa-phone",
    rewardType: "lifeline",
    rewardValue: "callFriend",
    difficulty: "medium",
    condition: (stats) => stats.lifelineUsed === 'callFriend' && stats.isCorrectAfterLifeline
  },
  {
    id: 15,
    title: "Ask the Crowd",
    description: "Use Ask Crowd lifeline and get the correct answer.",
    icon: "fa-users",
    rewardType: "lifeline",
    rewardValue: "ask_crowd",
    difficulty: "medium",
    condition: (stats) => stats.lifelineUsed === 'ask_crowd' && stats.isCorrectAfterLifeline
  },
  {
    id: 16,
    title: "50:50 Master",
    description: "Use 50:50 and get the correct answer.",
    icon: "fa-percent",
    rewardType: "lifeline",
    rewardValue: "fifty_fifty",
    difficulty: "medium",
    condition: (stats) => stats.lifelineUsed === 'fifty_fifty' && stats.isCorrectAfterLifeline
  },
  {
    id: 17,
    title: "All or Nothing",
    description: "Answer all 10 questions correctly.",
    icon: "fa-star",
    rewardType: "coins",
    rewardValue: 25,
    difficulty: "medium",
    condition: (stats) => stats.correctCount === 10
  },
  {
    id: 18,
    title: "The Comeback",
    description: "Win a round after being on a losing streak of 3 or more.",
    icon: "fa-undo-alt",
    rewardType: "coins",
    rewardValue: 25,
    difficulty: "medium",
    condition: (stats) => stats.streakDirection === 'win' && stats.previousStreak <= -3
  },
  {
    id: 19,
    title: "Perfectionist",
    description: "Get 0 wrong answers in a round.",
    icon: "fa-check-double",
    rewardType: "coins",
    rewardValue: 25,
    difficulty: "medium",
    condition: (stats) => stats.wrongCount === 0 && stats.correctCount > 0
  },
  {
    id: 20,
    title: "Lifeline Saver",
    description: "Complete a round without using any lifelines.",
    icon: "fa-life-ring",
    rewardType: "coins",
    rewardValue: 20,
    difficulty: "medium",
    condition: (stats) => stats.lifelinesUsed === 0 && stats.correctCount >= 5
  },
  {
    id: 21,
    title: "Close Call",
    description: "Win a round with less than 2 seconds to spare.",
    icon: "fa-stopwatch",
    rewardType: "coins",
    rewardValue: 20,
    difficulty: "medium",
    condition: (stats) => stats.finalTimer < 2 && stats.correctCount >= 5
  },
  {
    id: 22,
    title: "Mixed Bag",
    description: "Use both 50:50 and Ask Crowd in one round and get them both correct.",
    icon: "fa-layer-group",
    rewardType: "lifeline",
    rewardValue: "ask_crowd",
    difficulty: "medium",
    condition: (stats) => stats.lifelineUsed === 'both' && stats.isCorrectAfterLifeline
  },
  {
    id: 23,
    title: "The Streak Breaker",
    description: "End a losing streak of 2 or more with a correct answer.",
    icon: "fa-cut",
    rewardType: "coins",
    rewardValue: 25,
    difficulty: "medium",
    condition: (stats) => stats.streakDirection === 'win' && stats.previousStreak <= -2
  },
  {
    id: 24,
    title: "Question Master",
    description: "Answer 8 questions correctly in a round.",
    icon: "fa-crown",
    rewardType: "coins",
    rewardValue: 25,
    difficulty: "medium",
    condition: (stats) => stats.correctCount >= 8
  },
  {
    id: 25,
    title: "Lifeline Trio",
    description: "Use all three lifelines in a single round (call, crowd, 50:50).",
    icon: "fa-arrows-alt",
    rewardType: "lifeline",
    rewardValue: "callFriend",
    difficulty: "medium",
    condition: (stats) => stats.lifelineUsed === 'all'
  },
  {
    id: 26,
    title: "The Survivor",
    description: "Finish a round with at least 5 correct answers and 5 wrong answers.",
    icon: "fa-skull",
    rewardType: "coins",
    rewardValue: 20,
    difficulty: "medium",
    condition: (stats) => stats.correctCount >= 5 && stats.wrongCount >= 5
  },
  {
    id: 27,
    title: "The Lone Wolf",
    description: "Answer 9 questions correctly with only 1 wrong.",
    icon: "fa-user-astronaut",
    rewardType: "coins",
    rewardValue: 25,
    difficulty: "medium",
    condition: (stats) => stats.correctCount === 9 && stats.wrongCount === 1
  },
  {
    id: 28,
    title: "No Pressure",
    description: "Answer 5 correct questions without using any lifelines.",
    icon: "fa-gem",
    rewardType: "coins",
    rewardValue: 20,
    difficulty: "medium",
    condition: (stats) => stats.correctCount >= 5 && stats.lifelinesUsed === 0
  },
  {
    id: 29,
    title: "The Gambler",
    description: "Use 50:50 and get the correct answer with less than 5 seconds left.",
    icon: "fa-dice",
    rewardType: "lifeline",
    rewardValue: "fifty_fifty",
    difficulty: "medium",
    condition: (stats) => stats.lifelineUsed === 'fifty_fifty' && stats.lastAnswerTimeLeft < 5 && stats.isCorrectAfterLifeline
  },

  // === HARD (15) – reward 30 coins or one lifeline ===
  {
    id: 30,
    title: "10 in a Row",
    description: "Answer 10 questions correctly in a row (perfect round).",
    icon: "fa-fire",
    rewardType: "coins",
    rewardValue: 30,
    difficulty: "hard",
    condition: (stats) => stats.currentStreak === 10 && stats.streakDirection === 'win'
  },
  {
    id: 31,
    title: "Flawless Victory",
    description: "Answer all 10 questions correctly without using any lifelines.",
    icon: "fa-shield-alt",
    rewardType: "coins",
    rewardValue: 30,
    difficulty: "hard",
    condition: (stats) => stats.correctCount === 10 && stats.lifelinesUsed === 0
  },
  {
    id: 32,
    title: "The Comeback King",
    description: "Win a round after being on a losing streak of 5 or more.",
    icon: "fa-undo",
    rewardType: "coins",
    rewardValue: 30,
    difficulty: "hard",
    condition: (stats) => stats.streakDirection === 'win' && stats.previousStreak <= -5
  },
  {
    id: 33,
    title: "Lifeline Legend",
    description: "Use all three lifelines in one round and get them all correct.",
    icon: "fa-trophy",
    rewardType: "lifeline",
    rewardValue: "callFriend",
    difficulty: "hard",
    condition: (stats) => stats.lifelineUsed === 'all' && stats.isCorrectAfterLifeline
  },
  {
    id: 34,
    title: "The Mastermind",
    description: "Answer 9 questions correctly and use no lifelines.",
    icon: "fa-brain",
    rewardType: "coins",
    rewardValue: 30,
    difficulty: "hard",
    condition: (stats) => stats.correctCount >= 9 && stats.lifelinesUsed === 0
  },
  {
    id: 35,
    title: "The Survivor",
    description: "Finish a round with exactly 5 correct answers and 5 wrong answers.",
    icon: "fa-balance-scale",
    rewardType: "coins",
    rewardValue: 30,
    difficulty: "hard",
    condition: (stats) => stats.correctCount === 5 && stats.wrongCount === 5
  },
  {
    id: 36,
    title: "The Comeback Kid II",
    description: "Win a round after being on a losing streak of 4 or more, with at least 7 correct answers.",
    icon: "fa-undo-alt",
    rewardType: "coins",
    rewardValue: 30,
    difficulty: "hard",
    condition: (stats) => stats.streakDirection === 'win' && stats.previousStreak <= -4 && stats.correctCount >= 7
  },
  {
    id: 37,
    title: "The Loyalist",
    description: "Answer 10 questions correctly without using 50:50 lifeline.",
    icon: "fa-handshake",
    rewardType: "coins",
    rewardValue: 30,
    difficulty: "hard",
    condition: (stats) => stats.correctCount === 10 && stats.lifelineUsed !== 'fifty_fifty'
  },
  {
    id: 38,
    title: "The Gambler II",
    description: "Use Call a Friend lifeline and get the correct answer with less than 3 seconds left.",
    icon: "fa-phone-volume",
    rewardType: "lifeline",
    rewardValue: "callFriend",
    difficulty: "hard",
    condition: (stats) => stats.lifelineUsed === 'callFriend' && stats.lastAnswerTimeLeft < 3 && stats.isCorrectAfterLifeline
  },
  {
    id: 39,
    title: "The Strategist",
    description: "Answer 8 correct questions, each with a different lifeline used at least once.",
    icon: "fa-chess-queen",
    rewardType: "coins",
    rewardValue: 30,
    difficulty: "hard",
    condition: (stats) => stats.correctCount >= 8 && stats.lifelineUsed === 'all'
  },
  {
    id: 40,
    title: "The Oracle",
    description: "Answer 8 correct in a row and finish with a perfect round.",
    icon: "fa-eye",
    rewardType: "coins",
    rewardValue: 30,
    difficulty: "hard",
    condition: (stats) => stats.currentStreak >= 8 && stats.streakDirection === 'win' && stats.correctCount === 10
  },
  {
    id: 41,
    title: "The Legend",
    description: "Answer 10 correct in a row, use no lifelines, and finish under 25 seconds.",
    icon: "fa-crown",
    rewardType: "coins",
    rewardValue: 30,
    difficulty: "hard",
    condition: (stats) => stats.currentStreak === 10 && stats.streakDirection === 'win' && stats.lifelinesUsed === 0 && stats.totalTime < 25
  }
];

// ========== CORE FRONT‑END FUNCTIONS ==========

/**
 * Get today's active challenge based on a date seed.
 * Same challenge for all users on the same day.
 */
export function getTodaysChallenge() {
  const daySeed = Math.floor(Date.now() / 86400000); // days since Unix epoch
  const index = daySeed % CHALLENGES.length;
  return CHALLENGES[index];
}

/**
 * Check if today's challenge has already been completed.
 * Uses localStorage.
 */
export function isChallengeCompletedToday() {
  const today = Math.floor(Date.now() / 86400000);
  const stored = localStorage.getItem('challengeData');
  if (!stored) return false;
  try {
    const data = JSON.parse(stored);
    return data.completedDay === today;
  } catch {
    return false;
  }
}

/**
 * Mark today's challenge as completed and store reward info.
 */
export function markChallengeCompletedLocal(rewardType, rewardValue) {
  const today = Math.floor(Date.now() / 86400000);
  localStorage.setItem('challengeData', JSON.stringify({
    completedDay: today,
    rewardType,
    rewardValue
  }));
}

/**
 * Evaluate if the current day's challenge condition is met.
 * @param {Object} stats – round stats from games.js
 * @returns {Object|null} – { rewardType, rewardValue } if completed, else null.
 */
export function evaluateChallenge(stats) {
  if (isChallengeCompletedToday()) return null;
  const challenge = getTodaysChallenge();
  if (!challenge) return null;
  const conditionMet = challenge.condition(stats);
  if (conditionMet) {
    return { rewardType: challenge.rewardType, rewardValue: challenge.rewardValue };
  }
  return null;
}

/**
 * Apply the reward to the user in Firestore.
 * (Kept from original – still used by games.js)
 */
export async function applyReward(userUID, rewardType, rewardValue, db) {
  const userRef = doc(db, 'users', userUID);
  const update = {};
  if (rewardType === 'coins') {
    update.coins = increment(rewardValue);
  } else if (rewardType === 'lifeline') {
    update[`lifeline.${rewardValue}`] = increment(1);
  }
  await updateDoc(userRef, update);
}

/**
 * Show a congratulatory modal with flowers animation.
 * (Unchanged from original)
 */
export function showCongratulationsModal(rewardType, rewardValue) {
  // Remove any existing modal
  const existing = document.getElementById('challengeCongratsModal');
  if (existing) existing.remove();

  // Build reward text
  let rewardText = '';
  if (rewardType === 'coins') {
    rewardText = `+${rewardValue} coins!`;
  } else {
    const lifelineLabels = {
      fifty_fifty: '50:50',
      ask_crowd: 'Ask Crowd',
      callFriend: 'Call a Friend'
    };
    rewardText = `+1 ${lifelineLabels[rewardValue] || rewardValue}!`;
  }

  const overlay = document.createElement('div');
  overlay.id = 'challengeCongratsModal';
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.7); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    z-index:10005; padding:1rem;
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    background:rgba(20,25,40,0.95);
    border:2px solid #FFD700;
    border-radius:2rem; padding:2rem 1.5rem;
    max-width:400px; width:100%;
    text-align:center; font-family:'Poppins',sans-serif;
    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;

  // Flowers (emoji animation)
  const flowers = document.createElement('div');
  flowers.style.cssText = `
    font-size:3rem; margin-bottom:0.5rem; animation: floatFlowers 2s ease-in-out infinite;
  `;
  flowers.textContent = '🌸🌼🌺🌸🌼';
  card.appendChild(flowers);

  const title = document.createElement('h2');
  title.textContent = '🎉 Challenge Complete!';
  title.style.cssText = `color:#FFD700; font-size:1.6rem; margin-bottom:0.5rem;`;
  card.appendChild(title);

  const msg = document.createElement('p');
  msg.textContent = `You earned ${rewardText}`;
  msg.style.cssText = `color:#f0f3fa; font-size:1.2rem; margin-bottom:1.5rem;`;
  card.appendChild(msg);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Awesome! 🎊';
  closeBtn.style.cssText = `
    background:linear-gradient(135deg,#3ED6B7,#259c84);
    border:none; border-radius:40px; padding:0.6rem 2rem;
    font-weight:700; font-size:1rem; color:#0a0f1e;
    cursor:pointer; font-family:'Poppins',sans-serif;
  `;
  closeBtn.addEventListener('click', () => overlay.remove());
  card.appendChild(closeBtn);

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  // Add keyframe animations if not already present
  if (!document.getElementById('challengeAnimStyle')) {
    const style = document.createElement('style');
    style.id = 'challengeAnimStyle';
    style.textContent = `
      @keyframes popIn {
        0% { transform: scale(0.5); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes floatFlowers {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
  }
}