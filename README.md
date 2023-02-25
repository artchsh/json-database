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

## Create new database
```js
const JsonDatabase = require('@artchsh/json-database');
const db = new JsonDatabase('shop');

// you can create several databases as you need
const users = new JsonDatabase('users');
const servers = new JsonDatabase('servers');
```

## Get entire database
```js
db.get();
// returns whole database
```

## Get specific object with id
```js
db.findById('123456789');
// returns an object, if nothing found - returns empty object
```

## Get specific object with given key and value
```js
db.findOne({ model: '123' });
// returns first found object with that key and value. Better use for unique keys. Always returns object, in case if nothing found, returns null
```

## Get specific object with given key and value and then
```js
db.findOneAndEdit({ model: '123' }, { model: '123' });
// Changes first found object with that key and value to given key and value. Better use for unique keys. Always returns object, in case if nothing found, returns null
```

## Remove object with given id
```js
db.removeById('123456789');
// returns changed database
```

## Add new object
```js
db.add({ manufacturer: "Apple", type: "MacBook", model: "Air 2023" });
// returns added object with id
```

## **(Danger)** Clear entire database
```js
db.clear();
// returns empty array
```