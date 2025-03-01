/**
 * @file profileForm.js
 * @description Manages the profile form modal functionality, allowing logged-in users
 * to update their name, email, password, and profile photo. If the user is a guest,
 * clicking the user icon will instead open the login/register modal.
 */

import {
    isAuthenticated,
    getCurrentUserData,
    updateProfile
} from '/javascripts/auth-components/auth.js';
import {
    showLoginModal
} from '/javascripts/auth-components/loginAuthForm.js';

/**
 * Initializes the profile form by setting an event listener on the user icon.
 * If the user is logged in, the profile modal will be shown; otherwise, the login modal is opened.
 */
export function initializeProfileForm() {
    const userIcon = document.getElementById('user-icon-button');
    if (!userIcon) {
        console.error('User icon not found.');
        return;
    }

    userIcon.addEventListener('click', () => {
        if (!isAuthenticated()) {
            // For guest users, open the login/register modal
            showLoginModal();
        } else {
            // If logged in, display the profile form modal
            showProfileFormModal();
        }
    });
}

/**
 * Fetches the profile form HTML template and displays the modal.
 */
export function showProfileFormModal() {
    // Get the modal container or create it if it doesn't exist.
    let modalContainer = document.getElementById('profileModalContainer');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'profileModalContainer';
        document.body.appendChild(modalContainer);
    }

    fetch('/templates/auth-components/profileForm.hbs')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load profileForm');
            }
            return response.text();
        })
        .then(html => {
            modalContainer.innerHTML = html;
            setupProfileFormModal();
        })
        .catch(error => {
            console.error('Error loading profile form template:', error);
        });
}

/**
 * Sets up the profile form modal functionality:
 * - Displays the modal.
 * - Pre-populates fields with current user data.
 * - Handles file selection for the profile photo preview.
 * - Conditionally reveals password change fields.
 * - Attaches event listeners, including one to close the modal when clicking outside of it.
 */
