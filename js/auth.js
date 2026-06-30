// Firebase Modular SDK v12.14.0
import { auth, db, storage, analytics } from "./firebase.config.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
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

// ========== PHONE NUMBER AUTO-FORMATTING ==========
function formatPhoneNumber(value) {
    let cleaned = value.replace(/\D/g, '');
    if (!cleaned.startsWith('234')) {
        cleaned = '234' + cleaned;
    }
    if (cleaned.length > 13) cleaned = cleaned.slice(0, 13);
    let formatted = '+';
    if (cleaned.length >= 4) {
        formatted += cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 6);
        if (cleaned.length >= 7) {
            formatted += ' ' + cleaned.slice(6, 10);
            if (cleaned.length >= 11) {
                formatted += ' ' + cleaned.slice(10, 14);
            }
        }
    } else {
        formatted += cleaned;
    }
    return formatted.trim();
}

function setupPhoneFormatter() {
    const phoneInput = document.getElementById("phoneNumber");
    if (!phoneInput) return;
    phoneInput.placeholder = "+234 801 234 5678";
    phoneInput.addEventListener("input", function() {
        let digits = this.value.replace(/\D/g, '');
        if (digits.length === 0) {
            this.value = '+234 ';
            return;
        }
        if (!digits.startsWith('234')) digits = '234' + digits;
        this.value = formatPhoneNumber('+' + digits);
    });
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

// ========== USERNAME AVAILABILITY (PUBLIC - NO AUTH REQUIRED) ==========
async function isUsernameAvailable(username) {
    if (!username || username.length < 3) return false;
    // Use the usernames collection with a direct document read (public)
    const usernameDoc = doc(db, "usernames", username.toLowerCase());
    const snapshot = await getDoc(usernameDoc);
    return !snapshot.exists();
}

function setupUsernameListener() {
    const usernameInput = document.getElementById("username");
    const statusSpan = document.getElementById("usernameStatus");
    if (!usernameInput || !statusSpan) return;
    let debounceTimer;
    usernameInput.addEventListener("input", async () => {
        clearTimeout(debounceTimer);
        const username = usernameInput.value.trim();
        if (username.length < 3) {
            statusSpan.textContent = "Min 3 characters";
            statusSpan.className = "username-status taken";
            return;
        }
        debounceTimer = setTimeout(async () => {
            try {
                const available = await isUsernameAvailable(username);
                if (available) {
                    statusSpan.textContent = "✓ Username Available";
                    statusSpan.className = "username-status available";
                } else {
                    statusSpan.textContent = "✗ Username Already Taken";
                    statusSpan.className = "username-status taken";
                }
            } catch (error) {
                // If network error, show a neutral message
                statusSpan.textContent = "⚠️ Checking...";
                statusSpan.className = "username-status taken";
            }
        }, 500);
    });
}

// ========== CREATE USER PROFILE ==========
async function createUserProfile(user, userData) {
    const { username, email, phone, state } = userData;
    const uniqueReferralCode = await getUniqueReferralCode();
    const userDocRef = doc(db, "users", user.uid);
    const profile = {
        uid: user.uid,
        displayName: username,
        email: email,
        phone: phone || "",
        state: state,
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
        bankDetails: { bankName: "", accountNumber: "", accountName: "" },
        createdAt: serverTimestamp(),
        isAdmin: false
    };
    await setDoc(userDocRef, profile);
    return profile;
}

// ========== CREATE USERNAME DOCUMENT ==========
async function createUsernameDocument(username, uid) {
    const usernameRef = doc(db, "usernames", username.toLowerCase());
    await setDoc(usernameRef, {
        uid: uid,
        createdAt: serverTimestamp()
    });
}

// ========== ROLLBACK FUNCTIONS (for error handling) ==========
async function deleteUserProfile(uid) {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
}

// ========== HANDLE SIGNUP ==========
async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById("username")?.value.trim();
    const email = document.getElementById("signupEmail")?.value.trim();
    let phone = document.getElementById("phoneNumber")?.value.trim();
    const state = document.getElementById("state")?.value.trim();
    const password = document.getElementById("signupPassword")?.value;
    const confirm = document.getElementById("confirmPassword")?.value;
    const signupBtn = document.getElementById("signupBtn");

    // Validation
    if (!username || !email || !phone || !state || !password) {
        showToast("All fields are required", "error");
        return;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phoneDigits.startsWith('234') || phoneDigits.length < 13) {
        showToast("Enter a valid Nigerian phone number (e.g., +234 801 234 5678)", "error");
        return;
    }
    if (password !== confirm) {
        showToast("Passwords do not match", "error");
        return;
    }
    if (password.length < 6) {
        showToast("Password must be at least 6 characters", "error");
        return;
    }

    setButtonLoading(signupBtn, true);

    // Step 1: Check username availability (public, no auth)
    try {
        const available = await isUsernameAvailable(username);
        if (!available) {
            showToast("Username already taken. Please choose another.", "error");
            setButtonLoading(signupBtn, false);
            return;
        }
    } catch (error) {
        console.error("Username check error:", error);
        showToast("Network error. Please try again.", "error");
        setButtonLoading(signupBtn, false);
        return;
    }

    // Step 2: Create Firebase Auth user
    let userCredential;
    try {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Firebase Auth error:", error);
        let msg = error.message;
        if (msg.includes("email-already-in-use")) msg = "Email already registered. Please login.";
        else if (msg.includes("weak-password")) msg = "Password is too weak. Use at least 6 characters.";
        else msg = "Authentication failed. Please try again.";
        showToast(msg, "error");
        setButtonLoading(signupBtn, false);
        return;
    }

    const user = userCredential.user;

    // Step 3: Create Firestore user profile (users/{uid})
    try {
        await createUserProfile(user, { username, email, phone, state });
    } catch (error) {
        console.error("User profile creation error:", error);
        showToast("Account created but profile setup failed. Please contact support.", "error");
        await user.delete(); // clean up auth user
        setButtonLoading(signupBtn, false);
        return;
    }

    // Step 4: Create username document (usernames/{username})
    try {
        await createUsernameDocument(username, user.uid);
    } catch (error) {
        console.error("Username document creation error:", error);
        // Rollback: delete user profile and auth user
        await deleteUserProfile(user.uid);
        await user.delete();
        showToast("Signup failed due to a system error. Please try again.", "error");
        setButtonLoading(signupBtn, false);
        return;
    }

    // Step 5: Success
    showToast("Account created successfully! Welcome to NaijaGenius 🎉", "success");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}

