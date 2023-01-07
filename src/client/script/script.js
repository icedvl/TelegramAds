window.$ = window.jQuery = require('jquery');
const { ipcRenderer } = require('electron');
//=require libs/jquery-ui.js


let languages = {};
//=require ../lang/en.js
//=require ../lang/ru.js
let lang = languages[ localStorage.getItem('lang') || 'en' ];


//=require defaultConfig.js
let state = {
    pages: JSON.parse( localStorage.getItem('pages') ) || defaultPages,
    params: JSON.parse( localStorage.getItem('params') ) || defaultParams,
}

let resources = {};

const app = {
    pages: {}
};


(async () => {

    ipcRenderer.on('logout', () => {
        localStorage.removeItem('token');
        window.location.reload();
    })

    // console.log( state )

    // подгружаем язык

    //=require utils.js
    //=require svg.js
    //=require partials/elements.js
    //=require partials/updates.js
    //=require partials/auth.js
    //=require partials/sidebar.js
    //=require partials/content.js
    //=require pages/resources/page_resources.js
    //=require pages/audiences/page_audiences.js
    //=require pages/accounts/page_accounts.js
    //=require pages/groups/page_groups.js
    //=require pages/settings/page_settings.js
    //=require pages/account/page_account.js


    // проверяем есть ли у пользователя интернет
    if ( !window.navigator.onLine ) {

        await utils.system.connectionStatus()
    } else {

        // проверяем жив ли сервер, и есть ли какая-то информация
        if (await utils.system.serverStatus()) {

            // проверяем авторизацию
            if (await app.auth.check()) {
                resources.vote = await utils.getResources.votes();
                resources.accounts = await utils.getResources.accounts();
                $('body').removeClass('loading').addClass('authorized');
                app.sidebar.render();
                app.content.render();
                utils.page.open( state.pages.open );
                console.log( resources )
            } else {
                $('body').removeClass('loading')
                app.auth.render()
            }
        }
    }
})();



