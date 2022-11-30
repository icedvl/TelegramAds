const {ipcMain, app, dialog} = require("electron");
const fs = require("fs-extra");
const async = require("async");
const tdataConverter = require('./tdata-converter.js').Main;
const Account = require('./client/src/server/models/Account')



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
        let newArray = [];
        async.forEach(pathArray, (path, cb) => {
            tdataConverter(path)
                .then( async data => {
                    data.path = path;
                    newArray.push(data);
                    cb();
                })
                .catch( async err => {
                    errArray.push({ path: path, type: 'bad'})
                    cb();
                })
        }, () => {
            // console.log( 'error', errArray )
            // console.log( 'new', newArray )
            let counter = 0;

            // смотрим не добавлен ли такой аккаунт, если нет создаем новый
            async.forEach(newArray, async (account, cb) => {
                counter++;
                let exist = await Account.find({ $or: [{ tdata_id: account.id, session: account.session }]});
                if ( exist ) {
                    newArray.splice(counter, 1);
                    errArray.push({ path: data.path, type: 'double'});
                    cb();
                } else {
                    new Account({
                        init: {
                            type: 'tdata',
                            id: account.id,
                            session: account.session
                        },
                        config: {
                            api_id: apiId,
                            api_hash: apiHash
                        }
                    })
                }
            }, () => {
                event.sender.send('addAccounts_tdata_res', { added: newArray.length, error: errArray });
            })
        })
    } else {
        event.sender.send('addAccounts_tdata_res', { empty: true });
    }

});
