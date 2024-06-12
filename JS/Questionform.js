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

// Function to update the progress bar
const updateProgress = (value) => {
    progressText.text(`${value}`)
    const percentage = (value / time) * 100;
    progressBar.css("width", `${percentage}%`);
};

// updateProgress()

// Function to load the next question
const loadQues = () => {
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
        endQz();
    }
};

// Function to check the selected answer
const checkAnswer = (selectedAnswer, correctAnswer) => {
    if (selectedAnswer === correctAnswer) {
        score += 3;
        // scoreElement.text(score);
        scoreTextElement.text(`Your score: ${score}`);
    }
    currentQuestionIndex++;
    changeBackgroundColor();
    loadQues();
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
            loadQues();
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
const endQz = () => {
    clearInterval(timer);
    quizContainer.hide();
    scoreContainer.show();
    scoreTextElement.text(`You scored ${score} out of ${questions.length * 3}`);
};

const start = () => {
    $.getJSON('../HTML/questions.json', (data) => {
        questions = data.categories[0].questions;
    }).fail(() => {
        console.log('Error');
    }).then(() => {
        loadQues();
    });
};

$('btn').on('click', function () {
    console.log('hello');
    scoreContainer.hide();
    start();
});
