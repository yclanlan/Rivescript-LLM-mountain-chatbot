let prompt, text_output , botRepsonse, reader;
let conversationTurn = 0;

function setup() {
  // preGenerateText();
  noCanvas();
  noLoop();


  // let button = select('#submit');
  prompt = select('#user_input');
  // prompt.changed(generateText);
  prompt.elt.addEventListener('keydown', preventNewLine);
  // text_output = select('#output');
  // createButton('generateText').mousePressed(generateText);

 
  
  bot = new RiveScript();
  loadBot();
  let wordsByBot = createElement('p','Hi! I am Mountain! How should I call you? ');
  wordsByBot.style('background-color', '#ffffff');
  wordsByBot.style('color', '#000000');
  wordsByBot.style('border-radius', '2rem');
  wordsByBot.style('text-align', 'left');
  wordsByBot.style('align-items', 'flex');
  wordsByBot.style('padding-left', '1rem');
  wordsByBot.parent('output');

}

//RiveScript Bot
async function loadBot() {
  await bot.loadFile('brain.rive.txt');
  bot.sortReplies();

}

////RiveScript Bot chat
async function chat() {

  let txt = prompt.value();

  // User's reply
  let wordsByUser = createElement('p', txt + '  ');
  wordsByUser.style('background-color', '#64cde2');
  wordsByUser.style('color', '#000');
  wordsByUser.style('border-radius', '2rem');
  wordsByUser.style('text-align', 'right');
  wordsByUser.style('align-items', 'flex');
  wordsByUser.parent('output');

  prompt.value('');

  // Increase conversation turn
  conversationTurn++;

  // Delay bot's reply
  setTimeout(async () => {

    let reply = await bot.reply('local-user', txt);
    let words = reply.split(" ");
    // Bot's reply
    let wordsByBot = createDiv('');
    wordsByBot.style('background-color', '#ffffff');
    wordsByBot.style('color', '#000000');
    wordsByBot.style('border-radius', '2rem');
    wordsByBot.style('text-align', 'left');
    wordsByBot.style('align-items', 'flex');
    wordsByBot.style('padding-left', '1rem');

    for (let i=0; i< words.length; i++) {
     (function (i) {
        setTimeout( () => {
          wordsByBot.html(words[i]+" ",true);
          // console.log(i);
          wordsByBot.parent('output');
          },random(0.5,0.8)*200*i);
        })(i);
   }

    console.log("TURN:"+conversationTurn); 
   

    // Check if it's time to ask a question
    if (conversationTurn === 3) {
      setTimeout(askQuestion, 1500); 
      //turn the LLM on
      preGenerateText();
      // Wait for 1.5 second before asking the question
    }

    if (conversationTurn === 5) {
      setTimeout(askQuestion2, 1500); // Wait for 1.5 second before asking the question
    }

    if (conversationTurn === 6) {
      setTimeout(askQuestion3, 1500); // Wait for 1.5 second before asking the question
    }

    if (conversationTurn === 7) {
      setTimeout(askQuestion4, 1500); // Wait for 1.5 second before asking the question
    }

    if (conversationTurn === 9) {
      setTimeout(askQuestion5, 1500); // Wait for 1.5 second before asking the question
    }

    if (conversationTurn === 10) {
      setTimeout(askQuestion6, 1500); // Wait for 1.5 second before asking the question
    }
    

  }, 1000); // 1000 milliseconds (1 second) delay



}







//LLM Bot
  async function generateText() {

    let txt = prompt.value();

    let wordsByUser = createElement('p', txt + '  ');
    wordsByUser.style('background-color', '#64cde2');
    wordsByUser.style('color', '#000');
    wordsByUser.style('border-radius', '2rem');
    wordsByUser.style('text-align', 'right');
    wordsByUser.style('align-items', 'flex');
    wordsByUser.parent('output');
  
    console.log('sending text to api');
    
    const response = await fetch('/api/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt.value() }),
    });

    console.log(response.body);
    conversationTurn++;
    console.log("turn="+conversationTurn);


    // Initialize a stream reader from the server response
    let reader = response.body.getReader();
    botRepsonse = createDiv('');
    botRepsonse.style('background-color', 'white');
    botRepsonse.style('border-radius', '1rem');
    botRepsonse.style('padding-left', '1rem');
    botRepsonse.style('padding-right', '1rem');
    // Continuously read data from the stream
    while (true) {
      // console.log('true');

      const { done, value } = await reader.read();
      
      // Stop when it's done!
      if (done) break;
      // The 'value' is a Uint8Array containing the streamed binary data
      // TextDecoder converts this binary data into a human-readable string
      
      botRepsonse.html(botRepsonse.html() + new TextDecoder().decode(value));
      botRepsonse.parent('output');


      
    }

    // const data = await response.json();
    // let wordsByBot  = createElement('p', data.output.join(''));
    // wordsByBot.parent('output');
    // console.log(data);

    prompt.value('');
  }

 



function preventNewLine(event) {

  // console.log (event.keyCode);
  if (event.keyCode === 13) {
    event.preventDefault();
    if (conversationTurn <= 9){
      chat();

    }else if(conversationTurn ===10){
      chat();
      console.log('change background');
      changeBackground();

    }else{   
      generateText();
    }
    
    
  }
}



async function preGenerateText() {

  let txt = "Hi mountain, are you there?";
  console.log('sending text to api');
  
  const response = await fetch('/api/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: txt }),
  });
  console.log(response);
  console.log(response.body);

}



function changeBackground() {
  // background-color: rgb(110, 110, 238);
  // background-image: url(mountains.gif);

  // document.body.style.backgroundcolor= rgb(110, 110, 238);
  let bg = select('#body');
  console.log('background-image:'+ bg.elt.style.backgroundImage);
  bg.elt.style.backgroundColor= 'rgb(255, 168, 97);';
  bg.elt.style.backgroundImage= 'url(hiphopmountain.gif)';
 

  console.log('change');
}

function pressed() { 
  
  preGenerateText();
  conversationTurn = 10;
  console.log('turn='+conversationTurn);

}