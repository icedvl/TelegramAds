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
