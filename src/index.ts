const { randomUUID } = require('node:crypto')
const fs = require('node:fs')

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
    if (typeof name !== typeof '' || typeof table !== typeof '') {
      throw new TypeError('Name of database or Table is not string')
    }
    this.dbPath = `${name}.json`
    this.tableName = table
  }

  /**
   * @returns parsed data
   */
  #read(): objectEx {
    this.#checkDatabase()
    const data = fs.readFileSync(this.dbPath, 'utf8')
    const parsedData = JSON.parse(data)
    return parsedData
  }

  /**
   * converts to string and rewrites db
   * @param {objectEx} data
   */
  #write(data: objectEx) {
    // @ts-ignore
    fs.writeFileSync(this.dbPath, JSON.stringify(data))
  }

  #checkDatabase() {
    if (!fs.existsSync(this.dbPath)) {
      let data: objectEx = {}
      data[this.tableName] = []
      Object.defineProperty(data, this.tableName, {
        value: [],
        writable: true
      })
      this.#write(data)
    }
  }

  #writeCurrentTable(data: objectEx[]) {
    let [error, db] = this.get()
    db![this.tableName] = data
    Object.defineProperty(db, this.tableName, {
      value: data,
      writable: true
    })
    this.#write(db!)
  }

  /**
   * @param {objectEx} value
   * @param {cbFunc} cb
   * @returns {object}
   */
  add(value: objectEx, cb: cbFunc = defaultCallback) {
    try {
      let objectAdd = value
      let [error, table] = this.getCurrentTable()
      const randomID = randomUUID()
      objectAdd["id"] = randomID
      Object.defineProperty(objectAdd, 'id', {
        value: randomID,
        writable: true
      })
      table?.push(objectAdd)
      this.#writeCurrentTable(table!)
      cb(null, value)
      return [null, value]
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
    try {
      let [error, table] = this.getCurrentTable()
      let updatedTable: objectEx[] = []
      for (let i = 0; i < table!.length; i++) {
        let document = table![i]
        if (document.id != id) {
          updatedTable.push(document)
        }
        this.#writeCurrentTable(updatedTable)
        cb(null, null)
        return [null, null]
      }
    } catch (error) {
      cb(error, null)
      return [error, null]
    }
  }

  /**
   * @param {cbFunc} cb
   * @returns {object}
   */
  get(cb: cbFunc = defaultCallback): [any | null, objectEx | null] {
    try {
      const data = this.#read()
      cb(null, data)
      return [null, data]
    } catch (error) {
      cb(error, null)
      return [error, null]
    }
  }

  getCurrentTable(
    cb: cbFunc = defaultCallback
  ): [null | any, null | objectEx[]] {
    try {
      const db = this.#read()
      const table = db[this.tableName]
      cb(null, table)
      return [null, table]
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
  findById(
    id: string,
    cb: cbFunc = defaultCallback
  ): [null | any, null | objectEx] {
    try {
      let [error, table] = this.getCurrentTable()
      for (let i = 0; i < table!.length; i++) {
        let document = table![i]
        if (document.id == id) {
          return [null, document]
        }
      }
      return [null, null]
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
  findOne(
    query: object,
    cb: cbFunc = defaultCallback
  ): [null | any, null | objectEx] {
    try {
      const [key, value] = [Object.keys(query)[0], Object.values(query)[0]]
      let [error, table] = this.getCurrentTable()
      for (let i = 0; i < table!.length; i++) {
        let document = table![i]
        if (document[key] == value) {
          return [null, document]
        }
      }
      throw new Error('Nothing had been found!')
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
      const [key, value] = [Object.keys(query)[0], Object.values(query)[0]]
      const [editKey, editValue] = [
        Object.keys(edit)[0],
        Object.values(edit)[0]
      ]
      let [error, table] = this.getCurrentTable()
      for (let i = 0; i < table!.length; i++) {
        let document = table![i]
        if (document[key] == value) {
          document[editKey] = editValue
          Object.defineProperty(document, editKey, {
            value: editValue,
            writable: true
          })
          table![i] = document
          this.#writeCurrentTable(table!)
          return [null, document]
        }
      }
      throw new Error('Nothing had been found!')
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
    this.#write({})
  }
}

export { JsonDatabase }
