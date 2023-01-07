// const { ipcRenderer } = require('electron');

const utils = {
    system: {
        connectionStatus: () => {
            $('body').removeClass('loading').append(
                $('<DIV/>', { class: 'system' }).append(
                    svg.noInternet,
                    $('<DIV/>', { class: 'system_message', text: lang.system.noInternet.message }),
                    $('<DIV/>', { class: 'system_button', text: lang.system.noInternet.button }).on('click', () => {
                        window.location.reload()
                    })
                )
            )
        },
        serverStatus: async () => {

            const serverStatus = await fetch(process.env.SERVER + '/status')
                .then(res => {
                    // console.log(res);
                    return true;
                })
                .catch(err => {
                    $('body').removeClass('loading').append(
                        $('<DIV/>', { class: 'system' }).append(
                            svg.serverNotRespond,
                            $('<DIV/>', { class: 'system_message', text: lang.system.serverNotRespond.message }),
                            $('<DIV/>', { class: 'system_button', text: lang.system.serverNotRespond.button }).on('click', () => {
                                window.location.reload()
                            })
                        )
                    )
                    return false
                })


            return serverStatus;

        }
    },
    getResources: {
        votes: () => {
            return $.get(process.env.SERVER + '/vote/get');
        },
        accounts: () => {
            return $.get(process.env.SERVER + '/accounts/get');
        },
        proxies: () => {
            return $.get(process.env.SERVER + '/accounts/proxies');
        }
    },
    page: {
        clearAll: () => {
            $('body *').remove();
        },
        clearContent: () => {
            $('body .content *').remove();
        },
        open: (page) => {
            // console.log( state.pages )
            state.pages.open = page;
            localStorage.setItem('pages', JSON.stringify( state.pages ));

            $('.sidebar_menuitem, .sidebar_settings, .sidebar_account').removeClass('active');
            $(`.sidebar [data-name=${ page }]`).addClass('active');
            utils.page.clearContent();
            app.pages[ page ].render();
            if ( app.pages[ page ].tabs ) {
                utils.page.tabs.open()
            }
        },
        tabs: {
            render: (tabs) => {
                const tabsWrap = $('<DIV/>', { class: 'topbar_tabs' });
                tabs.forEach( tab => {
                    tabsWrap.append(
                        $('<DIV/>', {
                            'data-name': tab,
                            class: 'topbar_tab',
                            text: lang.pages[state.pages.open].tabs[tab].title
                        })
                            .on('click', function() {
                                utils.page.tabs.open( tab )
                            })
                    )
                })
                return tabsWrap
            },
            open: (tab) => {
                tab = tab || state.pages[ state.pages.open ];
                state.pages[ state.pages.open ] = tab;
                localStorage.setItem('pages', JSON.stringify( state.pages ));

                $('.topbar_tab').removeClass('active');
                $(`.topbar_tab[data-name=${ tab }`).addClass('active');
                $('.content_body *').remove();
                app.pages[ state.pages.open ].tabs[ tab ].render();
            }
        }
    },
    declOfNum: function(n, titles) {
        if (titles.constructor === Array) {
            return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
        } else {
            return titles;
        }
    },
};
