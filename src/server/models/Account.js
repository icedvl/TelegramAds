const mongoose = require("mongoose");
require('mongoose-long')(mongoose);
const Schema = mongoose.Schema;
const {Types: {Long}} = mongoose;

const accountScheme = new Schema({
    status: { type: String, default: 'NEW', index: true },
    banTime: Date,
    init: {
        type: String,
        id: { type: Long, index: true },
        session: String,
    },
    config: {
        api_id: String,
        api_hash: String,
        name: { type: String, index: true },
    },
    info: {
        id: { type: Long, index: true },
        username: String,
        name: String,
        surname: String,
        about: String,
        phone: String,
        groups: Array,
        channels: Array,
        contacts: Array,
        chats: Array
    },
    group: { type: String, index: true },
    proxy: { type: String, index: true },
    stats: {
        messages: {
            sent: { type: Number, default: 0 },
            limit: {
                day: Number,
                total: Number
            }
        },
        invite: {
            sent: { type: Number, default: 0 },
            limit: {
                day: Number,
                total: Number
            }
        },
        reactions: {
            sent: { type: Number, default: 0 },
            limit: {
                day: Number,
                total: Number
            }
        },
        reports: {
            sent: { type: Number, default: 0 },
            limit: {
                day: Number,
                total: Number
            }
        },
        votes: {
            sent: { type: Number, default: 0 },
            limit: {
                day: Number,
                total: Number
            }
        }
    },
    actions: Array,
    scenarios: Array,
    last_work_time: { type: Date, index: true },
}, {
    timestamps: true,
    minimize: false
});

const Account = mongoose.model("Account", accountScheme);

module.exports.Account = Account;
