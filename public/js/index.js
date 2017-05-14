$(document).ready(function () {
    //Connect to Firebase Database
    connectDB();

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
            console.log("Appending Image " + JSON.stringify(imagedata));
            var key = Object.keys(imagedata);
            var data = imagedata[key];
            var $griditem = $(`<div class="grid-item" id="${key}">
                <img src="${data.url}" />
                <div id="imageinfo">
                <span><i class="fa fa-comments">${data.totalcomments}</i></span>
                <span class="empty"></span>
                <span><i class="fa fa-heart">${data.likes}  </i> </span>
                </div>
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
        console.log("all images loaded")
        $('.grid').isotope('layout');
    });
}

function highlightNav() {
    if (document.body.scrollTop > 200) {
        console.log("inside class add");
        $(".navbar").addClass('navbar-fixed-top highlight');
    } else {
        $(".navbar").removeClass('navbar-fixed-top highlight');
    }
}