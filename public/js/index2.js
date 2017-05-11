$(document).ready(function () {
    window.onscroll = function () {
        myFunction()
    };

    function myFunction() {
        console.log("My function")
        if (document.body.scrollTop > 200
            //|| document.documentElement.scrollTop > 200
        ) {
            console.log("inside class add");
            $(".navbar").addClass('navbar-fixed-top highlight');
            //$(".navbar").addClass('highlight');
            //            
        } else {
            $(".navbar").removeClass('navbar-fixed-top highlight');
            //$(".navbar").removeClass('highlight');
        }
    }

    var $grid = $('.grid').masonry({
        itemSelector: '.grid-item',
        percentPosition: true,
        columnWidth: '.grid-sizer'
    });
    // layout Isotope after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry();
    });
});