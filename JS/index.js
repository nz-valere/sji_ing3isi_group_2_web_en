$(document).ready(function() {

    const indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB;

    let db;

    function deleteDatabase() {
        console.log("Deleting existing database...");
        const deleteRequest = indexedDB.deleteDatabase("UserIdDB");

        deleteRequest.onerror = function(event) {
            console.log("Error deleting database:", event);
        };

        deleteRequest.onsuccess = function(event) {
            console.log("Database deleted successfully");
            initializeDatabase();
        };
    }

    function initializeDatabase() {
        console.log("Initializing database...");
        const request = indexedDB.open("UserIdDB", 3);

        request.onerror = function(event) {
            console.log('An error occurred with IndexedDB');
            console.log(event);
        };

        request.onupgradeneeded = function(event) {
            db = event.target.result;
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

        request.onsuccess = function(event) {
            db = event.target.result;
            console.log("Database initialized successfully", db.objectStoreNames);
            bindFormEvents();
        };
    }

    function bindFormEvents() {
        function addUser(username, password) {
            console.log("Adding user:", username);
            if (!db.objectStoreNames.contains("Users")) {
                console.log("Object store 'Users' does not exist.");
                return;
            }

            const transaction = db.transaction(["Users"], "readwrite");
            const store = transaction.objectStore("Users");

            const userRequest = store.get(username);

            userRequest.onsuccess = function() {
                if (userRequest.result) {
                    console.log("Username already exists. Please choose a different one.");
                } else {
                    const addUserRequest = store.add({ username: username, password: password });
                    addUserRequest.onsuccess = function() {
                        console.log("User added successfully!");
                        alert(`User ID '${username}' added to the database successfully!`);
                        sessionStorage.setItem('username', username); // Temporarily store the username
                        window.location.href = '../HTML/Home.html'; // Redirect to home.html
                    };
                    addUserRequest.onerror = function(event) {
                        console.log("Error adding user.", event);
                    };
                }
            };

            userRequest.onerror = function(event) {
                console.log("Error fetching user:", event);
            };
        }

        function getUser(username, password, callback) {
            console.log("Getting user:", username);
            if (!db.objectStoreNames.contains("Users")) {
                console.log("Object store 'Users' does not exist.");
                callback(false);
                return;
            }

            const transaction = db.transaction(["Users"], "readonly");
            const store = transaction.objectStore("Users");

            const userRequest = store.get(username);
            userRequest.onsuccess = function() {
                const user = userRequest.result;
                if (user && user.password === password) {
                    callback(true);
                } else {
                    callback(false);
                }
            };

            userRequest.onerror = function(event) {
                console.log("Error fetching user:", event);
                callback(false);
            };
        }

        $("#signup-form").submit(function(event) {
            event.preventDefault();

            const username = $("#signup-username").val();
            const password = $("#signup-password").val();
            const confirmPassword = $("#signup-confirm-password").val();

            if (password !== confirmPassword) {
                $("#error_message").text("Passwords do not match. Please try again.");
                return;
            }

            addUser(username, password);
        });

        $("#login-form").submit(function(event) {
            event.preventDefault();

            const username = $("#username").val();
            const password = $("#password").val();

            getUser(username, password, function(isValid) {
                if (isValid) {
                    alert("Login successful!");
                    sessionStorage.setItem('username', username); // Temporarily store the username
                    window.location.href = '../HTML/Home.html'; // Redirect to home.html
                } else {
                    $("#error-message").text("Invalid username or password. Please try again.");
                }
            });
        });

        $('.xy').on('click', function(){
            $('#login-container').slideToggle().animate({fontSize: '15px'});
            $('.xy').css('display','none');
        });

        $('.zz').on('click', function(){
            $('.signup-container').slideToggle().animate({fontSize: '15px'});
            $('#login-container').css('display','none');
        });
    }

    initializeDatabase();
    // deleteDatabase();
});
