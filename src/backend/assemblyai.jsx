import { AssemblyAI } from "assemblyai";

const AssemblyAIKey = import.meta.env.VITE_APP_ASSEMBLY_AI_KEY;

const client = new AssemblyAI({
  apiKey: AssemblyAIKey,
});


export default async function generateTranscript(audioFile) {
    //alert("1");
    const params = {
        audio: audioFile,
        "language_detection": true,
        "speech_models": ["universal-3-pro", "universal-2"]
    };

    //alert("2");
    //alert(params);

    const transcript = await client.transcripts.transcribe(params);

    //alert("3");

    //alert(transcript.text);
    alert("Transcript created");

    return transcript
}