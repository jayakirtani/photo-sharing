$(document).ready(function () {
    //Connect to Firebase Database
    connectDB();

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

    fetchImages().then((imageList) => {
        for (var i = 1; i < imageList.length; i++) {
            console.log(JSON.stringify(imageList[i]));
            console.log(i + "--" + imageList[i].url);
            var $griditem = $(`<div class="grid-item">
                <img src="${imageList[i].url}" />
                <div id="imageinfo">
                <span>${imageList[i].totalcomments} Comments</span>
                <span>${imageList[i].likes} Likes</span>
                </div>
            </div>`)
            console.log($griditem);
            // Add images to the image grid
            $('.grid').prepend($griditem).isotope('prepended', $griditem);
        }

        // Rearrange the layout once all images have loaded
        $('.grid').imagesLoaded(function () {
            console.log("all images loaded")
            $('.grid').isotope('layout');
        });
    });

});

function highlightNav() {
    if (document.body.scrollTop > 200) {
        console.log("inside class add");
        $(".navbar").addClass('navbar-fixed-top highlight');
    } else {
        $(".navbar").removeClass('navbar-fixed-top highlight');
    }
}