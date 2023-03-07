const { JsonDatabase } = require('./dist/index.js')

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const db = new JsonDatabase(`${makeId(10)}-test`)
let objFmDb

test('get database', () => {
    const result = db.get()
    if(result[0]) {
        console.error(result[0])
    }
    expect(result[1]).toStrictEqual([])
    expect(result[0]).toBeNull()  
})

test('add new item to database', () => {
    const [error, data] = db.add({ value: 123 })
    objFmDb = data
    expect(data).not.toBeNull()
    expect(data.id).toContain('-')
    expect(error).toBeNull()
})

test('find item by id', () => {
    const [error, data] = db.findById(objFmDb.id)
    expect(data).toBe(objFmDb)
    expect(error).toBeNull()
})