function getCumulativeScore(username, category) {
  return new Promise((resolve, reject) => {
      const request = indexedDB.open("UserIdDB", 3);

      request.onerror = function(event) {
          console.error("Database error: ", event.target.errorCode);
          reject("Database error: " + event.target.errorCode);
      };

      request.onsuccess = function(event) {
          const db = event.target.result;
          const transaction = db.transaction(["Scores"], "readonly");
          const scoreStore = transaction.objectStore("Scores");

          const index = scoreStore.index("username");
          const userScores = [];

          index.openCursor(IDBKeyRange.only(username)).onsuccess = function(event) {
              const cursor = event.target.result;
              if (cursor) {
                  if (cursor.value.category === category) {
                      userScores.push(cursor.value.score);
                  }
                  cursor.continue();
              } else {
                  // No more entries, calculate the cumulative score
                  const cumulativeScore = userScores.reduce((acc, score) => acc + score, 0);
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
getCumulativeScore('someUsername', 'someCategory')
  .then(cumulativeScore => {
      console.log('Cumulative Score:', cumulativeScore);
  })
  .catch(error => {
      console.error('Error:', error);
  });