// ========== HANDLE LOGIN (with admin redirection) ==========
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
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                const isAdmin = data.isAdmin === true;

                // Update login streak
                const today = new Date().toISOString().split('T')[0];
                const last = data.lastLoginDate;
                let streak = data.loginStreak || 0;
                if (last !== today) {
                    if (last === new Date(Date.now() - 86400000).toISOString().split('T')[0]) streak += 1;
                    else streak = 1;
                    await updateDoc(userRef, { lastLoginDate: today, loginStreak: streak });
                }

                // Redirect based on admin status
                if (isAdmin) {
                    window.location.href = "/admin/admin.html";
                } else {
                    // Regular user → dashboard
                    window.location.href = "/app/dashboard.html";
                }
            } else {
                // User document not found – fallback to login
                window.location.href = "/login.html";
            }
        } else {
            window.location.href = "/login.html";
        }
    } catch (err) {
        let msg = "Invalid email or password";
        if (err.code === "auth/user-not-found") msg = "No account found";
        if (err.code === "auth/wrong-password") msg = "Wrong password";
        showToast(msg, "error");
        setButtonLoading(loginBtn, false);
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
function initModal() {
    const modal = document.getElementById("resetModal");
    const closeBtn = document.getElementById("closeModalBtn");
    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => modal.style.display = "none");
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    }
}

// ========== STATE INPUT VALIDATION ==========
function setupStateInput() {
    const stateInput = document.getElementById("state");
    if (!stateInput) return;
    const validStates = [
        "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
        "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT Abuja","Gombe",
        "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
        "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
        "Taraba","Yobe","Zamfara"
    ];
    stateInput.addEventListener("change", function() {
        const value = this.value.trim();
        if (value && !validStates.includes(value)) {
            showToast("Please select a valid Nigerian state from the list", "error");
            this.value = "";
        }
    });
}

// ========== LOGOUT (redirects to index.html in root) ==========
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
    console.log("DOM ready - initializing...");
    initPasswordToggles();
    observeToggleIcons();
    initModal();
    setupPhoneFormatter();
    setupStateInput();

    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);

    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", handleSignup);
        setupUsernameListener();
    }

    const resetForm = document.getElementById("resetForm");
    if (resetForm) resetForm.addEventListener("submit", handleResetPassword);
});
