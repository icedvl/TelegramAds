const elements = {
    popup: {
        create: (type, content, target) => {
            target = target || $('body');

            $('.curtain').css('zIndex', 3).fadeIn(200);
            target.append(
                $('<DIV/>', { class: 'magictime popup_wrap ' + type }).append(
                    $('<DIV/>', { class: 'popup' }).append(
                        $('<DIV/>', { class: 'popup_header' }).append(
                            $('<DIV/>', { class: 'popup_title', text: content.title }),
                            $('<DIV/>', { class: 'popup_close', title: lang.helpers.close })
                                .append( svg.icon.cross )
                                .on('click', function() {
                                    elements.popup.destroy(content.callback)
                                })
                        ),
                        $('<DIV/>', { class: 'popup_content' }).append( content.body ),
                        content.actions ? $('<DIV/>', { class: 'popup_actions' }).append( content.actions ) : ''
                    )
                )
            )

            if ( type === 'side' ) {
                target.find('.popup_wrap').addClass('slideRightReturn')
            }

            if ( type === 'center' ) {
                target.find('.popup_wrap').addClass('vanishIn')
            }

            $(document).on('keydown.popupClose',  function (e) {
                if ( e.key === 'Escape' || e.keyCode === 27 ) {
                    e.preventDefault();
                    elements.popup.destroy(content.callback)
                }
            })

            $(document).on('keydown.popupSave',  function (e) {

                if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
                    e.preventDefault();
                    if ( content.saveFn ) {
                        content.saveFn();
                    }
                    elements.popup.destroy(content.callback)
                }
            })

        },
        destroy: (callback) => {
            $(document).off('keydown.popupSave');
            $(document).off('keydown.popupClose');
            if ( $('.popup_wrap').hasClass('slideRightReturn') ) {
                $('.popup_wrap').removeClass('slideRightReturn').addClass('slideRight')
            }
            if ( $('.popup_wrap').hasClass('vanishIn') ) {
                $('.popup_wrap').removeClass('vanishIn').addClass('vanishOut')
            }
            $('.curtain').fadeOut(200);
            if ( callback ) { callback() }
            setTimeout(() => {
                $('.curtain').css('zIndex', -1)
                $('.popup_wrap').remove();
            }, 200)
        }
    },
    button: (params) => {

        let button;

        if ( params.url ) {
            button = $('<A/>', { class: 'button', href: params.url, target: '_blank' });
        } else {
            button = $('<DIV/>', { class: 'button' });
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

        if ( params.icon ) {
            button.append( params.icon );
        }

        if ( params.primary ) {
            button.addClass('button--primary');
        }

        if ( params.loader ) {
            button.append( svg.loader );
        }


        return button;
    }
}
