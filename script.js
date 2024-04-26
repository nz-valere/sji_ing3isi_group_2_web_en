const questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "Hyper Text Markup Language", correct: true },
            { text: "Hyperlinks and Text Markup Language", correct: false },
            { text: "Home Tool Markup Language", correct: false },
            { text: "Hyper Transfer Markup Language", correct: false }
        ]
    },
    {
        question: "Which of the following is NOT a JavaScript data type?",
        answers: [
            { text: "String", correct: false },
            { text: "Boolean", correct: false },
            { text: "Float", correct: true },
            { text: "Object", correct: false }
        ]
    },
    // Add other questions here...
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answers");
const nextButton = document.getElementById("next");

let questionIndex = 0;
let score = 0;

function startQuiz() {
    questionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[questionIndex];
    questionElement.textContent = currentQuestion.question;

    // Clear answer buttons
    answerButtons.innerHTML = "";

    // Create answer buttons
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.classList.add("btn");
        button.addEventListener("click", () => {
            if (answer.correct) {
                score++;
            }
            questionIndex++;
            if (questionIndex < questions.length) {
                showQuestion();
            } else {
                // Quiz ended
                alert(`Quiz ended. Your score: ${score}/${questions.length}`);
            }
        });
        answerButtons.appendChild(button);
    });
}

startQuiz();