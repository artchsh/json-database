"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _JsonDatabase_instances, _JsonDatabase_read, _JsonDatabase_write, _JsonDatabase_writeCurrentTable, _JsonDatabase_isTableExists;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDatabase = void 0;
const { randomUUID } = require('crypto');
const fs = require('fs');
const defaultCallback = (error, docs) => {
    if (error) {
        console.error(error);
    }
};
class JsonDatabase {
    constructor(name, table = 'default') {
        _JsonDatabase_instances.add(this);
        if (typeof name !== typeof '') {
            throw new TypeError('Name of database or Table is not string');
        }
        this.dbPath = `${name}.json`;
        this.tableName = table;
    }
    /**
     * @param {objectEx} value
     * @param {cbFunc} cb
     * @returns {object}
     */
    add(value, cb = defaultCallback) {
        try {
            if (typeof value === typeof {}) {
                const [err, DB] = this.getCurrentTable();
                value.id = randomUUID();
                DB.push(value);
                __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_write).call(this, DB);
                cb(null, value);
                return [null, value];
            }
            else {
                cb('Value to add is not a type of object.', null);
                throw new TypeError('Value to add is not a type of object.');
            }
        }
        catch (error) {
            cb(error, null);
            return [error, null];
        }
    }
    /**
     * @param {string} id
     * @param {cbFunc} cb
     * @returns {unknown | object[]}
     */
    removeById(id, cb = defaultCallback) {
        const [err, DB] = this.get();
        let newDB = [];
        for (let i = 0; i < DB.length; i++) {
            if (DB[i].id !== id) {
                newDB.push(DB[i]);
            }
        }
        try {
            __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_write).call(this, newDB);
        }
        catch (error) {
            cb(error, null);
            return [error, null];
        }
        this.get((err, docs) => {
            if (!err) {
                cb(null, docs);
                return [null, docs];
            }
            else {
                cb(err, null);
                return err;
            }
        });
    }
    /**
     * @param {cbFunc} cb
     * @returns {unknown | object}
     */
    all(cb = defaultCallback) {
        try {
            const data = __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_read).call(this);
            cb(null, data);
            return [null, data];
        }
        catch (error) {
            try {
                fs.writeFileSync(this.dbPath, '{}');
                const [err, data] = this.all();
                cb(null, data);
                return [null, data];
            }
            catch (error) {
                cb(error, null);
                return [error, null];
            }
        }
    }
    getCurrentTable(cb = defaultCallback) {
        try {
            const [err, data] = this.all();
            if (__classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_isTableExists).call(this, data)) {
                Object.defineProperty(data, this.tableName, {
                    value: [],
                    writable: true
                });
            }
            cb(null, data[this.tableName]);
            return [null, data[this.tableName]];
        }
        catch (error) {
            cb(error, null);
            return [error, null];
        }
    }
    /**
     * @param {string} id
     * @param {cbFunc} cb
     * @returns {object | null}
     */
    findById(id, cb = defaultCallback) {
        try {
            if (typeof id !== typeof '') {
                cb('ID is not a type of string.', null);
                throw new Error('ID is not a type of string.');
            }
            const [error, data] = this.get();
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    cb(null, data[i]);
                    return [null, data[i]];
                }
            }
            cb('Nothing found', null);
            return ['Nothing found', null];
        }
        catch (error) {
            cb(error, null);
            return [error, null];
        }
    }
    /**
     * @param {object} query
     * @param {cbFunc} cb
     * @returns {object | null}
     */
    findOne(query, cb = defaultCallback) {
        try {
            if (typeof query !== typeof {}) {
                cb('Query is not type of object', null);
            }
            const key = Object.entries(query)[0][0];
            const value = Object.entries(query)[0][1];
            const [error, data] = this.get();
            for (let i = 0; i < data.length; i++) {
                if (data[i][key] == value) {
                    cb(null, data[i]);
                    return [null, data[i]];
                }
            }
            cb('Nothing found', null);
            return ['Nothing found', null];
        }
        catch (error) {
            cb(error, null);
            return [error, null];
        }
    }
    /**
     * @param {object} query
     * @param {object} edit
     * @param {cbFunc} cb
     * @returns {object[] | unknown}
     */
    findOneAndEdit(query, edit, cb = defaultCallback) {
        try {
            let newDB = [];
            const [error, data] = this.get();
            const foundedDoc = this.findOne(query);
            for (let i = 0; i < data.length; i++) {
                const doc = data[i];
                if (foundedDoc !== null) {
                    if (foundedDoc.id === doc.id) {
                        const editArray = Object.entries(edit)[0];
                        const key = editArray[0];
                        const value = editArray[1];
                        foundedDoc[key] = value;
                        newDB.push(foundedDoc);
                    }
                }
                newDB.push(doc);
            }
            __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_write).call(this, newDB);
            const [err, docs] = this.get();
            cb(null, docs);
            return [null, docs];
        }
        catch (error) {
            cb(error, null);
            return [error, null];
        }
    }
    /**
     * @param {cbFunc} cb
     * @returns {object[] | unknown}
     */
    clear(cb = defaultCallback) {
        try {
            __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_write).call(this, {});
            const data = __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_read).call(this);
            cb(null, data);
            return [null, data];
        }
        catch (error) {
            cb(error, null);
            return [error, null];
        }
    }
}
exports.JsonDatabase = JsonDatabase;
_JsonDatabase_instances = new WeakSet(), _JsonDatabase_read = function _JsonDatabase_read() {
    const data = fs.readFileSync(this.dbPath, 'utf8');
    return JSON.parse(data);
}, _JsonDatabase_write = function _JsonDatabase_write(data) {
    // @ts-ignore
    fs.writeFile(this.dbPath, JSON.stringify(data), (err) => {
        if (err)
            throw new Error(err);
    });
}, _JsonDatabase_writeCurrentTable = function _JsonDatabase_writeCurrentTable(data) {
    const [error1, db] = this.all();
    db ? [this.tableName] = data
        :
    ;
    __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_write).call(this, db);
}, _JsonDatabase_isTableExists = function _JsonDatabase_isTableExists(data) {
    for (let dataOne of Object.entries(data)) {
        if (dataOne.includes(this.tableName)) {
            return true;
        }
    }
    return false;
};
