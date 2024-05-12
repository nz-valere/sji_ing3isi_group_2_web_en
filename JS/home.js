var cat
const catList = document.getElementsByClassName('ctegory')

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if(this.readyState == 4){
        var response = JSON.parse(xhttp.responseText)
        cat = response.categories
        console.log(response)
        console.log(cat)
        for (const iterator of cat) {
            var div = document.createElement('div')
            div.classList.add('cat')
            div.innerHTML = iterator.name
            catList.append(div)
        }
        // selectCategory(cat)
    }
}
xhttp.open("GET","../HTML/questions.json",true)
xhttp.send()