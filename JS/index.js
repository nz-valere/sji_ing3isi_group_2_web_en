$(document).ready(function() {
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

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains("Users")) {
                const userIdDB = db.createObjectStore("Users", { keyPath: "user" });
                userIdDB.createIndex("user", "user", { unique: true });
                userIdDB.createIndex("password", "password", { unique: false });
                console.log("Object store 'Users' created");
            }
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            console.log("Database initialized successfully");
            bindFormEvents();
        };
    }

    function bindFormEvents() {
        function addUser(username, password) {
            if (!db.objectStoreNames.contains("Users")) {
                console.log("Object store 'Users' does not exist.");
                return;
            }

            const transaction = db.transaction(["Users"], "readwrite");
            const store = transaction.objectStore("Users");

            const userIndex = store.index("user");
            const userRequest = userIndex.get(username);

            userRequest.onsuccess = function() {
                if (userRequest.result) {
                    console.log("Username already exists. Please choose a different one.");
                } else {
                    const addUserRequest = store.add({ user: username, password: password });
                    addUserRequest.onsuccess = function() {
                        console.log("User added successfully!");
                        alert(`User ID '${username}' added to the database successfully!`);
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
                alert("Passwords do not match. Please try again.");
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
});
