import React, { useState, useRef, useEffect } from 'react';
import Wave from 'wave-visualizer';

const Visualizer = () => {
  const [audioStream, setAudioStream] = useState(null);
  const audioRef = useRef();

  useEffect(() => {
    async function openAudioStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
      } catch (error) {
        console.error(error);
      }
    }
    openAudioStream();
  }, []);

  useEffect(() => {
    async function startVisualization() {
      if (audioStream) {
        let wave = new Wave();
        wave.fromStream(audioStream, audioRef.current.id, {
          type: 'bars',
          colors: ['blue', '3498db'],
          stroke: 1,
        });
      }
    }
    startVisualization();
  }, [audioStream]);

  function stopVisualization() {
    audioStream?.getTracks().forEach((track) => {
      track.stop();
    });
  }

  return (
    <div id="visualizer-container">
      <canvas id="output" width="250" height="200" ref={audioRef}></canvas>
      <h2 id="word-preview"></h2>
      <h3 id="search-result"></h3>
    </div>
  );
};

export default Visualizer;
