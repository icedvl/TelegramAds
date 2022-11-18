app.auth = {
    render: () => {
        const auth = $('<DIV/>', { class: 'auth' });

        app.auth.signIn.render(auth);
        // app.auth.signUp.render(auth); // Открыть сразу же экран Регистрации для теста
        // app.auth.recover.render(auth); // Открыть сразу же экран Восстановления пароля для теста

        elements.popup('block', $('body'), auth);

        elements.language.render();
    },
    signIn: {
        render: (target) => {
            let emailTimeout, passwordTimout;

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
            const buttonSignIn = $('<BUTTON/>', { class: 'auth_signin_button' }).append(
                $('<SPAN>', { class: 'button_text', text: lang.pages.auth.signIn.button }),
                $('<SPAN/>', { class: 'button_loader', html: svg.loader })
            );
            const buttonRecover = $('<DIV/>', {class: 'auth_signin_recover', text: lang.pages.auth.signIn.recover});
            const buttonSignUp = $('<DIV/>', {class: 'auth_signin_signup', html: lang.pages.auth.signIn.signUp});

            buttonSignIn.on('click', function () {

                let validate = true;

                console.log( /\S+@\S+\.\S+/.test( email.find('input').val() ) );

                if ( !email.find('input').val() || !/\S+@\S+\.\S+/.test( email.find('input').val() ) ) {
                    validate = false;
                    email.removeClass('error');
                    email.addClass('error');
                    clearTimeout( emailTimeout )
                    emailTimeout = setTimeout(() => {
                        email.removeClass('error');
                        clearTimeout( emailTimeout )
                    }, 2000)
                }

                if ( !password.find('input').val() ) {
                    validate = false;
                    password.removeClass('error');
                    password.addClass('error');
                    clearTimeout( passwordTimout )
                    passwordTimout = setTimeout(() => {
                        password.removeClass('error');
                        clearTimeout( passwordTimout )
                    }, 2000)
                }

                if ( validate ) {
                    email.removeClass('error');
                    password.removeClass('error');
                    wrap.addClass('loading');
                    $(this).addClass('loading').attr('disabled', true);
                    localStorage.setItem('authRequest', true);
                    app.auth.signIn.request({
                        email: email.find('input').val(),
                        password: password.find('input').val()
                    });
                }
            })

            buttonSignUp.on('click', () => {
                if ( !localStorage.getItem('authRequest') ) {
                    wrap.removeClass('spaceInRight').addClass('spaceOutLeft')
                    if (!$('.auth_signup').length) {
                        app.auth.signUp.render(target);
                    } else {
                        $('.auth_signup').removeClass('spaceOutLeft').addClass('spaceInRight');
                    }
                }
            })

            buttonRecover.on('click', () => {
                if ( !localStorage.getItem('authRequest') ) {
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
        request: (data) => {
            console.log( data.email, data.password )
            $.post('http://127.0.0.1:2207/auth/signin', data)
                .done(res => {
                    utils.page.clearAll();
                    localStorage.setItem('isAuth', true);
                    app.sidebar.render();
                    app.content.render();
                })
                .catch(err => {
                    console.log(err)
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
            const buttonSignUp = $('<BUTTON/>', { class: 'auth_signup_button' }).append(
                $('<SPAN>', { class: 'button_text', text: lang.pages.auth.signUp.button }),
                $('<SPAN/>', { class: 'button_loader', html: svg.loader })
            );
            const buttonSignIn = $('<DIV/>', {class: 'auth_signup_signin', html: lang.pages.auth.signUp.signIn});

            buttonSignUp.on('click', function () {
                let validate = true;

                if ( !email.find('input').val() || !/\S+@\S+\.\S+/.test( email.find('input').val() ) ) {
                    validate = false;
                    email.removeClass('error');
                    email.addClass('error');
                    clearTimeout( emailTimeout )
                    emailTimeout = setTimeout(() => {
                        email.removeClass('error');
                        clearTimeout( emailTimeout )
                    }, 2000)
                }

                if ( !password.find('input').val() ) {
                    validate = false;
                    password.removeClass('error');
                    password.addClass('error');
                    clearTimeout( passwordTimout )
                    passwordTimout = setTimeout(() => {
                        password.removeClass('error');
                        clearTimeout( passwordTimout )
                    }, 2000)
                }

                if ( password.find('input').val() !== passwordConfirm.find('input').val() ) {
                    validate = false;
                    passwordConfirm.removeClass('error');
                    passwordConfirm.addClass('error');
                    clearTimeout( passwordConfirmTimeout );
                    passwordConfirmTimeout = setTimeout(() => {
                        passwordConfirm.removeClass('error');
                        clearTimeout( passwordConfirmTimeout );
                    }, 2000)
                }

                if ( validate ) {
                    email.removeClass('error');
                    password.removeClass('error');
                    passwordConfirm.removeClass('error');
                    wrap.addClass('loading');
                    $(this).addClass('loading').attr('disabled', true);
                    localStorage.setItem('authRequest', true);
                    app.auth.signUp.request({
                        email: email.find('input').val(),
                        password: password.find('input').val()
                    });

                }


            });

            buttonSignIn.on('click', () => {
                if ( !localStorage.getItem('authRequest') ) {
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
        request: (data) => {
            console.log( data.email, data.password, data.confirmPassword );
            $.post('http://127.0.0.1:2207/auth/signup', data)
                .done(res => {
                    utils.page.clearAll();
                    localStorage.setItem('isAuth', true);
                    app.sidebar.render();
                    app.content.render();
                })
                .catch(err => {
                    console.log(err)
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
            const buttonRecover = $('<BUTTON/>', { class: 'auth_recover_button' }).append(
                $('<SPAN>', { class: 'button_text', text: lang.pages.auth.recover.button }),
                $('<SPAN/>', { class: 'button_loader', html: svg.loader })
            );
            const buttonSignIn = $('<DIV/>', { class: 'auth_recover_signin', text: lang.pages.auth.recover.signIn });
            const buttonSignUp = $('<DIV/>', { class: 'auth_recover_signup', html: lang.pages.auth.recover.signUp });

            buttonRecover.on('click', function () {
                let validate = true;

                if ( !email.find('input').val() || !/\S+@\S+\.\S+/.test( email.find('input').val() ) ) {
                    validate = false;
                    email.removeClass('error');
                    email.addClass('error');
                    clearTimeout( emailTimeout )
                    emailTimeout = setTimeout(() => {
                        email.removeClass('error');
                        clearTimeout( emailTimeout )
                    }, 2000)
                }

                if ( validate ) {
                    email.removeClass('error');
                    wrap.addClass('loading');
                    $(this).addClass('loading').attr('disabled', true);
                    localStorage.setItem('authRequest', true);
                    app.auth.recover.request(
                        wrap, {
                        email: email.find('input').val()
                    });
                }
            })

            buttonSignIn.on('click', () => {
                if ( !localStorage.getItem('authRequest') ) {
                    wrap.removeClass('spaceInRight').addClass('spaceOutLeft')
                    if (!$('.auth_signin').length) {
                        app.auth.signIn.render(target);
                    } else {
                        $('.auth_signin').removeClass('spaceOutLeft').addClass('spaceInRight');
                    }
                }
            })

            buttonSignUp.on('click', () => {
                if ( !localStorage.getItem('authRequest') ) {
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
        request: (wrap, data) => {
            console.log( data.email )
            $.post('http://127.0.0.1:2207/auth/recover', data)
                .done(res => {
                    wrap.prepend( $('<DIV/>', { class: 'auth_message', html: [ svg.icon.email.sent, lang.pages.auth.recover.messages.newPassword] }) )
                })
                .catch(err => {
                    console.log(err)
                })

        }
    }
}
