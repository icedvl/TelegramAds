require('dotenv').config();
const {ipcMain, app, dialog} = require("electron");
const axios = require('axios');
require('./pages/resources/accounts.js');


ipcMain.on('token', (event, data) => {
    global.token = data.token;
})





