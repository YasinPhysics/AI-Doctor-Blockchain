export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { records, userMessage } = req.body;

  if (!records || !userMessage) {
    return res.status(400).json({ error: 'Missing records or message' });
  }

  try {
    const prompt = `...` // আগের প্রম্পট

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const advice = data.choices[0].message.content.trim();

    res.status(200).json({ advice });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: 'AI request failed: ' + error.message });
  }
}
