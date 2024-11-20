import Replicate from 'replicate';
import express from 'express';
import bodyParser from 'body-parser';
// Import EventSource for handling Server-Sent Events (SSE)
// import EventSource from 'eventsource';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


app.post('/api/text', async (request, response) => {
  
  const input= {
      prompt: request.body.prompt,
      system_prompt: 'You are a speechless mountain who loves dad jokes. You only speak short sentences and always keep the conversation short.',
      max_new_tokens: 128,
      temperature: 0.85,
    };

     // Set response headers for streaming
  response.setHeader('Content-Type', 'text/event-stream');
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('Connection', 'keep-alive');

  try {
    // Stream responses from the model using for await loop
    for await (const event of replicate.stream('meta/meta-llama-3-8b-instruct', { input })) {
      // Write each event to the response
      response.write(event.toString());
    }
    // End the response once streaming is complete
    response.end();
  } catch (error) {
    // Handle errors during streaming
    console.error('Error during streaming:', error);
    response.status(500).send('Error during streaming');
  }
});





const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});