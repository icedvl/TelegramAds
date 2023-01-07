// import {ipcRenderer} from "electron";

app.auth = {
    render: () => {

        const auth = $('<DIV/>', { class: 'auth' });
        $('body').append( auth );

        app.auth.signIn.render(auth);
        // app.auth.signUp.render(auth); // Открыть сразу же экран Регистрации для теста
        // app.auth.recover.render(auth); // Открыть сразу же экран Восстановления пароля для теста

        app.auth.language.render( $('body') );




    },
    check: async () => {
         if ( localStorage.getItem('token') ) {

             ipcRenderer.send('token', { token: localStorage.getItem('token') });

             $.ajaxSetup({
                 headers: {
                     'Accept': 'application/json',
                     'Authorization': 'Bearer ' + localStorage.getItem('token')
                 }
             });

             const response = await fetch(process.env.SERVER + '/auth/check', {
                 method: 'GET',
                 mode: 'cors',
                 cache: 'no-cache',
                 credentials: 'same-origin',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': 'Bearer ' + localStorage.getItem('token')
                 },
             })

             if ( response.status ) {
                 if (response.status === 401 || response.status === 403) {
                     localStorage.removeItem('token')
                     return false
                 }
                 if ( response.status === 200 ) {
                     return true
                 }
             }

         } else {
             return false;
         }
    },
    signIn: {
        render: (target) => {

            const wrap = $('<FORM/>', {class: 'auth_signin magictime'}).on('submit', (e) => {
                e.preventDefault();
            });
            const email = $('<DIV/>', { class: "auth_input" }).append(
                $('<INPUT/>', { type: 'email', placeholder: lang.pages.auth.signIn.placeholders.email }),
                $('<DIV/>', { class: 'input_error', html: svg.icon.input.danger })
            );
            const password = $('<DIV/>', { class: "auth_input" }).append(
                $('<INPUT/>', { type: 'password', placeholder: lang.pages.auth.signIn.placeholders.password, maxLength: 32 }),
                $('<DIV/>', { class: 'input_error', html: svg.icon.input.danger }),
                $('<DIV/>', { class: 'input_pass-show', html: svg.icon.input.passShow }).on('click', function() {
                    $(this).hide().next('.input_pass-hide').css('display', 'flex');
                    $(this).siblings('input').attr('type', 'text');
                }),
                $('<DIV/>', { class: 'input_pass-hide', html: svg.icon.input.passHide }).on('click', function() {
                    $(this).hide().prev('.input_pass-show').css('display', 'flex');
                    $(this).siblings('input').attr('type', 'password');
                })
            );
            // const buttonSignIn = $('<BUTTON/>', { class: 'auth_signin_button' }).append(
            //     $('<SPAN>', { class: 'button_text', text: lang.pages.auth.signIn.button }),
            //     $('<SPAN/>', { class: 'button_loader', html: svg.loader })
            // );

            const buttonSignIn = elements.button({
                text: lang.pages.auth.signIn.button,
                loader: true,
                primary: true,
                size: 'l'
            })

            const buttonRecover = $('<DIV/>', {class: 'auth_signin_recover', text: lang.pages.auth.signIn.recover});
            const buttonSignUp = $('<DIV/>', {class: 'auth_signin_signup', html: lang.pages.auth.signIn.signUp});

            buttonSignIn.on('click', () => {

                let validate = true;

                if ( sessionStorage.getItem('authRequest') ) {
                    validate = false
                }

                if ( !email.find('input').val() || !/\S+@\S+\.\S+/.test( email.find('input').val() ) ) {
                    validate = false;
                    app.auth.inputError(email)
                }

                if ( !password.find('input').val() ) {
                    validate = false;
                    app.auth.inputError(password)
                }

                if ( validate ) {
                    email.removeClass('error');
                    password.removeClass('error');
                    app.auth.signIn.request({
                        email: email.find('input').val(),
                        password: password.find('input').val()
                    }, {wrap, email, password, button: buttonSignIn});
                }
            })

            buttonSignUp.on('click', () => {

                if ( !sessionStorage.getItem('authRequest') ) {
                    wrap.removeClass('spaceInRight').addClass('spaceOutLeft')
                    if (!$('.auth_signup').length) {
                        app.auth.signUp.render(target);
                    } else {
                        $('.auth_signup').removeClass('spaceOutLeft').addClass('spaceInRight');
                    }
                }
            })

            buttonRecover.on('click', () => {

                if ( !sessionStorage.getItem('authRequest') ) {
                    wrap.removeClass('spaceInRight').addClass('spaceOutLeft')
                    if (!$('.auth_recover').length) {
                        app.auth.recover.render(target);
                    } else {
                        $('.auth_recover').removeClass('spaceOutLeft').addClass('spaceInRight');
                    }
                }
            })

            target.append(
                wrap.append(
                    email,
                    password,
                    buttonSignIn,
                    buttonRecover,
                    buttonSignUp
                )
            )
        },
        request: (data, el) => {
            sessionStorage.setItem('authRequest', true);
            el.wrap.addClass('loading');
            el.button.addClass('loading').attr('disabled', true);

            $.post(process.env.SERVER + '/auth/signin', data)
                .done(async res => {
                    sessionStorage.removeItem('authRequest')
                    el.wrap.removeClass('loading');
                    el.button.removeClass('loading').attr('disabled', false)
                    if ( res.error ) {
                        if ( res.error.code === 400 ) {
                            app.auth.inputError(el.email)
                        }
                        if ( res.error.code === 401 ) {
                            app.auth.inputError(el.password)
                        }
                    } else {
                        localStorage.setItem('token', res.token)

                        $.ajaxSetup({
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            }
                        });

                        resources.accounts = await utils.getResources.accounts();
                        $('body > .auth, body > .language').remove();
                        app.sidebar.render();
                        app.content.render();
                        utils.page.open( state.pages.open );
                    }
                })
                .fail(err => {
                    sessionStorage.removeItem('authRequest')
                    el.wrap.removeClass('loading');
                    el.button.removeClass('loading').attr('disabled', false)
                })
        }
    },
    signUp: {
        render: (target) => {
            let emailTimeout, passwordTimout, passwordConfirmTimeout;

            const wrap = $('<FORM/>', {class: 'auth_signup magictime spaceInRight'}).on('submit', (e) => {
                e.preventDefault();
            });
            const email = $('<DIV/>', { class: "auth_input" }).append(
                $('<INPUT/>', { type: 'email', placeholder: lang.pages.auth.signUp.placeholders.email }),
                $('<DIV/>', { class: 'input_error', html: svg.icon.input.danger })
            );
            const password = $('<DIV/>', { class: "auth_input" }).append(
                $('<INPUT/>', { type: 'password', placeholder: lang.pages.auth.signUp.placeholders.password, maxLength: 32 }),
                $('<DIV/>', { class: 'input_error', html: svg.icon.input.danger }),
                $('<DIV/>', { class: 'input_pass-show', html: svg.icon.input.passShow }).on('click', function() {
                    $(this).hide().next('.input_pass-hide').css('display', 'flex');
                    $(this).siblings('input').attr('type', 'text');
                }),
                $('<DIV/>', { class: 'input_pass-hide', html: svg.icon.input.passHide }).on('click', function() {
                    $(this).hide().prev('.input_pass-show').css('display', 'flex');
                    $(this).siblings('input').attr('type', 'password');
                })
            );
            const passwordConfirm = $('<DIV/>', { class: "auth_input" }).append(
                $('<INPUT/>', { type: 'password', placeholder: lang.pages.auth.signUp.placeholders.passwordConfirm, maxLength: 32 }),
                $('<DIV/>', { class: 'input_error', html: svg.icon.input.danger }),
                $('<DIV/>', { class: 'input_pass-show', html: svg.icon.input.passShow }).on('click', function() {
                    $(this).hide().next('.input_pass-hide').css('display', 'flex');
                    $(this).siblings('input').attr('type', 'text');
                }),
                $('<DIV/>', { class: 'input_pass-hide', html: svg.icon.input.passHide }).on('click', function() {
                    $(this).hide().prev('.input_pass-show').css('display', 'flex');
                    $(this).siblings('input').attr('type', 'password');
                })
            );
            const buttonSignUp = elements.button({
                text: lang.pages.auth.signUp.button,
                loader: true,
                primary: true,
                size: 'l'
            })

            const buttonSignIn = $('<DIV/>', {class: 'auth_signup_signin', html: lang.pages.auth.signUp.signIn});

            buttonSignUp.on('click', function () {
                let validate = true;

                if ( !email.find('input').val() || !/\S+@\S+\.\S+/.test( email.find('input').val() ) ) {
                    validate = false;
                    app.auth.inputError(email)
                }

                if ( !password.find('input').val() || password.find('input').val().length < 6 ) {
                    validate = false;
                    app.auth.inputError(password)
                }

                if ( password.find('input').val() !== passwordConfirm.find('input').val() ) {
                    validate = false;
                    app.auth.inputError(passwordConfirm)
                }

                if ( validate ) {
                    email.removeClass('error');
                    password.removeClass('error');
                    passwordConfirm.removeClass('error');
                    app.auth.signUp.request({
                        email: email.find('input').val(),
                        password: password.find('input').val()
                    }, {wrap, email, password, button: buttonSignUp});

                }


            });

            buttonSignIn.on('click', () => {
                if ( !sessionStorage.getItem('authRequest') ) {
                    wrap.removeClass('spaceInRight').addClass('spaceOutLeft');
                    if (!$('.auth_signin').length) {
                        app.auth.signIn.render(target);
                    } else {
                        $('.auth_signin').removeClass('spaceOutLeft').addClass('spaceInRight');
                    }
                }
            });

            target.append(
                wrap.append(
                    email,
                    password,
                    passwordConfirm,
                    buttonSignUp,
                    buttonSignIn
                )
            )
        },
        request: (data, el) => {
            sessionStorage.setItem('authRequest', true);
            el.wrap.addClass('loading');
            el.button.addClass('loading').attr('disabled', true);

            $.post(process.env.SERVER + '/auth/signup', data)
                .done(res => {
                    sessionStorage.removeItem('authRequest')
                    el.wrap.removeClass('loading');
                    el.button.removeClass('loading').attr('disabled', false)

                    if ( res.error ) {
                        if ( res.error.code === 403 ) {
                            app.auth.inputError(el.email)
                        }
                    } else {
                        localStorage.setItem('token', res.token)
                        $('body > .auth, body > .language').remove();
                        app.sidebar.render();
                        app.content.render();
                    }
                })
                .catch(err => {
                    sessionStorage.removeItem('authRequest')
                    el.wrap.removeClass('loading');
                    el.button.removeClass('loading').attr('disabled', false)
                })
        }
    },
    recover: {
        render: (target) => {
            let emailTimeout;
            const wrap = $('<FORM/>', {class: 'auth_recover magictime spaceInRight'}).on('submit', (e) => {
                e.preventDefault();
            });
            const email = $('<DIV/>', { class: "auth_input" }).append(
                $('<INPUT/>', { type: 'email', placeholder: lang.pages.auth.recover.placeholders.email }),
                $('<DIV/>', { class: 'input_error', html: svg.icon.input.danger })
            );
            const buttonRecover = elements.button({
                text: lang.pages.auth.recover.button,
                loader: true,
                primary: true,
                size: 'l'
            })
            const buttonSignIn = $('<DIV/>', { class: 'auth_recover_signin', text: lang.pages.auth.recover.signIn });
            const buttonSignUp = $('<DIV/>', { class: 'auth_recover_signup', html: lang.pages.auth.recover.signUp });

            buttonRecover.on('click', () => {
                let validate = true;

                if ( !email.find('input').val() || !/\S+@\S+\.\S+/.test( email.find('input').val() ) ) {
                    validate = false;
                    app.auth.inputError(email)
                }

                if ( validate ) {
                    email.removeClass('error');
                    app.auth.recover.request({
                        email: email.find('input').val(),
                    }, {wrap, email, button: buttonRecover});
                }
            })

            buttonSignIn.on('click', () => {
                if ( !sessionStorage.getItem('authRequest') ) {
                    wrap.removeClass('spaceInRight').addClass('spaceOutLeft')
                    if (!$('.auth_signin').length) {
                        app.auth.signIn.render(target);
                    } else {
                        $('.auth_signin').removeClass('spaceOutLeft').addClass('spaceInRight');
                    }
                }
            })

            buttonSignUp.on('click', () => {
                if ( !sessionStorage.getItem('authRequest') ) {
                    wrap.removeClass('spaceInRight').addClass('spaceOutLeft')
                    if (!$('.auth_signup').length) {
                        app.auth.signUp.render(target);
                    } else {
                        $('.auth_signup').removeClass('spaceOutLeft').addClass('spaceInRight');
                    }
                }
            })

            target.append(
                wrap.append(
                    email,
                    buttonRecover,
                    buttonSignIn,
                    buttonSignUp
                )
            )

        },
        request: (data, el) => {
            sessionStorage.setItem('authRequest', true);
            el.wrap.addClass('loading');
            el.button.addClass('loading').attr('disabled', true);

            $.post( process.env.SERVER + '/auth/recover', data)
                .done(res => {
                    sessionStorage.removeItem('authRequest')
                    el.wrap.removeClass('loading');
                    el.button.removeClass('loading').attr('disabled', false)
                    if ( res.error ) {
                        if (res.error.code === 400) {
                            app.auth.inputError(el.email)
                        }
                    } else {
                        el.wrap.prepend($('<DIV/>', {
                            class: 'auth_message',
                            html: [svg.icon.email.sent, lang.pages.auth.recover.messages.newPassword]
                        }))
                    }
                })
                .catch(err => {
                    sessionStorage.removeItem('authRequest')
                    el.wrap.removeClass('loading');
                    el.button.removeClass('loading').attr('disabled', false)
                })

        }
    },
    inputError: (input) => {
        input.addClass('error');
        setTimeout(() => {
            input.removeClass('error')
        }, 2000)
    },
    language: {
        render: ( target ) => {
            const languageButton = $('<DIV/>', { class: 'language_button', html: [ svg.icon.world, lang.lang.button ] }).on('click', () => {
                languageList.slideToggle();
            });
            const languageList = $('<DIV/>', { class: 'language_list' }).append(
                $('<DIV/>', { class: localStorage.getItem('lang') == 'en' ? 'language_item active' : 'language_item', text: 'English' }).on('click', () => {
                    localStorage.setItem('lang', 'en');
                    location.reload();
                }),
                $('<DIV/>', { class: localStorage.getItem('lang') == 'ru' ? 'language_item active' : 'language_item', text: 'Русский' }).on('click', () => {
                    localStorage.setItem('lang', 'ru');
                    location.reload();
                }),
                $('<DIV/>', { class: 'language_item soon', text: 'Deutsch' }),
                $('<DIV/>', { class: 'language_item soon', text: 'Español' }),
                $('<DIV/>', { class: 'language_item soon', text: 'Français' }),
                $('<DIV/>', { class: 'language_item soon', text: 'Italiano' }),
            )

            const language = $('<DIV/>', { class: 'language' })

            target.append( language.append( languageButton, languageList ) );
        }
    }
}
