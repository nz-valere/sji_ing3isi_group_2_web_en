$(document).ready(function() {
    var questionElement = $("#question");
    var answerButtons = $("#answers");
    var nextButton = $("#next");

    var questionIndex = 0;
    var score = 0;
    var questions = [];

    // Fetch JSON data
    $.getJSON("questions.json")
        .done(function(data) {
            questions = data;
            showQuestion();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("Error loading questions:", errorThrown);
        });

    function showQuestion() {
        var currentQuestion = questions[questionIndex];
        questionElement.text(currentQuestion.question);

        answerButtons.empty();

        $.each(currentQuestion.answers, function(index, answer) {
            var button = $("<button>").text(answer.text).addClass("btn");
            button.on("click", function() {
                if (answer.correct) {
                    score++;
                }
                questionIndex++;
                if (questionIndex < questions.length) {
                    showQuestion();
                } else {
                    endQuiz();
                }
            });
            answerButtons.append(button);
        });
    }

    function endQuiz() {
        alert("Quiz ended. Your score: " + score + "/" + questions.length);
    }
});
