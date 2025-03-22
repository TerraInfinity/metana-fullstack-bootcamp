import React from 'react';
import { FaInstagram, FaLinkedin, FaYoutube, FaFacebookF, FaGlobe, FaTumblr, FaSnapchatGhost, FaReddit, FaTwitch, FaGithub, FaDiscord } from 'react-icons/fa';
import { SiRumble, SiLinktree } from "react-icons/si";
import { SlSocialSpotify, SlSocialSoundcloud, SlSocialSteam } from "react-icons/sl";
import { FaPatreon, FaXTwitter  } from "react-icons/fa6";



// Add the import for the Omniflix icon if available
// import { OmniflixIcon } from 'path/to/omniflixIcon'; // Uncomment and update the path if you have an icon

/**
 * SocialBar component displays a list of social media links with corresponding icons.
 *
 * This component takes an object of social media links and renders clickable icons
 * for each platform that has a corresponding link.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.socialLinks - An object containing social media links where keys are platform identifiers.
 * @returns {JSX.Element} The rendered SocialBar component.
 */
const SocialBar = ({ socialLinks = {} }) => {
    // Define the list of social media platforms and their corresponding icons
    const platforms = [
            { key: 'linktree', icon: SiLinktree },
            { key: 'Discord', icon: FaDiscord },
            { key: 'Github', icon: FaGithub },
            { key: 'website', icon: FaGlobe },
            { key: 'X', icon: FaXTwitter },
            { key: 'Patreon', icon: FaPatreon },
            { key: 'Reddit', icon: FaReddit },
            { key: 'youtube', icon: FaYoutube },
            { key: 'omniflix', icon: '/assets/images/omniflixIcon.jpg', isImage: true },
            { key: 'rumble', icon: SiRumble },
            { key: 'Spotify', icon: SlSocialSpotify },
            { key: 'Soundcloud', icon: SlSocialSoundcloud },
            { key: 'Twitch', icon: FaTwitch },
            { key: 'Steam', icon: SlSocialSteam },
            { key: 'Tumblr', icon: FaTumblr },
            { key: 'instagram', icon: FaInstagram },          
            { key: 'facebook', icon: FaFacebookF },
            { key: 'Snapchat', icon: FaSnapchatGhost },
            { key: 'linkedin', icon: FaLinkedin },   
      ];

  return (
    <div className="flex flex-wrap gap-4">
      {platforms
        .filter(({ key }) => socialLinks[key])
        .map(({ key, icon, isImage }) => (
          <a
            key={key}
            href={socialLinks[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-2xl"
          >
            {isImage ? (
              <img src={icon} alt={key} className="w-4.5 h-4.5" />
            ) : (
              React.createElement(icon, { className: "w-4.5 h-4.5" })
            )}
          </a>
        ))}
    </div>
  );
};

export default SocialBar;

