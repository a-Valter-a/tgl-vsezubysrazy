var linkNav = document.querySelectorAll('[href^="#"]'),
    V = 0.04;
for (var i = 0; i < linkNav.length; i++) {
    linkNav[i].addEventListener('click', function (e) {
        e.preventDefault();
        var w = window.pageYOffset,
            hash = this.href.replace(/[^#]*(.*)/, '$1');
        t = document.querySelector(hash).getBoundingClientRect().top,
            start = null;
        requestAnimationFrame(step);

        function step(time) {
            if (start === null) start = time;
            var progress = time - start,
                r = (t < 0 ? Math.max(w - progress / V, w + t) : Math.min(w + progress / V, w + t));
            window.scrollTo(0, r);
            if (r != w + t) {
                requestAnimationFrame(step)
            } else {
                location.hash = hash
            }
        }
    }, false);
}

$(function () {
    if (window.innerWidth < 768) {
        let imgElement = document.querySelector('.hero-img');
        imgElement.remove();
    }
    
    //Menu toggle
    $('.menu-btn').click(function () {
        $(this).toggleClass('active');
        $('.menu-toggle').fadeToggle('active');
    });

    $('.menu-toggle a').click(function () {
        $('.menu-btn').removeClass('active');
        $('.menu-toggle').fadeOut('active');
    });

    //Patients toggle
    $('.patients-slider').slick({
        infinite: true,
        slidesToShow: 1,
        prevArrow: $('.patients-prev'),
        nextArrow: $('.patients-next'),
        responsive: [
            {
                breakpoint: 576,
                settings: {
                    adaptiveHeight: true
                }
            }
        ]
    });

    // $('.patients-slider').on('afterChange', function (event, slick, currentSlide) {
    //     var currentSlideHeight = $(slick.$slides[currentSlide]).height();
    //     $(this).find('.slick-list').height(currentSlideHeight);
    //   });

    $('.price-btn').click(function () {
        let titleName = $(this).closest('.price-card').attr('data-title');
        $('.modal-price-title').val(titleName);
    })

    //Reviews toggle
    $('.reviews-slider').slick({
        infinite: true,
        slidesToShow: 1,
        prevArrow: '<button type="button" class="reviews-prev slick-prev"></button>',
        nextArrow: '<button type="button" class="reviews-next slick-next"></button>'
    });

    //Recommend toggle
    $('.recommend-slider').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 2,
        arrows: false,
        dots: false,
        variableWidth: true,
        responsive: [
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    variableWidth: false,
                }
            }
        ]
    });

    //Open and close modal
    $('.open-modal').click(function () {
        const modal = $(this).attr('data-modal');
        $('.modal.' + modal).fadeIn();
    });

    $('.modal__close').click(function () {
        $('.modal').fadeOut();
    });

    $('.thanks-close').click(function () {
        $('.thanks').fadeOut();
    });

    // $('.price-bottom__btn, .price-btn').click(function () {
    //     $('.modal-quiz').fadeIn();
    // });

    $(document).mouseup(function (e) {
        var div = $('.popup-box');
        if (div.is(e.target)
            && div.has(e.target).length === 0) {
            $('.popup-box').fadeOut();
        }
    });

    // $(document).mouseup(function (e) {
    //     var div = $('.modal-body');
    //     if (div.is(e.target)
    //         && div.has(e.target).length === 0) {
    //         $('.modal-quiz').fadeOut();
    //     }
    // });

    var t = $(".arrow-to-top");
    $(window).scroll((function () {
        $(window).scrollTop() > 1200 ? t.addClass("show") : t.removeClass("show")
    }
    )),
        t.on("click", (function (t) {
            t.preventDefault(),
                $("html, body").animate({
                    scrollTop: 0
                }, "300")
        }
        ), {passive: true});

    if ($(window).width() < 992) {
        $('.quiz-present').insertAfter('.quiz-form__block:nth-child(3)');
    }

    if ($(window).width() < 768) {
        $('.info-block__btn').appendTo('.visit-body__row:last-child');
        $('.info-block__btn').attr('class', 'info-btn btn btn-main btn-blue');

        $('.flex-row').each(function () {
            let content = $(this).find('.info-block__content');
            $(this).find('.flex-right img').after(content);
        });
    }

    if ($(window).width() < 576) {
        $('.price-bottom').insertAfter('.price__subtitle');
        $('.quiz-form__title').text('Каким способом предоставить расчет стоимости и подарок?');
    }

    $(window).resize(function () {
        if ($(window).width() < 768) {
            $('.comfort__title').html('Обеспечиваем <br> <span>безопасную и комфортную</span><span> имплантацию</span>');
            $('.guarantee__title').html('Даем <span>пожизненную</span><span>гарантию</span> и фиксируем её в договоре');
        }
    });

    $(".question-next").click(function () {
        let current = $(".current-ques").text();
        let wrapper = $(this).closest('.question-active').find('.quiz-question__group input');
        if ($(wrapper).is(':checked')) {
            $(this).closest(".quiz-question").removeClass('question-active').next().addClass('question-active');
            $(".current-ques").text(+current + 1);
            $('.progress-bar__indicator').css({
                "width": '+=20%'
            });
        }
        if ($('.quiz-question-5').hasClass('question-active')) {
            $('.quiz-box__progress, .progress-bar').hide();
            $('.quiz-consult').hide();
            $('.quiz-present').show();
            $('.quiz-box').addClass('final');
            $('.quiz-wrapper').addClass('final');
        }
    });

    $(".question-prev").click(function () {
        let current = $(".current-ques").text();
        $(this).closest(".quiz-question").removeClass('question-active').prev().addClass('question-active');
        $(".current-ques").text(+current - 1);
        $('.progress-bar__indicator').css({
            "width": '-=20%'
        });
    });

    //Input mask phone
    $('input[type="tel"]').mask("+7(999)999-99-99");
    $('input[type="tel"]').focus(function () {
        $(this).val('');
    });
});