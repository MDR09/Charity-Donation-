// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, get, set, child } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGMUO9YFJnO-F6QhtqJyisDZleHQvgygY",
    authDomain: "charity-78b81.firebaseapp.com",
    projectId: "charity-78b81",
    storageBucket: "charity-78b81.appspot.com",
    messagingSenderId: "351871288311",
    appId: "1:351871288311:web:057d6d5a4575d67ba524f2",
    measurementId: "G-2TM815MBN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Reference to Firebase Database
const db = getDatabase(app);
const auth = getAuth(app);



 // Get references to the login/signup modal and buttons
const loginSignupModal = document.getElementById("loginSignupModal");
const submitDonate = document.getElementById("submitDonate");
const loginButton = document.getElementById("loginButton");

// Check login state on page load
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

// Handle login synchronization for donations
document.getElementById('submitDonate').addEventListener('click', function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        // Show login/signup modal if not logged in
        document.getElementById('loginSignupModal').style.display = 'block';
    } else {
        // Proceed with donation form if logged in
        document.getElementById('formContainer').style.display = 'block';
    }
});

function logoutUser() {
    console.log("Logout function called."); // Debug log
    // Clear login state in localStorage
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("loggedInUser"); // If you store user details
    isLoggedIn = false; // Update the global variable
    
    // Update the UI
    document.getElementById('loginButton').textContent = 'Login';
    document.getElementById('loginButton').classList.remove('active');

    alert("You have been logged out.");
}

// Handle login button click
loginButton.addEventListener("click", function() {
    console.log("Login button clicked."); // Debug log
    if (isLoggedIn) { // Use the global variable
        logoutUser(); // Call the logout function
    } else {
        // Show login modal or redirect to login
        loginSignupModal.style.display = 'block';
    }
});

// Update UI on page load
document.addEventListener("DOMContentLoaded", function() {
    if (isLoggedIn) {
        loginButton.textContent = "Logout"; // Change to 'Logout' if logged in
        loginButton.classList.add("active"); // Add active class
    } else {
        loginButton.textContent = "Login"; // Show 'Login' if logged out
        loginButton.classList.remove("active");
    }
});


// Function to check login status before allowing donation
submitDonate.addEventListener("click", function() {
    if (isLoggedIn) {
        // Proceed to the donation form if the user is logged in
        document.getElementById('formContainer').style.display = 'block';
    } else {
        // Show login/signup modal if not logged in
        loginSignupModal.style.display = 'block';
    }
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('submitLogin').addEventListener('click', function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (email === "" || password === "") {
            alert("Please enter both email and password.");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // Check if the email is verified
                if (!user.emailVerified) {
                    alert("Please verify your email before logging in.");
                    return;
                }

                alert("Login successful!");
                document.getElementById('loginEmail').value = '';
                document.getElementById('loginPassword').value = '';

                // Save login state and user information to localStorage
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("loggedInUser", JSON.stringify(user)); // Store user details if needed

                // Update UI after successful login
                isLoggedIn = true; // Update login status
                loginButton.textContent = "Logout"; // Change button text to 'Logout'
                loginButton.classList.add("active"); // Add active class
                loginSignupModal.style.display = 'none'; // Close the modal

            })
            .catch((error) => {
                // Handle authentication errors
                alert("Login failed: " + error.message);
            });
    });
});

// Add event listener for Sign Up button
document.getElementById('submitSignup').addEventListener('click', function(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

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
                    document.getElementById('signupName').value = '';
                    document.getElementById('signupEmail').value = '';
                    document.getElementById('signupPassword').value = ''; // Reset form

                    return set(ref(db, 'users/' + user.uid), {
                        username: name,
                        email: email
                    });
                })
                .catch((error) => {
                    alert('Error while sending verification email: ' + error.message);
                });
        })
        .catch((error) => {
            alert('Sign up failed: ' + error.message);
            document.getElementById('signupName').value = '';
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPassword').value = '';

        });
});

// Logic to handle modal close
const closeModal = document.getElementsByClassName("close")[0];
closeModal.onclick = function() {
    loginSignupModal.style.display = "none";
};

