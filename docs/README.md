## Options

The manuals will show all the flags and options which are available for the respective tasks.
If you find yourself in a situation where you always define certain flags in order to
make the CLI compliant to your project, you can move those definitions also into a file called
`.env`.

### The migration schema

The CLI uses [umzug](https://github.com/sequelize/umzug) and its migration schema. This means a migration has to look like this (specify the `typescript` argument to create a .ts version of this script):

```js
module.exports = {
  up: function(dynamodb, done) {
    done();
  },

  down: function(dynamodb) {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
};
```

Please note that you can either return a Promise or call the third argument of the function once your asynchronous logic was executed. If you pass something to the callback function (the `done` function) it will be treated as erroneous execution.
