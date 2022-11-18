const path = require("path");
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const server = require('./pre_build/server.js');
const { app, BrowserWindow, session } = require('electron');

// try {
//     require('electron-reloader')(module)
// } catch (_) {}


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');



let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1400,
        height: 800,
        backgroundColor: '#121423',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
            preload: dirname + '/pre_build/assets/script/libs/jquery-3.6.1.min.js',
        },
    });
    win.loadFile('./pre_build/index.html')


    autoUpdater.checkForUpdatesAndNotify();

    win.on('close', event => {
        win = null
    })
}

app.on('ready', () => {
    createWindow();
});


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


