const { app, BrowserWindow, ipcMain, Tray } =
require('electron');
const path = require('path');

let tray = undefined;
let window = undefined;

// Don't show the app in the mac dock
app.dock.hide();

app.on('ready', () => {
    createTray();
    createWindow();
});

// Method to create the tray
const createTray = () => {
    tray = new Tray(path.join('icon.png'));
    tray.on('click', function (event) {
        toggleWindow();
    })
}

// Method to toggle the window
const toggleWindow = () => {
    window.isVisible() ? window.hide() : showWindow();
};

const showWindow = () => {
    const position = getWindowPosition();
    window.setPosition(position.x  , position.y, false);
    window.show();
}

const getWindowPosition = () => {
    const windowBounds = window.getBounds();
    const trayBounds = tray.getBounds();

    // Center window horizontally below tray icon
    const x =  Math.round(trayBounds.x + (trayBounds.width / 2)
    - (windowBounds.width / 2));

    // Position window 4 pixels vertically below tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4);

    return {x: x, y: y}
}

const createWindow = () => {
    window = new BrowserWindow({
        width: 320,
        height: 450,
        show: false,
        frame: false,
        fullscreenable: false,
        resizeable: false,
        transparent: true
    });
    window.loadURL(`file://${path.join('index.html')}`);

    // Hide the window when it loses focus
    window.on('blur', () => {
        if (!window.webContents.isDevToolsOpened()) {
            window.hide();
        }
    });
}