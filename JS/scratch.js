$(document).ready(function() {
    // Initialize Peer
    const peer = new Peer();
  
    const ul = $("<div class='list-group'></div>");
    const child = $('.child-container');
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
    const restart = $(".restart");
    const container = $('.container1');
  
    let conn;  // Connection object
    let isGameMaster = false; // Flag to determine who starts the quiz
    let currentCategory;
  
    let questions = [];
    let currentQuestionIndex = 0;
    let time = 10;
    let score = 0;
    let timer;
  
    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      $('#id').text(id);
    });
  
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
  
    // Add player ID to the list of available players
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
  
    // Setup connection to handle data
    function setupConnection(connection) {
      connection.on('data', function(data) {
        // Handle incoming data
        if (data.type === 'question') {
          displayQuestion(data.question);
        } else if (data.type === 'answer') {
          handleAnswer(data.answer, data.peerId);
        } else if (data.type === 'score') {
          alert(`Player ${data.peerId} scored!`);
          nextQuestion();
        }
      });
    }
  
    // Function to start the quiz
    function startQuiz() {
      $.getJSON('../HTML/questions.json', (data) => {
        questions = data.categories.find(category => category.name === currentCategory).questions;
      }).fail(() => {
        console.log('Error');
      }).then(() => {
        loadQuestion();
      });
    }
  
    // Function to load the next question
    function loadQuestion() {
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
    }
  
    // Function to check the selected answer
    function checkAnswer(selectedAnswer, correctAnswer) {
      if (selectedAnswer === correctAnswer) {
        score += 3;
        scoreElement.text(score);
        scoreTextElement.text(`Your score: ${score}`);
      }
      conn.send({ type: 'answer', answer: selectedAnswer, peerId: peer.id });
    }
  
    // Function to handle the answer
    function handleAnswer(answer, peerId) {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = answer === currentQuestion.correct_answer;
      if (isCorrect) {
        if (peerId === peer.id) {
          score += 3;
          scoreElement.text(score);
          scoreTextElement.text(`Your score: ${score}`);
        }
        conn.send({ type: 'score', peerId: peerId });
        currentQuestionIndex++;
        loadQuestion();
      } else {
        alert('Incorrect answer.');
      }
    }
  
    // Function to load the next question
    function nextQuestion() {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        loadQuestion();
      } else {
        endQuiz();
      }
    }
  
    // Function to reset the timer for each question
    function resetTimer() {
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
    }
  
    // Function to update the progress bar
    function updateProgress(value) {
      progressText.text(`${value}`);
      const percentage = (value / time) * 100;
      progressBar.css("width", `${percentage}%`);
    }
  
    // Function to end the quiz
    function endQuiz() {
      clearInterval(timer);
      quizContainer.hide();
      scoreContainer.show();
      scoreTextElement.text(`You scored ${score} out of ${questions.length * 3}`);
      const username = sessionStorage.getItem('username');
      const category = currentCategory;
  
      if (username) {
        const scoreData = {
          username: username,
          category: category,
          score: score,
          date: new Date().toISOString()
        };
        addScore(scoreData).then(() => {
          console.log('Score saved successfully');
        }).catch((error) => {
          console.error('Error saving score:', error);
        });
      } else {
        alert('No username found. Please log in.');
        window.location.href = '../HTML/index.html'; // Redirect to login page if no username is found
      }
    }
  
    // Function to change the background color with animation
    function changeBackgroundColor() {
      $("body").css("transition", "background-color 0.5s");
      const colors = ["#f8b195", "#f67280", "#c06c84", "#6c5b7b", "#355c7d"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      $("body").css("background-color", randomColor);
    }
  
    // Load categories
    const loadCategory = function(category) {
      for (const iterator of category) {
        ul.append(`<div class='small-container ${iterator.name}'>${iterator.name}</div>`);
      }
      child.append(ul);
    };
  
    // Event handlers for category selection and quiz start
    $.getJSON('../HTML/questions.json', function(data) {
      let category = data.categories;
      loadCategory(category);
  
      $('.small-container').on('click', function() {
        var click = $(this).text();
        currentCategory = click;
        $('h4').css('display', 'none');
        $('.category-section').hide();
        $('h4').html(`You chose: <strong>${click}</strong>`).slideToggle();
        $('body').css('backgroundImage', `url(../Assets/images/${click}.png)`);
        $(`#${click}`).slideToggle().animate({ fontSize: '15px' });
        $('.img img').attr('src', `../Assets/images/${click}.png`);
      });
  
      $('.btn').on('click', function() {
        $('.parent').css('display', 'none');
        $('.container1').slideToggle().animate();
        scoreContainer.hide();
        startQuiz();
      });
  
      $('.restart').on('click', function() {
        $('.container1').css('display', 'none');
        $('.container1').slideToggle().animate();
        scoreContainer.hide();
        startQuiz();
      });
    });
  });
  