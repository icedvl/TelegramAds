app.pages.resources = {
    tabs: {},
    render: () => {
        const topbar = $('<DIV/>', { class: 'topbar' });
        const title = $('<DIV/>', { class: 'topbar_title', text: lang.pages.resources.title });
        $('.content').append(
            topbar.append( title, utils.page.tabs.render(['accounts', 'proxies', 'autoreg'] ) ),
            $('<DIV/>', { class: 'content_body' })
        )
    }
}

//=require tab_accounts.js
//=require tab_proxies.js
//=require tab_autoreg.js
