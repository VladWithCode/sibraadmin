const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');
// const { protocol } = require('electron/main');

let mainWindow;
const relativePath = app.getAppPath();

function createWindow() {
    mainWindow = new BrowserWindow({ width: 900, height: 680, backgroundColor: '#fff', minWidth: 900, minHeight: 680 });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : path.join(relativePath, 'build/index.html'));
    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        mainWindow.webContents.openDevTools();
    }
    // if (!isDev) {
    //     mainWindow.webPreferences.devTools = false;
    // }
    mainWindow.setMenu(null);
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', () => {

    /* protocol.interceptFileProtocol('app', (req, cb) => {
        const url = req.url.substr(7);
        cb({
            path: path.join(relativePath, 'build', url)
        })

    }, err => { console.log(err) }); */

    createWindow();

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});


console.log('electron-dev', app.getAppPath());