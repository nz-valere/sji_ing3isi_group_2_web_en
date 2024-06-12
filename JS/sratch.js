$(document).ready(function() {

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

  const username = sessionStorage.getItem('username');
  if (!username) {
      alert('No username found. Please log in.');
      window.location.href = '../HTML/index.html'; // Redirect to login page if no username is found
      return;
  }

  // Initialize Peer
  const peer = new Peer(username);

  let conn;  // Connection object
  let isGameMaster = false; // Flag to determine who starts the quiz
  let currentCategory;

  let questions = [];
  let currentQuestionIndex = 0;
  let time = 10;
  let score = 0;
  let timer;
  let index;

  // Load category function
  function loadCategory(categories) {
      const ul = $("<div class='list-group'></div>");
      const child = $('.child-container');
      for (const category of categories) {
          ul.append(`<div class='small-container ${category.name}'>${category.name}</div>`);
      }
      child.append(ul);
  }

  // Event handlers for category selection and quiz start
  $.getJSON('../HTML/questions.json', function(data) {
      let categories = data.categories;
      loadCategory(categories);

      $('.small-container').on('click', function() {
          var click = $(this).text();
          index = categories.findIndex(category => category.name === click);
          if (index === -1) {
              alert('Category not found.');
              return;
          }
          currentCategory = click;
          console.log(index);
          $('h4').css('display', 'none');
          $('#Sports').css('display', 'none');
          $('#Culture').css('display', 'none');
          $('#Music').css('display', 'none');
          $('#Science').css('display', 'none');
          $('#History').css('display', 'none');
          $('#Computer').css('display', 'none');
          $('h4').html(`You chose: <strong>${click}</strong>`).slideToggle();
          $('body').css('backgroundImage', `url(../Assets/images/${click}.png)`);
          $(`#${click}`).slideToggle().animate({ fontSize: '18px' });
          $('.img img').attr('src', `../Assets/images/${click}.png`);
      });

      peer.on('open', function(id) {
          console.log('My peer ID is: ' + id);
          $('.id').text(id);
      });

      peer.on('connection', function(connection) {
          conn = connection;  // Store the connection object
          setupConnection(conn);
          conn.on('open', function() {
              console.log('Connected to: ' + conn.peer);
              console.log('Connection established');
              if (!isGameMaster) {
                  // If not game master, wait for the game master to send the category
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
              $('.parent').css('display', 'none');
              $('.container1').slideToggle().animate();
              scoreContainer.hide();
              isGameMaster = true;  // The player who initiates the connection is the game master
              conn.send({ type: 'category', category: currentCategory }); // Send selected category to the player
              startQuiz();
          });
      }

      // Setup connection to handle data
      function setupConnection(connection) {
          connection.on('data', function(data) {
              // Handle incoming data
              if (data.type === 'category') {
                  currentCategory = data.category;
                  index = categories.findIndex(category => category.name === currentCategory);
                  if (index === -1) {
                      alert('Category not found.');
                      return;
                  }
                  startQuiz();
              } else if (data.type === 'question') {
                  displayQuestion(data.question);
              } else if (data.type === 'answer') {
                  handleAnswer(data.answer, data.peerId);
              } else if (data.type === 'score') {
                  handleScoreUpdate(data.peerId, data.correct);
                  nextQuestion();
              } else if (data.type === 'timeUp') {
                  clearInterval(timer);
                  currentQuestionIndex++;
                  nextQuestion();
              }
          });
      }

      // Function to start the quiz
      function startQuiz() {
          if (index === undefined) {
              alert('Please select a category.');
              return;
          }
          $.getJSON('../HTML/questions.json', (data) => {
              questions = data.categories[index].questions;
              console.log('Questions loaded:', questions);
              currentQuestionIndex = 0; // Ensure currentQuestionIndex is reset
              if (isGameMaster) {
                  sendQuestion();
              } else {
                  $('.parent').css('display', 'none');
                  $('.container1').slideToggle().animate();
                  scoreContainer.hide();
                  loadQuestion();
              }
          }).fail(() => {
              console.log('Error loading questions.json');
          });
      }

      // Function to send the current question to the peer
      function sendQuestion() {
          if (currentQuestionIndex < questions.length) {
              const question = questions[currentQuestionIndex];
              conn.send({ type: 'question', question: question });
              displayQuestion(question);
              startTimer();
          } else {
              endQuiz();
          }
      }

      // Function to load the next question
      function loadQuestion() {
          if (currentQuestionIndex < questions.length) {
              const currentQuestion = questions[currentQuestionIndex];
              displayQuestion(currentQuestion);
              startTimer();
          } else {
              endQuiz();
          }
      }

      // Function to display the current question
      function displayQuestion(question) {
          questionsElement.text(question.question);
          answersElement.empty();

          question.choices.forEach((choice) => {
              const answerButton = $(`<button class="answer">${choice}</button>`);
              answerButton.on("click", () => {
                  checkAnswer(choice, question.correct_answer);
                  // Disable all buttons after answering
                  answersElement.find('button').attr('disabled', true);
              });
              answersElement.append(answerButton);
          });

          questionNumberElement.text(currentQuestionIndex + 1);
          totalQuestionsElement.text(questions.length);
      }

      // Function to check the selected answer
      function checkAnswer(selectedAnswer, correctAnswer) {
          if (selectedAnswer === correctAnswer) {
              score += 3;
              scoreElement.text(score);
              scoreTextElement.text(`Your score: ${score}`);
              conn.send({ type: 'answer', answer: selectedAnswer, peerId: peer.id });
              alert('Correct answer!');
          } else {
              conn.send({ type: 'answer', answer: selectedAnswer, peerId: peer.id });
              alert('Wrong answer!');
          }
          if (isGameMaster) {
              nextQuestion(); // Only the game master initiates the next question
          }
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
              alert('Correct answer from player!');
          } else {
              alert('Wrong answer from player!');
          }
          if (isGameMaster) {
              nextQuestion(); // Only the game master initiates the next question
          }
      }

      // Function to handle score update
      function handleScoreUpdate(peerId, correct) {
          if (correct) {
              if (peerId === peer.id) {
                  score += 3;
                  scoreElement.text(score);
                  scoreTextElement.text(`Your score: ${score}`);
              }
          }
      }

      // Function to load the next question
      function nextQuestion() {
          currentQuestionIndex++;
          if (currentQuestionIndex < questions.length) {
              sendQuestion(); // Game master sends the next question
          } else {
              endQuiz();
          }
      }

      // Function to start the timer for each question
      function startTimer() {
          clearInterval(timer);
          time = 10;
          updateProgress(time);

          timer = setInterval(() => {
              time--;
              updateProgress(time);
              if (time <= 0) {
                  clearInterval(timer);
                  conn.send({ type: 'timeUp' }); // Notify the player that time is up
                  if (isGameMaster) {
                      nextQuestion();
                  }
              }
          }, 1000);
      }

      // Function to update the progress bar
      function updateProgress(value) {
          progressText.text(`${value}`);
          const percentage = (value / 10) * 100;
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
    
    // Function to save the score
    function addScore(scoreData) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("UserIdDB", 3);
    
            request.onerror = function(event) {
                console.error("Database error: ", event.target.errorCode);
                reject("Database error: " + event.target.errorCode);
            };
    
            request.onsuccess = function(event) {
                const db = event.target.result;
                const transaction = db.transaction(["Scores"], "readwrite");
                const store = transaction.objectStore("Scores");
                const addRequest = store.add(scoreData);
    
                addRequest.onsuccess = () => {
                    resolve('Score added successfully');
                    alert('score added to DB');
                };
    
                addRequest.onerror = (event) => {
                    reject('Error adding score:', event);
                };
            };
        });
    }
  }).fail(() => {
      alert('Error loading categories.');
  });

  peer.on('error', (err) => {
      console.error('PeerJS Error:', err);
      alert('An error occurred with the PeerJS connection. Please try again.');

  // Function to change the background color with animation
  function changeBackgroundColor() {
    $("body").css("transition", "background-color 0.5s");
    const colors = ["#f8b195", "#f67280", "#c06c84", "#6c5b7b", "#355c7d"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    $("body").css("background-color", randomColor);
  }
  
  // Function to load the quiz categories
  function loadCategory(categories) {
    const ul = $("<div class='list-group'></div>");
    categories.forEach(category => {
      ul.append(`<div class='small-container ${category.name}'>${category.name}</div>`);
    });
    $('.child-container').append(ul);
  }
});
})
  