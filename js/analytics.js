// analytics.js – lightweight wrapper for Firebase Analytics events
import { analytics, logEvent } from './firebase.config.js';

/**
 * Log a custom event
 * @param {string} eventName - The event name (e.g., 'game_started')
 * @param {object} params - Optional parameters (e.g., { category: 'afrobeats' })
 */
export function logAnalyticsEvent(eventName, params = {}) {
  try {
    logEvent(analytics, eventName, params);
  } catch (err) {
    // Silently fail – analytics should never break the app
    console.debug('Analytics error:', err.message);
  }
}

// Convenience functions for common events
export function logGameStarted(gameType, category) {
  logAnalyticsEvent('game_started', { game_type: gameType, category });
}

export function logGameCompleted(gameType, score, correct, total, coinsEarned) {
  logAnalyticsEvent('game_completed', {
    game_type: gameType,
    score,
    correct_answers: correct,
    total_questions: total,
    coins_earned: coinsEarned
  });
}

export function logLifelineUsed(lifelineName) {
  logAnalyticsEvent('lifeline_used', { lifeline: lifelineName });
}

export function logLevelUp(newLevel) {
  logAnalyticsEvent('level_up', { level: newLevel });
}

export function logShopPurchase(itemId, price, type) {
  logAnalyticsEvent('shop_purchase', { item_id: itemId, price, type });
}

export function logAdWatched(reward) {
  logAnalyticsEvent('ad_watched', { reward });
}

export function logNavigation(section) {
  logAnalyticsEvent('screen_view', { screen_name: section });
}