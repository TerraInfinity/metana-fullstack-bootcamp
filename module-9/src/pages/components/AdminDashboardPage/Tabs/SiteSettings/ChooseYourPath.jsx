import React, { useState, useEffect, useRef } from 'react';

// Enhanced paths array with description and perks
const paths = [
    {
      name: 'Dark (NSFW)',
      image: '/assets/images/PathOfDark.jpg',
      description: "Like OMG! Bambi! Thots go pop! You came here to get brainwashed. Like, who wouldn't want to washing their brain from time to time! Explore a world of ethical depravity and self inflicted consensually non-consensual mindless obsessions.",
      perks: ['Reverse Leveling', 'IQ Point System', 'Bimbo Achievements'],
    },
    {
      name: 'Dork (Chaos)',
      image: '/assets/images/PathOfChaos.jpg',
      description: 'Do you pray at the Altar of Chaos? Chaos Resides in Cyber Athens. Roll the dice, you never know what to expect. NSFW? SFW? Skynet? Media Empire? Glåüm? It all blends together. A Bimbo such as yourself lets our Lady of Perpetural Chaos decide her fate.',
      perks: ['Chaotic Leveling', 'Chaos Point System', 'Altar Of Chaos Achievements'],
    },
    {
      name: 'Light (SFW)',
      image: '/assets/images/PathOfLight.jpg',
      description: "Crystal AI Co-pilot online, ascension protocols accelerate. Manifest your destiny! Integrate healthy habits! Meditate and Practice your B.I.M.B.O Yoga. Guided by the many hands of Glåüm, love and abundance await those who embark towards humanity's accention",
      perks: ['Incremental Leveling', 'Glåümule Point System', 'Glåüm Achievements'],
    },
];

/**
 * ChooseYourPath component allows users to select a path with associated perks.
 *
 * This component displays a selection of paths, each with a description and perks.
 * Users can click on a path to select it temporarily and then lock in their choice.
 *
 * @param {Object} props - The component props.
 * @param {function} props.onSelectPath - Callback function to handle the selection of a path.
 * @param {string} props.selectedPath - The currently selected path, used to initialize the component state.
 * @returns {JSX.Element} The rendered component.
 */
const ChooseYourPath = ({ onSelectPath, selectedPath }) => {
  // State to temporarily hold the selected path
  const [tempSelectedPath, setTempSelectedPath] = useState(selectedPath);
  // State to manage the height of the bottom div for dynamic positioning
  const [bottomHeight, setBottomHeight] = useState(0);
  const bottomDivRef = useRef(null);

  // Effect to set the height of the bottom div after the component mounts
  useEffect(() => {
    if (bottomDivRef.current) {
      setBottomHeight(bottomDivRef.current.offsetHeight);
    }
  }, []);

  /**
   * Handles the click event on a path to set it as the temporary selected path.
   *
   * This function updates the state to reflect the path that the user has clicked on.
   *
   * @param {string} pathName - The name of the path that was clicked.
   */
  const handlePathClick = (pathName) => {
    setTempSelectedPath(pathName);
  };

  /**
   * Locks in the currently selected path and triggers the onSelectPath callback.
   *
   * This function is called when the user confirms their selection by clicking the "Lock In" button.
   * It passes the selected path back to the parent component.
   */
  const handleLockIn = () => {
    onSelectPath(tempSelectedPath);
    console.log(`Locked in path: ${tempSelectedPath}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Choose Your Path
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paths.map((path) => (
          <div
            key={path.name}
            className="flex flex-col items-center"
          >
            <div
              id={`path-${path.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handlePathClick(path.name)}
              className={`relative cursor-pointer rounded-lg overflow-hidden h-160 w-full ${
                tempSelectedPath === path.name ? 'ring-4 ring-blue-500' : ''
              }`}
            >
              <img
                src={path.image}
                alt={path.name}
                className="w-full h-160 object-cover hover:scale-105 transition-transform duration-300"
              />
              {tempSelectedPath === path.name && (
                <div
                  className="absolute top-0 left-0 right-0 bg-black bg-opacity-60 flex flex-col justify-start p-4 overflow-y-auto"
                  style={{ bottom: `${bottomHeight}px` }}
                >
                  <div className="text-white text-center">
                    <h3 className="text-xl font-bold">{path.name}</h3>
                    <p className="mt-2">{path.description}</p>
                  </div>
                  <div className="text-white mt-4">
                    <h4 className="font-semibold mb-2">Perks:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {path.perks.map((perk, index) => (
                        <li key={index}>{perk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <div
                ref={bottomDivRef}
                className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-center font-semibold"
              >
                {path.name}
              </div>
            </div>
            {tempSelectedPath === path.name && (
              <button
                id="lock-in-button"
                onClick={handleLockIn}
                className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors duration-200 w-full max-w-xs"
              >
                Lock In
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseYourPath;