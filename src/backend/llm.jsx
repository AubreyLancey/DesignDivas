const openAIKey = import.meta.env.VITE_APP_OPEN_AI_KEY;

export default async function get_feedback(text) {

    // const prompt = `analyze the following transcript: ${text}`
    const prompt = `Provide me some speech-related feedback on this text: ${text}`
    // alert(prompt)

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.4",
        input: prompt
      }),
    });

    const data = await res.json();


    const output =
        data.output_text ??
        data.output?.[0]?.content?.[0]?.text ??
        "No feedback returned";

    alert(output);

    return output;

}