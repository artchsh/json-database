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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDeEMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBS3hCLE1BQU0sZUFBZSxHQUFXLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQzlDLElBQUksS0FBSyxFQUFFO1FBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUNyQjtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sUUFBUTtJQUVaLFlBQVksSUFBWTs7UUFDdEIsSUFBSSxPQUFPLElBQUksS0FBSyxPQUFPLEVBQUUsRUFBRTtZQUM3QixNQUFNLElBQUksU0FBUyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7U0FDdEQ7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUE7SUFDOUIsQ0FBQztJQWVELEdBQUcsQ0FBQyxLQUFlLEVBQUUsS0FBYSxlQUFlO1FBQy9DLElBQUksT0FBTyxLQUFLLEtBQUssT0FBTyxFQUFFLEVBQUU7WUFDOUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQ3JCLEtBQUssQ0FBQyxFQUFFLEdBQUcsVUFBVSxFQUFFLENBQUE7WUFDdkIsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNkLHVCQUFBLElBQUksNENBQU8sTUFBWCxJQUFJLEVBQVEsRUFBRSxDQUFDLENBQUE7WUFDZixFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQ2YsT0FBTyxLQUFLLENBQUE7U0FDYjthQUFNO1lBQ0wsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLElBQUksQ0FBQyxDQUFBO1lBQ2pELE1BQU0sSUFB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