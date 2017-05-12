var database;

// Returns a Promise which whne resolved returns a JSON with all images
function fetchImages() {
    
    return database.ref('/images').once('value').then(function (imageList) {
        console.log(imageList.val());
        return Promise.resolve(imageList.val());
    });
}

function connectDB() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBiyoO98d-j8nRV3Bmh1ZAdI-hsLjpif8o",
        authDomain: "photosharing-c37de.firebaseapp.com",
        databaseURL: "https://photosharing-c37de.firebaseio.com",
        projectId: "photosharing-c37de",
        storageBucket: "photosharing-c37de.appspot.com",
        messagingSenderId: "1065700949630"
    };
    firebase.initializeApp(config);
    // Get a reference to the database service
    database = firebase.database();

    //var userId = firebase.auth().currentUser.uid;
}