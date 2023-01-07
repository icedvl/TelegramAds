const elements = {
    interval: null,
    popup: {
        create: (type, content, target) => {
            target = target || $('body');

            $('.curtain').css('zIndex', 3).fadeIn(200);

            let wrap = $('<DIV/>', { class: 'magictime popup_wrap ' + type });

            let popup = $('<DIV/>', { class: 'popup' }).append(
                $('<DIV/>', { class: 'popup_header' }).append(
                    $('<DIV/>', { class: 'popup_title', text: content.title }),
                    $('<DIV/>', { class: 'popup_close', title: lang.helpers.close })
                        .append( svg.icon.cross )
                        .on('click.destroy', function() {
                            if ( !content.secondPopup ) {
                                elements.popup.destroy(content.callback)
                            } else {
                                clearInterval(elements.interval)
                                $('.popup_wrap.second').remove();
                                $('.popup_wrap.hide .popup').fadeIn(200)
                                $('.popup_wrap.hide').removeClass('hide');

                                $(document).on('keydown.popupClose', function (e) {
                                    if (e.key === 'Escape' || e.keyCode === 27) {
                                        e.preventDefault();
                                        setTimeout(() => {
                                            elements.popup.destroy(content.callback)
                                        }, 200)
                                    }
                                })
                            }
                        })
                ),
                $('<DIV/>', { class: 'popup_content' }).append( content.body ),
                content.actions ? $('<DIV/>', { class: 'popup_actions' }).append( content.actions ) : ''
            );

            wrap.append( popup );


            if ( type === 'side' ) {
                wrap.addClass('slideRightReturn')
            }

            if ( type === 'center' ) {
                wrap.addClass('vanishIn')
            }

            if ( type === 'group' ) {
                wrap.addClass('vanishIn')
                wrap.append( content.second )
            }

            if ( type === 'vote' ) {
                wrap.addClass('vanishIn')
            }


            if ( !content.secondPopup ) {
                $(document).on('keydown.popupClose', function (e) {
                    if (e.key === 'Escape' || e.keyCode === 27) {
                        e.preventDefault();
                        elements.popup.destroy(content.callback)
                    }
                })
            } else {
                wrap.addClass('second');
                $('.popup_wrap').addClass('hide');
                $('.popup_wrap .popup').hide(0);
                $(document).off('keydown.popupClose');

                $(document).on('keydown.secondPopupClose', function (e) {
                    if (e.key === 'Escape' || e.keyCode === 27) {
                        e.preventDefault();

                        clearInterval(elements.interval)
                        $('.popup_wrap.second').remove();
                        $('.popup_wrap.hide .popup').fadeIn(200)
                        $('.popup_wrap.hide').removeClass('hide');

                        $(document).on('keydown.popupClose', function (e) {
                            if (e.key === 'Escape' || e.keyCode === 27) {
                                e.preventDefault();
                                setTimeout(() => {
                                    elements.popup.destroy(content.callback)
                                }, 200)
                            }
                        })
                    }
                })
            }

            if ( content.saveFn ) {
                $(document).on('keydown.popupSave', function (e) {

                    if ( (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83 ) {
                        e.preventDefault();
                        content.saveFn();
                        if ( !content.dontDestroy ) {
                            elements.popup.destroy(content.callback);
                        }
                    }
                })
            }

            // Добаляем на страницу
            target.append( wrap )

        },
        destroy: (callback, wrap) => {
            $(document).off('keydown.popupSave');
            $(document).off('keydown.popupClose');

            let popup = wrap || $('.popup_wrap')

            if ( popup.hasClass('slideRightReturn') ) {
                popup.removeClass('slideRightReturn').addClass('slideRight')
            }
            if ( popup.hasClass('vanishIn') ) {
                popup.removeClass('vanishIn').addClass('vanishOut')
            }

            $('.curtain').fadeOut(200);

            if ( callback ) { callback() }

            setTimeout(() => {
                $('.curtain').css('zIndex', -1)
                $('.popup_wrap').remove();
            }, 200)
        },
        error: (title, text) => {

            if ( $('.popup_wrap').length ) {
                $('.popup').remove();


                $('.popup_wrap').append(
                    $('<DIV/>', { class: 'popup' }).append(
                        $('<DIV/>', { class: 'popup_header' }).append(
                            $('<DIV/>', { class: 'popup_title', text: lang.helpers.popup.error.title }),
                            $('<DIV/>', { class: 'popup_close', title: lang.helpers.close })
                                .append( svg.icon.cross )
                                .on('click.destroy', () => {
                                    elements.popup.destroy()
                                })
                        ),
                        $('<DIV/>', { class: 'popup_content' }).append(
                            $('<DIV/>', { class: 'error' }).append(
                                $('<SPAN/>', { class: 'error_title', text: title || lang.helpers.popup.error.name }),
                                $('<SPAN/>', { class: 'error_text', text: text || lang.helpers.popup.error.description })
                            )
                        ),
                        $('<DIV/>', { class: 'popup_actions' }).append(
                            elements.button({
                                class: 'button-error',
                                text: lang.helpers.close,
                                primary: true
                            })
                                .on('click.destroy', () => {
                                    elements.popup.destroy()
                                })
                        )
                    )
                )
            } else {

                elements.popup.create('center', {
                    title: lang.helpers.popup.error.title,
                    body: $('<DIV/>', { class: 'error' }).append(
                        $('<SPAN/>', { class: 'error_title', text: title || lang.helpers.popup.error.name }),
                        $('<SPAN/>', { class: 'error_text', text: text || lang.helpers.popup.error.description })
                    ),
                    actions: elements.button({
                        class: 'button-error',
                        text: lang.helpers.close
                    })
                        .on('click.destroy', () => {
                            elements.popup.destroy()
                        })
                })
            }
        },
        vote: (feature, cls) => {

            let data = {
                feature: feature,
                rate: null
            }

            let rate = (el, rate, note) => {

                $('.stars_star').off('click.rate');
                data.rate = rate;
                el.closest('.vote_content_stars').addClass('voted');
                el.addClass('active');

                $.post(process.env.SERVER + '/vote', data )
                    .done(res => {
                        if ( !resources.vote ) {
                            resources.vote = {};
                        }
                        resources.vote[feature] = rate;
                        cover.addClass('voted')
                        cover.find('.coming_vote').remove();
                        cover.off('click.vote')

                        let count = 5;
                        elements.interval = setInterval(() => {
                            if ( count === 0 ) {
                                clearInterval(elements.interval)
                                $('.popup_wrap.second').remove();
                                $('.popup_wrap.hide .popup').fadeIn(200)
                                $('.popup_wrap.hide').removeClass('hide');

                                $(document).on('keydown.popupClose', function (e) {
                                    if (e.key === 'Escape' || e.keyCode === 27) {
                                        e.preventDefault();
                                        setTimeout(() => {
                                            elements.popup.destroy(content.callback)
                                        }, 200)
                                    }
                                })
                            } else {
                                note.find('.vote_content_tnx span').text(count + ' ' + utils.declOfNum(count, ['секунду', 'секунды', 'секунд']))
                                count--;
                            }
                        }, 1000)

                        note.html(
                            $('<DIV/>', { class: 'vote_content_tnx', text: 'Ваш голос принят, можете закрыть попап, или он закроется через ' }).append(
                                $('<SPAN/>', { text: count + ' ' + utils.declOfNum(count, ['секунду', 'секунды', 'секунд'])})
                            )
                        )
                        count--;
                    })
                    .fail(err => {
                        elements.popup.error()
                    })
            }

            let votePopup = (feature, cover) => {

                let content = $('<DIV/>', { class: 'vote_content' });
                let title = $('<DIV/>', { class: 'vote_content_title', text: lang.coming[feature].title });
                let description = $('<DIV/>', { class: 'vote_content_description', text: lang.coming[feature].description });
                let note = $('<DIV/>', { class: 'vote_content_note', text: lang.coming.description });
                let starsWrap = $('<DIV/>', { class: 'vote_content_stars-wrap' });
                let stars = $('<DIV/>', { class: 'vote_content_stars' });
                stars.append(
                    $('<DIV/>', { class: 'stars_star'}).append(
                        svg.star,
                        $('<DIV/>', { class: 'stars_star_text', text: lang.coming.stars[1] }),
                    ).on('click.rate', function() { rate($(this), 1, note, cover) }),
                    $('<DIV/>', { class: 'stars_star'}).append(
                        svg.star,
                        $('<DIV/>', { class: 'stars_star_text', text: lang.coming.stars[2] }),
                    ).on('click.rate', function() { rate($(this), 2, note, cover) }),
                    $('<DIV/>', { class: 'stars_star'}).append(
                        svg.star,
                        $('<DIV/>', { class: 'stars_star_text', text: lang.coming.stars[3] }),
                    ).on('click.rate', function() { rate($(this), 3, note, cover) }),
                    $('<DIV/>', { class: 'stars_star'}).append(
                        svg.star,
                        $('<DIV/>', { class: 'stars_star_text', text: lang.coming.stars[4] }),
                    ).on('click.rate', function() { rate($(this), 4, note, cover) }),
                    $('<DIV/>', { class: 'stars_star'}).append(
                        svg.star,
                        $('<DIV/>', { class: 'stars_star_text', text: lang.coming.stars[5] }),
                    ).on('click.rate', function() { rate($(this), 5, note, cover) }),
                )


                content.append(
                    title,
                    description,
                    starsWrap.append( stars ),
                    note
                )

                if ( $('.popup_wrap').length ) {
                    elements.popup.create('vote', {
                        title: lang.coming.title,
                        body: content,
                        secondPopup: true
                    })
                } else {
                    elements.popup.create('center', {
                        title: lang.coming.title,
                        body: content
                    })
                }
            }



            let cover = $('<DIV/>', { class: 'coming ' + cls }).append(
                $('<DIV/>', { class: 'coming_cover', text: lang.coming[feature].cover }),
                $('<DIV/>', { class: 'coming_vote', text: lang.coming.cta }).append(svg.vote)
            )

            if ( !resources.vote || !resources.vote[feature] ) {
                cover.on('click.vote', () => {
                    votePopup(feature, cover)
                })
            } else {
                cover.addClass('voted')
                cover.find('.coming_vote').remove();
            }

            return cover;
        }
    },
    button: (params) => {

        let button;

        if ( params.url ) {
            button = $('<A/>', { class: 'button', href: params.url, target: '_blank' });
        } else {
            button = $('<BUTTON/>', { class: 'button' });
        }

        if ( params.class ) {
            button.addClass(params.class)
        }

        if ( params.size === 'm' ) {
            button.addClass('button--m')
        }

        if ( params.size === 'l' ) {
            button.addClass('button--l')
        }

        if ( params.size === 'xl' ) {
            button.addClass('button--xl')
        }

        if ( params.text ) {
            button.append($('<SPAN/>', { text: params.text }));
        }

        if ( params.title ) {
            button.attr('title', params.title)
        }

        if ( params.icon ) {
            button.prepend( params.icon );
        }

        if ( params.primary ) {
            button.addClass('button--primary');
        }

        if ( params.danger ) {
            button.addClass('button--danger');
        }

        if ( params.loader ) {
            button.append( svg.loader );
        }

        return button;
    }
}
