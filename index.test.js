// Import our package directly
const { JsonDatabase } = require('./dist/index.js')

// Function to make different db each time tests run
function makeId(length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    return result
}

// Variables setup
const db_name = `${makeId(10)}-test`
const db = new JsonDatabase(db_name)
let objFmDb

// Tests
test('Get data out of json database', () => {
    const [error, data] = db.get()
    expect(data).toStrictEqual({
        default: []
    })
    expect(error).toBeNull()  
})

test('Add new document to database', () => {
    const [error, data] = db.add({ value: 123 })
    objFmDb = data
    expect(data).not.toBeNull()
    expect(data.id).toContain('-')
    expect(error).toBeNull()
})

test('Find specific document with given id in database', () => {
    const [error, data] = db.findById(objFmDb.id)
    expect(data).toStrictEqual(objFmDb)
    expect(error).toBeNull()
})

test('Find specific document with given query in database', () => {
    const [error, data] = db.findOne({ value: 123 })
    expect(data).toStrictEqual(objFmDb)
    expect(error).toBeNull()
})

test('Find specific document with given query in database, edit it and write it to database', () => {
    const [error, data] = db.findOneAndEdit({ value: 123 }, { value: 234 })
    let [keys, values] = [Object.keys(data), Object.values(data)]
    for (let key in keys) {
        if (key == 'value') {
            expect(values[keys.indexOf(key)]).toBe(234)
        }
    }
    expect(error).toBeNull()
})