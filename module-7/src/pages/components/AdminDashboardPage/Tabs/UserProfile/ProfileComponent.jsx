import React, { useState, useEffect } from 'react';
import BioComponent from './BioComponent';
import ChangePasswordForm from './ChangePasswordForm';
import SocialBar from './SocialBar';
import AdditionalDetails from './AdditionalDetails';
import { FaInstagram, FaLinkedin, FaYoutube, FaFacebookF, FaGlobe, FaTumblr, FaSnapchatGhost, FaReddit, FaTwitch, FaGithub, FaDiscord } from 'react-icons/fa';
import { SiRumble, SiLinktree } from "react-icons/si";
import { SlSocialSpotify, SlSocialSoundcloud, SlSocialSteam } from "react-icons/sl";
import { FaPatreon, FaXTwitter  } from "react-icons/fa6";
import ProfileHeader from './ProfileHeader';
// Add the import for the Omniflix icon if available
// import { OmniflixIcon } from 'path/to/omniflixIcon'; // Uncomment and update the path if you have an icon

// Define social platforms with icons and valid domains
const socialPlatforms = [
    { key: 'website', label: 'Website', icon: FaGlobe, domains: null },
    { key: 'Patreon', label: 'Patreon', icon: FaPatreon, domains: ['patreon.com'] },
    { key: 'Discord', label: 'Discord', icon: FaDiscord, domains: ['discord.com'] },
    { key: 'linktree', label: 'Linktree', icon: SiLinktree, domains: ['linktr.ee'] },
    { key: 'X', label: 'X (Twitter)', icon: FaXTwitter, domains: ['twitter.com', 'x.com'] },
    { key: 'Reddit', label: 'Reddit', icon: FaReddit, domains: ['reddit.com'] },
    { key: 'Spotify', label: 'Spotify', icon: SlSocialSpotify, domains: ['spotify.com'] },
    { key: 'Soundcloud', label: 'SoundCloud', icon: SlSocialSoundcloud, domains: ['soundcloud.com'] },
    { key: 'instagram', label: 'Instagram', icon: FaInstagram, domains: ['instagram.com'] },
    { key: 'youtube', label: 'YouTube', icon: FaYoutube, domains: ['youtube.com'] },
    { key: 'omniflix', label: 'Omniflix', icon: '/assets/images/omniflixIcon.jpg', isImage: true, domains: ['omniflix.tv'] },
    { key: 'rumble', label: 'Rumble', icon: SiRumble, domains: ['rumble.com'] },
    { key: 'Github', label: 'GitHub', icon: FaGithub, domains: ['github.com'] },
    { key: 'Twitch', label: 'Twitch', icon: FaTwitch, domains: ['twitch.tv'] },
    { key: 'Steam', label: 'Steam', icon: SlSocialSteam, domains: ['steamcommunity.com'] },
    { key: 'Tumblr', label: 'Tumblr', icon: FaTumblr, domains: ['tumblr.com'] },
    { key: 'Snapchat', label: 'Snapchat', icon: FaSnapchatGhost, domains: ['snapchat.com'] },
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
}) {
  const [urlErrors, setUrlErrors] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedSocials, setSelectedSocials] = useState({});
  const [showAllIcons, setShowAllIcons] = useState(false);
  const [iconLimit, setIconLimit] = useState(7); // Default to 7 icons

  // New state for additional details
  const [age, setAge] = useState(user.details?.age || '');
  const [gender, setGender] = useState(user.details?.gender || '');
  const [orientation, setOrientation] = useState(user.details?.orientation || '');
  const [pronouns, setPronouns] = useState(user.details?.pronouns || '');

  // Validate form whenever inputs change
  useEffect(() => {
    validateForm();
  }, [name, email, bio, socialLinks, age, gender, orientation, pronouns]);

  // Effect to handle window resize and set icon limit based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // Medium breakpoint (768px)
        setIconLimit(6); // Show 6 icons at medium breakpoint
      } else {
        setIconLimit(7); // Show 7 icons otherwise
      }
    };

    // Set initial icon limit
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle social field visibility
  const toggleSocial = (key) => {
    setSelectedSocials((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // URL validation logic
  const validateUrl = (url, domains) => {
    const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
    if (!url || !urlPattern.test(url)) return false;
    if (!domains) return true; // Website: no domain restriction
    const urlDomain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.toLowerCase();
    return domains.some((domain) => urlDomain === domain || urlDomain.endsWith(`.${domain}`));
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format';
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
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
            />
            {urlErrors.email && <p className="text-red-500 text-sm">{urlErrors.email}</p>}
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
          {/* Social Bar moved here */}
          <div>
            {/* Row for social icons */}
            <div className="flex flex-wrap gap-4 mb-4">
              {socialPlatforms.slice(0, showAllIcons ? socialPlatforms.length : iconLimit).map(({ key, icon, label, isImage }) => {
                const IconComponent = !isImage ? icon : null; // Only assign icon to a variable if it's a React component
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSocial(key)} // Ensure the toggle function is called on click
                    className={`text-2xl p-2 rounded-full transition-colors ${
                      selectedSocials[key]
                        ? 'text-gray-500 bg-gray-700'
                        : 'text-white hover:bg-gray-600'
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
            {/* Toggle link for expanding/collapsing icons, anchored to the right */}
            {/* <div className="flex justify-between items-center">
              <p
                className="text-sm text-blue-600 cursor-pointer"
                onClick={() => setShowAllIcons(!showAllIcons)}
              >
                {showAllIcons ? 'Collapse' : 'Expand'}
              </p>
            </div> */}
            {/* Row for social input fields */}
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
          {/* Change Password Toggle and Expand Toggle */}
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
          {showChangePassword && (
            <ChangePasswordForm onCancel={() => setShowChangePassword(false)} />
          )}
          {/* Buttons */}
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
          <p><strong>Email:</strong> {user.email}</p>
          <AdditionalDetails details={user.details} />
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