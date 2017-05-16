var auth = firebase.auth();
var storageRef = firebase.storage().ref();
$body = $("body");
$(document).ready(function (){

var batchSize= 8;
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
    // retrieveImages().then((imageList) => {
    //     for (var key in imageList) {
    //             var userimagedata = imageList[key].url;
                
    //             var likes = imageList[key].likes;
    //             var comments = imageList[key].totalcomments;
    //             var $griditem = $(`<div class="grid-item" id="${key}">
    //             <img src="${userimagedata}" />
    //             <div id="userimageinfo">
    //             <span>${comments} Comments</span>
    //             <span>${likes} Likes</span>
    //             </div>
    //         </div>`)
    //         // Add images to the image grid
    //         $('.grid').prepend($griditem).isotope('prepended', $griditem);
    //     }

    //     // Rearrange the layout once all images have loaded
    //     $('.grid').imagesLoaded(function () {
    //         console.log("all images loaded")
    //         $('.grid').isotope('layout');
    //     });
    // });

    /////////////////////////////////////////////////////
 fetchUserFirstImageBatch(batchSize).then((imageList) => {
        showUserImages(false, imageList);
    });
    $(document).endlessScroll({
        inflowPixels: 0,
        fireOnce: true,
        fireDelay: true,
        //loader: "Loading...",
        ceaseFireOnEmpty: false,
        callback: function (i, p, d) {
            console.log('Inside callback');
            if (d === 'next') {
                console.log("Window down Scrolled");
                fetchUserNextImageBatch(batchSize).then((imageList) => {
                    showUserImages(true, imageList);
                });
            }
        }
        // ,
        // ceaseFire : function(i,p,d){
        //     if (d ==='prev'){
        //         return true;
        //     }
        // }
    });


    /////////////////////////////////////////////////////

  } else {
    // No user is signed in.
    console.log("user not logged in");
  }
});

});

function highlightNav() {
    if (document.body.scrollTop > 0) {
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
        }).then((snap)=>{
            const key = snap.key;
            firebase.database().ref('images').child(key).set({
            url: url,
            totalcomments:ititialComments,
            likes:initialLikes,
            timestamp:-Date.now()
            
        });
    window.location ="user.html";  
    });

        $body.removeClass("loading");
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
            //     var $griditem = $(`<div class="grid-item" id="${uid}">
            //     <img src="${url}" />
            //     <div id="userimageinfo">
            //     <span>${ititialComments} Comments</span>
            //     <span>${initialLikes} Likes</span>
            //     </div>
            // </div>`)
            // console.log($griditem);
            // // Add images to the image grid
            // $('.grid').prepend($griditem).isotope('prepended', $griditem);

            // $('.grid').imagesLoaded(function () {
            //             console.log("all images loaded")
            //             $('.grid').isotope('layout');
            //   });

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////         
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
	

