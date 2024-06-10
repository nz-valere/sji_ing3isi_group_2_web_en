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
const restart = $(".restart")
const container =$('.container1')
let currentCategory;

let questions = [];
let currentQuestionIndex = 0;
let time = 10;
let score = 0;
let timer;

function openDatabase() {
  return new Promise((resolve, reject) => {
      const request = indexedDB.open('UserIdDB', 4);

      request.onerror = (event) => {
          console.error('An error occurred with IndexedDB', event);
          reject('Error');
      };

      request.onsuccess = (event) => {
          db = event.target.result;
          resolve(db);

      };

  });
}

function addScore(scoreData) {
  alert('quiz end')
  return openDatabase().then((db) => {
      return new Promise((resolve, reject) => {
          const transaction = db.transaction(['Users'], 'readwrite');
          const objectStore = transaction.objectStore('Users');
          const getRequest = objectStore.get(scoreData.username);

          getRequest.onsuccess = (event) => {
              const userData = event.target.result || { username: scoreData.username };
              if (!userData[scoreData.category]) {
                  userData[scoreData.category] = [];
              }
              userData[scoreData.category].push({ score: scoreData.score, date: scoreData.date });

              const putRequest = objectStore.put(userData);
              putRequest.onsuccess = () => {
                  resolve();
              };
              putRequest.onerror = (event) => {
                  reject(event.target.error);
              };
          };

          getRequest.onerror = (event) => {
              reject(event.target.error);
          };
      });
  });
}



  const endQuiz = () => {
    clearInterval(timer);
    quizContainer.hide();
    scoreContainer.show();
    scoreTextElement.text(`You scored ${score} out of --`);
    // alert('hello')
    const username = sessionStorage.getItem('username');
    const category = currentCategory; // assuming currentCategory is set when category is chosen
  
    if (username) {
        const scoreData = {
            username: username,
            category: category,
            score: score,
            date: new Date().toISOString()
        };
        alert(category);
        addScore(scoreData).then(() => {
            console.log('Score saved successfully');
        }).catch((error) => {
            console.error('Error saving score:', error);
        });
    } else {
        alert('No username found. Please log in.');
        window.location.href = '../HTML/index.html'; // Redirect to login page if no username is found
    }
  };
  
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


const startQuiz = () => {
  $.getJSON('../HTML/questions.json', (data) => {
      questions = data.categories[4].questions;
  }).fail(() => {
      console.log('Error');
  }).then(() => {
      loadQuestion();
  });
};

$(document).ready(function(){
  $.getJSON('../HTML/questions.json', function(data){
    let category = data.categories
    console.log(category);
    loadCategory(category)
    $('.small-container').on('click', function(){
      var click = $(this).text();
      currentCategory = click
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
    $('.restart').on('click', function(){
      $('.container1').css('display', 'none')
      $('.container1').slideToggle().animate()
      // scoreContainer.hide();
      startQuiz();
    })
  })
  
})



