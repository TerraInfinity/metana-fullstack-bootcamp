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

const ChooseYourPath = ({ onSelectPath, selectedPath }) => {
  const [tempSelectedPath, setTempSelectedPath] = useState(selectedPath);
  const [bottomHeight, setBottomHeight] = useState(0);
  const bottomDivRef = useRef(null);

  // Fixed the useEffect to use correct ref name
  useEffect(() => {
    if (bottomDivRef.current) {
      setBottomHeight(bottomDivRef.current.offsetHeight);
    }
  }, []);

  const handlePathClick = (pathName) => {
    setTempSelectedPath(pathName);
  };

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