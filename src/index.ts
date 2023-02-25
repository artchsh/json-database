const { randomUUID } = require('crypto')
const fs = require('fs')

type cbFunc = (error: unknown, docs: object | object[] | null) => void
type objectEx = { [key: string]: any }

const defaultCallback: cbFunc = (error, docs) => {
  if (error) {
    console.error(error)
  }
}

class Database {
  dbPath: string
  constructor(name: string) {
    if (typeof name !== typeof '') {
      throw new TypeError('Name of database is not string')
    }
    this.dbPath = `${name}.json`
  }

  #read() {
    const data = fs.readFileSync(this.dbPath, 'utf8')
    return JSON.parse(data)
  }

  /**
   * @param {object} data
   */
  #write(data: object) {
    this.get()
    // @ts-ignore
    fs.writeFile(this.dbPath, JSON.stringify(data), (err) => {
      if (err) throw new Error(err)
    })
  }

  /**
   * @name cbFunc
   * @function
   * @param {any} error
   * @param {object[] | object | null} docs
   */
  /**
   * @param {objectEx} value
   * @param {cbFunc} cb
   * @returns {object}
   */
  add(value: objectEx, cb: cbFunc = defaultCallback) {
    if (typeof value === typeof {}) {
      const DB = this.get()
      value.id = randomUUID()
      DB.push(value)
      this.#write(DB)
      cb(null, value)
      return value
    } else {
      cb('Value to add is not a type of object.', null)
      throw new TypeError('Value to add is not a type of object.')
    }
  }

  /**
   * @param {string} id
   * @param {cbFunc} cb
   * @returns {unknown | object[]}
   */
  removeById(id: string, cb: cbFunc = defaultCallback) {
    const DB: objectEx[] = this.get()
    let newDB: object[] = []
    for (let i = 0; i < DB.length; i++) {
      if (DB[i].id !== id) {
        newDB.push(DB[i])
      }
    }
    try {
      this.#write(newDB)
    } catch (error) {
      cb(error, null)
      return error
    }
    this.get((err, docs) => {
      if (!err) {
        cb(null, docs)
        return docs
      } else {
        cb(err, null)
        return err
      }
    })
  }

  /**
   *
   * @param {cbFunc} cb
   * @returns {unknown | object}
   */
  get(cb: cbFunc = defaultCallback) {
    try {
      const data = this.#read()
      cb(null, data)
      return data
    } catch (error) {
      try {
        const data = fs.writeFileSync(this.dbPath, '[]')
        cb(null, data)
        return data
      } catch (error) {
        cb(error, null)
        return error
      }
    }
  }

  /**
   * @param {string} id
   * @param {cbFunc} cb
   * @returns {object | null}
   */
  findById(id: string, cb: cbFunc) {
    if (typeof id !== typeof '') {
      cb('ID is not a type of string.', null)
      throw new Error('ID is not a type of string.')
    }
    const data: objectEx[] = this.get()
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        cb(null, data[i])
        return data[i]
      }
    }
    cb(null, null)
    return null
  }

  /**
   * @param {object} query
   * @param {cbFunc} cb
   * @returns {object | null}
   */
  findOne(query: object, cb: cbFunc = defaultCallback) {
    if (typeof query !== typeof {}) {
      cb('Query is not type of object', null)
    }
    const key = Object.entries(query)[0][0]
    const value = Object.entries(query)[0][1]
    const data = this.get()
    for (let i = 0; i < data.length; i++) {
      if (data[i][key] == value) {
        cb(null, data[i])
        return data[i]
      }
    }
    cb(null, null)
    return null
  }

  /**
   * @param {object} query
   * @param {object} edit
   * @param {cbFunc} cb
   * @returns {object[] | unknown}
   */
  findOneAndEdit(query: object, edit: object, cb: cbFunc = defaultCallback) {
    try {
      let newDB: object[] = []
      const data: objectEx[] = this.get()
      const foundedDoc: objectEx = this.findOne(query)
      for (let i = 0; i < data.length; i++) {
        const doc: objectEx = data[i]
        if (foundedDoc !== null) {
          if (foundedDoc.id === doc.id) {
            const editArray = Object.entries(edit)[0]
            const key = editArray[0]
            const value = editArray[1]
            foundedDoc[key] = value
            newDB.push(foundedDoc)
          }
        }
        newDB.push(doc)
      }
      this.#write(newDB)
      const docs = this.get()
      cb(null, docs)
      return docs
    } catch (error) {
      cb(error, null)
      return error
    }
  }

  /**
   * @param {cbFunc} cb
   * @returns {object[] | unknown}
   */
  clear(cb: cbFunc = defaultCallback) {
    try {
      this.#write([])
      const docs = this.#read()
      cb(null, docs)
      return docs
    } catch (error) {
      cb(error, null)
      return error
    }
  }
}

module.exports = Database
