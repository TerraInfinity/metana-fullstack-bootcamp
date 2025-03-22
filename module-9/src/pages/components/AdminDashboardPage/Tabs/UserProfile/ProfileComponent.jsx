import React, { useState, useEffect } from 'react';
import BioComponent from './BioComponent';
import ChangePasswordForm from './ChangePasswordForm';
import SocialBar from './SocialBar';
import AdditionalDetails from './AdditionalDetails';
import { FaInstagram, FaLinkedin, FaYoutube, FaFacebookF, FaGlobe, FaTumblr, FaSnapchatGhost, FaReddit, FaTwitch, FaGithub, FaDiscord } from 'react-icons/fa';
import { SiRumble, SiLinktree } from 'react-icons/si';
import { SlSocialSpotify, SlSocialSoundcloud, SlSocialSteam } from 'react-icons/sl';
import { FaPatreon, FaXTwitter } from 'react-icons/fa6';
import ProfileHeader from './ProfileHeader';

// Define social platforms with icons and valid domains (using consistent lowercase keys)
const socialPlatforms = [
  { key: 'website', label: 'Website', icon: FaGlobe, domains: null },
  { key: 'patreon', label: 'Patreon', icon: FaPatreon, domains: ['patreon.com'] },
  { key: 'discord', label: 'Discord', icon: FaDiscord, domains: ['discord.com'] },
  { key: 'linktree', label: 'Linktree', icon: SiLinktree, domains: ['linktr.ee'] },
  { key: 'x', label: 'X (Twitter)', icon: FaXTwitter, domains: ['twitter.com', 'x.com'] },
  { key: 'reddit', label: 'Reddit', icon: FaReddit, domains: ['reddit.com'] },
  { key: 'spotify', label: 'Spotify', icon: SlSocialSpotify, domains: ['spotify.com'] },
  { key: 'soundcloud', label: 'SoundCloud', icon: SlSocialSoundcloud, domains: ['soundcloud.com'] },
  { key: 'instagram', label: 'Instagram', icon: FaInstagram, domains: ['instagram.com'] },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube, domains: ['youtube.com'] },
  { key: 'omniflix', label: 'Omniflix', icon: '/assets/images/omniflixIcon.jpg', isImage: true, domains: ['omniflix.tv'] },
  { key: 'rumble', label: 'Rumble', icon: SiRumble, domains: ['rumble.com'] },
  { key: 'github', label: 'GitHub', icon: FaGithub, domains: ['github.com'] },
  { key: 'twitch', label: 'Twitch', icon: FaTwitch, domains: ['twitch.tv'] },
  { key: 'steam', label: 'Steam', icon: SlSocialSteam, domains: ['steamcommunity.com'] },
  { key: 'tumblr', label: 'Tumblr', icon: FaTumblr, domains: ['tumblr.com'] },
  { key: 'snapchat', label: 'Snapchat', icon: FaSnapchatGhost, domains: ['snapchat.com'] },
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, domains: ['linkedin.com'] },
  { key: 'facebook', label: 'Facebook', icon: FaFacebookF, domains: ['facebook.com'] },
];

