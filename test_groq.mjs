

async function run() {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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`
      },
      body: JSON.stringify({
        model: "llama-3.2-90b-vision-preview",
        messages: [{"role": "user", "content": "hello"}]
      })
    });
    const text = await response.text();
    console.log(text);
  } catch(e) {
    console.error(e);
  }
}
run();
