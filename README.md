# Json-Database
## Examples:
Create new database:
```js
const JsonDatabase = require('@artchsh/json-database');
const db = new JsonDatabase('test');
```
Get entire database:
```js
db.get();
```
Get specific object:
```js
db.find({ id: '123456789' });
```
Remove object with given id: (returns changed database)
```js
db.remove('123456789');
```
Add new object: (returns added object with id)
```js
db.add({ manufacturer: "Apple", type: "MacBook", model: "Air 2023" });
```
(Danger) Clear entire database (json file): (returns cleared database)
```js
db.clear();
```