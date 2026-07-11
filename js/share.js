// ========== share.js — Central WhatsApp Share Utility ==========
import { isNativePlatform } from './sound.js';

export const SHARE_BASE_URL = 'https://naijagenius.vercel.app';

/**
 * Opens WhatsApp directly to the contact/group picker with pre-filled text.
 * Works both in the wrapped native app and in a regular browser.
 */
export function shareToWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  const waLink = `https://wa.me/?text=${encoded}`;
  window.open(waLink, isNativePlatform() ? '_system' : '_blank');
}