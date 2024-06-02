// const category
const catList = document.getElementById('category-list')
const describtionDiv = document.querySelector('.description p')
const describtionDivImg = document.querySelector('.description img')
const ul = $("<ul class ='list-group'></ul>") 
const cat = $('.Category-list')

function displayDescription(description) {
    
}
function handleCategoryClick(category) {
    describtionDiv.innerHTML = category.description;
    describtionDivImg.setAttribute('src',`../Assets/images/${category.name}.jpg`)
    window.location.href = `../HTML/QUESTIONFORM.html?category=${category.name}`;
}
$.getJSON('../HTML/questions.json', function(data){

})
const loadCategory = function(category){
    for (const iterator of category){
        ul.append(`<li class = 'list-group-item list-group-item-action'>${iterator.name}</li>`)
        console.log(ul);
    }
    cat.append(ul)
    console.log(cat);
}

console.log("Home");

$(document).ready(function(){
    $.getJSON('../HTML/questions.json', function(data){
        category = data.categories
        // console.log(category);
        loadCategory(category)
    })
    
})
