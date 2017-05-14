function retrieveImages() {
    var uid = firebase.auth().currentUser.uid;
	console.log("uid:"+uid);
    return firebase.database().ref('users/' + uid+'/images/').once('value').then(function (imageList) {
        console.log(imageList.val());
        return Promise.resolve(imageList.val());
    });
}