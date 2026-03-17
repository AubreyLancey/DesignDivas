import React from "react";
import { useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import { LiquidGlass }  from '@liquidglass/react';

import generateTranscript from './backend/assemblyai.jsx'

import get_feedback from './backend/llm.jsx'

function App() {
  const [count, setCount] = useState(0);
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);

  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

  const mediaRecorder = useRef(null);

  const mimeType = "audio/mp4";


  const [transcript, setTranscript] = useState("N/A");
  
  const handleTranscribe = async () => {
    const result = await generateTranscript(audioBlob);
    setTranscript(result.text);
    alert(result.text)
  };

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        setPermission(true);
        setStream(streamData);

      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = () => {
    setRecordingStatus("recording");

    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;

    let localAudioChunks = [];

    media.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        localAudioChunks.push(event.data);
      }
    };

    media.onstop = () => {
      const blob = new Blob(localAudioChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(blob);
      setAudio(audioUrl);
      setAudioBlob(blob);
    };

    media.start();
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
  };

  const playAudio = () => {
    if (!audio) return;
    const audioElement = new Audio(audio);
    audioElement.play();
  };

  const openFeedback = () => {
    setShowPopup(true);
  };

  const closeFeedback = () => {
    setShowPopup(false);
  };



  return (
    <div className='body-container'>
      <div className="homepage-banner">
        <h2>Record and analyze your voice</h2>
          {/* {!permission ? (
              <button onClick={getMicrophonePermission} type="button" className='button-primary'>
                  Get Audio Permissions
              </button>
          ): null}
          {permission ? (
              <button
                onClick={recordingStatus === "inactive" ? startRecording : stopRecording}
                type="button"
                className='button-primary'
              >
                {recordingStatus === "inactive" ? "Record" : "Stop Recording"}
              </button>
          ): null} */}


          <div className="audio-controls">
          {!permission ? (
          <button onClick={getMicrophonePermission} type="button">
              Record
          </button>
          ) : null}
          {permission && recordingStatus === "inactive" ? (
          <button onClick={startRecording} type="button">
              Record
          </button>
          ) : null}
          {recordingStatus === "recording" ? (
          <button onClick={stopRecording} type="button">
              Stop
          </button>
          ) : null}

          {audio ? (
            <div className="audio-container">
              <audio src={audio} controls></audio>
              <a download href={audio}>
                  Download Recording
              </a>
            </div>
          ) : null}
      </div>
      </div>
      
      <div className='grid-container'>
        <div onClick={openFeedback} className='grid-item'>
          <div style={{width:"100px",height:"100px",backgroundColor:"lightgray",borderRadius:'5px'}}></div>
          <h4 style={{color:"black"}}>Clip. 1</h4>
        </div>
        <div onClick={openFeedback} className='grid-item'>
          <div style={{width:"100px",height:"100px",backgroundColor:"lightgray",borderRadius:'5px'}}></div>
          <h4 style={{color:"black"}}>Clip. 2</h4>
        </div>
        <div onClick={openFeedback} className='grid-item'>
          <div style={{width:"100px",height:"100px",backgroundColor:"lightgray",borderRadius:'5px'}}></div>
          <h4 style={{color:"black"}}>Clip. 3</h4>
        </div>
      </div>

      <div className="audio-controls">
          {!permission ? (
          <button onClick={getMicrophonePermission} type="button">
              Get Microphone
          </button>
          ) : null}
          {permission && recordingStatus === "inactive" ? (
          <button onClick={startRecording} type="button">
              Start Recording
          </button>
          ) : null}
          {recordingStatus === "recording" ? (
          <button onClick={stopRecording} type="button">
              Stop Recording
          </button>
          ) : null}

          {/* {audio ? (
            <div className="audio-container">
              <audio src={audio} controls></audio>
              <a download href={audio}>
                  Download Recording
              </a>
            </div>
          ) : null} */}
          <LiquidGlass><button onClick={handleTranscribe} style={{ border: 'none', background: 'transparent' }}>Generate Transcript</button></LiquidGlass>
      </div>

      {showPopup && (
        <div className={`popup-overlay ${showPopup ? 'show' : ''}`} onClick={closeFeedback}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Feedback</h3>
            <button onClick={closeFeedback}>Close</button>

            <p style={{ lineHeight: "1.6", color:'black' , textAlign: "justify" }}>
              The speech presented a <span style={{ fontWeight: "bold" }}>clear central idea</span>, but the overall
              <span style={{ color: "#2a7ae2", fontWeight: "bold" }}> flow of transitions </span>
              between sections felt uneven. Early on, the introduction effectively captured attention,
              yet it moved quickly into the main points without enough framing. Adding a short
              <span style={{ fontStyle: "italic" }}> roadmap of the argument </span> would help the
              audience understand how the ideas connect. In several moments, strong insights were
              introduced but not fully developed, which slightly weakened the overall structure.
            </p>

            <p style={{ lineHeight: "1.6", color:'black', textAlign: "justify" }}>
              From a content perspective, the examples used were
              <span style={{ color: "#c0392b", fontWeight: "bold" }}> relevant and engaging </span>,
              but the speech relied heavily on general statements rather than specific evidence.
              Incorporating brief statistics, anecdotes, or references would strengthen credibility
              and make the argument more persuasive. The conclusion did a good job reinforcing the
              main theme, though it could be more memorable by returning to the opening idea or
              offering a concise call to action.
            </p>

            <p style={{ lineHeight: "1.6", color:'black', textAlign: "justify"   }}>
              In terms of speaking conventions, the delivery appeared confident, though pacing
              occasionally became rushed during complex explanations. Slowing down and emphasizing
              key phrases—especially through
              <span style={{ fontWeight: "bold", color: "#16a085" }}> intentional pauses </span>—would
              improve clarity. Additionally, varying vocal tone and emphasizing important terms
              would create stronger engagement. Overall, the speech demonstrates
              <span style={{ fontStyle: "italic", color: "#8e44ad" }}> thoughtful preparation </span>,
              and with smoother transitions, more concrete evidence, and deliberate pacing,
              it could become a compelling and polished presentation.
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;