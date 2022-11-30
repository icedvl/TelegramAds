"use strict";
/**
 * Converts a TDATA (tdesktop) folder to a GramJS session.
 * Needs GramJS installed (npm i telegram)
 *
 * This is all based on https://github.com/danog/MadelineProto/blob/master/src/danog/MadelineProto/Conversion.php from the madeline library
 * and as such is distributed in the same license and with the same header
 *
 * onversion module.
 *
 * This file is part of MadelineProto.
 * MadelineProto is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * MadelineProto is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU General Public License along with MadelineProto.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 * @author    Daniil Gentili <daniil@daniil.it>
 * @copyright 2016-2020 Daniil Gentili <daniil@daniil.it>
 * @license   https://opensource.org/licenses/AGPL-3.0 AGPLv3
 *
 * @link https://docs.madelineproto.xyz MadelineProto documentation
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var fs = require("fs");
var extensions_1 = require("telegram/extensions");
var IGE_1 = require("telegram/crypto/IGE");
var AuthKey_1 = require("telegram/crypto/AuthKey");
var sessions_1 = require("telegram/sessions");
function tdesktop_md5(data) {
    var result = '';
    var hash = crypto.createHash('md5').update(data).digest("hex");
    for (var i = 0; i < hash.length; i += 2) {
        result += hash[i + 1] + hash[i];
    }
    return result.toUpperCase();
}
function tdesktop_readBuffer(file) {
    var length = file.read(4).reverse().readInt32LE();
    return length > 0 ? file.read(length, false) : Buffer.alloc(0);
}
function sha1(buf) {
    return crypto.createHash('sha1').update(buf).digest();
}
/**
 * Old way of calculating aes keys
 */
