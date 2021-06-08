export const productListScroller = () => {
        $(document).ready(function () {
            const windowWidth = $(window).width();
            if (windowWidth > 1200) {

                $(window).scroll(function () {
                    let headerNavigationHeight = $('.headerNav').outerHeight();
                    let productsFilterSection = $('.productsFilterSection');
                    let productsFilterSectionTop = productsFilterSection.offset().top;
                    let productsFilterSectionHeight = productsFilterSection.height();
                    let footer = $('.catFooter');
                    let stickyStop = footer.offset().top - productsFilterSectionHeight;
                    let windowScrollPos = $(window).scrollTop();

                    if (windowScrollPos > productsFilterSectionTop - headerNavigationHeight) {
                        productsFilterSection.css({
                            position: 'fixed',
                            top: headerNavigationHeight,
                            height: '100%',
                            background: '#f7f7f7'
                        });
                    } else {
                        productsFilterSection.css({
                            position: 'static',
                        });
                    }

                    if (windowScrollPos > stickyStop) {
                        var scrollable = stickyStop - windowScrollPos;
                        // alert(scrollable)
                        productsFilterSection.css({
                            top: scrollable
                        });
                    }

                });
            }
        });
}