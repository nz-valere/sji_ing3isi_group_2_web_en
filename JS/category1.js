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
// hello
const startQuiz = () => {
  $.getJSON('../HTML/questions.json', (data) => {
      questions = data.categories[0].questions;
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


