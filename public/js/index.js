$(document).ready(function () {
    //Connect to Firebase Database
    connectDB();

    window.onscroll = function () {
        highlightNav()
    };

    // Fetch Images from Database and add to Main page
    fetchImages().then((imageList) => {
        for (var i = 1; i < imageList.length; i++) {
            console.log(JSON.stringify(imageList[i]));
            console.log(i + "--" + imageList[i].url);
        }
    });

    var $grid = $('.grid').imagesLoaded(function () {
        $grid.masonry({
            itemSelector: '.grid-item',
            percentPosition: true,
            columnWidth: '.grid-sizer'
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