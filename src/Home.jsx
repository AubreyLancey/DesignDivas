import React from "react";
import { useState, useRef, useEffect } from "react"
import reactLogo from "./assets/react.svg"
import "./Home.css"

import generateTranscript from './backend/assemblyai.jsx'

import get_feedback from './backend/llm.jsx'

import { useNavigate } from 'react-router-dom';
import { supabase } from './backend/supabase.js'


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

  const [selectedClip, setSelectedClip] = useState(null);

  const openFeedback = (clip) => {
    setSelectedClip(clip);
    setShowPopup(true);
  };

  const closeFeedback = () => {
    setShowPopup(false);
    setSelectedClip(null);
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

  const [clips, setClips] = useState([]);

  useEffect(() => {
    const fetchClips = async () => {
      try {
        // 1. Fetch saved_data rows
        const { data: savedRows, error: savedError } = await supabase
          .from('saved_data')
          .select('id, file_name, transcript, feedback, words');

        if (savedError) {
          console.error('Error fetching saved_data:', savedError);
          return;
        }

        // 2. List files in storage
        const { data: files, error: listError } = await supabase
          .storage
          .from('audio_files')
          .list('', { limit: 100 });

        if (listError) {
          console.error('Error listing storage files:', listError);
          return;
        }

        // 3. Insert any new files not already in saved_data
        const existingNames = savedRows.map(r => r.file_name);
        const newFiles = files.filter(f => !existingNames.includes(f.name));

        if (newFiles.length > 0) {
          const { error: insertError } = await supabase
            .from('saved_data')
            .insert(newFiles.map(f => ({ file_name: f.name })));

          if (insertError) console.error('Error inserting new rows:', insertError);
        }

        // 4. Merge storage info with database info
        const mergedRows = await Promise.all(
          files.map(async (file) => {
            // get signed URL
            const { data: signedData, error: urlError } = await supabase
              .storage
              .from('audio_files')
              .createSignedUrl(file.name, 60);

            if (urlError) console.error(urlError);

            // find database row (after insertion, there should be one)
            const dbRow = savedRows.find(r => r.file_name === file.name) || {};

            return {
              name: file.name,
              url: signedData.signedUrl,
              transcript: dbRow.transcript || null,
              feedback: dbRow.feedback || null,
              words: dbRow.words || null
            };
          })
        );

        setClips(mergedRows);
        console.log(mergedRows)
      } catch (err) {
        console.error('Unexpected error in fetchClips:', err);
      }
    };

    fetchClips();
  }, []);
  const handleTranscribeClip = async (clip) => {
    try {
      // 1. Fetch row by file_name
      const { data: row, error: fetchError } = await supabase
        .from('saved_data')
        .select('id, transcript, words')
        .eq('file_name', clip.name.trim())
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching row:', fetchError);
        alert('Failed to fetch row for ' + clip.name);
        return;
      }

      if (!row) {
        alert('No row found for ' + clip.name);
        return;
      }

      if (row.transcript) {
        alert('Transcript already exists for ' + clip.name);
        return;
      }

      // 2. Generate transcript
      const response = await generateTranscript(clip.url);
      const transcriptText = response.text;
      const wordsArray = response.words; // make sure your generateTranscript returns words

      if (!transcriptText) {
        alert('Transcription failed for ' + clip.name);
        return;
      }

      // 3. Update saved_data row
      const { error: updateError } = await supabase
        .from('saved_data')
        .update({ transcript: transcriptText, words: wordsArray })
        .eq('file_name', clip.name.trim());

      if (updateError) {
        console.error('Error updating transcript/words:', updateError);
        alert('Failed to save transcript for ' + clip.name);
        return;
      }

      alert('Transcript saved for ' + clip.name);

      // 4. Update local clips state so UI updates
      setClips((prev) =>
        prev.map((c) =>
          c.name === clip.name
            ? { ...c, transcript: transcriptText, words: wordsArray }
            : c
        )
      );
    } catch (err) {
      console.error('Unexpected error in handleTranscribeClip:', err);
      alert('Something went wrong for ' + clip.name);
    }
  };

  const handleGenerateFeedback = async (clip) => {
    try {
      // 1. Fetch the row for this clip
      const { data: row, error: fetchError } = await supabase
        .from('saved_data')
        .select('id, transcript, words, feedback')
        .eq('file_name', clip.name.trim())
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching row:', fetchError);
        alert('Failed to fetch row for ' + clip.name);
        return;
      }

      if (!row) {
        alert('No row found for ' + clip.name);
        return;
      }

      if (!row.transcript) {
        alert('Please transcribe the clip first.');
        return;
      }

      if (row.feedback) {
        alert('Feedback already exists for ' + clip.name);
        return;
      }

      // 2. Generate feedback
      const feedbackResult = await get_feedback(row.transcript);

      // 3. Update feedback in database
      const { error: updateError } = await supabase
        .from('saved_data')
        .update({ feedback: feedbackResult })
        .eq('file_name', clip.name.trim());

      if (updateError) {
        console.error('Error updating feedback:', updateError);
        alert('Failed to save feedback for ' + clip.name);
        return;
      }

      alert('Feedback saved for ' + clip.name);

      // 4. Update local state so UI updates immediately
      setClips((prev) =>
        prev.map((c) =>
          c.name === clip.name ? { ...c, feedback: feedbackResult } : c
        )
      );

    } catch (err) {
      console.error('Unexpected error in handleGenerateFeedback:', err);
      alert('Something went wrong for ' + clip.name);
    }
  };

  const [showTranscript, setShowTranscript] = useState(false);


  const [pendingAction, setPendingAction] = useState(null);
  const SPEECH_TYPES = [
    "Unspecified",
    "Casual conversation",
    "Work presentation",
    "Class presentation",
    "Other"
  ];

  return (
    <div className='body-container'>
      <h2 style={{color: "black", textAlign: 'left'}}>Temporary Feedback (Unsaved)</h2>
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
    {audio? (
      <>
        <button 
          onClick={handleTranscribe} 
          style={{ border: 'black', background: 'lightgray', color: 'black' }}
        >
          Generate Transcript
        </button>

        <button
          onClick={handleGetFeedback}
          style={{ border: 'none', background: 'lightgray', color: 'black' }}
        >
        Get Feedback
        </button>
      </>

    ): null}
      </div>


      <br/>
      <h2 style={{color: "black", textAlign: 'left'}}>Hardware-Recorded Feedback (Saved)</h2>
      <div className='grid-container'>
        {clips.length > 0 ? clips.map((clip, index) => (
        <div key={clip.name} className='grid-item' onClick={() => openFeedback(clip)}>
            <div
              style={{
                color: "black",
                cursor: "pointer",
                textAlign: "center",
                padding: "8px",
                borderRadius: "5px",
                backgroundColor: "#e0e0e0"
              }}
            >
              {clip.name}  {/* or `Recording ${index + 1}` */}
            </div>
          </div>
        )) : (
          <div>Loading...</div>
        )}
      </div>

      
      {showPopup && selectedClip && (
        <div className="overlay" onClick={closeFeedback}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeFeedback}>×</button>

            <div className="clip-row">
              <p>{selectedClip.name}</p>
              <audio src={selectedClip.url} controls />

              {selectedClip.transcript ? (
                <span style={{ marginRight: '10px', color: 'green' }}>Transcript created</span>
              ) : (
                <button onClick={() => handleTranscribeClip(selectedClip)}>Transcribe</button>
              )}

              {selectedClip.feedback ? (
                <span style={{ marginRight: '10px', color: 'green' }}>Feedback created</span>
              ) : (
                <button onClick={() => handleGenerateFeedback(selectedClip)}>Generate Feedback</button>
              )}

              {selectedClip.transcript && selectedClip.feedback && (
                <button style={{  background: "#f3f3f3", color: "#111", border: "1px solid #d1d5db"}}
                  onClick={() =>
                    navigate("/Feedback", {
                      state: {
                        transcript: selectedClip.transcript,
                        feedback: selectedClip.feedback,
                        words: selectedClip.words
                      }
                    })
                  }
                >Go to Feedback
                </button>
              )}

              {selectedClip.transcript ? (
                <button style={{  background: "#f3f3f3", color: "#111", border: "1px solid #d1d5db"}} onClick={() => setShowTranscript(prev => !prev)}>
                  {showTranscript ? "Hide Transcript" : "Show Transcript"}
                </button>
              ): null}
              {showTranscript && selectedClip.transcript && (
                <div className="transcript-box" style={{fontSize: "12px"}}>
                  "{selectedClip.transcript}"
                </div>
              )}
            </div>
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