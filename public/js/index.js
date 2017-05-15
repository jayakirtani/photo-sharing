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
            var $griditem = $(`<div class="grid-item" data-featherlight="#inner-${key}-${i}" id="${key}">
                <div id="inner-${key}-${i}" class="inner-grid-content">
                <img class="img-responsive" src="${data.url}" />
                <div id="imageinfo" class="likes">
                <span><i class="fa fa-comments">${data.totalcomments}</i></span>
                <span class="empty"></span>
                <span><i class="fa fa-heart">${data.likes}  </i> </span>
                </div>
                <section class="comments-section">
                    <span>${data.likes} </span><span class="glyphicon glyphicon-thumbs-up"></span>
                    <span>${data.totalcomments} Comments</span>
                    <div class="form-group">
                        <label for="comment">Comment:</label>
                        <textarea class="form-control" rows="5" id="comment"></textarea>
                    </div>

                    <button class="btn btn-primary">Submit</button>
                    <ul>
                        <li>
                        <span class="username">Jhon315</span> says -
                        <span class="content">This a a great pic.... Thanks !!! :)
                        </li>
                        <li>
                        <span class="username">Arya Stark</span> says -
                        <span class="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales leo massa, eu convallis arcu tempus ac. Duis ornare, mauris ut venenatis rhoncus, neque nisi eleifend mauris, sit amet rhoncus nibh massa eget urna. Phasellus sed elit tincidunt quam aliquet venenatis quis ut elit. Sed hendrerit velit sit amet velit pellentesque aliquam. Morbi a magna enim. Morbi ipsum leo, ullamcorper eu iaculis sit amet, tempus in nulla. In at bibendum ipsum, ut bibendum urna.
                        </span>
                        </li>
                    </ul>
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