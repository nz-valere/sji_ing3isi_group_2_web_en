const DB_VERSION = 2; // Increment the version to trigger onupgradeneeded

const DB_SCORE_STORE_NAME = 'Scores';

let db;

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
            bind()
            // work Here

        };

    });
}
function bind(){
    function getUser(username) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['Users'], 'readonly');
            const store = transaction.objectStore('Users');
            const request = store.get(username);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject('Error fetching user:', event);
            };
        });
    }

    function addUser(user) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['Users'], 'readwrite');
            const store = transaction.objectStore('Users');
            const request = store.add(user);

            request.onsuccess = () => {
                resolve('User added successfully');
            };

            request.onerror = (event) => {
                reject('Error adding user:', event);
            };
        });
    }

    function updateUser(user) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['Users'], 'readwrite');
            const store = transaction.objectStore('Users');
            const request = store.put(user);

            request.onsuccess = () => {
                resolve('User updated successfully');
            };

            request.onerror = (event) => {
                reject('Error updating user:', event);
            };
        });
    }


    function addScore(score) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['Scores'], 'readwrite');
            const store = transaction.objectStore('Scores');
            const request = store.add(score);

            request.onsuccess = () => {
                resolve('Score added successfully');
            };

            request.onerror = (event) => {
                reject('Error adding score:', event);
            };
        });
    }

    function getScoresByUsername(username) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['Scores'], 'readonly');
            const store = transaction.objectStore('Scores');
            const index = store.index('username');
            const request = index.getAll(username);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject('Error fetching scores:', event);
            };
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    openDatabase().then(() => {
        console.log('Database initialized');
    }).catch((error) => {
        console.error(error);
    });
});
