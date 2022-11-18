const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
const server = require('./pre_build/server.js');
const { BrowserWindow, app } = require('electron');

try {
    require('electron-reloader')(module)
} catch (_) {}


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let template = []
if (process.platform === 'darwin') {
    // OS X
    const name = app.getName();
    template.unshift({
        label: name,
        submenu: [
            {
                label: 'About ' + name,
                role: 'about'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click() { app.quit(); }
            },
        ]
    })
}


function main() {
    let mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        backgroundColor: '#121423'
    });
    mainWindow.loadFile('./pre_build/index.html')
    mainWindow.webContents.openDevTools()
    mainWindow.on('close', event => {
        mainWindow = null
    })
}

app.on('ready', function()  {
    autoUpdater.checkForUpdatesAndNotify();
    main();
});

