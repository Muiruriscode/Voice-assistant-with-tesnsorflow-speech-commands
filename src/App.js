import logo from './logo.svg';
import './App.css';

import * as tf from '@tensorflow/tfjs'
import * as speech from '@tensorflow-models/speech-commands'

import VoiceModel from "./model/model.json"
import VoiceModelMetadata from "./model/metadata.json"

import React, { useEffect, useState } from 'react'
import Visualizer from './Visualizer';

function App() {
  const [model, setModel] = useState(null)
  const [action, setAction] = useState(null)
  const [labels, setLabels] = useState(null)

  const loadModel = async () => {
    try {
      const recognizer = await speech.create('BROWSER_FFT', undefined, VoiceModel, VoiceModelMetadata)
      console.log('loaded model')
      await recognizer.ensureModelLoaded()
      setModel(recognizer)
      setLabels(recognizer.wordLabels()) 
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() =>{
    loadModel()
  },[])
  useEffect(() => {
    speak()
  },model)

  function argMax(arr){
    return arr.map((x,i) => [x,i]).reduce((r,a) => (a[0] > r[0] ? a : r ))[1]
  }

  const recognizeCommands = async () => {
    console.log('listening for commands')
    model.listen(result => {
      console.log(labels[argMax(Object.values(result.scores))])
      setAction(labels[argMax(Object.values(result.scores))])
    }, {
      includeSpectrogram: true, 
      probabilityThreshold: 0.7,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.50 
    })
    setTimeout(() => model.stopListening(), 10e3)
  }
  function speak(text){
    try {
      const speech = new window.SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(speech)  
    } catch (error) {
      alert("speech syntesis not supported by your browser. Plaese update...")
    }
  }
  return (
    <div className="App">
      <div id="top-container">
      <h1 id="title">Voice Assistant</h1>
      <button id="start-btn" className="simple-btn"  onClick={recognizeCommands}>Start Assistant</button>
    </div>
      <Visualizer />
      {action ? <div>{action}</div>: <div>No action detected</div>}
      {action === "Weather"? speak("The weather today is sunny at 27 decgrees"): 
          action === "Greetings"? speak("Hello Dennis. How have you been?"): 
          action === "Play a Song" ? speak("Here are songs that I recomend for today."): 
          <p>Continue</p>}
    </div>
  );
}

export default App;
