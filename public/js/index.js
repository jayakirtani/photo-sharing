$(document).ready(function () {
    //Connect to Firebase Database
    //connectDB();

    var batchSize= 8;

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


});


function showImages(ignorefirst, imageList) {

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
                <span><i class="fa fa-comments">${commentKeys.length}</i></span>
                <span class="empty"></span>
                <span><i class="fa fa-heart">${data.likes}  </i> </span>
                </div>
                <section class="comments-section">
                    <span>${data.likes} </span><span class="fa fa-heart"></span>
                    <span>${commentKeys.length} </span><span class="fa fa-comments"></span>
                    <div class="form-group">
                        <label for="comment">Comment:</label>
                        <textarea class="form-control" rows="5" id="comment${key}" data-unique="i${key}"></textarea>
                    </div>

                    <button class="btn btn-primary" onclick="addComment('${key}', this)">Submit</button>
                    <ul class="comments-list">${commentsListStr}</ul>
                </section></div>
                          </div>`)
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
    console.log("Comment adeed-", $("input[data-unique='i"+ imageId +"']").val());
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
}