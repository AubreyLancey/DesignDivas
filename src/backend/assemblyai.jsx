import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: "ec1ab29aaca24872936aad29f632ec2e",
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