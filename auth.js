// auth.js (ES module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

/*
  ===  IMPORTANT: Replace the config below with your Firebase web app config  ===
  You get this from Firebase Console → Project Settings → Your apps → SDK setup and config
*/
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Expose sign-out so admin.html can call it
window.appSignOut = async () => {
  return signOut(auth);
};

// Common helper: display messages if login page is open
function showMessage(msg, isError=true) {
  const el = document.getElementById('message');
  if (el) {
    el.style.color = isError ? 'crimson' : 'green';
    el.innerText = msg;
  } else {
    console.log('Message:', msg);
  }
}

// Login page wiring (if login.html is loaded)
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnSignup = document.getElementById('btnSignup');

if (btnLogin) {
  btnLogin.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) { showMessage('Enter email and password'); return; }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showMessage('Signed in successfully — redirecting...', false);
      // Redirect to admin dashboard
      setTimeout(() => location.href = '/auth/admin.html', 600);
    } catch (err) {
      showMessage('Login failed: ' + err.message);
    }
  });
}

if (btnSignup) {
  btnSignup.addEventListener('click', async () => {
    // NOTE: For security, use this only once to create your admin, or remove button after creating user.
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) { showMessage('Enter email and password'); return; }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showMessage('Account created — you can sign in now.', false);
    } catch (err) {
      showMessage('Signup failed: ' + err.message);
    }
  });
}

/*
 Auth state listener — exposes window.currentUser and calls a hook window.onAuthReady(user)
 so other pages (admin.html) can react.
*/
onAuthStateChanged(auth, (user) => {
  window.currentUser = user || null;
  if (typeof window.onAuthReady === 'function') {
    window.onAuthReady(user);
  }
});
