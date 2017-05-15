var auth = firebase.auth();
var storageRef = firebase.storage().ref();
$body = $("body");
$(document).ready(function (){

window.onscroll = function () {
        highlightNav()
    };
document.getElementById('image_file').addEventListener('change', handleFileSelect, false);
document.getElementById('image_file').disabled = true;

auth.onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
    document.getElementById('image_file').disabled = false;
$('#hello').replaceWith("<h2>Hello "+user.displayName +"</h2>");
 
// Arrange Images using masonry layout grid
    $('.grid').isotope({
        itemSelector: '.grid-item',
        //layoutMode: 'fitRows'
        //layoutMode: 'masonry',
        percentPosition: true,
        columnWidth: '.grid-sizer',
    });
    retrieveImages().then((imageList) => {
        for (var key in imageList) {
                var userimagedata = imageList[key].url;
                
                var likes = imageList[key].likes;
                var comments = imageList[key].totalcomments;
                var $griditem = $(`<div class="grid-item" id="${key}">
                <img src="${userimagedata}" />
                <div id="userimageinfo">
                <span>${comments} Comments</span>
                <span>${likes} Likes</span>
                </div>
            </div>`)
            // Add images to the image grid
            $('.grid').prepend($griditem).isotope('prepended', $griditem);
        }

        // Rearrange the layout once all images have loaded
        $('.grid').imagesLoaded(function () {
            console.log("all images loaded")
            $('.grid').isotope('layout');
        });
    });

  } else {
    // No user is signed in.
    console.log("user not logged in");
  }
});

});

function highlightNav() {
    if (document.body.scrollTop > 10) {
        console.log("inside class add");
        $(".navbar").addClass('navbar-fixed-top highlight');
    } else {
        $(".navbar").removeClass('navbar-fixed-top highlight');
    }
}

function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var file = evt.target.files[0];
      var metadata = {
        'contentType': file.type
      };

      $body.addClass("loading");
      document.getElementById('image_file').disabled = true;
      storageRef.child('images/' + generateUUID()+file.name).put(file, metadata).then(function(snapshot) {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log(snapshot.metadata);
        var url = snapshot.metadata.downloadURLs[0];
        console.log('File available at', url);
  
       // document.getElementById('linkbox').innerHTML = '<a href="' +  url + '">Click For File</a>';
        var database = firebase.database();
        var uid = firebase.auth().currentUser.uid;
        var ititialComments = 0;
        var initialLikes = 0;
        firebase.database().ref('users/' + uid+'/images/').push({
            url: url,
            totalcomments:ititialComments,
            likes:initialLikes,
            timestamp:-Date.now()
        });

        firebase.database().ref('/images/').push({
            url: url,
            totalcomments:ititialComments,
            likes:initialLikes,
            timestamp:-Date.now()
        });

        $body.removeClass("loading");
                var $griditem = $(`<div class="grid-item" id="${uid}">
                <img src="${url}" />
                <div id="userimageinfo">
                <span>${ititialComments} Comments</span>
                <span>${initialLikes} Likes</span>
                </div>
            </div>`)
            console.log($griditem);
            // Add images to the image grid
            $('.grid').prepend($griditem).isotope('prepended', $griditem);

            $('.grid').imagesLoaded(function () {
                        console.log("all images loaded")
                        $('.grid').isotope('layout');
              });
              document.getElementById('image_file').disabled = false;
        console.log(uid);
      }).catch(function(error) {
        console.error('Upload failed:', error);
      });
      
    }

//Generate high quality UUID's for giving images a unique name
  function generateUUID() {
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now();; //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
	
