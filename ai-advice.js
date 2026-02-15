// ai-advice.js
// এই ফাইলে AI পরামর্শ আনার সম্পূর্ণ লজিক আছে

/**
 * রেকর্ড দেখার পর বা নতুন রেকর্ড যোগ করার পর AI পরামর্শ আনার ফাংশন
 * @param {Array} records - contract থেকে আসা রেকর্ড অ্যারে
 * @param {string} [currentReading] - ঐচ্ছিক: নতুন যোগ করা রেকর্ডের reading value
 * @param {string} [currentDisease] - ঐচ্ছিক: নতুন যোগ করা রোগের নাম
 */
async function fetchAIAdvice(records = [], currentReading = "", currentDisease = "") {
  if (records.length === 0 && !currentReading) {
    addMessage("কোনো রেকর্ড নেই, তাই পরামর্শ দেওয়ার মতো কিছু নেই।");
    return;
  }

  try {
    // API-তে পাঠানোর জন্য ডেটা তৈরি
    const payload = {
      records: records.map(r => ({
        encryptedData: r.encryptedData,
        timestamp: r.timestamp.toString()
      })),
      currentReading: currentReading,
      currentDisease: currentDisease,
      userMessage: "এই রেকর্ডগুলো দেখে আমার জন্য সহজ ও সাধারণ পরামর্শ দাও। আমার বয়স/লিঙ্গ/অন্যান্য তথ্য না জানলে জেনারেল টিপস দিও। কোনো ওষুধ বা চিকিৎসা সাজেশন দেবে না।"
    };

    addMessage("AI বন্ধুকে তোমার রেকর্ড দেখাচ্ছি... একটু অপেক্ষা করো।");

    const response = await fetch('https://ai-doctor-blockchain.vercel.app/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API এরর: ${response.status}`);
    }

    const data = await response.json();

    if (data.advice && data.advice.trim()) {
      addMessage("AI ডাক্তারের পরামর্শ:\n\n" + data.advice);
    } else {
      addMessage("AI থেকে কোনো পরামর্শ পাওয়া যায়নি।");
    }
  } catch (err) {
    console.error("AI fetch error:", err);
    addMessage("AI কানেকশন সমস্যা: " + (err.message || "Unknown error"));
  }
}

// এই ফাংশনটা main HTML থেকে কল করা যাবে
window.fetchAIAdvice = fetchAIAdvice;
