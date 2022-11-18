const { ipcRenderer } = require('electron');
ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    console.log( arg.version )
    localStorage.setItem('version', arg.version)
});




const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});


function closeNotification() {
    notification.classList.add('hidden');
}
function restartApp() {
    ipcRenderer.send('restart_app');
}

restartButton.onclick = function () {
    console.log('Restart')
    restartApp();
};
document.getElementById('close-button').addEventListener('click', closeNotification);


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



