import React from "react";
import { useState, useRef, useEffect } from "react"
import reactLogo from "./assets/react.svg"
import "./Home.css"

import generateTranscript from './backend/assemblyai.jsx'

import get_feedback from './backend/llm.jsx'

import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();


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


  const [words, setWords] = useState([]);
  const [feedbackData, setFeedbackData] = useState(null);
  
  const handleTranscribe = async () => {
    //alert("transcroption started");
    const result = await generateTranscript(audioBlob);
    //alert(result);
    setTranscript(result.text);
    //alert(result.text);
    //alert(JSON.stringify(result.words));
    setWords(result.words);
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
        //alert(err.message);
      }
    } else {
      //alert("The MediaRecorder API is not supported in your browser.");
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

  const handleGetFeedback = async () => {
    if (!transcript || transcript === "N/A") {
      //alert("Please generate a transcript before getting feedback.");
      return;
    }
    try {
      const fb = await get_feedback(transcript);
      setFeedbackData(fb);
      // alert(fb);
      navigate("/Feedback", { state: { words, feedback: fb, transcript: transcript } });
    } catch (error) {
      console.error("Error fetching feedback", error);
      //alert("Failed to get feedback, please try again.");
    }
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

      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
  <button 
    onClick={handleTranscribe} 
    style={{ border: 'black', background: 'none' }}
  >
    Generate Transcript
  </button>

  <button
    onClick={handleGetFeedback}
    style={{ border: 'none', background: 'none' }}
  >
  Get Feedback
  </button>

</div>
      
      <div className='grid-container'>
        <div onClick={openFeedback} className='grid-item'>
          <div style={{width:"100px",height:"100px",backgroundColor:"lightgray",borderRadius:'5px'}}></div>
          <h4 style={{color:"black"}}>Storing transcripts to-be-implemented</h4>
          {/* <h4 style={{color: 'black'}}>hello</h4> */}
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


          {/* BUTTONS FOR TRANSCRIPT AND FEEDBACK */}
          {/* <button onClick={async () => {
            const result = await get_feedback(sampleInput);
            //alert(result[1]);
          }}>
            TEST
          </button> */}
          

          {/* <button onClick={() => handleTranscribe.then(get_feedback(transcript).then())} style={{ border: 'none', background: 'none' }}>All-in-one</button>
          <button onClick={() => navigate('/Feedback')}>Feedback Page</button> */}
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

export default Home;

const sampleInput = `
Uh, okay, so… hi everyone. Today I’m gonna be talking about, um, the history of skateboarding. So, like, skateboarding actually started in the 1950s in California, when surfers kinda wanted something to do when there weren’t waves. They called it, uh, “sidewalk surfing,” which I think is kinda funny.

At first, the boards were super basic, like, literally just wooden planks with roller skate wheels attached. Um, but over time, they improved a lot, especially in the 1970s when, uh, polyurethane wheels were invented, which made riding smoother and safer.

So, yeah, that’s also when skate parks started becoming popular, and more people got into tricks and stuff. Um, in the 1980s and 90s, skateboarding kinda became part of, like, youth culture, with videos, magazines, and, uh, professional competitions.

Today, skateboarding is actually an Olympic sport, which is pretty crazy if you think about how it started. Um, yeah, so overall, it went from, like, a small hobby to something global.

Uh, yeah, that’s basically it. Thanks for listening.
`