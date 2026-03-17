const openAIKey = meta.env.VITE_OPEN_AI_KEY;

export default async function get_feedback(text) {

    const prompt = `hello ${text}`
    alert(prompt)

    return
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.4",
        input: `Give clear, specific writing feedback on this text:\n\n${text}`
      }),
    });

    const data = await res.json();

    return data.output_text || "No feedback returned";
}