/**
 * AudioPlayer component
 * 
 * This component provides an audio player for playing audio content.
 * It includes play/pause functionality and displays the audio controls.
 * 
 * File: AudioPlayer.jsx
 */
import React, { useRef, useState } from 'react';

function AudioPlayer({ audioUrl }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl font-semibold">Audio Version</h2>
      <div className="flex items-center bg-gray-800 rounded-lg p-4">
        <audio ref={audioRef} src={audioUrl} className="w-full" controls>
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}

export default AudioPlayer;