function showUserImages(ignorefirst, imageList) {
    
    var hideClass = 'hide';
    var currentUser = firebase.auth().currentUser;
    //Comment section show hide. If user logged in then show it, else keep it hidden.
    if (currentUser) {
        hideClass = '';
    }
    
    for (var i = 0; i < imageList.length; i++) {
        if (!ignorefirst) {
            var imagedata = imageList[i];
            //console.log("Appending Image " + JSON.stringify(imagedata));
            var key = Object.keys(imagedata);
            var data = imagedata[key];
            var commentKeys = [];
            data.comments = data.comments || [];
            var commentsListStr = '';
            try {
                commentKeys = Object.keys(data.comments);
                commentKeys.forEach(function(key) {
                    var comment = data.comments[key];
                    commentsListStr += $(`<li>
                        <span class="username">${comment.username}</span> says -
                        <span class="content">${comment.text}</span></li>`)[0].outerHTML;
                }, this);
            } catch (e) {

            }

            var $griditem = $(`<div class="grid-item" data-featherlight="#inner-${key}" id="${key}">
                <div id="inner-${key}" class="inner-grid-content">
                <img class="img-responsive" src="${data.url}" />
                <div id="imageinfo" class="likes">
                <span><i class="comments-count fa fa-comments">${commentKeys.length}</i></span>
                <span class="empty"></span>
                <span><i class="likes-count fa fa-heart">${data.likes}  </i> </span>
                </div>
                <section class="comments-section">
                    <span class="likes-count">${data.likes} </span><span onclick="addUserLike('${key}', this)" class="fa fa-heart"></span>
                    <span class="comments-count">${commentKeys.length} </span><span class="fa fa-comments"></span>
                    <div class="comment-form ${hideClass}">
                        <div class="form-group">
                            <label for="comment">Comment:</label>
                            <textarea class="form-control" rows="5" id="comment${key}" data-unique="i${key}"></textarea>
                        </div>
                    <button class="btn btn-primary" onclick="addUserComment('${key}', this)">Submit</button>
                    </div>
                    <ul class="comments-list">${commentsListStr}</ul>
                </section>
                </div></div>`);
            //console.log($griditem);
            // Add images to the image grid
            $('.grid').append($griditem).isotope('appended', $griditem).isotope('layout');
        } else {
            // Ignored first Image as it was already displayed in last batch
            ignorefirst = false;
        }
    }


    // Rearrange the layout once all images have loaded
    $('.grid').imagesLoaded().progress(function () {
        //console.log("all images loaded")
        $('.grid').isotope('layout');
            $('.grid-item').featherlightGallery({
                previousIcon: '«',
                nextIcon: '»',
                galleryFadeIn: 300,
                openSpeed: 300
            });    });
}

function addUserComment(imageId, elem) {
	var commentRef = firebase.database().ref('/images/' + imageId).child("comments");
	var newPostRef = commentRef.push();
    console.log("Comment adeed-", $("textarea[data-unique='i"+ imageId +"']")[1].value);
    var newComment = {
        text : $("textarea[data-unique='i"+ imageId +"']")[1].value,
        username : firebase.auth().currentUser.displayName,
        ts : Date.now()
    };
    newPostRef.set(newComment);
    //Append to UI.
   

updateCommentInUser(imageId,elem);
}
//update the user database also
function updateCommentInUser(imageId,elem){
    var uid = firebase.auth().currentUser.uid;
var commentRef = firebase.database().ref('/users/' + uid+'/images/' + imageId).child("comments");
	var newPostRef = commentRef.push();
    console.log("Comment adeed-", $("textarea[data-unique='i"+ imageId +"']")[1].value);
    var newComment = {
        text : $("textarea[data-unique='i"+ imageId +"']")[1].value,
        username : firebase.auth().currentUser.displayName,
        ts : Date.now()
    };
    newPostRef.set(newComment);
    //Append to UI.
    var commentStr = $(`<li>
            <span class="username">${newComment.username}</span> says -
            <span class="content">${newComment.text}</span></li>`)[0].outerHTML;
    $(elem).parent().siblings(".comments-list").prepend($(commentStr));
    //Update count on UI - popup.
    var commentCount = $(elem).parent().siblings('span.comments-count');
    var newCount = (parseInt(commentCount.text()) || 0) + 1
     commentCount.text(newCount);
     //Update on homepage too.
     $("#" + imageId).find(".comments-count").eq(0).text(newCount);
}

function addUserLike(imageId, elem) {
    var likeCount = (parseInt($(elem).siblings('span.likes-count').text()) || 0) + 1;
    firebase.database().ref('/images/' + imageId).update({likes : likeCount});
    $(elem).siblings('span.likes-count').text(likeCount);
    //Update on homepage too.
     $("#" + imageId).find(".likes-count").eq(0).text(likeCount);

     updateLikesInUser(imageId,elem);
}

function updateLikesInUser(imageId,elem)
{
  var uid = firebase.auth().currentUser.uid;
  var likeCount = parseInt($(elem).siblings('span.likes-count').text());
  firebase.database().ref('/users/' + uid+'/images/' + imageId).update({likes : likeCount}); 
}