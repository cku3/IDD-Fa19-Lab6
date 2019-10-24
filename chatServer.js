/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;

//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Welcome :)"); //We start with the introduction;
    setTimeout(timedQuestion, 5000, socket, "What is your name?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = 'Hello ' + input + '!'; // output response
    app.use(express.static('public'));
    waitTime = 5000;
    question = 'let\'s play a game! you have five guesses to figure out who i am... sound good?'; // load next question
  } else if (questionNum == 1) {
    answer = 'Great! Here is the first hint: I am something that became popular in the past decade';
    waitTime = 5000;
    question = 'Hint 2: You can see people scroll past me or show their friends. What am I?';
  } else if (questionNum == 2) {
    if (input == 'meme') {
    questionNum = 7;
    answer = 'Congratulations! You got it right! I am a memeeee.'
    waitTime = 0;
    app.use(express.static('public'));
    question = '';
    }
    else {
    answer = 'Oof! Not quite...';
    waitTime = 5000;
    question = 'Hint 3: Sometimes I am embarrassing but it depends on the person'; // load next question
    }
  } else if (questionNum == 3) {
    if (input == 'meme') {
    questionNum = 7;
    answer = 'Congratulations! You got it right! I am a memeeee.'
    waitTime = 000;
    app.use(express.static('public'));
    question = '';
    }
    else {
    answer = 'Nope!';
    waitTime = 5000;
    question = 'Hint 4: People make references to me all the time'; // load next question
    }
  } else if (questionNum == 4) {
    if (input == 'meme') {
    questionNum = 7;
    answer = 'Congratulations! You got it right! I am a memeeee.'
    waitTime = 0;
    app.use(express.static('public'));
    question = '';
    }
    else {
    answer = 'Nah '+ input+ ' isn\'t it';
    waitTime = 5000;
    question = 'Last Hint: I am four letters'; // load next question
    }
    // load next question
  } else {
    if (input == 'meme') {
    questionNum = 7;
    answer = 'Congratulations! You got it right! I am a memeeee.'
    waitTime = 0;
    app.use(express.static('public'));
    question = '';
    }
    else {
    answer = 'I don\'t have anymore clues! Sad... if you want to know you\'ll have to play again!'; // output response
    waitTime = 0;
    question = '';
  }}


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
