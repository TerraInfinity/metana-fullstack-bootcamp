import React, { useState, useEffect } from 'react';
import ProfileComponent from './ProfileComponent';

function ProfileManager({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || '');
  const [socialLinks, setSocialLinks] = useState(user.socialLinks || {
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: '',
    website: '',
  });
  const [isValid, setIsValid] = useState(true);
  const [userState, setUserState] = useState(user);

  // Reset form fields when exiting edit mode or user prop changes
  useEffect(() => {
    if (!isEditing) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio || '');
      setSocialLinks(user.socialLinks || {
        twitter: '',
        instagram: '',
        linkedin: '',
        facebook: '',
        website: '',
      });
      setUserState(user);
    }
  }, [isEditing, user]);

  const handleAvatarChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserState((prevUser) => ({ ...prevUser, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return; // Extra safety, though button is disabled when invalid
    const formData = { name, email, bio, socialLinks, avatar: userState.avatar };
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <ProfileComponent
        user={userState}
        isEditing={isEditing}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        bio={bio}
        setBio={setBio}
        socialLinks={socialLinks}
        setSocialLinks={setSocialLinks}
        onValidationChange={setIsValid}
        onEdit={() => setIsEditing(true)}
        onCancel={() => setIsEditing(false)}
        onAvatarChange={handleAvatarChange}
      />
      {isEditing && (
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full p-2 rounded text-white hover:bg-blue-700 ${
            isValid ? 'bg-blue-600' : 'bg-gray-600 opacity-50 cursor-not-allowed'
          }`}
        >
          Update Profile
        </button>
      )}
    </form>
  );
}

export default ProfileManager;