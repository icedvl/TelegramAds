app.pages.account = {
    render: () => {
        const topbar = $('<DIV/>', { class: 'topbar' });
        const title = $('<DIV/>', { class: 'topbar_title', text: lang.pages.account.title });
        $('.content').append(
            topbar.append(
                title,
                $('<h3/>', { class: 'logout', text: 'Logout' }).on('click', () => {
                    localStorage.removeItem('token');
                    window.location.reload();
                })
            )
        )
    }
}
