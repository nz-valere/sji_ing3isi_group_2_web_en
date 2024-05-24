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
xhttp.send();

document.addEventListener("DOMContentLoaded", function() {
    const indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB;

    let db;

    function initializeDatabase() {
        const request = indexedDB.open("UserIdDB", 1);

        request.onerror = function(event) {
            console.log('An error occurred with IndexedDB');
            console.log(event);
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            displayUsername();
        };
    }

    function displayUsername() {
        const transaction = db.transaction(["Users"], "readonly");
        const store = transaction.objectStore("Users");

        // Assuming the username is stored in `sessionStorage` temporarily
        const username = sessionStorage.getItem('username');
        if (!username) {
            alert('No username found. Please log in.');
            window.location.href = '../HTML/index.html'; // Redirect to login page if no username is found
            return;
        }

        const userRequest = store.get(username);
        userRequest.onsuccess = function() {
            const user = userRequest.result;
            if (user) {
                document.getElementById('user').textContent = user.user;
            } else {
                alert('No user found with the given username. Please log in again.');
                window.location.href = '../HTML/index.html';
            }
        };

        userRequest.onerror = function(event) {
            console.log("Error fetching user:", event);
        };
    }

    initializeDatabase();
});
