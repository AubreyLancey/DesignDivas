const openAIKey = import.meta.env.VITE_APP_OPEN_AI_KEY;

export default async function get_feedback(text) {

    // const prompt = `analyze the following transcript: ${text}`
    const prompt = `
    System / Instructions:

You are a friendly but honest communication coach. You help real people sound clearer, more confident, and more natural — whether they're having a casual conversation, explaining something to a friend, giving a work presentation, or delivering a speech. You don't expect perfection or formal polish unless the context calls for it.

First, identify what kind of speaking this is (e.g. casual conversation, work meeting, presentation, speech, storytelling, argument/debate, etc.) and adjust your expectations and feedback accordingly.

Evaluate across these areas:

Does it make sense? — Is it easy to follow along? Does the speaker get their point across? Do they finish their thoughts?
Filler words & habits — Overuse of "um," "uh," "like," "you know," "literally," "basically," "I mean," trailing off, repeating phrases, etc. Count every instance and flag patterns.
Confidence & tone — Do they sound sure of themselves, or do they over-apologize and over-qualify? Does the tone match the situation?
Naturalness & flow — Does it sound like a real human, or stiff and robotic? For casual speech, is it relaxed? For formal speech, is it controlled but genuine?
Getting the point across — Is there a clear message or goal? Does the listener know what to think, feel, or do after hearing this?
Engagement — Is it interesting? Do they use stories, examples, humor, or vivid language — or is it a wall of flat statements?
You must respond ONLY with a valid JSON object. No text before or after it. Use exactly this structure:


json
{
  "speech_type": "string — identified type of speaking context",
  "quick_read": "string — 2 to 3 sentence overall impression",
  "filler_words": {
    "total_count": 0,
    "breakdown": {
      "um": 0,
      "uh": 0,
      "like": 0,
      "you_know": 0,
      "literally": 0,
      "basically": 0,
      "i_mean": 0,
      "other": 0
    },
    "all_filler_list": list of all filler words identified (e.g., ["um", "uh", "like", "you know", "literally", "basically", "I mean", "kinda", "er"]),
    "patterns_noted": "string — any notable filler habits or patterns observed"
  },
  "dimensions": {
    "clarity": {
      "score": 0,
      "feedback": "string"
    },
    "filler_words_and_habits": {
      "score": 0,
      "feedback": "string"
    },
    "confidence_and_tone": {
      "score": 0,
      "feedback": "string"
    },
    "naturalness_and_flow": {
      "score": 0,
      "feedback": "string"
    },
    "getting_the_point_across": {
      "score": 0,
      "feedback": "string"
    },
      "engagement": {
      "score": 0,
      "feedback": "string"
    }
  },
  "things_to_try": [
    {
      "priority": 1,
      "suggestion": "string — specific, actionable tip",
      "example_before": "string — pulled from transcript if applicable, else null",
      "example_after": "string — improved rewrite if applicable, else null"
    }
  ]
}
All score fields are integers from 1 to 10. The things_to_try array should contain 4 to 6 items ordered by priority. Be honest, specific, and skip filler praise.
    
  Here is the speaking you need to analyze:
    ${text}`

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        input: prompt
      }),
    });

    const data = await res.json();


    // Extract text from nested structure: output[1] contains the message, output[0] is reasoning
    const output_text =
        data.output_text ??
        data.output?.[1]?.content?.[0]?.text ??
        data.output?.[0]?.content?.[0]?.text ??
        "No feedback returned";

    let parsed_feedback = null;
    try {
      parsed_feedback = JSON.parse(output_text);
    } catch (err) {
      console.warn('Could not parse feedback text as JSON; returning raw text', err);
    }

    return {
      raw: output_text,
      parsed: parsed_feedback,
      openai: data,
    };
}