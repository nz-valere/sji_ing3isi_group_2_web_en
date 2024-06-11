const ul = $("<div class ='list-group'></div>") 
const child = $('.child-container')
const questionsElement = $("#question");
const answersElement = $("#answers");
const questionNumberElement = $(".current");
const totalQuestionsElement = $(".total");
const progressBar = $(".progress-bar");
const progressText = $(".progress-text");
const scoreElement = $(".final-points");
const scoreTextElement = $(".score-text");
const scoreContainer = $(".score");
const quizContainer = $(".quiz");

let questions = [];
let currentQuestionIndex = 0;
let time = 10;
let score = 0;
let timer;
let conn;  // Connection object
let isGameMaster = false; // Flag to determine who starts the quiz
let currentCategory;


const loadCategory = function(category){
  for (const iterator of category){
    ul.append(`<div class = 'small-container ${iterator.name}'>${iterator.name}</div>`)
    console.log(ul);
}
child.append(ul)
}

// Function to update the progress bar
const updateProgress = (value) => {
  progressText.text(`${value}`)
  const percentage = (value / time) * 100;
  progressBar.css("width", `${percentage}%`);
};

// Function to load the next question
const loadQuestion = () => {
  if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      questionsElement.text(currentQuestion.question);
      answersElement.empty();

      currentQuestion.choices.forEach((choice) => {
          const answerButton = $(`<button class="answer">${choice}</button>`);
          answerButton.on("click", () => checkAnswer(choice, currentQuestion.correct_answer));
          answersElement.append(answerButton);
      });

      questionNumberElement.text(currentQuestionIndex + 1);
      totalQuestionsElement.text(questions.length);
      resetTimer();
  } else {
      endQuiz();
  }
};

// Function to check the selected answer
const checkAnswer = (selectedAnswer, correctAnswer) => {
  if (selectedAnswer === correctAnswer) {
      score += 3;
      scoreElement.text(score);
      scoreTextElement.text(`Your score: ${score}`);
  }
  currentQuestionIndex++;
  changeBackgroundColor();
  loadQuestion();
};

// Function to reset the timer for each question
const resetTimer = () => {
  clearInterval(timer);
  time = 10;
  updateProgress(time);

  timer = setInterval(() => {
      time--;
      updateProgress(time);
      if (time <= 0) {
          clearInterval(timer);
          currentQuestionIndex++;
          loadQuestion();
      }
  }, 1000);
};

// Function to change the background color with animation
const changeBackgroundColor = () => {
  $("body").css("transition", "background-color 0.5s");
  const colors = ["#f8b195", "#f67280", "#c06c84", "#6c5b7b", "#355c7d"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  $("body").css("background-color", randomColor);
};

// Function to end the quiz and show the score
const endQuiz = () => {
  clearInterval(timer);
  quizContainer.hide();
  scoreContainer.show();
  scoreTextElement.text(`You scored ${score} out of --`);
};


const startQuiz = () => {
  $.getJSON('../HTML/questions.json', (data) => {
      questions = data.categories[0].questions;
  }).fail(() => {
      console.log('Error');
  }).then(() => {
      loadQuestion();
  });
};

function addPlayerToList(id) {
  const listItem = $("<li></li>").text(id);
  listItem.click(function() {
    connectToPeer(id);
  });
  $('#players').append(listItem);
}
  // Manually add a player to the list
  $('#add-player-btn').click(function() {
    const newPlayerId = $('#new-player-id').val();
    if (newPlayerId && newPlayerId !== peer.id) {
      addPlayerToList(newPlayerId);
    } else {
      alert('Invalid ID or you cannot add your own ID.');
    }
  });
  
  // Connect to another peer
  function connectToPeer(peerId) {
  if (peerId === peer.id) {
    alert("You cannot connect to yourself. Use another device or browser to test.");
    return;
  }

  conn = peer.connect(peerId);
  setupConnection(conn);
  conn.on('open', function() {
    console.log('Connected to: ' + peerId);
    startQuiz();
  });
}


$(document).ready(function(){
  const peer = new Peer();

  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    $('#id').text(id);
  });

  $.getJSON('../HTML/questions.json', function(data){
    let category = data.categories
    console.log(category);
    loadCategory(category)
    $('.small-container').on('click', function(){
      var click = $(this).text();

      peer.on('connection', function(connection) {
        conn = connection;  // Store the connection object
        setupConnection(conn);
        conn.on('open', function() {
          console.log('Connected to: ' + conn.peer);
          if (isGameMaster) {
            startQuiz();
          }
        });
      });

      console.log(click);
      $('h4').css('display', 'none')
      $('#Sports').hide();
      $('#Culture').hide();
      $('#Music').hide();
      $('#Science').hide();
      $('#History').hide();
      $('#Computer').hide();
      $('h4').html(`You choosed: <strong>${click}</strong>`).slideToggle();
      $('body').css('backgroundImage',`url(../Assets/images/${click}.png)`);
      $(`#${click}`).slideToggle().animate({fontSize: '15px'});
      $('.img img').attr('src',`../Assets/images/${click}.png`);
    })

    $('.btn').on('click', function(){
      $('.parent').css('display', 'none')
      $('.container1').slideToggle().animate()
      scoreContainer.hide();
      startQuiz();
    })

  })
  
})


