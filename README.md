<h1 align="center">
    Json-Database
</h1>

<p align="center">
  <strong>Simple, offline & easy</strong><br>
</p>

<p align="center">
  <a href="https://github.com/artchsh/json-database/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Json-Database is released under the MIT license." />
  </a>
  <a href="https://www.npmjs.com/package/@artchsh/json-database">
    <img src="https://img.shields.io/npm/v/@artchsh/json-database?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
</p>

> I don't recommend using this package for large or medium sized projects because it's an insecure nor unstable database type.
## Notes
After version 0.3.1 there are several ways to use the methods. For example, before that version you could use it like this:

```js
const JsonDatabase = require('@artchsh/json-database');
const db = new JsonDatabase('example');
const data = db.get();
console.log(data)
```

But now, you can do it like this.
```js
// I advise you to use methods with callback function, not with variables and constants, because this way you can work better with data and handle errors
const JsonDatabase = require('@artchsh/json-database');
const db = new JsonDatabase('example');

// if no error, then error param will be null, and same with docs
// callback type: (error: unknown, docs: object | object[] | null) => void
db.get((err, docs) => {
  if (err) { console.error(error); };
  console.log(docs);
});

db.findById('123456789', (err, docs) => {
  if (err) { console.error(error); };
  console.log(docs)
});
```

## Example

```js
const JsonDatabase = require('@artchsh/json-database');

// Create new database
const db = new JsonDatabase('shop');

// You can create several databases as you need
const users = new JsonDatabase('users');
const servers = new JsonDatabase('servers');

// Returns database
db.get();

// Returns an object, if nothing found - returns empty object
db.findById('123456789');

// Returns first found object with that key and value. Better use for unique keys. Always returns object, in case if nothing found, returns null
db.findOne({ model: '123' });

// Changes first found object with that key and value to given key and value. Better use for unique keys. Always returns object, in case if nothing found, returns null
db.findOneAndEdit({ model: '123' }, { model: '123' });

// Returns changed database
db.removeById('123456789');

// Returns added object with id
db.add({ manufacturer: "Apple", type: "MacBook", model: "Air 2023" });

// Returns empty array
db.clear();
```