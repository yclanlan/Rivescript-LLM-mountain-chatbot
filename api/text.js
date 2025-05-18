// File structure for Vercel deployment:
// 
// /api/text.js - This handles your API endpoint
// /public/ - Your static files
// /pages/index.js - If using Next.js (optional)

// /api/text.js
import Replicate from 'replicate';
import * as dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the prompt from the request body
    const { prompt } = req.body;

    const input = {
      prompt: prompt,
      system_prompt: 'You are a speechless mountain who loves dad jokes. You only speak short sentences and always keep the conversation short.',
      max_new_tokens: 128,
      temperature: 0.85,
    };

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the response
    for await (const event of replicate.stream('meta/meta-llama-3-8b-instruct', { input })) {
      // Write each chunk as it comes in
      res.write(event.toString());
    }
    
    // End the response
    res.end();
  } catch (error) {
    console.error('Error:', error);
    // If we haven't started streaming yet, send an error response
    if (!res.headersSent) {
      res.status(500).json({ error: 'An error occurred during processing' });
    } else {
      // If we've already started streaming, we need to end the response
      res.end(`Error: ${error.message}`);
    }
  }
}