# Json-Database
Create new database:
```js
const JsonDatabase = require('@artchsh/json-database');
const db = new JsonDatabase('shop');

// you can create several databases as you need
const users = new JsonDatabase('users')d
const servers = new JsonDatabase('servers')
```
Get entire database:
```js
db.get();
// returns whole database
```
Get specific object:
```js
db.findById('123456789');
// returns an object, if nothing found - returns empty object
```
Remove object with given id:
```js
db.removeById('123456789');
// returns changed database (array with objects)
```
Add new object:
```js
db.add({ manufacturer: "Apple", type: "MacBook", model: "Air 2023" });
// returns added object with id
```
**(Danger)** Clear entire database (json file):
```js
db.clear();
// returns empty array
```