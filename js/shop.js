// shop.js – Shop logic for NaijaGenius
import { auth, db } from '/js/firebase.config.js';
import { doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// ========== SHOP ITEMS (updated) ==========
const SHOP_ITEMS = [
    { id: 'extra_life', label: '+3 Lives', icon: 'fa-heart', price: 500, type: 'life' },
    { id: 'fifty_fifty', label: '+1 50:50', icon: 'fa-percent', price: 300, type: 'lifeline', field: 'fifty_fifty' },
    { id: 'ask_crowd', label: '+1 Crowd', icon: 'fa-users', price: 500, type: 'lifeline', field: 'ask_crowd' },
    { id: 'call_friend', label: '+1 Call a Friend', icon: 'fa-phone', price: 500, type: 'lifeline', field: 'callFriend' }
];

// ========== RENDER SHOP ==========
export function renderShop(currentCoins) {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;

    grid.innerHTML = '';
    SHOP_ITEMS.forEach(item => {
        const card = document.createElement('div');
        card.className = 'shop-item';
        card.innerHTML = `
            <div class="shop-item-icon"><i class="fas ${item.icon}"></i></div>
            <div class="shop-item-info">
                <h4>${item.label}</h4>
                <p><i class="fas fa-coins" style="color:#FFD700;"></i> ${item.price}</p>
            </div>
            <button class="shop-buy-btn" data-item-id="${item.id}" ${currentCoins < item.price ? 'disabled' : ''}>
                ${currentCoins >= item.price ? 'Buy' : 'Need more coins'}
            </button>
        `;
        grid.appendChild(card);
    });

    // Attach buy handlers
    document.querySelectorAll('.shop-buy-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const itemId = btn.dataset.itemId;
            const item = SHOP_ITEMS.find(it => it.id === itemId);
            if (!item) return;
            await purchaseItem(item);
        });
    });
}

// ========== PURCHASE LOGIC ==========
export async function purchaseItem(item) {
    const user = auth.currentUser;
    if (!user) {
        showToast('Please log in to make purchases.', 'error');
        return;
    }

    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            showToast('User data not found.', 'error');
            return;
        }

        const data = userSnap.data();
        const coins = data.coins || 0;
        if (coins < item.price) {
            // Show modal: not enough coins
            showNotEnoughCoinsModal();
            return;
        }

        // Prepare update
        const update = { coins: increment(-item.price) };

        if (item.type === 'life') {
            // +3 Lives
            update.lives = increment(3);
        } else if (item.type === 'lifeline') {
            // Update nested lifeline field
            const field = `lifeline.${item.field}`;
            update[field] = increment(1);
        }

        await updateDoc(userRef, update);

        showToast(`Purchased ${item.label}!`, 'success');

        // Refresh UI
        const newSnap = await getDoc(userRef);
        const newCoins = newSnap.data().coins || 0;
        renderShop(newCoins);

        // Also update header coins – handled by onSnapshot in dashboard

    } catch (err) {
        console.error('Purchase error:', err);
        showToast('Purchase failed. Please try again.', 'error');
    }
}

// ========== NOT ENOUGH COINS MODAL ==========
function showNotEnoughCoinsModal() {
    // Remove any existing modal
    const existing = document.getElementById('insufficientCoinsModal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'insufficientCoinsModal';
    overlay.style.cssText = `
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.8); backdrop-filter:blur(6px);
        display:flex; align-items:center; justify-content:center;
        z-index:10003; padding:1rem;
    `;

    const card = document.createElement('div');
    card.style.cssText = `
        background:rgba(20,25,40,0.95);
        border:1px solid rgba(255,215,0,0.3);
        border-radius:2rem; padding:2rem 1.5rem;
        max-width:400px; width:100%;
        text-align:center; font-family:'Poppins',sans-serif;
    `;

    card.innerHTML = `
        <div style="font-size:3rem; color:#FFD700; margin-bottom:0.5rem;">
            <i class="fas fa-coins"></i>
        </div>
        <h3 style="color:#f0f3fa; font-size:1.3rem; margin-bottom:0.5rem;">Not Enough Coins!</h3>
        <p style="color:#a0b3d9; font-size:1rem; margin-bottom:1.5rem;">
            You need more coins to buy this item. Keep playing to earn more!
        </p>
        <button id="closeCoinsModal" style="
            background:linear-gradient(135deg,#3ED6B7,#259c84);
            border:none; border-radius:40px; padding:0.6rem 2rem;
            font-weight:700; font-size:1rem; color:#0a0f1e;
            cursor:pointer; font-family:'Poppins',sans-serif;
        ">OK, Got it</button>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    document.getElementById('closeCoinsModal').addEventListener('click', () => {
        overlay.remove();
    });
}

// ========== AD BUTTON ==========
export function setupAdButton(userRef, updateHeaderUI) {
    const adBtn = document.getElementById('watchAdBtn');
    if (!adBtn) return;

    adBtn.addEventListener('click', () => {
        // Placeholder for AdMob rewarded video integration
        if (confirm('Simulate watching ad? (In production, this would trigger a rewarded video ad.)')) {
            updateDoc(userRef, { lives: increment(1) })
                .then(() => {
                    showToast('🎉 +1 Life earned!', 'success');
                    // UI will update via onSnapshot
                })
                .catch(err => {
                    console.error('Ad reward failed:', err);
                    showToast('Failed to grant life. Try again.', 'error');
                });
        }
    });
}

// ========== TOAST HELPER ==========
function showToast(message, type = 'success', duration = 4000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, duration);
}