import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.experientiallabs.ai/v1',
  apiKey: 'xpl_9dfbc4225f5f4fb0416f968c9ae77ca64ccb9c5a',
});

async function main() {
  try {
    const response = await client.chat.completions.create({
      model: 'qwen3.8-27b',
      messages: [{ role: 'user', content: 'Say hello in 5 words' }],
      max_tokens: 50
    });
    console.log('AI Response:', response.choices[0]?.message?.content);
  } catch (err) {
    console.error('AI Error:', err);
  }
}

main();
