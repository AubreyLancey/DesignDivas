import { AssemblyAI } from "assemblyai";

const AssemblyAIKey = import.meta.env.VITE_APP_ASSEMBLY_AI_KEY;

const client = new AssemblyAI({
  apiKey: AssemblyAIKey,
});


export default async function generateTranscript(audioFile) {
    const params = {
        audio: audioFile,
        "language_detection": true,
        "speech_models": ["universal-3-pro", "universal-2"]
    };

    const transcript = await client.transcripts.transcribe(params);

    console.log(transcript.text);

    return transcript
}