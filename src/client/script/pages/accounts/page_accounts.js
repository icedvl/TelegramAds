app.pages.accounts = {
    tabs: {},
    render: () => {
        const topbar = $('<DIV/>', { class: 'topbar' });
        const title = $('<DIV/>', { class: 'topbar_title', text: lang.pages.accounts.title });
        $('.content').append(
            topbar.append( title, utils.page.tabs.render(['spam', 'comment', 'view', 'reaction', 'vote', 'report'] ) )
        )
    }
}

//=require tab_spam.js
//=require tab_comment.js
//=require tab_view.js
//=require tab_reaction.js
//=require tab_vote.js
//=require tab_report.js
