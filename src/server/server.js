require('dotenv').config()
const axios = require('axios')
const express = require('express')
const app = express()

app.post('/auth', function (req, res) {

    axios.post( process.env.SERVER + '/auth', {
        login: res.login,
        pass: res.login
    })
        .then(res2 => {
            res.sendStatus(200)
        })
        .catch(err => {
            console.log( err )
        })

})

app.listen(2207)

