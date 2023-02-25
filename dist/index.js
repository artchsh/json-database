"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Database_instances, _Database_read, _Database_write;
const { randomUUID } = require('crypto');
const fs = require('fs');
const defaultCallback = (error, docs) => {
    if (error) {
        console.error(error);
    }
};
class Database {
    constructor(name) {
        _Database_instances.add(this);
        if (typeof name !== typeof '') {
            throw new TypeError('Name of database is not string');
        }
        this.dbPath = `${name}.json`;
    }
    add(value, cb = defaultCallback) {
        if (typeof value === typeof {}) {
            const DB = this.get();
            value.id = randomUUID();
            DB.push(value);
            __classPrivateFieldGet(this, _Database_instances, "m", _Database_write).call(this, DB);
            cb(null, value);
            return value;
        }
        else {
            cb('Value to add is not a type of object.', null);
            throw new TypeError('Value to add is not a type of object.');
        }
    }
    removeById(id, cb = defaultCallback) {
        const DB = this.get();
        let newDB = [];
        for (let i = 0; i < DB.length; i++) {
            if (DB[i].id !== id) {
                newDB.push(DB[i]);
            }
        }
        try {
            __classPrivateFieldGet(this, _Database_instances, "m", _Database_write).call(this, newDB);
        }
        catch (error) {
            cb(error, null);
            return error;
        }
        this.get((err, docs) => {
            if (!err) {
                cb(null, docs);
                return docs;
            }
            else {
                cb(err, null);
                return err;
            }
        });
    }
    get(cb = defaultCallback) {
        try {
            const data = __classPrivateFieldGet(this, _Database_instances, "m", _Database_read).call(this);
            cb(null, data);
            return data;
        }
        catch (error) {
            try {
                const data = fs.writeFileSync(this.dbPath, '[]');
                cb(null, data);
                return data;
            }
            catch (error) {
                cb(error, null);
                return error;
            }
        }
    }
    findById(id, cb) {
        if (typeof id !== typeof '') {
            cb('ID is not a type of string.', null);
            throw new Error('ID is not a type of string.');
        }
        const data = this.get();
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                cb(null, data[i]);
                return data[i];
            }
        }
        cb(null, null);
        return null;
    }
    findOne(query, cb = defaultCallback) {
        if (typeof query !== typeof {}) {
            cb('Query is not type of object', null);
        }
        const key = Object.entries(query)[0][0];
        const value = Object.entries(query)[0][1];
        const data = this.get();
        for (let i = 0; i < data.length; i++) {
            if (data[i][key] == value) {
                cb(null, data[i]);
                return data[i];
            }
        }
        cb(null, null);
        return null;
    }
    findOneAndEdit(query, edit, cb = defaultCallback) {
        try {
            let newDB = [];
            const data = this.get();
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
            __classPrivateFieldGet(this, _Database_instances, "m", _Database_write).call(this, newDB);
            const docs = this.get();
            cb(null, docs);
            return docs;
        }
        catch (error) {
            cb(error, null);
            return error;
        }
    }
    clear(cb = defaultCallback) {
        try {
            __classPrivateFieldGet(this, _Database_instances, "m", _Database_write).call(this, []);
            const docs = __classPrivateFieldGet(this, _Database_instances, "m", _Database_read).call(this);
            cb(null, docs);
            return docs;
        }
        catch (error) {
            cb(error, null);
            return error;
        }
    }
}
_Database_instances = new WeakSet(), _Database_read = function _Database_read() {
    const data = fs.readFileSync(this.dbPath, 'utf8');
    return JSON.parse(data);
}, _Database_write = function _Database_write(data) {
    this.get();
    fs.writeFile(this.dbPath, JSON.stringify(data), (err) => {
        if (err)
            throw new Error(err);
    });
};
module.exports = Database;
