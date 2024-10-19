// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGMUO9YFJnO-F6QhtqJyisDZleHQvgygY",
    authDomain: "charity-78b81.firebaseapp.com",
    databaseURL: "https://charity-78b81-default-rtdb.firebaseio.com",
    projectId: "charity-78b81",
    storageBucket: "charity-78b81.appspot.com",
    messagingSenderId: "351871288311",
    appId: "1:351871288311:web:057d6d5a4575d67ba524f2",
    measurementId: "G-2TM815MBN5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Admin ID (replace with your actual user ID)
const adminUID = "CGm7g89PCedIM3bBNpCMkVBBtrK2"; // Replace this with your UID

// Check login state on page load
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";


// Existing modal-related code...
const modal = document.getElementById('loginSignupModal');
const loginBtn = document.getElementById('loginBtn');
const closeBtn = document.getElementsByClassName('close')[0];
const signupLink = document.getElementById('signupLink');
const loginLink = document.getElementById('loginLink');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Function to open the modal
function openModal() {
    modal.style.display = 'flex';
}

// Open modal when login button is clicked
loginBtn.onclick = openModal;

// Close modal when clicking on 'X' button
closeBtn.onclick = function() {
    closeModal();
};

// Close modal if clicked outside the content area
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// Function to close the modal and reset inputs
function closeModal() {
    modal.style.display = 'none';
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
}

// Function to switch forms
function switchForm(hideForm, showForm) {
    hideForm.style.display = 'none';
    showForm.style.display = 'block';
}

// Show signup form when clicking 'Sign up here'
signupLink.onclick = function(event) {
    event.preventDefault();
    switchForm(loginForm, signupForm);
}

// Show login form when clicking 'Login here'
loginLink.onclick = function(event) {
    event.preventDefault();
    switchForm(signupForm, loginForm);
}

// Function to handle 'Enter' key press and trigger correct button action
function handleEnterKeyPress(event, submitButton) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        submitButton.click(); // Trigger the button click event
    }
}

// Add event listener to Login form
loginForm.addEventListener('keypress', function(e) {
    handleEnterKeyPress(e, document.getElementById('submitLogin')); // Call login button
});

// Add event listener to Signup form
signupForm.addEventListener('keypress', function(e) {
    handleEnterKeyPress(e, document.getElementById('submitSignup')); // Call signup button
});

// Add event listener for Sign Up button
document.getElementById('submitSignup').addEventListener('click', function(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if (name === "" || email === "" || password === "") {
        alert("All fields are required!");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Send email verification
            sendEmailVerification(user)
                .then(() => {
                    alert('A verification email has been sent to your email address. Please verify your email to complete the sign-up.');
                    closeModal(); // Close modal after sending verification
                    // Set user role in the database
                    return set(ref(db, 'users/' + user.uid), {
                        username: name,
                        email: email,
                        role: user.uid === adminUID ? 'admin' : 'user' // Assign role based on UID
                    });
                })
                .catch((error) => {
                    alert('Error while sending verification email: ' + error.message);
                });
        })
        .catch((error) => {
            alert('Sign up failed: ' + error.message);
            closeModal(); // Close modal after failed signup
        });
});

// Handle Login
document.getElementById('submitLogin').addEventListener('click', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (email === "" || password === "") {
        alert("Please enter both email and password.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Check if email is verified
            if (!user.emailVerified) {
                alert("Please verify your email before logging in.");
                signOut(auth);
                return;
            }

            // Fetch the user data from the database
            get(child(ref(db), 'users/' + user.uid)).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val(); // Fetch user data
                    const name = userData.username; // Get the name from the database
                    const firstLetter = name.charAt(0).toUpperCase(); // Get first letter and make it uppercase

                    // Set the first letter as the user icon
                    const userIcon = document.getElementById("userIcon");
                    userIcon.textContent = firstLetter;

                    // Check if the user is an admin
                    if (userData.role === 'admin') {
                        // Show admin pop-up (you can use a custom modal here)
                        alert("Welcome Admin!");
                    }
                } else {
                    alert("No user data found in the database.");
                }
            }).catch((error) => {
                alert("Error fetching user data: " + error.message);
            });

            alert("Login successful!");
            closeModal(); // Close modal after successful login

        })
        .catch((error) => {
            alert("Login failed: " + error.message);
        });
});
// Handle logout
loginBtn.addEventListener("click", function() {
    if (isLoggedIn) {
        // Log the user out
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("loggedInUser");
        isLoggedIn = false;
        updateLoginUI(false); // Update UI to logged-out state
        alert("You have been logged out.");
    } else {
        // Show the login modal if not logged in
        //document.getElementById("loginSignupModal").style.display = "block";
    }
});

function logout() {  
    signOut(auth).then(() => {
        // Sign-out successful.
        if (isLoggedIn) {
            // Log the user out
            localStorage.setItem("isLoggedIn", "false");
            localStorage.removeItem("loggedInUser");
            isLoggedIn = false;
            document.getElementById("navLoginSignup").style.display = "block"; // Show login/signup button
            document.getElementById("navLogout").style.display = "none"; // Hide Logout button
            document.getElementById("userIcon").textContent = ''; // Clear icon letter
            document.getElementById("dropdownMenu").style.display = "none"; // Hide dropdown
        alert("You have been logged out successfully.");
        }
        // else {
        //     // Show the login modal if not logged in
        //     document.getElementById("loginSignupModal").style.display = "block";
        // }
    }).catch((error) => {
        alert("Logout failed: " + error.message);
    });
};

onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        // User is signed in and email is verified
        localStorage.setItem("isLoggedIn", "true"); // Store login state in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(user)); // Optionally store user details
        updateLoginUI(true); // Update UI to reflect the logged-in state
    } else {
        // No user is signed in or email is not verified
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("loggedInUser");
        updateLoginUI(false); // Update UI to reflect the logged-out state
    }
});

// Function to update UI based on login state
function updateLoginUI(isLoggedIn) {
    const loginButton = document.getElementById("loginButton");
    if (isLoggedIn) {
        loginButton.textContent = "Logout";
        loginButton.classList.add("active");
        // Show user-specific content (e.g., user name or profile options)
    } else {
        loginButton.textContent = "Login";
        loginButton.classList.remove("active");
        // Hide user-specific content
    }
}

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.emailVerified) {
            // User is signed in and email is verified.
            get(child(ref(db), 'users/' + user.uid)).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const name = userData.username; // Get the name from the database
                    const firstLetter = name.charAt(0).toUpperCase(); // Get first letter and make it uppercase

                    // Set the first letter as the user icon
                    const userIcon = document.getElementById("userIcon");
                    userIcon.textContent = firstLetter;
                }
            });
            
            document.getElementById("navLoginSignup").style.display = "none"; // Hide login/signup button
            document.getElementById("navLogout").style.display = "block"; // Show Logout button

            // Check user role and show admin options if applicable
            checkUserRole(user.uid);
        } else {
            // If email is not verified, log out the user and show alert
            signOut(auth).then(() => {
                alert("Please verify your email to log in.");
            });
        }

    } else {
        // User is signed out.
        document.getElementById("navLoginSignup").style.display = "block"; // Show login/signup button
        document.getElementById("navLogout").style.display = "none"; // Hide Logout button
        document.getElementById("userIcon").textContent = ''; // Clear icon letter
        document.getElementById("dropdownMenu").style.display = "none"; // Hide dropdown
    }
});

// Function to check user role and display admin options
function checkUserRole(uid) {
    get(child(ref(db), 'users/' + uid)).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const dropdownMenu = document.getElementById("dropdownMenu");
            if (userData.role === 'admin') {
                // Add option to view all donations and make another user an admin
                dropdownMenu.innerHTML += `
                    <a href="#" id="viewDonations">View All Donations</a>
                    <a href="#" id="makeAdmin">Make Another User Admin</a>
                `;
                // Attach click event for view donations
                document.getElementById("logoutBtn").onclick = logout;
                document.getElementById("makeAdmin").onclick = promptMakeAdmin;
                // Attach click event for making another user admin
            }
            else {
                document.getElementById("logoutBtn").onclick = logout;
            }
        }
    }).catch((error) => {
        alert("Failed to check user role: " + error.message);
    });
}



// Function to view donations (placeholder, implement as needed)
function viewDonations() {
    alert("Viewing all donations... (implement this functionality)");
}

// Function to prompt for making another user admin
function promptMakeAdmin() {
    const email = prompt("Enter the email of the user to make admin:");
    if (email) {
        makeUserAdmin(email);
    }
}

// Function to make a user admin by updating their role in the database
function makeUserAdmin(email) {
    // Find the user in the database based on email
    get(ref(db, 'users')).then((snapshot) => {
        if (snapshot.exists()) {
            let userFound = false;

            // Loop through users to find matching email
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.email === email) {
                    const userId = childSnapshot.key;

                    // Update the user's role to 'admin'
                    set(ref(db, 'users/' + userId + '/role'), 'admin')
                        .then(() => {
                            alert(`User with email ${email} has been made an admin.`);
                        })
                        .catch((error) => {
                            alert(`Failed to make the user an admin: ${error.message}`);
                        });

                    userFound = true;
                }
            });

            if (!userFound) {
                alert("User not found with the provided email.");
            }
        } else {
            alert("No users found in the database.");
        }
    }).catch((error) => {
        alert("Error fetching users: " + error.message);
    });
}
// Toggle dropdown visibility
const userIcon = document.getElementById("userIcon");
userIcon.onclick = function() {
    const dropdownMenu = document.getElementById("dropdownMenu");
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block"; // Toggle dropdown
}

// Hide dropdown on clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.circle-icon') && !event.target.matches('.dropdown-content a')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].style.display = "none"; // Hide dropdown if clicked outside
        }
    }
};

// Handle Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('header nav');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Wait for the DOM to load before applying event listener
document.addEventListener("DOMContentLoaded", function() {
    var startButton = document.getElementById("startWithLittleBtn");

    if (startButton) {
        startButton.addEventListener("click", function() {
            // Redirect to the donation page
            window.location.href = "donate.html";
        });
    }

    var donateButtons = document.querySelectorAll(".donateNowBtn");
    console.log("Donate buttons found: ", donateButtons.length);

    donateButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            console.log("Donate Now button clicked!");
            window.location.href = "donate.html";
        });
    });
});
