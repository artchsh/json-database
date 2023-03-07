const { randomUUID } = require('crypto')
const fs = require('fs')

type cbFunc = (error: unknown, docs: object | object[] | null) => void
type objectEx = { [key: string]: any }

const defaultCallback: cbFunc = (error, docs) => {
  if (error) {
    console.error(error)
  }
}

class JsonDatabase {
  dbPath: string
  tableName: string
  constructor(name: string, table: string = 'default') {
    if (typeof name !== typeof '') {
      throw new TypeError('Name of database or Table is not string')
    }
    this.dbPath = `${name}.json`
    this.tableName = table
  }

  #read() {
    const data = fs.readFileSync(this.dbPath, 'utf8')
    return JSON.parse(data)
  }

  /**
   * @param {objectEx} data
   */
  #write(data: objectEx) {
    // @ts-ignore
    fs.writeFile(this.dbPath, JSON.stringify(data), (err) => {
      if (err) throw new Error(err)
    })
  }

  #writeCurrentTable(data: []) {
    const [error1, db] = this.all()
    db?[this.tableName] = data
    this.#write(db)
  }

  #isTableExists(data: objectEx) {
    for (let dataOne of Object.entries(data)) {
      if (dataOne.includes(this.tableName)) {
        return true
      }
    }
    return false
  }

  /**
   * @param {objectEx} value
   * @param {cbFunc} cb
   * @returns {object}
   */
  add(value: objectEx, cb: cbFunc = defaultCallback) {
    try {
      if (typeof value === typeof {}) {
        const [err, DB] = this.getCurrentTable()
        value.id = randomUUID()
        DB!.push(value)
        this.#write(DB!)
        cb(null, value)
        return [null, value]
      } else {
        cb('Value to add is not a type of object.', null)
        throw new TypeError('Value to add is not a type of object.')
      }
    } catch (error) {
      cb(error, null)
      return [error, null]
    }
  }

  /**
   * @param {string} id
   * @param {cbFunc} cb
   * @returns {unknown | object[]}
   */
  removeById(id: string, cb: cbFunc = defaultCallback) {
    const [err, DB] = this.get()
    let newDB: object[] = []
    for (let i = 0; i < DB!.length; i++) {
      if (DB![i].id !== id) {
        newDB.push(DB![i])
      }
    }
    try {
      this.#write(newDB)
    } catch (error) {
      cb(error, null)
      return [error, null]
    }
    this.get((err, docs) => {
      if (!err) {
        cb(null, docs)
        return [null, docs]
      } else {
        cb(err, null)
        return err
      }
    })
  }

  /**
   * @param {cbFunc} cb
   * @returns {unknown | object}
   */
  all(cb: cbFunc = defaultCallback): [unknown | null, objectEx | null] {
    try {
      const data = this.#read()
      cb(null, data)
      return [null, data]
    } catch (error) {
      try {
        fs.writeFileSync(this.dbPath, '{}')
        const [err, data] = this.all()
        cb(null, data)
        return [null, data]
      } catch (error) {
        cb(error, null)
        return [error, null]
      }
    }
  }

  getCurrentTable(cb: cbFunc = defaultCallback): [unknown | null, objectEx[] | null] {
    try {
      const [err, data] = this.all()
      if (this.#isTableExists(data!)) {
        Object.defineProperty(data, this.tableName, {
          value: [],
          writable: true
        })
      }
      cb(null, data![this.tableName])
      return [null, data![this.tableName]] 
    } catch (error) {
      cb(error, null)
      return [error, null]
    }
  }

  /**
   * @param {string} id
   * @param {cbFunc} cb
   * @returns {object | null}
   */
  findById(id: string, cb: cbFunc = defaultCallback) {
    try {
      if (typeof id !== typeof '') {
        cb('ID is not a type of string.', null)
        throw new Error('ID is not a type of string.')
      }
      const [error, data] = this.get()
      for (let i = 0; i < data!.length; i++) {
        if (data![i].id === id) {
          cb(null, data![i])
          return [null, data![i]]
        }
      }
      cb('Nothing found', null)
      return ['Nothing found', null]
    } catch (error) {
      cb(error, null)
      return [error, null]
    }
  }

  /**
   * @param {object} query
   * @param {cbFunc} cb
   * @returns {object | null}
   */
  findOne(query: object, cb: cbFunc = defaultCallback) {
    try {
      if (typeof query !== typeof {}) {
        cb('Query is not type of object', null)
      }
      const key = Object.entries(query)[0][0]
      const value = Object.entries(query)[0][1]
      const [error, data] = this.get()
      for (let i = 0; i < data!.length; i++) {
        if (data![i][key] == value) {
          cb(null, data![i])
          return [null, data![i]]
        }
      }
      cb('Nothing found', null)
      return ['Nothing found', null]
    } catch (error) {
      cb(error, null)
      return [error, null]
    }
  }

  /**
   * @param {object} query
   * @param {object} edit
   * @param {cbFunc} cb
   * @returns {object[] | unknown}
   */
  findOneAndEdit(query: object, edit: object, cb: cbFunc = defaultCallback) {
    try {
      let newDB: objectEx[] = []
      const [error, data] = this.get()
      const foundedDoc: objectEx = this.findOne(query)
      for (let i = 0; i < data!.length; i++) {
        const doc: objectEx = data![i]
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
      const [err, docs] = this.get()
      cb(null, docs)
      return [null, docs]
    } catch (error) {
      cb(error, null)
      return [error, null]
    }
  }

  /**
   * @param {cbFunc} cb
   * @returns {object[] | unknown}
   */
  clear(cb: cbFunc = defaultCallback) {
    try {
      this.#write({})
      const data = this.#read()
      cb(null, data)
      return [null, data]
    } catch (error) {
      cb(error, null)
      return [error, null]
    }
  }
}

export { JsonDatabase }
