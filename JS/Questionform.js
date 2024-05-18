// let question =[],
//     time = 30;
//     score = 0,
//     currentQuestion,
//     timer;


// const progressBar = document.querySelector(".progress-bar"),
//     progressText = document.querySelector(".progress-text");

//     fetch('questions.json')
//     .then((res)=> res.json())
//     .then((data)=>{
//         question = data.results;
//         console.log(question);
//     });

// const progress = (value) =>{
//     const percentage = (value/time) *100;
//     progressBar.style.width = `${percentage}%`;
//     prgressText.innerHTML = `${value}`;
//     // progressBar.getElementsByClassName
// };

// // chose the category to play
// const category = document.querySelector('category')

// const startQuiz = () =>{
//     const cat = category.value;


// }

// Define variables
let question = [],
    time = 30,
    score = 0,
    currentQuestion,
    timer;

const progressBar = document.querySelector(".progress-bar"),
      prgressText = document.querySelector(".progress-text");


// Define progress function
const progress = (value) =>{
    const percentage = (value/time) *100;
    progressBar.style.width = `${percentage}%`;
    prgressText.innerHTML = `${value}`;
    // progressBar.getElementsByClassName
};

// Define category
const category = document.querySelector('category');

// Define startQuiz function
const startQuiz = () =>{
    const cat = category.value;
    // my logic for starting the quiz
    // Fetch questions
    fetch('questions.json')
    .then((res)=> res.json())
    .then((data)=>{
        question = data.results;
        console.log(question);
        score.style.display = 'none';
    });

};
