$(document).ready(function () {
    //Connect to Firebase Database
    //connectDB();
const btnLogin = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');
const btnUser = document.getElementById('btnUser');

btnLogout.classList.add('hide');
btnUser.classList.add('hide');

    var batchSize= 25;

    window.onscroll = function () {
        highlightNav()
    };

    // Arrange Images using masonry layout grid
    $('.grid').isotope({
        itemSelector: '.grid-item',
        //layoutMode: 'fitRows'
        //layoutMode: 'masonry',
        percentPosition: true,
        columnWidth: '.grid-sizer',
    });

    fetchFirstImageBatch(batchSize).then((imageList) => {
        showImages(false, imageList);
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
                fetchNextImageBatch(batchSize).then((imageList) => {
                    showImages(true, imageList);
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

    btnUser.addEventListener('click', e=>{

    window.location ="user.html";
   
});

//logout button eventlistner
btnLogout.addEventListener('click', e=>{
    firebase.auth().signOut();
    window.location ="index.html";
});

firebase.auth().onAuthStateChanged(firebaseUser=> { 
          var uid = firebase.auth().currentUser.uid;
          var commentForms = $(".comment-form");
          if(firebaseUser)
          {
              commentForms.hide();
              btnLogin.classList.add('hide');
              btnLogout.classList.remove('hide'); 
              btnUser.classList.remove('hide'); 
          }
          else
          {
              commentForms.show();
              console.log("Not logged In");
              btnLogin.classList.remove('hide');
              btnLogout.classList.add('hide');
          }
});


});


function showImages(ignorefirst, imageList) {

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
                    <span class="likes-count">${data.likes} </span><span onclick="addLike('${key}', this)" class="fa fa-heart"></span>
                    <span class="comments-count">${commentKeys.length} </span><span class="fa fa-comments"></span>
                    <div class="comment-form ${hideClass}">
                        <div class="form-group">
                            <label for="comment">Comment:</label>
                            <textarea class="form-control" rows="5" id="comment${key}" data-unique="i${key}"></textarea>
                        </div>
                        <button class="btn btn-primary" onclick="addComment('${key}', this)">Submit</button>
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

function highlightNav() {
    if (document.body.scrollTop > 200) {
        //console.log("inside class add");
        $(".navbar").addClass('navbar-fixed-top highlight');
    } else {
        $(".navbar").removeClass('navbar-fixed-top highlight');
    }
}

function addComment(imageId, elem) {
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
    $(".comments-list").prepend($(commentStr));
    //Update count on UI - popup.
    var commentCount = $(elem).parent().siblings('span.comments-count');
    var newCount = (parseInt(commentCount.text()) || 0) + 1
     commentCount.text(newCount);
     //Update on homepage too.
     $("#" + imageId).find(".comments-count").eq(0).text(newCount);
}

function addLike(imageId, elem) {
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
  var likeCount = parseInt($(elem).siblings('span.likes-count').text()) || 1;
  firebase.database().ref('/users/' + uid+'/images/' + imageId).update({likes : likeCount}); 
}