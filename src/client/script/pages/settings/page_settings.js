app.pages.settings = {
    render: () => {
        const topbar = $('<DIV/>', { class: 'topbar' });
        const title = $('<DIV/>', { class: 'topbar_title', text: lang.pages.settings.title });
        $('.content').append(
            topbar.append(
                title
            )
        )
    }
}
