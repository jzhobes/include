# include

A simple, lightweight utility library to lazy load a JavaScript or CSS dependency.

### Usage
Performs a deep copy of the provided input. Supported data types at the moment are: Object, Array, Date, string, number, boolean, and function.
```javascript
const include = require('@mountaingapsolutions/include');

include('//code.jquery.com/jquery-3.4.1.slim.min.js').then(() => {
    $('.container').append('<div>Hello World</div>');
});

include('//stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.cs', '//stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js').then(() => {
    // Bootstrap and its stylesheet loaded.
});
```
