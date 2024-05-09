var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if(this.readyState == 4 || this.status == 200){
        var response = JSON.parse(xhttp.responseText)
        cat = response.categories
        console.log(cat)
        selectCategory(cat)
    }
}
xhttp.open("GET","questions.json",true)
xhttp.send()

function selectCategory(category) {
    // currentCategory = category;
    for (const iterator of category) {
        div = document.createElement('div')
        div.classList.add('category-buttons')
        div.innerHTML = iterator.name;
        selectCat.append(div)
        div.addEventListener('click', function(){
            console.log(this.innerHTML);
            quizContainer.style.display = "block";
            categorySelectionContainer.style.display = "none";
            switch (this.innerHTML) {
                case 'Sports':
                    currentCategory = category[0]
                    displayQuestion(currentCategory.questions[0]);
                    break;
                case 'Culture':
                    currentCategory = category[1]
                    displayQuestion(currentCategory.questions[0]);
                default:
                    break;
            }
            
        })
        // categorySelectionContainer.innerHTML = iterator.name;
    }
}
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