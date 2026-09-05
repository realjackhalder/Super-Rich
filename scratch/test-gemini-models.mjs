const apiKey = 'AQ.Ab8RN6LFxqGzIblQ51cYBkCDzTofhyx1H41ZCcj6r8oZuPuOLg';

async function test() {
  // Test gemini-3.6-flash
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Hello, what is the capital of Myanmar?' }] }]
    })
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Result:', JSON.stringify(data, null, 2));
}

test();
