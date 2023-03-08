"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _JsonDatabase_instances, _JsonDatabase_read, _JsonDatabase_write, _JsonDatabase_checkDatabase, _JsonDatabase_writeCurrentTable;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDatabase = void 0;
const { randomUUID } = require('node:crypto');
const fs = require('node:fs');
const defaultCallback = (error, docs) => {
    if (error) {
        console.error(error);
    }
};
class JsonDatabase {
    constructor(name, table = 'default') {
        _JsonDatabase_instances.add(this);
        if (typeof name !== typeof '' || typeof table !== typeof '') {
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
            let objectAdd = value;
            let [error, table] = this.getCurrentTable();
            const randomID = randomUUID();
            objectAdd["id"] = randomID;
            Object.defineProperty(objectAdd, 'id', {
                value: randomID,
                writable: true
            });
            table === null || table === void 0 ? void 0 : table.push(objectAdd);
            __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_writeCurrentTable).call(this, table);
            cb(null, value);
            return [null, value];
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
        try {
            let [error, table] = this.getCurrentTable();
            let updatedTable = [];
            for (let i = 0; i < table.length; i++) {
                let document = table[i];
                if (document.id != id) {
                    updatedTable.push(document);
                }
                __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_writeCurrentTable).call(this, updatedTable);
                cb(null, null);
                return [null, null];
            }
        }
        catch (error) {
            cb(error, null);
            return [error, null];
        }
    }
    /**
     * @param {cbFunc} cb
     * @returns {object}
     */
    get(cb = defaultCallback) {
        try {
            const data = __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_read).call(this);
            cb(null, data);
            return [null, data];
        }
        catch (error) {
            cb(error, null);
            return [error, null];
        }
    }
    getCurrentTable(cb = defaultCallback) {
        try {
            const db = __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_read).call(this);
            const table = db[this.tableName];
            cb(null, table);
            return [null, table];
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
            let [error, table] = this.getCurrentTable();
            for (let i = 0; i < table.length; i++) {
                let document = table[i];
                if (document.id == id) {
                    return [null, document];
                }
            }
            return [null, null];
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
            const [key, value] = [Object.keys(query)[0], Object.values(query)[0]];
            let [error, table] = this.getCurrentTable();
            for (let i = 0; i < table.length; i++) {
                let document = table[i];
                if (document[key] == value) {
                    return [null, document];
                }
            }
            throw new Error('Nothing had been found!');
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
            const [key, value] = [Object.keys(query)[0], Object.values(query)[0]];
            const [editKey, editValue] = [
                Object.keys(edit)[0],
                Object.values(edit)[0]
            ];
            let [error, table] = this.getCurrentTable();
            for (let i = 0; i < table.length; i++) {
                let document = table[i];
                if (document[key] == value) {
                    document[editKey] = editValue;
                    Object.defineProperty(document, editKey, {
                        value: editValue,
                        writable: true
                    });
                    table[i] = document;
                    __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_writeCurrentTable).call(this, table);
                    return [null, document];
                }
            }
            throw new Error('Nothing had been found!');
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
        __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_write).call(this, {});
    }
}
exports.JsonDatabase = JsonDatabase;
_JsonDatabase_instances = new WeakSet(), _JsonDatabase_read = function _JsonDatabase_read() {
    __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_checkDatabase).call(this);
    const data = fs.readFileSync(this.dbPath, 'utf8');
    const parsedData = JSON.parse(data);
    return parsedData;
}, _JsonDatabase_write = function _JsonDatabase_write(data) {
    // @ts-ignore
    fs.writeFileSync(this.dbPath, JSON.stringify(data));
}, _JsonDatabase_checkDatabase = function _JsonDatabase_checkDatabase() {
    if (!fs.existsSync(this.dbPath)) {
        let data = {};
        data[this.tableName] = [];
        Object.defineProperty(data, this.tableName, {
            value: [],
            writable: true
        });
        __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_write).call(this, data);
    }
}, _JsonDatabase_writeCurrentTable = function _JsonDatabase_writeCurrentTable(data) {
    let [error, db] = this.get();
    db[this.tableName] = data;
    Object.defineProperty(db, this.tableName, {
        value: data,
        writable: true
    });
    __classPrivateFieldGet(this, _JsonDatabase_instances, "m", _JsonDatabase_write).call(this, db);
};
//# sourceMappingURL=index.js.map