// Add the same form toggle logic for signup and login switch
document.getElementById("signupLink").addEventListener("click", function() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
});

document.getElementById("loginLink").addEventListener("click", function() {
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
});

// Update UI on page load based on login state
if (isLoggedIn) {
    loginButton.textContent = "Logout"; // Change to 'Logout' if logged in
    loginButton.classList.add("active"); // Add active class
}

// Function to handle donation amount submission
document.getElementById("submitDonate").addEventListener("click", function() {
    const customAmountInput = document.getElementById("customAmount");
    const errorMessage = document.getElementById("errorMessage");
    const amountSelected = document.querySelector('input[name="amount"]:checked');
    
    // Reset error message
    errorMessage.textContent = '';
    
    // Get the custom amount or selected radio button value
    const customAmount = parseFloat(customAmountInput.value);
    const selectedAmount = amountSelected ? parseFloat(amountSelected.value) : 0;
    const donationAmount = customAmount || selectedAmount;

    // Validate the donation amount
    if (isNaN(donationAmount) || donationAmount <= 0) {
        errorMessage.textContent = "Please enter a valid donation amount.";
        customAmountInput.focus();
        document.getElementById("formContainer").style.display = "none";
        document.getElementById("donationOptions").style.display = "block"; 
        return; // Prevent further action
    }

    if (donationAmount < 500) {
        errorMessage.textContent = "The minimum donation amount is ₹500.";
        customAmountInput.focus();

        // Hide form container and ensure donation options are still visible
        document.getElementById("formContainer").style.display = "none";
        document.getElementById("donationOptions").style.display = "block"; 
        return; // Prevent further action
    }

    // If amount is valid and meets the minimum, proceed with showing the form
    document.getElementById('donationOptions').style.display = 'none';
    document.getElementById("formContainer").style.display = "block";
});
// db.ref('donations').push(donationData)  // Change from 'database' to 'db'
//     .then(() => {
//         alert('Donation data saved successfully!');
//         // Optionally, you can redirect to a different page or reset the form here
//     })
//     .catch((error) => {
//         console.error('Error saving donation data:', error);
//     });

// Updated form submission code
document.getElementById('formContainer').querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const formData = {
        name: document.querySelector('input[type="text"]').value,
        email: document.querySelector('input[type="email"]').value,
        phone: document.querySelector('input[type="tel"]').value,
        dob: document.getElementById('dob').value,
        city: document.querySelector('input[placeholder="City"]').value,
        pinCode: document.querySelector('input[placeholder="Pin Code"]').value,
        address: document.querySelector('input[placeholder="Address"]').value,
        date: new Date().toISOString()
    };

    // Validate form fields
    if (!formData.name || !formData.email || !formData.phone) {
        alert('Please fill in all required fields.');
        return;
    }

    // Save form data to Firebase
    set(ref(db, 'formSubmissions'), formData)
        .then(() => {
            alert('Form data saved successfully!');

            // Now proceed to save donation data after form submission is successful
            saveDonationData();
            this.reset(); // Reset the form
        })
        .catch((error) => {
            console.error('Error saving form data:', error);
            alert('There was an error submitting the form. Please try again.');
        });
});

// Function to save donation data only after successful form submission
function saveDonationData() {
    const selectedAmount = document.querySelector('input[name="amount"]:checked');
    const customAmount = document.getElementById('customAmount').value;
    const amount = selectedAmount ? selectedAmount.value : customAmount;

    if (!amount) {
        document.getElementById('errorMessage').innerText = "Please select or enter an amount.";
        return;
    }

    const donationData = {
        amount: amount,
        date: new Date().toISOString()
    };

    // Save donation data to Firebase
    set(ref(db, 'donations'), donationData)
        .then(() => {
            alert('Donation data saved successfully!');
            // Optionally, you can redirect to a different page or reset the donation form here
        })
        .catch((error) => {
            console.error('Error saving donation data:', error);
            alert('There was an error saving the donation. Please try again.');
        });
}



