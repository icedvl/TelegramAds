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












app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
})

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
    // autoUpdater.quitAndInstall();
    setImmediate(() => {
        app.removeAllListeners("window-all-closed")
        if (mainWindow != null) {
            mainWindow.close()
        }
        autoUpdater.quitAndInstall(false)
    })
});



autoUpdater.on('update-available', () => {
    console.log( 'Update is available' )
    mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
    console.log( 'Update is downloaded' )
    mainWindow.webContents.send('update_downloaded');
});
