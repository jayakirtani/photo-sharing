var auth = firebase.auth();
var storageRef = firebase.storage().ref();

$(document).ready(function (){

document.getElementById('image_file').addEventListener('change', handleFileSelect, false);
document.getElementById('image_file').disabled = true;
auth.onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
    document.getElementById('image_file').disabled = false;
$('#hello').replaceWith("<h2>Hello "+user.displayName +"</h2>")

  } else {
    // No user is signed in.
    console.log("user not logged in");
  }
});



});

function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var file = evt.target.files[0];
      var metadata = {
        'contentType': file.type
      };
      // Push to child path.
      // [START oncomplete]
      storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log(snapshot.metadata);
        var url = snapshot.metadata.downloadURLs[0];
        console.log('File available at', url);
        // [START_EXCLUDE]
        document.getElementById('linkbox').innerHTML = '<a href="' +  url + '">Click For File</a>';

        var database = firebase.database();
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + uid+'/images/').push({
            image: url,
        });
        console.log(uid);

        // [END_EXCLUDE]
      }).catch(function(error) {
        // [START onfailure]
        console.error('Upload failed:', error);
        // [END onfailure]
      });
      // [END oncomplete]
    }