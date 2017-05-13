
// Returns a Promise which whne resolved returns a JSON with all images
function fetchImages() {
    
    return firebase.database().ref('/images').once('value').then(function (imageList) {
        console.log(imageList.val());
        return Promise.resolve(imageList.val());
    });
}

