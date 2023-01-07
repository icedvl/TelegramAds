const {ipcMain, app, dialog} = require("electron");
const fs = require("fs-extra");
const async = require("async");
const tdataConverter = require('./tdata-converter.js').Main;
const axios = require('axios');




// Добавление новых аккаунтов из tdata
ipcMain.on('addAccounts_tdata_req', (event, data) => {


    let apiId = process.env.API_ID;
    let apiHash = process.env.API_HASH;

    // если указаны кастомные Api Id и Api Hash
    if ( data.api ) {
        let apiId = data.api.slice(':')[0];
        let apiHash = data.api.slice(':')[1];
    }

    // Получаем выбранные пользователь путь к корневой папке
    let accountsFolderPath = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
    if ( accountsFolderPath ) {

        // проходим рекурсивно по всем вложениям в поисках папок tdata
        let pathArray = [];
        let getTdataPath = (path) => {

            let folders;
            try {
                folders = fs.readdirSync(path, {withFileTypes: true})
            } catch (err) {
                return
            }

            folders.forEach(folder => {

                if ( folder.isDirectory() ) {
                    if (folder.name === 'tdata') {
                        pathArray.push(path + '/' + folder.name)
                    } else if (folder.name !== 'tupdates') {
                        getTdataPath(path + '/' + folder.name)
                    }
                }
            })
        }
        getTdataPath( accountsFolderPath[0] )

        // проходим по собранным папкам tdata и получаем из них ключ сессии
        let errArray = [];
        let tdataArray = [];
        let tempArray = [];
        async.forEach(pathArray, (path, cb) => {
            tdataConverter(path)
                .then( data => {
                    data.path = path;
                    // разбиваем большой запрос на несколько
                    if ( pathArray.length >= 50 ) {
                        if (tempArray.length !== 50) {
                            tempArray.push(data);
                        } else {
                            tdataArray.push(tempArray);
                            tempArray = [];
                        }
                    } else {
                        tempArray.push(data);
                        tdataArray.push(tempArray);
                        tempArray = [];
                    }
                    cb();
                })
                .catch( err => {
                    errArray.push({ path: path, type: 'bad'})
                    cb();
                })
        }, () => {

            console.log( tdataArray )

            let newArray = [];
            let newAccountCounter = 0;

            async.forEach( tdataArray, (requestArray, callback) => {

                axios.post(
                    process.env.SERVER + '/accounts/add',
                    {
                        accounts: requestArray,
                        api_id: apiId,
                        api_hash: apiHash
                    },
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                            'Authorization': 'Bearer ' + data.token,
                        }
                    }
                )
                    .then(res => {
                        if ( res.data && res.data.newArray ) {
                            res.data.newArray.forEach( account => newArray.push(account));
                            newAccountCounter += res.data.newArray.length
                        }
                        if ( res.data && res.data.errArray ) { res.data.errArray.forEach( account => errArray.push(account)) }
                        callback();

                    })
                    .catch( err => {
                        if ( err.response && ( err.response.status === 401 || err.response.status === 403 ) ) {
                            event.sender.send('logout' );
                        } else {
                            console.log( err )
                            callback();
                        }
                    })

            }, () => {

                event.sender.send('addAccounts_tdata_res', { added: newArray, error: errArray });

            })
        })
    } else {
        event.sender.send('addAccounts_tdata_res', { empty: true });
    }

});

