// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('.article__topnav').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    console.log("chuj")
    var st = $(this).scrollTop();
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('.article__topnav').addClass('article__topnav--hidden');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('.article__topnav').removeClass('article__topnav--hidden');
        }
    }
    
    lastScrollTop = st;
}
