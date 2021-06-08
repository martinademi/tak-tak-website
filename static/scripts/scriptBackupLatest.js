//pageNavigation
function navigateTo() {
    window.location.assign('productsPage.html');
}
function goToOrdersPage() {
    window.location.assign('myOrders.html');
}
function goTomyOrders() {
    window.location.assign('myOrders.html');
}
function goToCheckOut() {
    window.location.assign('checkout.html');
}
//pageNavigation



//myordersPage
function viewOrderedItems() {
    document.getElementById('firstViewId').style.display = 'none';
    document.getElementById('secondViewId').style.display = 'block'
}
function back() {
    document.getElementById('secondViewId').style.display = 'none';
    document.getElementById('firstViewId').style.display = 'block'
}
//myordersPage



//jquery document ready
$(document).ready(function () {

    //homePage
    //categoriesList
    $('.catItems').slick({
        infinite: true,
        slidesToShow: 7,
        slidesToScroll: 7,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 6,
                    infinite: true,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 11,
                    slidesToScroll: 11
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 9,
                    slidesToScroll: 9
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 7,
                    slidesToScroll: 7
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5
                }
            },
            {
                breakpoint: 350,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }
        ]
    });
    //categoriesList
    //bannerList
    $('.bannerItems').slick();
    //bannerList
    //featuredList
    $('.featuredItemsId').slick({
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 1378,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 507,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
            ,
            {
                breakpoint: 345,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]

    });
    //featuredList
    //footer icons in homePage navigating
    function goToRestaurants() {
        window.location.assign("restaurents.html");
    }
    function goToShops() {
        window.location.assign("shops.html");
    }
    function goToLifeTime() {
        window.location.assign("lifetime.html");
    }
    function goToAnything() {
        window.location.assign("anything.html");
    }
    //footer icons in homePage navigating
    //homePage

    //productPage
    //slick modal
    $(".productPageModal").on("shown.bs.modal", function () {
        //featuredList
        $('.featuredItemsProductModalId').slick({
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        infinite: true,
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]

        });
        //featuredList
    });
    //slick modal
    //accordion
    $("#productsSideMenu h5").click(function () {
        $("#productsSideMenu h5").removeClass("active");
        $(this).addClass("active");
    });
    //accordin
    //productPage

    //myordersPage

    //editProfile modal
    $('#changeProfileNumber').click(function () {
        $('#numberPhoneOld').hide();
        $('#newNumberPhone').show();
    });
    $('#changeProfileEmail').click(function () {
        $('#emailOld').hide();
        $('#emailNew').show();
    });
    $('#changeProfilePassword').click(function () {
        $('#passwordOld').hide();
        $('#passwordNew').show();
    });
    //editProfile modal

    //show referral code input block modal
    function showRefCode() {
        var haveRefCodeId = document.getElementById('haveRefCodeId');
        var signUpRefCodeLayout = document.getElementById('signUpRefCodeLayout');
        haveRefCodeId.style.display = "none";
        signUpRefCodeLayout.style.display = "block";
    }
    //show referral code input block modal

    //toggle around login, signup and forgot modal
    function goToSignUpModal() {
        var loginModalId = document.getElementById('loginModalId');
        var signUpModalId = document.getElementById('signUpModalId');
        loginModalId.style.display = "none";
        signUpModalId.style.display = "block";
    }
    function goToLoginModal() {
        var loginModalId = document.getElementById('loginModalId');
        var signUpModalId = document.getElementById('signUpModalId');
        loginModalId.style.display = "block";
        signUpModalId.style.display = "none";
        forgotModalId.style.display = "none";
    }
    function goToForgotModal() {
        var loginModalId = document.getElementById('loginModalId');
        var forgotModalId = document.getElementById('forgotModalId');
        loginModalId.style.display = "none";
        forgotModalId.style.display = "block";
    }
    //toggle around login, signup and forgot modal

    //show password in signup modal
    function showPassword() {
        var signUpPassword = document.getElementById('signUpPassword');
        if (signUpPassword.attributes[0].value == "password") {
            signUpPassword.setAttribute('type', 'text');
        } else {
            signUpPassword.setAttribute('type', 'password');
        }
    }
    //show password in signup modal

    //show address categories modal
    function showCatrgoryAddress() {
        var categoryAddressOtherLayout = document.getElementById('categoryAddressOtherLayout');
        var categoryAddressLayout = document.getElementById('categoryAddressLayout');
        categoryAddressOtherLayout.style.display = "none";
        categoryAddressLayout.style.display = "block";
    }
    function showCatrgoryAddressToggle() {
        var categoryAddressOtherLayout = document.getElementById('categoryAddressOtherLayout');
        var categoryAddressLayout = document.getElementById('categoryAddressLayout');
        categoryAddressOtherLayout.style.display = "block";
        categoryAddressLayout.style.display = "none";
    }
    //show address categories modal

    //hide and show class for view adress and billing details down and up arrow
    $('.viewDynaUpNDownLayout').click(function () {
        // $(this).find('.viewDynaUpNDown1').removeClass('show');
        // $(this).find('.viewDynaUpNDown2').addClass('show');
        $(this).find('.viewDynaUpNDown1').toggleClass('show');
        $(this).find('.viewDynaUpNDown2').toggleClass('show');
    });
    $('.pastOrdersHeaderLayout').click(function () {
        // $(this).find('.viewDynaUpNDown1').removeClass('show');
        // $(this).find('.viewDynaUpNDown2').addClass('show');
        $(this).find('.viewDynaUpNDown1').toggleClass('show');
        $(this).find('.viewDynaUpNDown2').toggleClass('show');
    });
    //hide and show for view adress and billing details down and up arrow

    //myordersPage

});
//jquery document ready


