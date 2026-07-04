// Firebase Modular SDK v12.14.0
import { auth, db, storage, analytics } from "./firebase.config.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  increment,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-storage.js";

// Helper: Toast notifications
function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// Helper: Set button loading state
function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    if (isLoading) {
        btn.disabled = true;
        btn.dataset.originalText = btn.querySelector("span")?.innerText || "Submit";
        const spinner = document.createElement("span");
        spinner.className = "loading-spinner";
        spinner.style.marginRight = "8px";
        const textSpan = btn.querySelector("span");
        if (textSpan) {
            textSpan.innerText = "Processing...";
            textSpan.prepend(spinner);
        } else {
            btn.innerHTML = `<span class="loading-spinner"></span> Loading...`;
        }
    } else {
        btn.disabled = false;
        const textSpan = btn.querySelector("span");
        if (textSpan && btn.dataset.originalText) {
            textSpan.innerText = btn.dataset.originalText;
            const spinner = textSpan.querySelector(".loading-spinner");
            if (spinner) spinner.remove();
        } else if (btn.dataset.originalText) {
            btn.innerHTML = `<span>${btn.dataset.originalText}</span>`;
        }
        delete btn.dataset.originalText;
    }
}

// ========== REFERRAL CODE GENERATOR ==========
function generateReferralCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

async function getUniqueReferralCode() {
    let unique = false;
    let referralCode = "";
    while (!unique) {
        referralCode = generateReferralCode();
        const codeQuery = query(collection(db, "users"), where("referralCode", "==", referralCode));
        const snapshot = await getDocs(codeQuery);
        if (snapshot.empty) unique = true;
    }
    return referralCode;
}

// ========== WELCOME BONUS (first 200 users) ==========
const MAX_BONUS_USERS = 200;
const BONUS_AMOUNT = 1000;

async function applyWelcomeBonusIfEligible(userRef, user) {
    const counterRef = doc(db, 'appState', 'registrationCounter');

    try {
        // Ensure the counter document exists
        const counterSnap = await getDoc(counterRef);
        if (!counterSnap.exists()) {
            console.log('📄 Creating appState/registrationCounter document...');
            await setDoc(counterRef, { count: 0 });
        }

        // Run a transaction to safely increment and check eligibility
        await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            if (!counterDoc.exists()) {
                // Shouldn't happen now, but just in case
                transaction.set(counterRef, { count: 1 });
                transaction.update(userRef, {
                    coins: increment(BONUS_AMOUNT),
                    hasReceivedBonus: true
                });
                console.log(`🎉 User ${user.uid} received ${BONUS_AMOUNT} coins (User #1)`);
                return;
            }
            const currentCount = counterDoc.data().count;
            console.log(`📊 Current registration count: ${currentCount}`);
            if (currentCount < MAX_BONUS_USERS) {
                // Eligible: increment counter, add bonus coins and set flag
                transaction.update(counterRef, { count: currentCount + 1 });
                transaction.update(userRef, {
                    coins: increment(BONUS_AMOUNT),
                    hasReceivedBonus: true
                });
                console.log(`🎉 User ${user.uid} received ${BONUS_AMOUNT} coins (User #${currentCount + 1})`);
            } else {
                // Not eligible: just increment counter (count all users)
                transaction.update(counterRef, { count: currentCount + 1 });
                console.log(`ℹ️ User ${user.uid} did not receive bonus (User #${currentCount + 1} beyond ${MAX_BONUS_USERS})`);
            }
        });
    } catch (bonusErr) {
        console.error('Failed to apply welcome bonus:', bonusErr);
        // Non‑critical – user still created without bonus.
        // We could log this to a separate collection for manual review.
        // Re-throw so the calling function can handle it (optional)
        throw bonusErr;
    }
}

// ========== CREATE USER PROFILE ==========
async function createUserProfile(user, email, displayName) {
    const uniqueReferralCode = await getUniqueReferralCode();
    const userDocRef = doc(db, "users", user.uid);
    const profile = {
        uid: user.uid,
        displayName: displayName || email.split('@')[0] || "User",
        email: email,
        phone: "",
        state: "",
        avatarUrl: "",
        referralCode: uniqueReferralCode,
        referredBy: "",
        totalScore: 0,
        balance: 0,
        lifetimeRoundPlayed: 0,
        loginStreak: 0,
        lastLoginDate: new Date().toISOString().split('T')[0],
        age: null,
        dateOfBirth: null,
        categoryStats: {
            afrobeats: { played: 0, bestScore: 0, mastery: 0 },
            nollywood: { played: 0, bestScore: 0, mastery: 0 },
            lagos_slang: { played: 0, bestScore: 0, mastery: 0 },
            super_eagles: { played: 0, bestScore: 0, mastery: 0 },
            nigeria_history: { played: 0, bestScore: 0, mastery: 0 },
            nigeria_food: { played: 0, bestScore: 0, mastery: 0 },
            nigeria_culture: { played: 0, bestScore: 0, mastery: 0 },
            nigeria_proverbs: { played: 0, bestScore: 0, mastery: 0 }
        },
        lifeline: { fifty_fifty: 1, ask_crowd: 1, ask_friend: 1 },
        coins: 0,
        lives: 2,
        level: "",
        badges: [],
        adCooldownUntil: null,
        lastAdRewardTime: null,
        bankDetails: { bankName: "", accountNumber: "", accountName: "" },
        createdAt: serverTimestamp(),
        isAdmin: false,
        hasReceivedBonus: false,
        bonusNotified: false
    };
    await setDoc(userDocRef, profile);
    return profile;
}

