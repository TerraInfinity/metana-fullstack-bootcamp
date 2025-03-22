import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import ProfileComponent from './ProfileComponent';

/**
 * ProfileManager component is responsible for managing user profile data.
 * It allows users to view, edit, and update their profile information.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.user - The user object containing user details
 * @param {Function} props.onUpdate - Callback function to update user data in the parent component
 */
function ProfileManager({ user, onUpdate }) {
    const { token } = useContext(AuthContext); // Retrieve the authentication token from context
    const [initialData, setInitialData] = useState({}); // Store initial user data for potential reset
    const [isEditing, setIsEditing] = useState(false); // Flag to indicate if the profile is currently being edited
    
    // State variables for user profile fields
    const [name, setName] = useState(user.name || ''); // User's name
    const [email, setEmail] = useState(user.email || ''); // User's email
    const [bio, setBio] = useState(user.bio || ''); // User's bio
    const [socialLinks, setSocialLinks] = useState(user.socialLinks || {}); // User's social links
    const [age, setAge] = useState(user.age || ''); // User's age
    const [gender, setGender] = useState(user.gender || ''); // User's gender
    const [orientation, setOrientation] = useState(user.orientation || ''); // User's orientation
    const [pronouns, setPronouns] = useState(user.pronouns || ''); // User's pronouns
    const [currentPassword, setCurrentPassword] = useState(''); // Current password for validation
    const [newPassword, setNewPassword] = useState(''); // New password input for updates
    const [confirmNewPassword, setConfirmNewPassword] = useState(''); // Confirm new password input
    const [isValid, setIsValid] = useState(true); // Validation state for form submission
    const [updateError, setUpdateError] = useState(''); // Error message for failed updates
    const [updateSuccess, setUpdateSuccess] = useState(''); // Success message for successful updates

    const backendUrl = `${process.env.REACT_APP_BACKEND_ORIGIN}:${process.env.REACT_APP_BACKEND_PORT}`; // Construct backend API URL

    useEffect(() => {
        // Fetch user profile data from the backend when the component mounts
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }, // Include authorization token in the request
                });
                const data = response.data;
                // Update state with fetched data
                setName(data.name || '');
                setEmail(data.email || '');
                setBio(data.bio || '');
                setSocialLinks(data.socialLinks || {});
                setAge(data.age || '');
                setGender(data.gender || '');
                setOrientation(data.orientation || '');
                setPronouns(data.pronouns || '');
                setInitialData(data); // Store the full data object for potential reset
            } catch (error) {
                console.error('Error fetching profile:', error); // Log any errors encountered during fetch
            }
        };
        fetchProfile();
    }, [token]); // Dependency array ensures this runs once when the component mounts

    /**
     * Handles form submission for updating the user profile.
     * Validates input and sends a PUT request to update the profile.
     *
     * @param {Event} e - The form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior to handle it manually
        if (!isValid) return; // Prevent submission if the form is not valid

        // Construct the profile data object to be sent to the server
        const profileData = {
            name,
            bio,
            socialLinks,
            age,
            gender,
            orientation,
            pronouns,
        };

        // Only include email in the request if the user provider is local
        if (user.provider === 'local') {
            profileData.email = email; // Include email for local users
            
            // Include password fields if the user is changing their password
            if (newPassword && currentPassword) {
                profileData.currentPassword = currentPassword; // Current password for validation
                profileData.password = newPassword; // New password to be set
            }
        }

        try {
            // Log the data being submitted for debugging purposes
            console.log('Submitting profile update with data:', JSON.stringify(profileData, null, 2));
            
            // Send a PUT request to update the user profile on the server
            const response = await axios.put(
                `${backendUrl}/api/users/profile`,
                profileData,
                {
                    headers: {
                        'Content-Type': 'application/json', // Specify content type for the request
                        Authorization: `Bearer ${token}`, // Include authorization token for authentication
                    },
                }
            );
            // Log successful update response for debugging
            console.log('Profile update successful:', response.data);
            
            // Update local state with the response data to reflect changes in the UI
            setName(response.data.name);
            setBio(response.data.bio || '');
            setEmail(response.data.email || '');
            setSocialLinks(response.data.socialLinks || {});
            setAge(response.data.age || '');
            setGender(response.data.gender || '');
            setOrientation(response.data.orientation || '');
            setPronouns(response.data.pronouns || '');
            setInitialData(response.data); // Update initial data with the latest response
            
            // Set success message to inform the user of the successful update
            setUpdateSuccess('Profile updated successfully');
            setUpdateError(''); // Clear any previous error messages
            setIsEditing(false); // Exit editing mode
            
            // Pass updated user data to the parent component for further processing
            const updatedUser = {
                ...user,
                ...response.data // Merge existing user data with updated data
            };
            onUpdate(updatedUser); // Call the onUpdate callback with the updated user data
            
            // Reset password fields to clear sensitive information
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            // Log any errors encountered during the update process for debugging
            console.error('Error updating profile:', {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : 'No response data',
            });
            // Set error message to inform the user of the failure
            setUpdateError(error.response?.data?.message || 'An error occurred while updating the profile');
            setUpdateSuccess(''); // Clear success message on error
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
            {/* ProfileComponent is responsible for rendering the profile fields and handling user input */}
            <ProfileComponent
                user={user} // Pass the user object to the ProfileComponent
                isEditing={isEditing} // Flag to indicate if the profile is in editing mode
                name={name} // User's name
                setName={setName} // Function to update the name state
                email={email} // User's email
                setEmail={setEmail} // Function to update the email state
                bio={bio} // User's bio
                setBio={setBio} // Function to update the bio state
                socialLinks={socialLinks} // User's social links
                setSocialLinks={setSocialLinks} // Function to update the social links state
                currentPassword={currentPassword} // Current password for validation
                setCurrentPassword={setCurrentPassword} // Function to update the current password state
                newPassword={newPassword} // New password input for updates
                setNewPassword={setNewPassword} // Function to update the new password state
                confirmNewPassword={confirmNewPassword} // Confirm new password input
                setConfirmNewPassword={setConfirmNewPassword} // Function to update the confirm new password state
                onValidationChange={setIsValid} // Callback to validate form inputs and update isValid state
                onEdit={() => setIsEditing(true)} // Function to enable editing mode
                onCancel={() => {
                    // Reset fields to initial data on cancel
                    setName(initialData.name || ''); // Reset name to initial value
                    setEmail(initialData.email || ''); // Reset email to initial value
                    setBio(initialData.bio || ''); // Reset bio to initial value
                    setSocialLinks(initialData.socialLinks || {}); // Reset social links to initial value
                    setAge(initialData.age || ''); // Reset age to initial value
                    setGender(initialData.gender || ''); // Reset gender to initial value
                    setOrientation(initialData.orientation || ''); // Reset orientation to initial value
                    setPronouns(initialData.pronouns || ''); // Reset pronouns to initial value
                    setCurrentPassword(''); // Clear current password field
                    setNewPassword(''); // Clear new password field
                    setConfirmNewPassword(''); // Clear confirm new password field
                    setIsEditing(false); // Exit editing mode
                }}
                age={age} // User's age
                setAge={setAge} // Function to update the age state
                gender={gender} // User's gender
                setGender={setGender} // Function to update the gender state
                orientation={orientation} // User's orientation
                setOrientation={setOrientation} // Function to update the orientation state
                pronouns={pronouns} // User's pronouns
                setPronouns={setPronouns} // Function to update the pronouns state
            />
            {isEditing && ( // Conditional rendering for editing mode
                <>
                    {updateError && <p className="text-red-500">{updateError}</p>} {/* Display error message if present */}
                    {updateSuccess && <p className="text-green-500">{updateSuccess}</p>} {/* Display success message if present */}
                    <button
                        type="submit" // Submit button for the form
                        disabled={!isValid} // Disable button if form is not valid
                        className={`w-full p-2 rounded text-white hover:bg-blue-700 ${
                            isValid ? 'bg-blue-600' : 'bg-gray-600 opacity-50 cursor-not-allowed'
                        }`}
                    >
                        Update Profile {/* Button text */}
                    </button>
                </>
            )}
        </form>
    );
}

export default ProfileManager;