//Checkout page

//toggle around login, signup and forgot Checkout page
function goToSignUpCheckout() {
    var btnLayoutCheckout = document.getElementById('btnLayoutCheckout');
    var signUpCheckoutId = document.getElementById('signUpCheckoutId');
    btnLayoutCheckout.style.display = "none";
    signUpCheckoutId.style.display = "block";
}
function goToLoginCheckout() {
    var btnLayoutCheckout = document.getElementById('btnLayoutCheckout');
    var loginCheckoutId = document.getElementById('loginCheckoutId');
    loginCheckoutId.style.display = "block";
    btnLayoutCheckout.style.display = "none";
    // forgotModalId.style.display = "none";
}
function goToForgotCheckout() {
    var loginCheckoutId = document.getElementById('loginCheckoutId');
    var forgotCheckoutId = document.getElementById('forgotCheckoutId');
    loginCheckoutId.style.display = "none";
    forgotCheckoutId.style.display = "block";
}
function loginToSignUpCheckout() {
    var loginCheckoutId = document.getElementById('loginCheckoutId');
    var signUpCheckoutId = document.getElementById('signUpCheckoutId');
    loginCheckoutId.style.display = "none";
    signUpCheckoutId.style.display = "block";
}
function signUpToLoginCheckout() {
    var signUpCheckoutId = document.getElementById('signUpCheckoutId');
    var loginCheckoutId = document.getElementById('loginCheckoutId');
    signUpCheckoutId.style.display = "none";
    loginCheckoutId.style.display = "block";
}
function forgotToLoginCheckout() {
    var forgotCheckoutId = document.getElementById('forgotCheckoutId');
    var loginCheckoutId = document.getElementById('loginCheckoutId');
    forgotCheckoutId.style.display = "none";
    loginCheckoutId.style.display = "block";
}

function goToLoggedIn() {
    var befLog = document.getElementById('befLog');
    var afterLog = document.getElementById('afterLog');
    var befDeliveryCheckout = document.getElementById('befDeliveryCheckout');
    var afterDeliveryCheckout = document.getElementById('afterDeliveryCheckout');
    befLog.style.display = "none";
    afterLog.style.display = "block";
    befDeliveryCheckout.style.display = "none";
    afterDeliveryCheckout.style.display = "block";
}
function addedDeliverAddCo() {
    var befaddDeliverAddressCo = document.getElementById('befaddDeliverAddressCo');
    var afteraddDeliverAddressCo = document.getElementById('afteraddDeliverAddressCo');
    var befaddPaymentCo = document.getElementById('befaddPaymentCo');
    var afteraddPaymentCo = document.getElementById('afteraddPaymentCo');
    befaddDeliverAddressCo.style.display = "none";
    afteraddDeliverAddressCo.style.display = "block";
    befaddPaymentCo.style.display = "none";
    afteraddPaymentCo.style.display = "block";
}
//toggle around login, signup and forgotCheckout page

//show password in signup Checkout page
function showPasswordCheckout() {
    var signUpPassword = document.getElementById('signUpPassword');
    if (signUpPassword.attributes[0].value == "password") {
        signUpPassword.setAttribute('type', 'text');
    } else {
        signUpPassword.setAttribute('type', 'password');
    }
}
//show password in signup Checkout page

//show referral code input block
function showRefCodeCheckout() {
    var haveRefCodeIdCheckOutCo = document.getElementById('haveRefCodeIdCheckOutCo');
    var signUpRefCodeLayoutCo = document.getElementById('signUpRefCodeLayoutCo');
    haveRefCodeIdCheckOutCo.style.display = "none";
    signUpRefCodeLayoutCo.style.display = "block";
}
//show referral code input block

//Checkout page