// ========== HELPER: REDIRECT USER BASED ON ADMIN STATUS ==========
async function redirectUserAfterAuth(user) {
    if (!user) return;
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            const isAdmin = data.isAdmin === true;
            // Update login streak (only for regular users? or both – we'll keep it for both)
            const today = new Date().toISOString().split('T')[0];
            const last = data.lastLoginDate;
            let streak = data.loginStreak || 0;
            if (last !== today) {
                if (last === new Date(Date.now() - 86400000).toISOString().split('T')[0]) streak += 1;
                else streak = 1;
                await updateDoc(userRef, { lastLoginDate: today, loginStreak: streak });
            }
            if (isAdmin) {
                window.location.href = "/admin/admin.html";
            } else {
                window.location.href = "/app/dashboard.html";
            }
        } else {
            // User document not found – fallback to login
            window.location.href = "/login.html";
        }
    } catch (err) {
        console.error("Error checking admin status:", err);
        // Fallback: redirect to dashboard
        window.location.href = "/app/dashboard.html";
    }
}

// ========== HANDLE SIGNUP (email/password) ==========
async function handleSignup(e) {
    e.preventDefault();
    const email = document.getElementById("signupEmail")?.value.trim();
    const password = document.getElementById("signupPassword")?.value;
    const signupBtn = document.getElementById("signupBtn");

    if (!email || !password) {
        showToast("Email and password required", "error");
        return;
    }
    if (password.length < 6) {
        showToast("Password must be at least 6 characters", "error");
        return;
    }

    setButtonLoading(signupBtn, true);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Create the user profile (without bonus yet)
        await createUserProfile(user, email, email.split('@')[0]);

        // Apply welcome bonus (if eligible)
        const userRef = doc(db, "users", user.uid);
        await applyWelcomeBonusIfEligible(userRef, user);

        showToast("Account created successfully! Welcome to NaijaGenius 🎉", "success");
        // Redirect after signup (new user is not admin)
        setTimeout(() => {
            window.location.href = "/app/dashboard.html";
        }, 1500);
    } catch (error) {
        console.error("Signup error:", error);
        let msg = "Signup failed. Please try again.";
        if (error.code === "auth/email-already-in-use") msg = "Email already registered. Please login.";
        else if (error.code === "auth/weak-password") msg = "Password is too weak. Use at least 6 characters.";
        else if (error.code === "auth/invalid-email") msg = "Invalid email address.";
        showToast(msg, "error");
        setButtonLoading(signupBtn, false);
    }
}

// ========== HANDLE LOGIN (email/password) ==========
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;
    const loginBtn = document.getElementById("loginBtn");
    if (!email || !password) {
        showToast("Email and password required", "error");
        return;
    }
    setButtonLoading(loginBtn, true);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        showToast("Login successful! Redirecting...", "success");
        // Redirect based on admin status
        await redirectUserAfterAuth(user);
    } catch (err) {
        let msg = "Invalid email or password";
        if (err.code === "auth/user-not-found") msg = "No account found";
        if (err.code === "auth/wrong-password") msg = "Wrong password";
        showToast(msg, "error");
        setButtonLoading(loginBtn, false);
    }
}

// ========== HANDLE GOOGLE SIGN-IN / SIGN-UP ==========
async function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    const btn = document.getElementById("googleBtn");
    setButtonLoading(btn, true);
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        let isNewUser = false;
        if (!userSnap.exists()) {
            // Create the user profile
            await createUserProfile(user, user.email, user.displayName || user.email.split('@')[0]);
            isNewUser = true;
            showToast("Account created with Google! 🎉", "success");
        } else {
            showToast("Welcome back! 🎉", "success");
        }

        // If new user, apply welcome bonus (if eligible)
        if (isNewUser) {
            await applyWelcomeBonusIfEligible(userRef, user);
        }

        // Redirect based on admin status
        await redirectUserAfterAuth(user);
    } catch (error) {
        console.error("Google sign-in error:", error);
        let msg = "Google sign-in failed. Please try again.";
        if (error.code === "auth/popup-closed-by-user") msg = "Sign-in cancelled.";
        else if (error.code === "auth/unauthorized-domain") {
            msg = "Domain not authorized. Please add your domain to Firebase Console > Authentication > Settings > Authorized domains.";
            console.warn("Add your domain (e.g., naijagenius.vercel.app) to Firebase Console > Authentication > Settings > Authorized domains.");
        }
        showToast(msg, "error");
    } finally {
        setButtonLoading(btn, false);
    }
}

