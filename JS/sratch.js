const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answers");
const nextButton = document.getElementById("next");

let questionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuestions() {
    try {
        const response = await fetch("questions.json");
        if (!response.ok) {
            throw new Error("Failed to fetch questions");
        }
        questions = await response.json();
        startQuiz();
    } catch (error) {
        console.error("Error fetching questions:", error.message);
    }
}

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

fetchQuestions();
