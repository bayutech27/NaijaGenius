// sound.js – Sound effects for NaijaGenius
const SOUND_ENABLED_KEY = 'ng_sound_enabled';

// SFX
const sounds = {
  countdown: new Audio('/assets/sound/countdown.mp3'),
  correct:   new Audio('/assets/sound/correct.mp3'),
  wrong:     new Audio('/assets/sound/wrong.mp3'),
  comment:   new Audio('/assets/sound/comment.mp3'),
};

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
} catch (e) { /* ignore */ }

export function setSoundEnabled(enabled) {
  soundEnabled = !!enabled;
  try {
    localStorage.setItem(SOUND_ENABLED_KEY, soundEnabled);
  } catch (e) { /* ignore */ }
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function setMasterVolume(level) {
  const volume = Math.max(0, Math.min(1, level / 100));
  Object.values(sounds).forEach(audio => {
    audio.volume = volume;
  });
}

// Generic safe play (for SFX)
function safePlay(audio, restart = false) {
  if (!soundEnabled) return;
  if (restart) audio.currentTime = 0;
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
export function playCountdownSound() { safePlay(sounds.countdown, true); }
export function playCorrectSound()   { safePlay(sounds.correct, true); }
export function playWrongSound()     { safePlay(sounds.wrong, true); }
export function playCommentSound()   { safePlay(sounds.comment, true); }

// Stop countdown sound immediately
export function stopCountdownSound() {
  sounds.countdown.pause();
  sounds.countdown.currentTime = 0;
}

// ---------- Platform detection ----------
let _isNativePlatform = false;
try {
  if (window.Capacitor?.isNativePlatform()) {
    _isNativePlatform = true;
  }
} catch (e) {
  // not Capacitor
}

export function isNativePlatform() {
  return _isNativePlatform;
}