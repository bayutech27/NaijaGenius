// Firebase Modular SDK v12.14.0
import { auth, db, storage, analytics } from "./firebase.config.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
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

// ========== CREATE USER PROFILE (minimal) ==========
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
        isAdmin: false
    };
    await setDoc(userDocRef, profile);
    return profile;
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
        // Create Firestore profile
        await createUserProfile(user, email, email.split('@')[0]);
        showToast("Account created successfully! Welcome to NaijaGenius 🎉", "success");
        setTimeout(() => {
            window.location.href = "dashboard.html";
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
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Login successful! Redirecting...", "success");
        // Redirect will be handled by onAuthStateChanged
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
        // Check if user document exists
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            // New user – create profile
            await createUserProfile(user, user.email, user.displayName || user.email.split('@')[0]);
            showToast("Account created with Google! 🎉", "success");
        } else {
            showToast("Welcome back! 🎉", "success");
        }
        // Redirect after a moment
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);
    } catch (error) {
        console.error("Google sign-in error:", error);
        let msg = "Google sign-in failed. Please try again.";
        if (error.code === "auth/popup-closed-by-user") msg = "Sign-in cancelled.";
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

// ========== MODAL CLOSE (reset & terms) ==========
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
                // Show the correct tab
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

// ========== AUTH STATE LISTENER ==========
// Note: onAuthStateChanged is already used in dashboard.js; we can handle redirects here as well.
// We'll keep it minimal; the dashboard will redirect if not authenticated.
// But for login page we'll rely on the form handlers.

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