// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, // Added Code
  signOut, // Added Code
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbCeeN4ZcU0KsYNRtQ7FLjhKudPn7s3wM",
  authDomain: "gamepathver1.firebaseapp.com",
  projectId: "gamepathver1",
  storageBucket: "gamepathver1.firebasestorage.app",
  messagingSenderId: "927186101810",
  appId: "1:927186101810:web:c976c7c86809d1af2cfe2b",
  measurementId: "G-2TYRLYCDYX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // This initializes Firebase Auth and assigns it to "auth"

////_________________________ TESTING LOGIN FUNCTIONS + CREDENTIALS _________________________////
// 🔹 If the user enters a weak password, they see red text with instructions.
// 🔹 If the password meets all criteria, they see green text confirming a strong password.
// 🔹 Registration only proceeds if the password is strong.

const passwordInput = document.getElementById("regPassword");
const passwordMessage = document.getElementById("passwordMessage");

if (passwordInput && passwordMessage) {
  // Added Code: Prevents errors if elements are missing
  passwordInput.addEventListener("input", () => {
    if (isValidPassword(passwordInput.value)) {
      passwordMessage.style.color = "green";
      passwordMessage.textContent = "Strong password ✅";
      console.log("Strong password.");
    } else {
      passwordMessage.style.color = "red";
      passwordMessage.textContent =
        "Password must be 8+ characters, with uppercase, lowercase, number, and special character.";
    }
  });
}

// How It Works
// (?=.*[a-z]) → Requires at least one lowercase letter.
// (?=.*[A-Z]) → Requires at least one uppercase letter.
// (?=.*\d) → Requires at least one number.
// (?=.*[\W_]) → Requires at least one special character (e.g., !@#$%^&*).
// . {8, } → Ensures minimum length of 8 characters.
function isValidPassword(password) {
  // Regular expression for password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
}

const register = document.querySelector("#regForm");

// Registration Form Handling
function registerHandler(e) {
  e.preventDefault(); // Prevent page refresh
  console.log("registerHandler function called.");
  //debugger; // Added Code - This will pause execution in Chrome DevTools

  const emailInput = register.querySelector("#regEmail"); // Fixed reference
  const passwordInput = register.querySelector("#regPassword"); // Fixed reference
  const errorMessage = document.querySelector("#regError"); // Error message display

  if (!emailInput || !passwordInput) {
    console.error("Error: Form inputs not found.");
    return;
  }

  const email = emailInput.value;
  const password = passwordInput.value;

  // ✅ Prevent empty email or password submission
  if (!email) {
    console.warn("Email field is empty.");
    if (errorMessage) {
      errorMessage.textContent = "Please enter your email.";
      errorMessage.style.color = "red";
    } else {
      alert("Please enter your email.");
    }
    emailInput.focus(); // ✅ Added UX improvement
    return;
  }

  if (!password) {
    console.warn("Password field is empty.");
    if (errorMessage) {
      errorMessage.textContent = "Please enter your password.";
      errorMessage.style.color = "red";
    } else {
      alert("Please enter your password.");
    }
    passwordInput.focus(); // ✅ Added UX improvement
    return;
  }

  // ✅ Check password strength before proceeding
  if (!isValidPassword(password)) {
    if (errorMessage) {
      errorMessage.textContent =
        "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character.";
      errorMessage.style.color = "red";
      console.log(
        "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character.."
      );
    } else {
      alert(
        "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character."
      );
    }
    passwordInput.focus(); // ✅ Added UX improvement
    return;
  }

  // If password is strong, proceed with account creation
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("User created successfully:", cred.user);
      register.reset(); // ✅ Clear form after successful registration

      setTimeout(() => {
        window.location.hash = ""; // ✅ Close registration popup after success
      }, 500); // ✅ Small delay for visibility

      // ✅ Added delay before redirecting to allow Firebase sync
      setTimeout(() => {
        location.href = "/test.html";
      }, 1000); // 1.0 second delay
    })
    .catch((error) => {
      console.error("Firebase Error:", error);
      // ✅ Improved error handling with specific messages
      let message;
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "This email is already registered. Try logging in instead.";
          break;
        case "auth/invalid-email":
          message = "Invalid email format. Please check your email.";
          break;
        case "auth/weak-password":
          message = "Weak password. Use at least 8 characters.";
          break;
        default:
          message = "Registration failed. Please try again.";
      }
      console.error("Registration error:", error);

      // ✅ Display error dynamically inside the form
      if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.color = "red";
      } else {
        alert(message);
      }
    });
}

// Added Code: Improved registration form handling
// ✅ Ensure registration form exists before proceeding
if (!register) {
  console.error("Error: Registration form not found.");
} else {
  register.removeEventListener("submit", registerHandler); // ✅ Prevent duplicate event bindings
  register.addEventListener("submit", registerHandler);
  console.log("addEventListener registerHandler.");
}

// Status tracker of user
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("user logged in: ", user);
  } else {
    console.log("user logged out");
  }
});

// Login Form
const loginForm = document.querySelector("#myForm");
if (loginForm) {
  // Add an event listener for when the login form has been submitted
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get user inputs
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;

    //Function that signs in users
    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        //Reset Form and then send the user to Home
        loginForm.reset();
        location.href = "/test.html";
      })
      .catch((error) => {
        loginForm.reset();
        alert("Incorrect username or password.");
      });
  });
}

// Logging out
const logout = document.querySelector("#logout");
if (logout) {
  logout.addEventListener("click", (e) => {
    e.preventDefault();

    // auth.signOut().then(() => {
    //   location.href = "/index.html";
    // });
    signOut(auth).then(() => {
      location.href = "/index.html";
    }); // MED Changing Code
  });
}
// added code
function closePopup() {
  window.location.hash = ""; // Close the popup properly without reloading
}
