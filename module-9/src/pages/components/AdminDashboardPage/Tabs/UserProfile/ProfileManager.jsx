import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import ProfileComponent from './ProfileComponent';

function ProfileManager({ user, onUpdate }) {
    const { token } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [bio, setBio] = useState(user.bio || '');
    const [socialLinks, setSocialLinks] = useState(user.socialLinks || {});
    const [age, setAge] = useState(user.age || '');
    const [gender, setGender] = useState(user.gender || '');
    const [orientation, setOrientation] = useState(user.orientation || '');
    const [pronouns, setPronouns] = useState(user.pronouns || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [updateError, setUpdateError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState('');

    const backendUrl = `${process.env.REACT_APP_BACKEND_ORIGIN}:${process.env.REACT_APP_BACKEND_PORT}`;

    useEffect(() => {
        if (!isEditing) {
            setName(user.name);
            setEmail(user.email);
            setBio(user.bio || '');
            setSocialLinks(user.socialLinks || {});
            setAge(user.age || '');
            setGender(user.gender || '');
            setOrientation(user.orientation || '');
            setPronouns(user.pronouns || '');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        }
    }, [isEditing, user]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!isValid) return;
  
      const profileData = {
          name,
          bio,
          socialLinks,
          age,
          gender,
          orientation,
          pronouns,
      };
  
      // Only include email in the request if the provider is local
      if (user.provider === 'local') {
          profileData.email = email;
          
          // Include password fields if changing password
          if (newPassword && currentPassword) {
              profileData.currentPassword = currentPassword;
              profileData.password = newPassword;
          }
      }
  
      try {
          console.log('Submitting profile update with data:', JSON.stringify(profileData, null, 2));
          const response = await axios.put(
              `${backendUrl}/api/users/profile`,
              profileData,
              {
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                  },
              }
          );
          console.log('Profile update successful:', response.data);
          
          // Update local state with response data
          setName(response.data.name);
          setBio(response.data.bio || '');
          setSocialLinks(response.data.socialLinks || {});
          setAge(response.data.age || '');
          setGender(response.data.gender || '');
          setOrientation(response.data.orientation || '');
          setPronouns(response.data.pronouns || '');
          
          setUpdateSuccess('Profile updated successfully');
          setUpdateError('');
          setIsEditing(false);
          
          // Pass updated user data to parent component
          const updatedUser = {
            ...user,
            ...response.data
          };
          onUpdate(updatedUser);
          
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
      } catch (error) {
          console.error('Error updating profile:', {
              message: error.message,
              response: error.response ? {
                  status: error.response.status,
                  data: error.response.data,
              } : 'No response data',
          });
          setUpdateError(error.response?.data?.message || 'An error occurred while updating the profile');
          setUpdateSuccess('');
      }
  };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
            <ProfileComponent
                user={user}
                isEditing={isEditing}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                bio={bio}
                setBio={setBio}
                socialLinks={socialLinks}
                setSocialLinks={setSocialLinks}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmNewPassword={confirmNewPassword}
                setConfirmNewPassword={setConfirmNewPassword}
                onValidationChange={setIsValid}
                onEdit={() => setIsEditing(true)}
                onCancel={() => setIsEditing(false)}
                age={age}
                setAge={setAge}
                gender={gender}
                setGender={setGender}
                orientation={orientation}
                setOrientation={setOrientation}
                pronouns={pronouns}
                setPronouns={setPronouns}
            />
            {isEditing && (
                <>
                    {updateError && <p className="text-red-500">{updateError}</p>}
                    {updateSuccess && <p className="text-green-500">{updateSuccess}</p>}
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`w-full p-2 rounded text-white hover:bg-blue-700 ${
                            isValid ? 'bg-blue-600' : 'bg-gray-600 opacity-50 cursor-not-allowed'
                        }`}
                    >
                        Update Profile
                    </button>
                </>
            )}
        </form>
    );
}

export default ProfileManager;