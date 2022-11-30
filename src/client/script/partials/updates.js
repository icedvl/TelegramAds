
ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    console.log( arg.version )
    localStorage.setItem('version', arg.version)
});

// ipcRenderer.on('update_available', () => {
//     console.log('Update Available')
// });
// ipcRenderer.on('update_downloaded', () => {
//     console.log('Update Downloaded')
// });
