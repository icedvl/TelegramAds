const { ipcRenderer } = require('electron');
ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    console.log( arg.version )
    localStorage.setItem('version', arg.version)
});

ipcRenderer.on('update_available', () => {
    console.log('Update Available')
});
ipcRenderer.on('update_downloaded', () => {
    console.log('Update Downloaded')
});


window.$ = window.jQuery = require('jquery');

(async () => {
    const app = {};
    //=require svg.js
    //=require utils.js
    //=require partials/elements.js

    //=require partials/auth.js
    //=require partials/sidebar.js
    //=require partials/content.js

    const lang = await $.getJSON(`assets/lang/${localStorage.getItem('lang') || 'en' }.json`);

    // проверяем авторизацию
    if ( localStorage.getItem('isAuth') ) {
        // Если авторизирован рисуем приложение
        // app.sidebar.render();
        // app.content.render();
        app.auth.render()
    } else {
        // Если не авторизирован рисуем окно авторизации/регистрации
        console.log('Не авторизирован')
        localStorage.removeItem('authRequest')
        app.auth.render()
    }
})();



