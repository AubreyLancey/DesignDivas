import React from "react";
import { useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);

  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);

  const mediaRecorder = useRef(null);

  const mimeType = "audio/webm";

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

    const media = new MediaRecorder(stream);
    mediaRecorder.current = media;

    let localAudioChunks = [];

    media.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        localAudioChunks.push(event.data);
      }
    };

    media.onstop = () => {
      const audioBlob = new Blob(localAudioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
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


  return (
    <div className='body-container'>
      <div className="homepage-banner">
        <h2>Record and analyze your voice</h2>
          {!permission ? (
              <button onClick={getMicrophonePermission} type="button" className='button-primary'>
                  Get Audio Permissions
              </button>
          ): null}
          {permission ? (
              <button type="button" className='button-primary'>
                  Record
              </button>
          ): null}

          
        
      </div>
      
      <div className='grid-container'>
        <div className='grid-item'>
          <div style={{width:"100px",height:"100px",backgroundColor:"lightgray",borderRadius:'5px'}}></div>
          <h4 style={{color:"black"}}>Clip. 1</h4>
        </div>
        <div className='grid-item'>
          <div style={{width:"100px",height:"100px",backgroundColor:"lightgray",borderRadius:'5px'}}></div>
          <h4 style={{color:"black"}}>Clip. 2</h4>
        </div>
        <div className='grid-item'>
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

          {audio ? (
            <div className="audio-container">
              <audio src={audio} controls></audio>
              <a download href={audio}>
                  Download Recording
              </a>
            </div>
          ) : null}
          )}
      </div>

    </div>

    

    
  );
}

export default App;
