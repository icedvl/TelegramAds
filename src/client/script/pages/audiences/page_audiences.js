app.pages.audiences = {
    render: () => {
        const topbar = $('<DIV/>', { class: 'topbar' });
        const title = $('<DIV/>', { class: 'topbar_title', text: lang.pages.audiences.title });
        $('.content').append(
            topbar.append(
                title
            )
        )
    }
}