function ProfileComponent({
  user,
  isEditing,
  name,
  setName,
  email,
  setEmail,
  bio,
  setBio,
  socialLinks,
  setSocialLinks,
  onValidationChange,
  onEdit,
  onCancel,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
}) {
  const [urlErrors, setUrlErrors] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedSocials, setSelectedSocials] = useState({});
  const [showAllIcons, setShowAllIcons] = useState(false);
  const [iconLimit, setIconLimit] = useState(7);

  const [age, setAge] = useState(user.age || '');
  const [gender, setGender] = useState(user.gender || '');
  const [orientation, setOrientation] = useState(user.orientation || '');
  const [pronouns, setPronouns] = useState(user.pronouns || '');

  useEffect(() => {
    validateForm();
  }, [name, email, bio, socialLinks, age, gender, orientation, pronouns, currentPassword, newPassword, confirmNewPassword]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIconLimit(6);
      } else {
        setIconLimit(7);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSocial = (key) => {
    setSelectedSocials((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const validateUrl = (url, domains) => {
    const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
    if (!url || !urlPattern.test(url)) return false;
    if (!domains) return true;
    const urlDomain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.toLowerCase();
    return domains.some((domain) => urlDomain === domain || urlDomain.endsWith(`.${domain}`));
  };


  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (user.provider === 'local') {
      if (!email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Invalid email format';
      }
    }
    Object.keys(socialLinks).forEach((key) => {
      const url = socialLinks[key];
      if (url) {
        const platform = socialPlatforms.find((p) => p.key === key);
        if (!validateUrl(url, platform.domains)) {
          errors[key] = `Please enter a valid ${platform.label} URL`;
        }
      }
    });
    if (user.provider === 'local') {
      if (showChangePassword) {
        if (newPassword && newPassword.length < 8) {
          errors.newPassword = 'New password must be at least 8 characters';
        }
        if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
          errors.confirmNewPassword = 'Passwords do not match';
        }
        if ((newPassword || confirmNewPassword) && !currentPassword) {
          errors.currentPassword = 'Current password is required to update password';
        }
      }
    }
    setUrlErrors(errors);
    onValidationChange(Object.keys(errors).length === 0);
  };


  return (
    <div className="text-white space-y-2">
      <ProfileHeader
        avatar={user.avatar}
        username={user.name}
        level={user.level || 1}
        xp={user.xp || 0}
        nextLevelXP={user.nextLevelXP || 100}
      />
      {isEditing ? (
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="text-gray-300" htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
            />
            {urlErrors.name && <p className="text-red-500 text-sm">{urlErrors.name}</p>}
          </div>
          {/* Email Field */}
          <div>
            <label className="text-gray-300" htmlFor="email">Email:</label>
            {user.provider === 'local' ? (
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                required
              />
            ) : (
              <div>
                <p className="text-white">{email}</p>
                <p className="text-sm text-gray-400">
                  Your email is managed by {user.provider}.
                </p>
              </div>
            )}
            {user.provider === 'local' && urlErrors.email && (
              <p className="text-red-500 text-sm">{urlErrors.email}</p>
            )}
          </div>
          {/* Bio Field */}
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              rows={4}
              maxLength={5000}
            />
            <div className="absolute right-2 bottom-2 text-gray-400">
              {5000 - bio.length}
            </div>
          </div>
          {/* Additional Details Fields */}
          <div>
            <div>
              <label className="text-gray-300" htmlFor="age">Age:</label>
              <input
                id="age"
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="text-gray-300" htmlFor="gender">Gender:</label>
              <input
                id="gender"
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="Gender"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="text-gray-300" htmlFor="orientation">Orientation:</label>
              <input
                id="orientation"
                type="text"
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                placeholder="Orientation"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="text-gray-300" htmlFor="pronouns">Pronouns:</label>
              <input
                id="pronouns"
                type="text"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                placeholder="Pronouns"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
          </div>
          {/* Social Links */}
          <div>
            <div className="flex flex-wrap gap-4 mb-4">
              {socialPlatforms.slice(0, showAllIcons ? socialPlatforms.length : iconLimit).map(({ key, icon, label, isImage }) => {
                const IconComponent = !isImage ? icon : null;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSocial(key)}
                    className={`text-2xl p-2 rounded-full transition-colors ${
                      selectedSocials[key] ? 'text-gray-500 bg-gray-700' : 'text-white hover:bg-gray-600'
                    }`}
                    title={label}
                  >
                    {isImage ? (
                      <img src={icon} alt={label} className="w-6 h-6 md:w-8 md:h-8" />
                    ) : (
                      IconComponent && <IconComponent className="w-6 h-6 md:w-8 md:h-8" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-4">
              {socialPlatforms.map(({ key, label }) => (
                selectedSocials[key] && (
                  <div key={key} className="w-full">
                    <input
                      type="text"
                      value={socialLinks[key] || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, [key]: e.target.value })}
                      placeholder={`${label} URL`}
                      className={`w-full p-2 bg-gray-800 border ${
                        urlErrors[key] ? 'border-red-500' : 'border-gray-700'
                      } rounded text-white`}
                    />
                    {urlErrors[key] && <p className="text-red-500 text-sm">{urlErrors[key]}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
          {/* Change Password Toggle and Fields */}
          {user.provider === 'local' && (
            <div className="flex justify-between items-center">
              <p
                className="text-sm text-blue-600 cursor-pointer"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                {showChangePassword ? 'Hide Change Password' : 'Change Password'}
              </p>
              <p
                className="text-sm text-blue-600 cursor-pointer"
                onClick={() => setShowAllIcons(!showAllIcons)}
              >
                {showAllIcons ? 'Collapse' : 'Expand'}
              </p>
            </div>
          )}
          {showChangePassword && user.provider === 'local' && (
            <div>
              <ChangePasswordForm
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmNewPassword={confirmNewPassword}
                setConfirmNewPassword={setConfirmNewPassword}
              />
              {urlErrors.currentPassword && <p className="text-red-500 mt-2">{urlErrors.currentPassword}</p>}
              {urlErrors.newPassword && <p className="text-red-500 mt-2">{urlErrors.newPassword}</p>}
              {urlErrors.confirmNewPassword && <p className="text-red-500 mt-2">{urlErrors.confirmNewPassword}</p>}
            </div>
          )}
          {/* Cancel Button */}
          <button
            type="button"
            onClick={onCancel}
            className="w-full p-2 bg-gray-600 rounded text-white hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p>
            <strong>Email:</strong> {user.email}{' '}
            {user.provider !== 'local' && <span className="text-gray-400">({user.provider})</span>}
          </p>
          <AdditionalDetails details={{ age, gender, orientation, pronouns }} />
          <BioComponent bio={user.bio} />
          {user.socialLinks && <SocialBar socialLinks={user.socialLinks} />}
          <button
            onClick={onEdit}
            className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
}

export default ProfileComponent;