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

// Set default volume for SFX
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

// If sound is disabled at load time, ensure background music doesn't play
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

// Safely play any audio
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

// Background music controls
export function playBackgroundMusic() {
  if (!soundEnabled) return;
  // Only start if not already playing (to avoid overlapping loops)
  if (bgMusic.paused) {
    try {
      const promise = bgMusic.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(e => console.warn('Background music failed:', e.message));
      }
    } catch (e) {
      console.warn('Background music exception:', e.message);
    }
  }
}

export function stopBackgroundMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}
