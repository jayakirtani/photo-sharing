function retrieveImages() {
    var uid = firebase.auth().currentUser.uid;
	console.log("uid:"+uid);
    return firebase.database().ref('users/' + uid+'/images/').once('value').then(function (imageList) {
        console.log(imageList.val());
        return Promise.resolve(imageList.val());
    });
}


function fetchUserFirstImageBatch(batchsize) {
    var uid = firebase.auth().currentUser.uid;
    return new Promise(function (fulfill, reject) {
        firebase.database().ref('users/' + uid+'/images/').orderByChild('timestamp').limitToFirst(batchsize).on('value', function (list) {
            console.log("First Batch");
            //console.log(list.val()); // JSON with all image data
            //console.log(list.key); //images
            var orderedData = [];
            // Loop through each JSON Object inside list and push the data in
            // an array to maintain order
            list.forEach(function (child) {
                var dataObject = {};
                dataObject[child.key] = child.val();
                orderedData.push(dataObject);
                lastImageTimestamp = child.val().timestamp;
            });
            console.log("lastImageTimestamp" + lastImageTimestamp);
            fulfill(orderedData);
        });
    });
}

function fetchUserNextImageBatch(batchsize) {
    var uid = firebase.auth().currentUser.uid;
    return new Promise(function (fulfill, reject) {
        firebase.database().ref('users/' + uid+'/images/').orderByChild('timestamp').startAt(lastImageTimestamp).limitToFirst(batchsize).on('value', function (imageList) {
            console.log("Next Batch");
            var orderedData = [];
            imageList.forEach(function (child) {
                var dataObject = {};
                dataObject[child.key] = child.val();
                orderedData.push(dataObject);
                lastImageTimestamp = child.val().timestamp;
            });
            fulfill(orderedData);
            //fulfill(imageList.val());
        });
    });
}
