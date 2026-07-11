// ========== share.js — Central WhatsApp Share Utility ==========
import { isNativePlatform } from './sound.js';

export const SHARE_BASE_URL = 'https://naijagenius.vercel.app';

export function shareToWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  const waLink = `https://wa.me/?text=${encoded}`;
  return window.open(waLink, isNativePlatform() ? '_system' : '_blank');
}
