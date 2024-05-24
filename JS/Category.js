var cat
const catList = document.getElementById('category-list')
const describtionDiv = document.querySelector('.description p')
const describtionDivImg = document.querySelector('.description img')

var xhttp = new XMLHttpRequest();
function displayDescription(description) {
    
}
function handleCategoryClick(category) {
    describtionDiv.innerHTML = category.description;
    describtionDivImg.setAttribute('src',`../Assets/images/${category.name}.jpg`)
    window.location.href = `../HTML/QUESTIONFORM.html?category=${category.name}`;
}
xhttp.onreadystatechange = function() {
    if(this.readyState == 4){
        var response = JSON.parse(xhttp.responseText)
        cat = response.categories
        console.log(response)
        console.log(cat)
        for (const iterator of cat) {
            var div = document.createElement('div')
            div.classList.add('category-btn')
            div.innerHTML = iterator.name;
            catList.append.div;
            div.addEventListener('click', () => handleCategoryClick(iterator));
        }
        // selectCategory(cat)
    }
}
xhttp.open("GET","../HTML/questions.json",true)
xhttp.send()

console.log("Home");


