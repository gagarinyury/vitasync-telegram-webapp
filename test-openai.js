require('dotenv').config();
const OpenAI = require('openai');

console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 10));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Say hello" }],
      model: "gpt-3.5-turbo",
    });
    console.log('OpenAI response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

test();