const indexedDB = 
    window.indexedDB ||
    mozIndexedDb ||
    webkitIdexedDB ||
    msIndexedDB;
 
const request = indexedDB.open("UserIdDB", 1);

request.onerror = function(event){
    console.log('An error occured with idexedDB');
    console.log(event);
};
request.onupgradeneeded = function (){
const db = request.result;
const UserIdDB = db.createObjectStore("Users",{keyath : "id"});
UserIdDB.createIndex("User", [user], {unique: true});
UserIdDB.createIndex("password", [password], {unique: false});
};

request.onsuccess = function(event){
    const db = request.result;
    const transaction = db.transaction("Users", "readwrite");
    const store = transaction.objectStore("Users");
    const userIndex = store.index(User);
    const passIndex = store.index(password);

    store.put({id: 1,user:"val" ,password: "12345"});

    const idQuerry = store.get(1);
    const userQuerry = userIndex.get("val");

    idQuerry.onsuccess = function () {
        console.log("idQuerry", idQuerry.result);
    };
    userQuerry.onsuccess = function () {
        console.log("userQuerry", userQuerry.result);
    };

    transaction.oncomplete = function (){
        db.close();
    };
};