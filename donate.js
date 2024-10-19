 // Import Firebase functions
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
 import { getDatabase, ref, get, set, child } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
 import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
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


// // Check login state on page load
// let isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; 

// // Get references to the login/signup modal and buttons
// const loginSignupModal = document.getElementById("loginSignupModal");
// const submitDonate = document.getElementById("submitDonate");

// // Handle login button click
// const loginButton = document.getElementById("loginButton");
// loginButton.addEventListener("click", function() {
//     if (isLoggedIn) {
//         // If already logged in, log out
//         isLoggedIn = false;
//         localStorage.setItem("isLoggedIn", "false"); // Update local storage
//         loginButton.textContent = "Login"; // Change text back to 'Login'
//         loginButton.classList.remove("active"); // Remove active class
//         alert("You have been logged out.");
//     } else {
//         // Show login/signup modal if not logged in
//         loginSignupModal.style.display = 'block';
//     }
// });

// // Function to check login status before allowing donation
// submitDonate.addEventListener("click", function() {
//     if (isLoggedIn) {
//         // Proceed to the donation form if the user is logged in
//         document.getElementById('formContainer').style.display = 'block';
//     } else {
//         // Show login/signup modal if not logged in
//         loginSignupModal.style.display = 'block';
//     }
// });

// // Logic to handle login/signup process
// document.getElementById("submitLogin").addEventListener("click", function() {
//     // Mock login logic
//     isLoggedIn = true;
//     localStorage.setItem("isLoggedIn", "true"); // Store login state in local storage
//     loginSignupModal.style.display = 'none'; // Close modal after login
//     alert("You are now logged in. You can donate now.");

//     // Change the login button to a logout button and activate it
//     loginButton.textContent = "Logout";
//     loginButton.classList.add("active");
// });

// // Logic to handle modal close
// const closeModal = document.getElementsByClassName("close")[0];
// closeModal.onclick = function() {
//     loginSignupModal.style.display = "none";
// };

// // Add the same form toggle logic for signup and login switch
// document.getElementById("signupLink").addEventListener("click", function() {
//     document.getElementById("loginForm").style.display = "none";
//     document.getElementById("signupForm").style.display = "block";
// });

// document.getElementById("loginLink").addEventListener("click", function() {
//     document.getElementById("signupForm").style.display = "none";
//     document.getElementById("loginForm").style.display = "block";
// });

// // Update UI on page load based on login state
// if (isLoggedIn) {
//     loginButton.textContent = "Logout"; // Change to 'Logout' if logged in
//     loginButton.classList.add("active"); // Add active class
// }

// // Function to handle donation amount submission
// document.getElementById("submitDonate").addEventListener("click", function() {
//     const customAmountInput = document.getElementById("customAmount");
//     const errorMessage = document.getElementById("errorMessage");
//     const amountSelected = document.querySelector('input[name="amount"]:checked');
    
//     // Reset error message
//     errorMessage.textContent = '';
    
//     // Get the custom amount or selected radio button value
//     const customAmount = parseFloat(customAmountInput.value);
//     const selectedAmount = amountSelected ? parseFloat(amountSelected.value) : 0;
//     const donationAmount = customAmount || selectedAmount;

//     // Validate the donation amount
//     if (isNaN(donationAmount) || donationAmount <= 0) {
//         errorMessage.textContent = "Please enter a valid donation amount.";
//         customAmountInput.focus();
//         return; // Prevent further action
//     }

//     if (donationAmount < 500) {
//         errorMessage.textContent = "The minimum donation amount is ₹500.";
//         customAmountInput.focus();

//         // Hide form container and ensure donation options are still visible
//         document.getElementById("formContainer").style.display = "none";
//         document.getElementById("donationOptions").style.display = "block"; 
//         return; // Prevent further action
//     }

//     // If amount is valid and meets the minimum, proceed with showing the form
//     document.getElementById('donationOptions').style.display = 'none';
//     document.getElementById("formContainer").style.display = "block";
// });

// function showForm() {
//     document.getElementById('donationOptions').style.display = 'none'; // Hide the donation options
//     document.getElementById('formContainer').style.display = 'block'; // Show the new form container
// }

// function goBack() {
//     document.getElementById('donationOptions').style.display = 'block'; // Show the donation options
//     document.getElementById('formContainer').style.display = 'none'; // Hide the new form container
// }


// Check login state on page load
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; 

