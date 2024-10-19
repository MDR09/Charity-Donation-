// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, get, update, remove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

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
const storage = getStorage(app);

// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.getElementById('profileImage');
    const profileInitials = document.getElementById('profileInitials');
    const accountName = document.getElementById('accountName');
    const accountEmail = document.getElementById('accountEmail');
    const accountRole = document.getElementById('accountRole');
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const uploadPhoto = document.getElementById('uploadPhoto');
    const editDetailsBtn = document.getElementById('editDetailsBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');

    // Fetch and display user details
    function fetchUserDetails() {
        const user = auth.currentUser;
        if (user) {
            const userRef = ref(db, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    accountName.textContent = userData.username;
                    accountEmail.textContent = userData.email;
                    accountRole.textContent = userData.role;

                    // Check for profile photo URL
                    if (userData.photoURL) {
                        profileImage.src = userData.photoURL;
                        profileImage.style.display = 'block';
                        profileInitials.style.display = 'none';
                    } else {
                        profileInitials.textContent = userData.username.charAt(0).toUpperCase();
                        profileInitials.style.display = 'flex';
                        profileImage.style.display = 'none';
                    }
                } else {
                    console.error("No user data available.");
                }
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        }
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            fetchUserDetails(); // Fetch user details when the user is authenticated
        } else {
            // User is signed out
            window.location.href = 'login.html'; // Redirect to login page
        }
    });

    // Change Photo button click event
    uploadPhotoBtn.addEventListener('click', () => {
        alert("Edit functionality is not implemented yet.");
    });

    // Handle photo upload
    uploadPhoto.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const userRef = ref(db, 'users/' + auth.currentUser.uid);
            const storageReference = storageRef(storage, 'profile_photos/' + auth.currentUser.uid);

            // Upload file to Firebase Storage
            uploadBytes(storageReference, file).then(() => {
                // Get download URL and update user data
                getDownloadURL(storageReference).then((downloadURL) => {
                    update(userRef, { photoURL: downloadURL }).then(() => {
                        profileImage.src = downloadURL;
                        profileImage.style.display = 'block';
                        profileInitials.style.display = 'none';
                    }).catch((error) => {
                        console.error("Error updating user data:", error);
                    });
                }).catch((error) => {
                    console.error("Error getting download URL:", error);
                });
            }).catch((error) => {
                console.error("Error uploading file:", error);
            });
        }
    });

    // Inline Editing Functionality
    document.querySelectorAll('.editable').forEach(element => {
        element.addEventListener('click', function () {
            const currentText = element.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            element.textContent = ''; // Clear the existing text
            element.appendChild(input);
            input.focus();

            // Handle input blur
            input.addEventListener('blur', () => {
                const newValue = input.value.trim();
                if (element.id === 'accountEmail' && newValue !== currentText) {
                    alert("Please verify your email before changing it.");
                    element.textContent = currentText; // Revert to original email
                } else {
                    updateAccountDetails(element.id, newValue);
                }
            });

            // Handle enter key to save changes
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    input.blur(); // Trigger blur event to save changes
                }
            });
        });
    });

    // Function to update user details in the database
    function updateAccountDetails(field, value) {
        const updates = {};
        updates[field === 'accountName' ? 'username' : 'email'] = value;

        update(ref(db, 'users/' + auth.currentUser.uid), updates)
            .then(() => {
                alert("Account details updated successfully.");
                fetchUserDetails(); // Refresh user details to reflect changes
            })
            .catch((error) => {
                alert("Error updating user details: " + error.message);
            });
    }

    // Delete Account button click event
    deleteAccountBtn.addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
            const userRef = ref(db, 'users/' + user.uid);

            // Remove user data from the database
            remove(userRef).then(() => {
                // Delete the user from Firebase Authentication
                user.delete().then(() => {
                    alert("Account deleted successfully.");
                    auth.signOut().then(() => {
                        window.location.href = 'index.html'; // Redirect to login page
                    });
                }).catch((error) => {
                    console.error("Error deleting user from authentication:", error);
                });
            }).catch((error) => {
                console.error("Error deleting user data from database:", error);
            });
        }
    });
}); 
