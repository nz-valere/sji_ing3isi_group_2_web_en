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

function getCumulativeScore(username) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("YourDatabaseName", 1);

        request.onerror = function(event) {
            console.error("Database error: ", event.target.errorCode);
            reject("Database error: " + event.target.errorCode);
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(["Scores"], "readonly");
            const scoreStore = transaction.objectStore("Scores");

            const index = scoreStore.index("username");
            let cumulativeScore = 0;

            index.openCursor(IDBKeyRange.only(username)).onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    cumulativeScore += cursor.value.score;
                    cursor.continue();
                } else {
                    // No more entries, return the cumulative score
                    resolve(cumulativeScore);
                }
            };

            index.openCursor(IDBKeyRange.only(username)).onerror = function(event) {
                console.error("Cursor error: ", event.target.errorCode);
                reject("Cursor error: " + event.target.errorCode);
            };
        };

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("Users")) {
                const userIdDB = db.createObjectStore("Users", { keyPath: "username" });
                userIdDB.createIndex("password", "password", { unique: false });
                console.log("Object store 'Users' created");
            }
            if (!db.objectStoreNames.contains("Scores")) {
                const scorestore = db.createObjectStore("Scores", { keyPath: "id", autoIncrement: true });
                scorestore.createIndex("username", "username", { unique: false });
                scorestore.createIndex('category', 'category', { unique: false });
                scorestore.createIndex('score', 'score', { unique: false });
                console.log("Object store 'Scores' created");
            }
        };
    });
}

// Usage
getCumulativeScore('someUsername')
    .then(cumulativeScore => {
        console.log('Cumulative Score:', cumulativeScore);
    })
    .catch(error => {
        console.error('Error:', error);
    });


    const carousel = document.querySelector(".carousel"),
firstImg = carousel.querySelectorAll("img")[0],
arrowIcons = document.querySelectorAll(".wrapper i");
let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff, autoScrollInterval;


const showHideIcons = () => {
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
    arrowIcons[1].style.display = carousel.scrollLeft == scrollWidth ? "none" : "block";
}

const updateProgressIndicator = () => {
    const progressIndicator = document.querySelector(".progress-indicator");
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    let scrollPosition = (carousel.scrollLeft / scrollWidth) * 100;
    progressIndicator.style.width = `${scrollPosition}%`;
}

arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        let firstImgWidth = firstImg.clientWidth + 14;
        carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
        setTimeout(() => showHideIcons(), 60);
        updateProgressIndicator();
    });
});

const autoSlide = () => {
    if (carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth) - 1) {
        carousel.scrollLeft = 0;
    } else {
        let firstImgWidth = firstImg.clientWidth + 14;
        carousel.scrollLeft += firstImgWidth;
    }
    updateProgressIndicator();
    showHideIcons();
}

const startAutoScroll = () => {
    autoScrollInterval = setInterval(autoSlide, 3000);
}

const stopAutoScroll = () => {
    clearInterval(autoScrollInterval);
}

const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
    stopAutoScroll();
}

const dragging = (e) => {
    if (!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    updateProgressIndicator();
    showHideIcons();
}