function _calcKey(authKey, msgKey, client) {
    var x = client ? 0 : 8;
    var sha1_a = sha1(Buffer.concat([msgKey, authKey.slice(x, x + 32)]));
    var sha1_b = sha1(Buffer.concat([authKey.slice(32 + x, 32 + x + 16), msgKey, authKey.slice(48 + x, 48 + x + 16)]));
    var sha1_c = sha1(Buffer.concat([authKey.slice(64 + x, 64 + x + 32), msgKey]));
    var sha1_d = sha1(Buffer.concat([msgKey, authKey.slice(96 + x, 96 + x + 32)]));
    var aes_key = Buffer.concat([sha1_a.slice(0, 8), sha1_b.slice(8, 8 + 12), sha1_c.slice(4, 4 + 12)]);
    var aes_iv = Buffer.concat([sha1_a.slice(8, 8 + 12), sha1_b.slice(0, 8), sha1_c.slice(16, 16 + 4), sha1_d.slice(0, 8)]);
    return [aes_key, aes_iv];
}
function tdesktop_decrypt(data, auth_key) {
    var message_key = data.read(16);
    var encrypted_data = data.read();
    var _a = _calcKey(auth_key, message_key, false), aes_key = _a[0], aes_iv = _a[1];
    var ige = new IGE_1.IGE(aes_key, aes_iv);
    var decrypted_data = ige.decryptIge(encrypted_data);
    if (message_key.toString("hex") != sha1(decrypted_data).slice(0, 16).toString("hex")) {
        throw new Error('msg_key mismatch');
    }
    return new extensions_1.BinaryReader(decrypted_data);
}
function tdesktop_open_encrypted(fileName, tdesktop_key) {
    var f = tdesktop_open(fileName);
    var data = tdesktop_readBuffer(f);
    var res = tdesktop_decrypt(new extensions_1.BinaryReader(data), tdesktop_key);
    var length = res.readInt(false);
    if (length > res.getBuffer().length || length < 4) {
        throw new Error('Wrong length');
    }
    return res;
}
function tdesktop_open(name) {
    var filesToTry = [];
    for (var _i = 0, _a = ['0', '1', 's']; _i < _a.length; _i++) {
        var i = _a[_i];
        if (fs.existsSync(name + i)) {
            filesToTry.push(new extensions_1.BinaryReader(fs.readFileSync(name + i)));
        }
    }
    for (var _b = 0, filesToTry_1 = filesToTry; _b < filesToTry_1.length; _b++) {
        var fileToTry = filesToTry_1[_b];
        var magic = fileToTry.read(4).toString("utf-8");
        if (magic != "TDF$") {
            console.error("WRONG MAGIC");
            continue;
        }
        var versionBytes = fileToTry.read(4);
        var version = versionBytes.readInt32LE(0);
        // console.error("TDesktop version: ".concat(version));
        var data = fileToTry.read();
        var md5 = data.slice(-16).toString("hex");
        data = data.slice(0, -16);
        var length = Buffer.alloc(4);
        length.writeInt32LE(data.length, 0);
        var toCompare = Buffer.concat([data, length, versionBytes, Buffer.from("TDF$", "utf-8")]);
        var hash = crypto.createHash('md5').update(toCompare).digest("hex");
        if (hash != md5) {
            throw new Error("Wrong MD5");
        }
        return new extensions_1.BinaryReader(data);
    }
    throw new Error("Could not open " + name);
}
function getServerAddress(dcId) {
    switch (dcId) {
        case 1:
            return "149.154.175.55";
        case 2:
            return "149.154.167.50";
        case 3:
            return "149.154.175.100";
        case 4:
            return "149.154.167.91";
        case 5:
            return "91.108.56.170";
        default:
            throw new Error("Invalid DC");
    }
}
function main(TDATA_PATH) {
    return __awaiter(this, void 0, void 0, function () {
        var old_session_key, part_one_md5, tdesktop_user_base_path, path_key, data, salt, encryptedKey, encryptedInfo, hash, passKey, key, info, count, main, magic, final, userId, mainDc, length, mainAuthKey, i, dc, authKey, session, sessionString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    old_session_key = 'data';
                    part_one_md5 = tdesktop_md5(old_session_key).slice(0, 16);
                    tdesktop_user_base_path = TDATA_PATH + "/" + part_one_md5;
                    path_key = 'key_' + old_session_key;
                    data = tdesktop_open(TDATA_PATH + "/" + path_key);
                    salt = tdesktop_readBuffer(data);
                    if (salt.length !== 32) {
                        throw new Error("Length of salt is wrong!");
                    }
                    encryptedKey = tdesktop_readBuffer(data);
                    encryptedInfo = tdesktop_readBuffer(data);
                    hash = crypto.createHash('sha512').update(salt).update('').update(salt).digest();
                    passKey = crypto.pbkdf2Sync(hash, salt, 1, 256, "sha512");
                    key = tdesktop_readBuffer(tdesktop_decrypt(new extensions_1.BinaryReader(encryptedKey), passKey));
                    info = tdesktop_readBuffer(tdesktop_decrypt(new extensions_1.BinaryReader(encryptedInfo), key));
                    count = info.readUInt32BE();
                    // console.log("Accounts count", count);
                    if (count !== 1) {
                        throw new Error("Currently only supporting one account at a time");
                    }
                    main = tdesktop_open_encrypted(tdesktop_user_base_path, key);
                    magic = main.read(4).reverse().readUInt32LE();
                    if (magic != 75) {
                        throw new Error("Unsupported magic version");
                    }
                    final = new extensions_1.BinaryReader(tdesktop_readBuffer(main));
                    final.read(12);
                    userId = final.read(4).reverse().readUInt32LE();
                    // console.log("User ID is ", userId);
                    mainDc = final.read(4).reverse().readUInt32LE();
                    // console.log("Main DC is ", mainDc);
                    length = final.read(4).reverse().readUInt32LE();
                    mainAuthKey = new AuthKey_1.AuthKey();
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < length)) return [3 /*break*/, 4];
                    dc = final.read(4).reverse().readUInt32LE();
                    authKey = final.read(256);
                    if (!(dc == mainDc)) return [3 /*break*/, 3];
                    return [4 /*yield*/, mainAuthKey.setKey(authKey)];
                case 2:
                    _a.sent();
                    session = new sessions_1.StringSession("");
                    session.setDC(mainDc, getServerAddress(mainDc), 443);
                    session.setAuthKey(mainAuthKey);
                    // console.log("Session is");
                    sessionString = session.save();
                    // console.log(sessionString);
                    return [2 /*return*/, { session: sessionString, id: userId}] ;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}

module.exports.Main = main;
