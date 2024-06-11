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
        const request = indexedDB.open("UserIdDB", 3);

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

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('UserIdDB', 3);
  
        request.onerror = (event) => {
            console.error('An error occurred with IndexedDB', event);
            reject('Error');
        };
  
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
  
        };
  
    });
}

    async function getCumulatedScore(username, category) {
        const db = await openDatabase();
        return await new Promise((resolve, reject) => {
            const transaction = db.transaction(['Scores'], 'readonly');
            const objectStore = transaction.objectStore('Scores');
            const getRequest = objectStore.get(username);

            getRequest.onsuccess = (event) => {
                const userData = event.target.result;
                alert(userData);
                if (userData && userData[category]) {
                    const scores = userData[category];
                    alert(scores)
                    const cumulatedScore = scores.reduce((total, scoreEntry) => total + scoreEntry.score, 0);
                    resolve(cumulatedScore);
                } else {
                    resolve(0); // If no data found for user or category, return 0
                }
            };

            getRequest.onerror = (event_1) => {
                reject(event_1.target.error);
            };
        });
    }

const username = 'valere'
const category = 'Music'

getCumulatedScore(username, category).then((cumulatedScore) => {
    console.log(`Cumulated score for ${username} in ${category}:`, cumulatedScore);
}).catch((error) => {
    console.error('Error retrieving cumulated score:', error);
});