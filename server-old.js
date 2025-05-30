import Replicate from 'replicate';
import express from 'express';
import bodyParser from 'body-parser';
// Import EventSource for handling Server-Sent Events (SSE)
import EventSource from 'eventsource';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const model = 'meta/meta-llama-3-70b-instruct';

// console.log(replicate.userAgent);


app.post('/api/text', async (request, response) => {
  
  const options = {
    model,
    Headers: {
      'Content-Type': 'application/json'
    },
    input: {
      prompt: request.body.prompt,
      system_prompt: 'You are a speechless mountain who loves dad jokes. You only speak short sentences and always keep the conversation short.',
      max_new_tokens: 128,
      temperature: 0.85,
    },
    // Enable streaming 
    stream: true,
  };

  console.log(options);



  const output = await replicate.run(model, { input });

  response.json({ output });



  // Create a prediction request to Replicate API
  const prediction = await replicate.predictions.create(options);
  // console.log(prediction);

  // Check if streaming URL is available in the prediction response
  if (prediction && prediction.urls && prediction.urls.stream) {
    // Initialize EventSource for streaming
    const source = new EventSource(prediction.urls.stream, {
      withCredentials: true
    });

    // Handle 'output' event for streaming data to client
    source.addEventListener('output', (e) => {
      response.write(e.data);
    });

    // Handle 'error' event during streaming
    source.addEventListener('error', (e) => {
      console.error('error', e);
      response.end();
    });

    // Handle 'done' event when streaming is complete
    source.addEventListener('done', (e) => {
      source.close();
      console.log('done', e);
      response.end();
    });

  } else {
    // Send error response if streaming is not supported or prediction failed
    response.status(500).send('Streaming not supported or prediction failed');
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});