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
