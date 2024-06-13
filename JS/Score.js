$(document).ready(function() {
    const categoryListElement = $('.category-list');
    const scoreBodyElement = $('#score-body');
    const categoryTitleElement = $('.category-title');

    // Fetch and display categories
    function loadCategories() {
        $.getJSON('../HTML/questions.json', function(data) {
            const categories = data.categories;
            categories.forEach(category => {
                const categoryButton = $(`<button class="category-button">${category.name}</button>`);
                categoryButton.on('click', function() {
                    loadScores(category.name);
                });
                categoryListElement.append(categoryButton);
            });
        }).fail(() => {
            console.error('Error loading categories.');
        });
    }

    // Fetch and display scores for a category
    function loadScores(category) {
        const request = indexedDB.open("UserIdDB", 3);

        request.onerror = function(event) {
            console.error("Database error: ", event.target.errorCode);
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(["Scores"], "readonly");
            const store = transaction.objectStore("Scores");
            const index = store.index("category");
            const scores = [];

            index.openCursor(IDBKeyRange.only(category)).onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    scores.push(cursor.value);
                    cursor.continue();
                } else {
                    displayScores(category, scores);
                }
            };

            index.openCursor(IDBKeyRange.only(category)).onerror = function(event) {
                console.error('Cursor error: ', event.target.errorCode);
            };
        };
    }

    // Display scores in descending order
    function displayScores(category, scores) {
        scores.sort((a, b) => b.score - a.score);
        categoryTitleElement.text(`Scores for ${category}`);
        scoreBodyElement.empty();
        scores.forEach(score => {
            const row = $(`
                <tr>
                    <td>${score.username}</td>
                    <td>${score.score}</td>
                    <td>${new Date(score.date).toLocaleString()}</td>
                </tr>
            `);
            scoreBodyElement.append(row);
        });
    }

    loadCategories();
});
