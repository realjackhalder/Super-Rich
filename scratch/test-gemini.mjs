const apiKey = 'AQ.Ab8RN6LFxqGzIblQ51cYBkCDzTofhyx1H41ZCcj6r8oZuPuOLg';

async function testGemini() {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello, respond in 5 words' }] }]
        })
      });
      const data = await res.json();
      console.log(`Model ${model}: status ${res.status}`, JSON.stringify(data).slice(0, 200));
      if (res.ok) break;
    } catch (err) {
      console.error(`Error on ${model}:`, err.message);
    }
  }
}

testGemini();