// ========== RESET PASSWORD ==========
async function handleResetPassword(e) {
    e.preventDefault();
    const email = document.getElementById("resetEmail")?.value.trim();
    const resetBtn = document.getElementById("resetBtn");
    if (!email) {
        showToast("Enter your email address", "error");
        return;
    }
    setButtonLoading(resetBtn, true);
    try {
        await sendPasswordResetEmail(auth, email);
        const modal = document.getElementById("resetModal");
        if (modal) modal.style.display = "flex";
        setButtonLoading(resetBtn, false);
        document.getElementById("resetForm")?.reset();
    } catch (error) {
        let msg = "Failed to send reset link. Check email.";
        if (error.code === "auth/user-not-found") msg = "Email not registered";
        showToast(msg, "error");
        setButtonLoading(resetBtn, false);
    }
}

// ========== PASSWORD EYE TOGGLE ==========
function initPasswordToggles() {
    const toggleIcons = document.querySelectorAll(".toggle-password");
    toggleIcons.forEach(icon => {
        icon.removeEventListener("click", toggleHandler);
        icon.addEventListener("click", toggleHandler);
    });
}

function toggleHandler(event) {
    const icon = event.currentTarget;
    const targetId = icon.getAttribute("data-target");
    if (!targetId) return;
    const input = document.getElementById(targetId);
    if (!input) return;
    const newType = input.type === "password" ? "text" : "password";
    input.type = newType;
    icon.classList.toggle("fa-eye-slash");
    icon.classList.toggle("fa-eye");
}

function observeToggleIcons() {
    const observer = new MutationObserver(() => initPasswordToggles());
    observer.observe(document.body, { childList: true, subtree: true });
}

// ========== MODAL CLOSE ==========
function initModals() {
    // Reset modal
    const resetModal = document.getElementById("resetModal");
    const closeResetBtn = document.getElementById("closeModalBtn");
    if (closeResetBtn && resetModal) {
        closeResetBtn.addEventListener("click", () => resetModal.style.display = "none");
        resetModal.addEventListener("click", (e) => {
            if (e.target === resetModal) resetModal.style.display = "none";
        });
    }

    // Terms modal
    const termsModal = document.getElementById("termsModal");
    const closeTermsBtn = document.getElementById("closeTermsBtn");
    if (closeTermsBtn && termsModal) {
        closeTermsBtn.addEventListener("click", () => termsModal.style.display = "none");
        termsModal.addEventListener("click", (e) => {
            if (e.target === termsModal) termsModal.style.display = "none";
        });
    }

    // Tab switching
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    tabButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            tabButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            const target = this.dataset.tab;
            tabContents.forEach(content => {
                content.style.display = content.id === target ? "block" : "none";
            });
        });
    });

    // Open terms modal from links
    document.querySelectorAll('.terms-link, .privacy-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = document.getElementById("termsModal");
            if (modal) {
                const tab = this.dataset.tab || 'terms';
                tabButtons.forEach(b => b.classList.remove("active"));
                tabContents.forEach(c => c.style.display = "none");
                const activeBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
                if (activeBtn) {
                    activeBtn.classList.add("active");
                    const content = document.getElementById(tab);
                    if (content) content.style.display = "block";
                }
                modal.style.display = "flex";
            }
        });
    });
}

// ========== LOGOUT ==========
async function logoutUser() {
    try {
        await signOut(auth);
        showToast("Logged out", "success");
        window.location.href = "/index.html";
    } catch (e) {
        showToast("Logout error", "error");
    }
}

// ========== DOMContentLoaded ==========
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM ready - initializing auth...");
    initPasswordToggles();
    observeToggleIcons();
    initModals();

    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);

    const signupForm = document.getElementById("signupForm");
    if (signupForm) signupForm.addEventListener("submit", handleSignup);

    const resetForm = document.getElementById("resetForm");
    if (resetForm) resetForm.addEventListener("submit", handleResetPassword);

    const googleBtn = document.getElementById("googleBtn");
    if (googleBtn) googleBtn.addEventListener("click", handleGoogleSignIn);

    // Pre-populate email from URL params (optional)
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
        const emailField = document.getElementById("loginEmail") || document.getElementById("signupEmail");
        if (emailField) emailField.value = emailParam;
    }
});

// Export logout for dashboard.js
export { logoutUser };