// Get references to the login/signup modal and buttons
const loginSignupModal = document.getElementById("loginSignupModal");
const submitDonate = document.getElementById("submitDonate");
const loginButton = document.getElementById("loginButton");

// Handle login button click
loginButton.addEventListener("click", function() {
    if (isLoggedIn) {
        // If already logged in, log out
        isLoggedIn = false;
        localStorage.setItem("isLoggedIn", "false"); // Update local storage
        loginButton.textContent = "Login"; // Change text back to 'Login'
        loginButton.classList.remove("active"); // Remove active class
        alert("You have been logged out.");
    } else {
        // Show login/signup modal if not logged in
        loginSignupModal.style.display = 'block';
    }
});

//Handle Login
document.getElementById('submitLogin').addEventListener('click', function(e) {
    e.preventDefault();
    
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    // Reference the database
    const dbRef = ref(db);

    // Check if user exists
    get(child(dbRef, `users/`)).then((snapshot) => {
        if (snapshot.exists()) {
            let userExists = false;

            // Loop through all the users in the database
            snapshot.forEach(function(childSnapshot) {
                const user = childSnapshot.val();
                // Check if email and password match
                if (user.email === loginEmail && user.password === loginPassword) {
                    userExists = true;
                    alert("Login successful!");
                    // modal.style.display = 'none'; // Close modal
                    // document.getElementById("navLoginSignup").style.display = "none"; // Hide login/signup button
                    // //document.getElementById("navMyDonation").style.display = "block"; // Show My Donations link
                    // document.getElementById("navLogout").style.display = "block";
                }
            });

            if (!userExists) {
                alert("Invalid email or password. Please try again or sign up first.");
            }
        } else {
            alert("No users found. Please sign up first.");
        }
    }).catch((error) => {
        alert("Error checking database: " + error.message);
    });
});

function updateLoginLogoutButton(isLoggedIn) {
    const loginButton = document.getElementById('submitLogin'); // The login button
    const logoutButton = document.createElement('button'); // Create a new logout button

    logoutButton.textContent = 'Logout'; // Set button text
    logoutButton.id = 'logoutButton'; // Set button ID
    logoutButton.addEventListener('click', function() {
        // Handle logout functionality here
        localStorage.removeItem('userLoggedIn'); // Remove login status
        updateLoginLogoutButton(false); // Update the button to show login again
        alert("You have been logged out."); // Alert user
    });

    if (isLoggedIn) {
        // Replace login button with logout button
        loginButton.parentNode.replaceChild(logoutButton, loginButton);
    } else {
        // If logged out, ensure the login button is present
        if (!document.getElementById('submitLogin')) {
            document.getElementById('loginContainer').appendChild(loginButton); // Make sure to append it back
        }
    }
}

// Add event listener for Sign Up button
document.getElementById('submitSignup').addEventListener('click', function(e) {
    e.preventDefault();

    // Get the values from the signup form
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Validate if fields are not empty
    if (name === "" || email === "" || password === "") {
        alert("All fields are required!");
        return;
    }

    const userRef = ref(db, 'users/' + name);

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            alert("This username is already taken. Please choose a different one.");
        } else {
            // Store the signup details in Firebase Realtime Database
            set(userRef, {
                username: name,
                email: email,
                password: password
            }).then(() => {
                alert('Sign up successful!');
            }).catch((error) => {
                alert('Error: ' + error.message);
            });
        }
    }).catch((error) => {
        alert('Error: ' + error.message);
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

    // // Check if the user is logged in
    // const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true'; // Function to check login status (implement this based on your app logic)

    // if (!isLoggedIn) {
    //     // Show the login box if user is not logged in
    //     document.getElementById("loginBox").style.display = "block"; // Ensure to show the login box
    //     document.getElementById("formContainer").style.display = "none"; // Hide the form container
    //     document.getElementById("donationOptions").style.display = "none"; // Hide donation options
    //     return; // Prevent further action
    // }

    // If amount is valid and meets the minimum, proceed with showing the form
    document.getElementById('donationOptions').style.display = 'none';
    document.getElementById("formContainer").style.display = "block";
});

function showForm() {
    document.getElementById('donationOptions').style.display = 'none'; // Hide the donation options
    document.getElementById('formContainer').style.display = 'block'; // Show the new form container
}

function goBack() {
    document.getElementById('donationOptions').style.display = 'block'; // Show the donation options
    document.getElementById('formContainer').style.display = 'none'; // Hide the new form container
}