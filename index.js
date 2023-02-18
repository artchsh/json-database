const { randomUUID } = require('crypto')
const fs = require('fs')
const path = require('path')

class Database {
    /**
     * Create a database.
     * @param {string} name - The name of the database
     */
    constructor(name) {
        if (typeof name !== typeof '') {
            throw TypeError('Name of database is not string')
        }
        this.dbPath = `${name}.json` //path.resolve(__dirname, `${name}.json`)
    }

    #read() {
        return fs.readFileSync(this.dbPath, "utf8")
    }

    #write(data) {
        fs.writeFile(this.dbPath, JSON.stringify(data), (err) => {
            if (err)
                console.log(err)
            else {
                console.log("File written successfully\n")
                console.log("The written has the following contents:")
                console.log(this.#read())
            }
        })
    }

    /**
     * @param {object} value 
     * @returns {object} with id, that was added
     */
    add(value) {
        if (typeof value === typeof {}) {
            const DB = JSON.parse(this.#read())
            value.id = randomUUID()
            DB.push(value)
            this.#write(DB)
            return value
        } else {
            throw TypeError('Value to add is not a type of object.')
        }
    }

    /**
     * Method, that removes document with specific id
     * @param {string} id
     * @returns {Array} changed entire database
     */
    remove(id) {
        const DB = JSON.parse(this.#read())
        let newDB = []
        for (let i = 0; i < DB.length; i++) {
            if (DB[i].id !== id) {
                newDB.push(DB[i])
            }
        }
        this.#write(newDB)
        return this.#read()
    }

    /**
     * Method, that gets entire database
     * @returns {array}
     */
    get() {
        try {
            const data = this.#read()
            return data
        }
        catch {
            try {
                const data = fs.writeFileSync(this.dbPath, '[]')
                return data
            }
            catch {
                throw Error('Something went wrong. Open new issue on github')
            }
        }
    }

    /**
     * Method, that clears database (danger)
     */
    clear() {
        this.#write([])
    }
}

module.exports = Database