app.pages.groups = {
    render: () => {
        const topbar = $('<DIV/>', { class: 'topbar' });
        const title = $('<DIV/>', { class: 'topbar_title', text: lang.pages.groups.title });
        $('.content').append(
            topbar.append( title, utils.page.tabs.render(['invite', 'clone', 'post']) )
        )
    }
}