async function setupProfileFormModal() {
    const modal = document.getElementById('profileModal');
    if (!modal) {
        console.error('Profile modal not found after loading template.');
        return;
    }
    // Make sure the modal itself is centered and visible.
    modal.style.display = "flex";

    // Pre-populate the form with current user data.
    const currentUser = await getCurrentUserData();
    if (currentUser) {
        document.getElementById('profile-name').value = currentUser.name || '';
        document.getElementById('profile-email').value = currentUser.email || '';
        const profilePhotoPreview = document.getElementById('profile-photo-preview');
        if (profilePhotoPreview) {
            profilePhotoPreview.src = currentUser.profilePhoto;
        }
    }

    // Setup file input for profile photo update.
    const profilePhotoPreviewContainer = document.getElementById('profile-photo-preview-container');
    const profilePhotoInput = document.getElementById('profile-photo');
    const profilePhotoPreview = document.getElementById('profile-photo-preview');

    if (profilePhotoPreviewContainer && profilePhotoInput && profilePhotoPreview) {
        profilePhotoPreviewContainer.addEventListener('click', () => {
            profilePhotoInput.click();
        });

        profilePhotoInput.addEventListener('change', () => {
            const file = profilePhotoInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePhotoPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Setup conditional reveal for Change Password fields.
    const toggleChangePassword = document.getElementById('toggle-change-password');
    const passwordChangeFields = document.getElementById('password-change-fields');

    if (toggleChangePassword && passwordChangeFields) {
        toggleChangePassword.addEventListener('click', () => {
            // Toggle display of the password fields.
            if (passwordChangeFields.style.display === "none" || passwordChangeFields.style.display === "") {
                passwordChangeFields.style.display = "block";
                toggleChangePassword.textContent = "Hide Password Fields";
            } else {
                passwordChangeFields.style.display = "none";
                toggleChangePassword.textContent = "Change Password";
            }
        });
    }

    // Setup show/hide password toggles using eye icons.
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    toggle.textContent = '🙈';
                } else {
                    input.type = 'password';
                    toggle.textContent = '👁';
                }
            }
        });
    });

    // Setup the close button functionality.
    const closeButton = document.getElementById('close-profile-form-modal');
    if (closeButton) {
        closeButton.addEventListener('click', closeProfileFormModal);
    }

    // ----- Click Outside Modal to Close -----
    // Instead of attaching a window click listener, we attach a listener on the modal container.
    // This container covers the viewport so clicks anywhere outside the modal content (profileModal)
    // will be detected.
    const modalContainer = document.getElementById('profileModalContainer');
    if (modalContainer) {
        modalContainer.addEventListener('click', function handler(event) {
            // If the clicked element is not inside the modal, close the modal.
            if (!modal.contains(event.target)) {
                closeProfileFormModal();
                // Optionally remove this handler to avoid duplicate events on subsequent opens.
                modalContainer.removeEventListener('click', handler);
            }
        });
    }

    // Handle form submission.
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.onsubmit = async(event) => {
            event.preventDefault();

            // Reset error messages.
            const resetError = id => {
                const el = document.getElementById(id);
                if (el) el.textContent = "";
            };
            resetError('profile-name-error');
            resetError('profile-email-error');
            resetError('current-password-error');
            resetError('new-password-error');
            resetError('confirm-new-password-error');
            resetError('profile-photo-error');

            // Gather basic fields.
            const updatedName = document.getElementById('profile-name').value.trim();
            const updatedEmail = document.getElementById('profile-email').value.trim();
            const profilePhotoFile = (profilePhotoInput.files && profilePhotoInput.files.length > 0) ?
                profilePhotoInput.files[0] : null;

            let formIsValid = true;
            if (!updatedName) {
                document.getElementById('profile-name-error').textContent = "Name is required.";
                formIsValid = false;
            }
            if (!updatedEmail) {
                document.getElementById('profile-email-error').textContent = "Email is required.";
                formIsValid = false;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(updatedEmail)) {
                    document.getElementById('profile-email-error').textContent = "Please enter a valid email.";
                    formIsValid = false;
                }
            }

            // Process password change if the change password section is visible.
            let newPasswordToSet = "";
            if (passwordChangeFields.style.display === "block") {
                const currentPassword = document.getElementById('current-password').value.trim();
                const newPassword = document.getElementById('new-password').value.trim();
                const confirmNewPassword = document.getElementById('confirm-new-password').value.trim();

                // Validate current password.
                if (!currentPassword) {
                    document.getElementById('current-password-error').textContent = "Current password is required.";
                    formIsValid = false;
                } else if (currentUser && currentPassword !== currentUser.password) {
                    document.getElementById('current-password-error').textContent = "Current password is incorrect.";
                    formIsValid = false;
                }
                // Validate new password.
                if (!newPassword) {
                    document.getElementById('new-password-error').textContent = "New password is required.";
                    formIsValid = false;
                } else if (newPassword.length < 8) {
                    document.getElementById('new-password-error').textContent = "Password must be at least 8 characters.";
                    formIsValid = false;
                }
                if (newPassword !== confirmNewPassword) {
                    document.getElementById('confirm-new-password-error').textContent = "Passwords do not match.";
                    formIsValid = false;
                }
                if (formIsValid) {
                    newPasswordToSet = newPassword;
                }
            }

            if (!formIsValid) return;

            try {
                // updateProfile (from auth.js) will update name, email, profile photo, and password (if provided).
                await updateProfile(updatedName, updatedEmail, newPasswordToSet, profilePhotoFile);
                console.info('Profile updated successfully.');
                closeProfileFormModal();
            } catch (error) {
                console.error('Error updating profile:', error);
                // Display a general error message to the user.
                document.getElementById('profile-email-error').textContent = error.message;
            }
        };
    } else {
        console.error('Profile form not found.');
    }
}

/**
 * Closes the profile form modal.
 */
function closeProfileFormModal() {
    const modalContainer = document.getElementById('profileModalContainer');
    if (modalContainer) {
        modalContainer.remove();
    }
}