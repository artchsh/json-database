# Changelog
## v0.4.0
In earlier version, you could something like this.

```ts
const [error, data] = db.get();
```

But now, you can do it like this.
```ts
db.findById('123456789', (error, data) => {
  if (error) { console.error(error); };
  // do something with docs
});
```
I advise you to use methods with callback function, not with variables and constants, because this way you can work better with data and handle errors. If there is no error, then error param will be null, same with docs