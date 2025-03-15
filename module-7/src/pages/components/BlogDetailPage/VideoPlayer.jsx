/**
 * VideoPlayer component
 *
 * This component provides a video player for displaying video content
 * related to the blog post, including support for OmniFlix videos.
 *
 * File: VideoPlayer.jsx
 */
import React, { useState, useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Extract YouTube video ID from various URL formats
function getYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Determine video MIME type from file extension
function getVideoType(url) {
  const extension = url.split('.').pop().toLowerCase();
  switch (extension) {
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'ogg':
      return 'video/ogg';
    case 'mov':
      return 'video/quicktime';
    case 'avi':
      return 'video/x-msvideo';
    default:
      return null;
  }
}

// Check if the URL is an OmniFlix video page
function isOmniFlixUrl(url) {
  return url && url.startsWith('https://omniflix.tv/iv/');
}

// Placeholder function to fetch IPFS source
async function fetchOmniFlixVideoSource(url) {
  // console.log('Fetching OmniFlix video source for:', url);
  if (url === 'https://omniflix.tv/iv/66c3c9c36107f6706716f134') {
    const videoData = {
      src: 'https://ipfs-gateway-2.omniflix.studio/ipfs/Qmf7HnWAtzSbfLnh9mQRtm1AwPy7xTSay6oPKreka3of4S',
      type: 'video/mp4',
      poster: 'https://imagedelivery.net/-N7cPU9vJaN2bV17tdfWHA/30b895d6-b44a-4b02-f0bc-9d1ed8d41a00/standard',
    };
    //console.log('Hardcoded video data:', videoData);
    return videoData;
  }
  throw new Error('Unable to fetch video source for this OmniFlix URL');
}

function VideoPlayer({ videoUrl }) {
  const [error, setError] = useState(false);
  const [omniFlixVideo, setOmniFlixVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Manual state for play/pause
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // console.log('VideoPlayer rendered with URL:', videoUrl);

  // Fetch OmniFlix video source when the URL changes
  useEffect(() => {
    if (isOmniFlixUrl(videoUrl)) {
      //console.log('Detected OmniFlix URL, initiating fetch...');
      fetchOmniFlixVideoSource(videoUrl)
        .then((videoData) => {
          //console.log('Successfully fetched OmniFlix video data:', videoData);
          setOmniFlixVideo(videoData);
        })
        .catch((err) => {
          console.error('Error fetching OmniFlix video source:', err);
          setError(true);
        });
    }
  }, [videoUrl]);

  // Initialize Video.js only if the video element and source exist, and player isn't already created
  useEffect(() => {
    if (videoRef.current && !playerRef.current && omniFlixVideo) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,        // Enable control bar
        preload: 'auto',      // Preload video metadata
        fluid: true,          // Responsive sizing
        userActions: {
          click: function(e) {
            // Toggle play/pause based on current state
            if (this.paused()) {
              this.play();
            } else {
              this.pause();
            }
          }
        },
        html5: {
          hls: { // If your video supports HLS, otherwise skip this
            overrideNative: true,
            enableLowInitialPlaylist: true // Start with lower quality to reduce load time
          },
          nativeVideoTracks: false, // Simplify playback stack
          bufferLength: 30 // Increase buffer (in seconds) for smoother seeking
        }
      });

      const player = playerRef.current;

      // Optional: Log play/pause events for debugging or state tracking
      player.on('play', () => {
        //console.log('Video.js play event detected');
      });
      player.on('pause', () => {
       // console.log('Video.js pause event detected');
      });
      
      // Error handling for network errors
      player.on('error', function() {
        const error = this.error();
        if (error.code === 2) { // MEDIA_ERR_NETWORK
          //console.log('Network error detected, retrying...');
          const currentTime = this.currentTime();
          this.load(); // Reload the media
          this.currentTime(currentTime); // Seek back to where we were
          this.play(); // Attempt to resume
        }
      });
    }

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [omniFlixVideo]);

  // Check if videoUrl is provided
  if (!videoUrl) {
    //console.log('No video URL provided');
    return <p className="text-red-500">No video URL provided.</p>;
  }

  // YouTube video
  const youtubeId = getYouTubeId(videoUrl);
  if (youtubeId) {
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
    //console.log('Rendering YouTube video with embed URL:', embedUrl);
    return (
      <div className="w-full h-full">
        {error ? (
          <p className="text-red-500">Failed to load video.</p>
        ) : (
          <iframe
            src={embedUrl}
            title="YouTube video player"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={(e) => {
              console.error('Error loading YouTube video:', videoUrl, e);
              setError(true);
            }}
            onLoad={() => setError(false)} // Reset error state on successful load
          ></iframe>
        )}
      </div>
    );
  }

  // OmniFlix video
  if (isOmniFlixUrl(videoUrl) && omniFlixVideo) {
    //console.log('Rendering OmniFlix video with source:', omniFlixVideo.src);
    return (
      <div className="w-full h-full">
        {error ? (
          <p className="text-red-500">Failed to load video.</p>
        ) : (
          <video
            ref={videoRef}
            className="video-js vjs-default-skin w-full h-full object-cover"
            preload="auto"
            poster={omniFlixVideo.poster}
            data-setup="{}"
          >
            <source src={omniFlixVideo.src} type={omniFlixVideo.type} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    );
  }

  // Direct video file
  const videoType = getVideoType(videoUrl);
  if (videoType) {
    //console.log('Rendering direct video file with type:', videoType);
    return (
      <div className="w-full h-full">
        {error ? (
          <p className="text-red-500">Failed to load video.</p>
        ) : (
          <video
            ref={videoRef}
            className="video-js vjs-default-skin w-full h-full object-cover"
            preload="auto"
            data-setup="{}"
          >
            <source src={videoUrl} type={videoType} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    );
  }

  // Fallback embed
  //console.log('Falling back to iframe embed for URL:', videoUrl);
  return (
    <div className="w-full h-full">
      {error ? (
        <p className="text-red-500">Failed to load video.</p>
      ) : (
        <iframe
          src={videoUrl}
          title="Video player"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={(e) => {
            console.error('Error loading embed video:', videoUrl, e);
            setError(true);
          }}
        ></iframe>
      )}
    </div>
  );
}

export default VideoPlayer;