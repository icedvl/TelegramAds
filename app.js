const path = require("path");
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const server = require('./pre_build/server.js');
const { app, BrowserWindow, session, ipcMain, dialog} = require('electron');

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
            devTools: !app.isPackaged,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
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


ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
    win.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update_downloaded');
});



process.on('uncaughtException', function (error) {
    // Handle the error
    console.log( error )
})


