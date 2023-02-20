var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Database_instances, _Database_read, _Database_write;
const { randomUUID } = require('crypto');
const fs = require('fs');
class Database {
    /**
     * Create a database.
     * @param {string} name - The name of the database
     */
    constructor(name) {
        _Database_instances.add(this);
        if (typeof name !== typeof '') {
            throw new TypeError('Name of database is not string');
        }
        this.dbPath = `${name}.json`;
    }
    /**
     * @param {object} value
     * @returns {object} with id, that was added
     */
    add(value) {
        if (typeof value === typeof {}) {
            const DB = this.get();
            value.id = randomUUID();
            DB.push(value);
            __classPrivateFieldGet(this, _Database_instances, "m", _Database_write).call(this, DB);
            return value;
        }
        else {
            throw new TypeError('Value to add is not a type of object.');
        }
    }
    /**
     * Method, that removes document with specific id
     * @param {string} id
     * @returns {object[]} changed database
     */
    removeById(id) {
        const DB = this.get();
        let newDB = [];
        for (let i = 0; i < DB.length; i++) {
            if (DB[i].id !== id) {
                newDB.push(DB[i]);
            }
        }
        __classPrivateFieldGet(this, _Database_instances, "m", _Database_write).call(this, newDB);
        return this.get();
    }
    /**
     * Method, that gets entire database
     * @returns {object[]}
     */
    get() {
        try {
            const data = __classPrivateFieldGet(this, _Database_instances, "m", _Database_read).call(this);
            return data;
        }
        catch (_a) {
            try {
                const data = fs.writeFileSync(this.dbPath, '[]');
                return data;
            }
            catch (_b) {
                throw new Error('Something went wrong. Please, if you are still getting error, open new issue on github.');
            }
        }
    }
    /**
     * Method, that searches for specified object
     * @param {string} id Search for an object with this id
     * @returns {object}
     */
    findById(id) {
        if (typeof id !== typeof '') {
            throw new TypeError('ID is not a type of string.');
        }
        const data = this.get();
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                return data[i];
            }
        }
        return {};
    }
    /**
     * Method, that searches for an object with that specific key and its value. If found nothing, then returns empty object
     * @param {object} query
     * @returns {object}
     */
    findOne(query) {
        if (typeof query !== typeof {}) {
            throw new TypeError('Key is not type of object');
        }
        const object2Array = JSON.stringify(query).split('{')[1].split('}')[0].split(':');
        const key = object2Array[0].split('"')[1];
        const value = object2Array[1].split('"')[1];
        const data = this.get();
        for (let i = 0; i < data.length; i++) {
            if (data[i][key] == value) {
                return data[i];
            }
        }
        return {};
    }
    /**
     * Method, that clears database (danger)
     * @returns {object[]} cleared database
     */
    clear() {
        __classPrivateFieldGet(this, _Database_instances, "m", _Database_write).call(this, []);
        return __classPrivateFieldGet(this, _Database_instances, "m", _Database_read).call(this);
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
