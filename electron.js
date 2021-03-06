/* jshint node: true */

var electron = require('electron');
//var Menu = require("menu");

var app = electron.app;
var mainWindow = null;
var BrowserWindow = electron.BrowserWindow;

electron.crashReporter.start();

app.on('window-all-closed', function onWindowAllClosed() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function onReady() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        icon :  __dirname + '/dist/assets/buggyvid.png'
    });

    delete mainWindow.module;


  /*  var template = [{
        label: "uMediaShare",
        submenu: [
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}
    ];


    Menu.setApplicationMenu(Menu.buildFromTemplate(template)); */

    // If you want to open up dev tools programmatically, call
    // mainWindow.openDevTools();

    // By default, we'll open the Ember App by directly going to the
    // file system.
    //
    // Please ensure that you have set the locationType option in the
    // config/environment.js file to 'hash'. For more information,
    // please consult the ember-electron readme.
    mainWindow.loadURL('file://' + __dirname + '/dist/index.html');

    mainWindow.on('closed', function onClosed() {
        mainWindow = null;
    });
});
