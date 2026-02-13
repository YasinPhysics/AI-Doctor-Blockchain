import { createClient } from '@xai/grok-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { records, userMessage } = req.body;

  if (!records || !userMessage) {
    return res.status(400).json({ error: 'Missing records or message' });
  }

  try {
    const client = createClient({
      apiKey: process.env.GROK_API_KEY,
    });

    const prompt = `
আমি একজন AI ডাক্তার সহায়ক। নিচের পেশেন্টের রেকর্ড দেখে সহজ, বাস্তবসম্মত এবং সতর্কতামূলক পরামর্শ দাও।
পরামর্শে সবসময় বলো: "এটা শুধু সাধারণ পরামর্শ। অবশ্যই ডাক্তারের সাথে কথা বলুন।"

রেকর্ড:
${records.map(r => `- ${r.encryptedData} (${new Date(Number(r.timestamp)*1000).toLocaleString()})`).join('\n')}

ইউজারের প্রশ্ন/মেসেজ: ${userMessage}

উত্তর বাংলায় দাও, সহজ ভাষায়, ৪-৬ লাইনের মধ্যে।`;

    const completion = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "grok-beta",
      temperature: 0.7,
      max_tokens: 300,
    });

    const advice = completion.choices[0].message.content.trim();

    res.status(200).json({ advice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI request failed' });
  }
}