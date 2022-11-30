app.sidebar = {
    render: (active) => {
        const sidebar = $('<DIV/>', { class: 'sidebar' });
        const logo = $('<DIV/>', { class: 'sidebar_logo' }).append(svg.logo);
        const nav = $('<NAV/>', { class: 'sidebar_nav' });
        const settings = $('<DIV/>', { 'data-name': 'settings', class: 'sidebar_settings', alt: lang.pages.settings.title });
        const account = $('<DIV/>', { 'data-name': 'account', class: 'sidebar_account', alt: lang.pages.account.title });

        nav.append(
            $('<DIV/>', { 'data-name': 'resources', class: 'sidebar_menuitem', alt: lang.pages.resources.title }).append( svg.icon.resources ).on('click', function() { utils.page.open( 'resources') }),
            $('<DIV/>', { 'data-name': 'audiences', class: 'sidebar_menuitem', alt: lang.pages.audiences.title }).append( svg.icon.audience ).on('click', function() { utils.page.open( 'audiences') }),
            $('<DIV/>', { 'data-name': 'accounts', class: 'sidebar_menuitem', alt: lang.pages.accounts.tabs.spam.title }).append( svg.icon.accounts ).on('click', function() { utils.page.open( 'accounts') }),
            $('<DIV/>', { 'data-name': 'groups', class: 'sidebar_menuitem', alt: lang.pages.groups.tabs.invite.title }).append( svg.icon.groups ).on('click', function() { utils.page.open( 'groups') }),
        )

        settings.append( svg.icon.settings ).on('click', function() { utils.page.open( 'settings') });
        account.append( svg.icon.user ).on('click', function() { utils.page.open( 'account') });

        sidebar.append(
            logo,
            nav,
            settings,
            account
        )

        $('body').append(sidebar)
    }
};
