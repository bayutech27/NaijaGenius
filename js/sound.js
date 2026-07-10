// sound.js – Sound effects and background music for NaijaGenius
const SOUND_ENABLED_KEY = 'ng_sound_enabled';

// SFX
const sounds = {
  countdown: new Audio('/assets/sound/countdown.mp3'),
  correct:   new Audio('/assets/sound/correct.mp3'),
  wrong:     new Audio('/assets/sound/wrong.mp3'),
  comment:   new Audio('/assets/sound/comment.mp3'),
};

// Background music
const bgMusic = new Audio('/assets/sound/background.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

// Default SFX volume
Object.values(sounds).forEach(audio => {
  audio.volume = 0.6;
});

// Mute state
let soundEnabled = true;
try {
  const stored = localStorage.getItem(SOUND_ENABLED_KEY);
  if (stored !== null) {
    soundEnabled = stored === 'true';
  }
} catch (e) {
  // ignore
}

// If sound is disabled at load, stop music
if (!soundEnabled) {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

export function setSoundEnabled(enabled) {
  soundEnabled = !!enabled;
  try {
    localStorage.setItem(SOUND_ENABLED_KEY, soundEnabled);
  } catch (e) {
    // ignore
  }
  if (!soundEnabled) {
    stopBackgroundMusic();
  }
}

export function isSoundEnabled() {
  return soundEnabled;
}

// Generic safe play
function safePlay(audio, restart = false) {
  if (!soundEnabled) return;
  if (restart) {
    audio.currentTime = 0;
  }
  try {
    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(e => console.warn('Sound playback failed:', e.message));
    }
  } catch (e) {
    console.warn('Sound playback exception:', e.message);
  }
}

// SFX exports
export function playCountdownSound() {
  safePlay(sounds.countdown, true);
}

export function playCorrectSound() {
  safePlay(sounds.correct, true);
}

export function playWrongSound() {
  safePlay(sounds.wrong, true);
}

export function playCommentSound() {
  safePlay(sounds.comment, true);
}

// Background music controls – only play after a user gesture
let gestureHappened = false;   // becomes true when user interacts
let musicRequested = false;   // someone asked to start music

function attemptPlay() {
  if (!soundEnabled || !gestureHappened || bgMusic.paused === false) return;
  try {
    const promise = bgMusic.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(e => console.warn('Background music failed:', e.message));
    }
  } catch (e) {
    console.warn('Background music exception:', e.message);
  }
}

// Track user gestures
document.addEventListener('click', () => {
  gestureHappened = true;
  if (musicRequested) attemptPlay();
}, { once: false });
document.addEventListener('touchstart', () => {
  gestureHappened = true;
  if (musicRequested) attemptPlay();
}, { once: false });
document.addEventListener('keydown', () => {
  gestureHappened = true;
  if (musicRequested) attemptPlay();
}, { once: false });

export function enableBackgroundMusicOnInteraction() {
  musicRequested = true;
  // If a gesture already happened (unlikely but safe), try now
  if (gestureHappened) attemptPlay();
  // Otherwise, the gesture listeners above will trigger attemptPlay()
}

export function stopBackgroundMusic() {
  musicRequested = false;
  bgMusic.pause();
  bgMusic.currentTime = 0;
}