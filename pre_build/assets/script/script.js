const { ipcRenderer } = require('electron');
ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    console.log( arg.version )
    localStorage.setItem('version', arg.version)
});

window.$ = window.jQuery = require('jquery');



const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});


function closeNotification() {
    notification.classList.add('hidden');
}
function restartApp() {
    ipcRenderer.send('restart_app');
}

restartButton.onclick = function () {
    console.log('Restart')
    restartApp();
};
document.getElementById('close-button').addEventListener('click', closeNotification);



(async () => {
    const app = {};
    const svg = {
        logo: '<svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36.1124 29.3985L39.9855 1.69836C40.1461 0.549665 38.94 -0.33068 37.8236 0.120389L0.478352 15.2076C-0.176809 15.4723 -0.153509 16.3676 0.514613 16.6008L7.96201 19.2004C9.85673 19.8618 11.9686 19.6105 13.6361 18.5253L28.9669 8.5479C29.5579 8.16332 30.2187 8.93081 29.7105 9.41143L18.3354 20.1693C17.2711 21.1758 17.4495 22.8646 18.7029 23.6472L31.2945 31.5095C33.2237 32.7141 35.8069 31.5822 36.1124 29.3985Z" fill="#B9C0FF"/></svg>',
        loader: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.02 2.2C13.36 2.07 12.69 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-.68-.07-1.35-.2-1.99"/></svg>',
        icon: {
            resources: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#9B9CB0" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.61 13.24V9.58L7.12 4.1M2.78 7.44l8.83 5.11 8.77-5.08m-8.77 14.14v-9.07M9.54 2.48 4.2 5.45C2.99 6.12 2 7.8 2 9.18v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.18c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.64-3.01-.64-4.15 0v0Z"/></svg>',
            audience: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#9B9CB0" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 3h1a28.424 28.424 0 0 0 0 18H8m7-18c.97 2.92 1.46 5.96 1.46 9M3 16v-1c2.92.97 5.96 1.46 9 1.46M3 9a28.424 28.424 0 0 1 18 0m1 13-1-1m1-9c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10m6.2-.6a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/></svg>',
            accounts: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#9B9CB0" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.065 4c1.94 0 3.5 1.57 3.5 3.5 0 1.89-1.5 3.43-3.37 3.5a1.13 1.13 0 0 0-.26 0m2.06 9c.72-.15 1.4-.44 1.96-.87 1.56-1.17 1.56-3.1 0-4.27-.55-.42-1.22-.7-1.93-.86m-9.21-3.13c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43c0-2.45 1.98-4.44 4.44-4.44a4.436 4.436 0 1 1 .16 8.87Zm-5 3.69c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0v0Z"/></svg>',
            groups: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#9B9CB0" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 7v10c0 .62-.02 1.17-.09 1.66C17.62 21.29 16.38 22 13 22h-2c-3.38 0-4.62-.71-4.91-3.34C6.02 18.17 6 17.62 6 17V7c0-.62.02-1.17.09-1.66C6.38 2.71 7.62 2 11 2h2c3.38 0 4.62.71 4.91 3.34.07.49.09 1.04.09 1.66Z"/><path stroke="#9B9CB0" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 17c0 .62.02 1.17.09 1.66-.14.01-.27.01-.42.01h-.34C2.67 18.67 2 18 2 15.33V8.67C2 6 2.67 5.33 5.33 5.33h.34c.15 0 .28 0 .42.01C6.02 5.83 6 6.38 6 7v10Zm16-8.33v6.66c0 2.67-.67 3.34-3.33 3.34h-.34c-.15 0-.28 0-.42-.01.07-.49.09-1.04.09-1.66V7c0-.62-.02-1.17-.09-1.66.14-.01.27-.01.42-.01h.34C21.33 5.33 22 6 22 8.67Z"/></svg>',
            settings: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#9B9CB0" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M12 15.439a3 3 0 1 0 0-6 3 3 0 0 0 0 6v0Z"/><path stroke="#9B9CB0" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M2 13.319v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47.79-1.49 1.07-2.28.6l-1.73-.99a1.9 1.9 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9Z"/></svg>',
            input: {
                danger: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#FF3030" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v5m0 7.41H5.94c-3.47 0-4.92-2.48-3.24-5.51l3.12-5.62L8.76 5c1.78-3.21 4.7-3.21 6.48 0l2.94 5.29 3.12 5.62c1.68 3.03.22 5.51-3.24 5.51H12v-.01Z"/><path stroke="#FF3030" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.995 17h.009"/></svg>',
                passShow: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#9CA2C9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.58 12c0 1.98-1.6 3.58-3.58 3.58S8.42 13.98 8.42 12s1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58Z"/><path stroke="#9CA2C9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 20.27c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-2.29-3.6-5.58-5.68-9.11-5.68-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19 2.29 3.6 5.58 5.68 9.11 5.68Z"/></svg>',
                passHide: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#9CA2C9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14.53 9.47-5.06 5.06a3.578 3.578 0 0 1 5.06-5.06v0Z"/><path stroke="#9CA2C9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73c-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19.79 1.24 1.71 2.31 2.71 3.17m2.82 1.76c1.14.48 2.35.74 3.58.74 3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-.33-.52-.69-1.01-1.06-1.47"/><path stroke="#9CA2C9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.51 12.7a3.565 3.565 0 0 1-2.82 2.82m-3.22-.99L2 22M22 2l-7.47 7.47"/></svg>'
            },
            email: {
                default: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M17 20.5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5Z"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="m17 9-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9"/></svg>',
                sent: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M2 8.5c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5H7"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="m17 9-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9m-5 7.5h6m-6-4h3"/></svg>'
            },
            world: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 3h1a28.424 28.424 0 0 0 0 18H8m7-18a28.425 28.425 0 0 1 0 18"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 16v-1a28.424 28.424 0 0 0 18 0v1M3 9a28.424 28.424 0 0 1 18 0"/></svg>',
        }
    
    }
    
    const utils = {
        page: {
            clearAll: () => {
                $('body *').remove();
            },
            clearContent: () => {
                $('body .content *').remove();
            }
        }
    };
    
    const elements = {
        popup: (type, target, content) => {
            if ( type === 'block' ) {
                target.append(
                    $('<DIV/>', {class: 'popup'}).append(
                        $('<DIV/>', { class: 'popup_content' }).append( content )
                    )
                )
            }
    
            if ( type === 'side' ) {
                target.append(
                    $('<DIV/>', {class: 'sidepopup'}).append(
                        $('<DIV/>', { class: 'popup_content' }).append( content )
                    )
                )
            }
        },
        language: {
            render: () => {
                const languageButton = $('<DIV/>', { class: 'language_button', html: [ lang.lang.button, svg.icon.world ] }).on('click', () => {
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
    
                $('body').append( language.append( languageButton, languageList ) );
            }
        }
    }
    

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
    
    app.sidebar = {
        render: (active) => {
            const sidebar = $('<DIV/>', { class: 'sidebar' });
            const logo = $('<DIV/>', { class: 'sidebar_logo' }).append(svg.logo);
            const nav = $('<NAV/>', { class: 'sidebar_nav' });
            const settings = $('<DIV/>', { class: 'sidebar_settings', alt: lang.pages.settings.title });
            const account = $('<DIV/>', { class: 'sidebar_account', alt: lang.pages.account.title });
    
            nav.append(
                $('<DIV/>', { alt: lang.pages.resources.title }).append( svg.icon.resources ),
                $('<DIV/>', { alt: lang.pages.audience.title }).append( svg.icon.audience ),
                $('<DIV/>', { alt: lang.pages.accounts.tabs.spam.title }).append( svg.icon.accounts ),
                $('<DIV/>', { alt: lang.pages.groups.tabs.invite.title }).append( svg.icon.groups ),
            )
    
            settings.append( svg.icon.settings ),
    
            sidebar.append(
                logo,
                nav,
                settings,
                account
            )
    
            $('body').append(sidebar)
        }
    };
    
    app.content = {
        render: () => {
            const content = $('<DIV/>', { class: 'content' })
            $('body').append( content )
        }
    }
    

    const lang = await $.getJSON(`assets/lang/${localStorage.getItem('lang') || 'en' }.json`);

    // проверяем авторизацию
    if ( localStorage.getItem('isAuth') ) {
        // Если авторизирован рисуем приложение
        // app.sidebar.render();
        // app.content.render();
        app.auth.render()
    } else {
        // Если не авторизирован рисуем окно авторизации/регистрации
        console.log('Не авторизирован')
        localStorage.removeItem('authRequest')
        app.auth.render()
    }
})();



