<h2 align="center">
  <strong>Simple, offline & easy</strong>
</h2>

<p align="center">
  <a href="https://github.com/artchsh/json-database/blob/main/LICENSE">
    <img alt="GitHub" src="https://img.shields.io/github/license/artchsh/json-database?style=for-the-badge" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/@artchsh/json-database">
    <img src="https://img.shields.io/npm/v/@artchsh/json-database?style=for-the-badge" alt="Current npm package version." />
  </a>
  <img src="https://img.shields.io/github/last-commit/artchsh/json-database?style=for-the-badge" alt="Latest commit." />
  <img src="https://img.shields.io/npm/dw/@artchsh/json-database?style=for-the-badge" alt="Downloads per week." />
</p>
<code>DOCUMENTATION IS IN PROGRESS</code>
<br/>
<br/>
<code>I don't recommend using this package for large or medium sized projects because it's an insecure nor unstable database type.</code>


```js
const JsonDatabase = require('@artchsh/json-database');

// Create new database
const db = new JsonDatabase('shop');

// You can create several databases as you need
const users = new JsonDatabase('db', 'users');
const servers = new JsonDatabase('db', 'servers');
const userConfig = new JsonDatabase('config', 'users')

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
