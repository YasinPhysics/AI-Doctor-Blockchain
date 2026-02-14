export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { records, userMessage } = req.body;

  if (!records || !userMessage) {
    return res.status(400).json({ error: 'Missing records or message' });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set");
    return res.status(500).json({ error: 'Server configuration error: Missing API key' });
  }

  try {
    const prompt = `
আমি একজন AI ডাক্তার সহায়ক। নিচের পেশেন্টের রেকর্ড দেখে সহজ, বাস্তবসম্মত এবং সতর্কতামূলক পরামর্শ দাও।
পরামর্শে সবসময় বলো: "এটা শুধু সাধারণ পরামর্শ। অবশ্যই ডাক্তারের সাথে কথা বলুন।"

রেকর্ড:
${records.map(r => `- ${r.encryptedData} (${new Date(Number(r.timestamp)*1000).toLocaleString()})`).join('\n')}

ইউজারের প্রশ্ন/মেসেজ: ${userMessage}

উত্তর বাংলায় দাও, সহজ ভাষায়, ৪-৬ লাইনের মধ্যে।`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API response error:", errText);
      throw new Error(`Groq API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const advice = data.choices[0].message.content.trim();

    res.status(200).json({ advice });
  } catch (error) {
    console.error("Groq API error:", error.message);
    res.status(500).json({ error: 'AI request failed: ' + error.message });
  }
}
