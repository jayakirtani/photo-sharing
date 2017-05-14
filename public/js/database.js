var database;
var lastImageTimestamp = 0;

// Returns a Promise which whne resolved returns a JSON with all images
function fetchImages() {
    return database.ref('/images').once('value').then(function (imageList) {
        return Promise.resolve(imageList.val());
    });
}


function fetchFirstImageBatch(batchsize) {
    return new Promise(function (fulfill, reject) {
        database.ref('images').orderByChild('timestamp').limitToFirst(batchsize).on('value', function (list) {
            console.log("First Batch");
            //console.log(list.val()); // JSON with all image data
            //console.log(list.key); //images
            var orderedData=[];
            // Loop through each JSON Object inside list and push the data in
            // an array to maintain order
            list.forEach(function (child) {
                //console.log(child.val())
                var key = child.key;
                var data = child.val();
                orderedData.push({key : data});
                lastImageTimestamp = child.val().timestamp;
            });
            console.log("lastImageTimestamp" + lastImageTimestamp);
            fulfill(orderedData);
        });
    });
}

function fetchNextImageBatch(batchsize) {
    return new Promise(function (fulfill, reject) {
        database.ref('images').orderByChild('timestamp').startAt(lastImageTimestamp).limitToFirst(batchsize).on('value', function (imageList) {
            console.log("Next Batch");
            var orderedData=[];
            imageList.forEach(function (child) {
                //console.log(child.val()) // NOW THE CHILDREN PRINT IN ORDER
                var key = child.key;
                var data = child.val();
                orderedData.push({key : data});
                lastImageTimestamp = child.val().timestamp;
            });
            fulfill(orderedData);
            //fulfill(imageList.val());
        });
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
    console.log("database " + database);

    //var userId = firebase.auth().currentUser.uid;
}