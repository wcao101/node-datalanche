//
// Drop the given schema. Must have admin access for the given database.
//
// equivalent SQL:
// DROP SCHEMA my_schema CASCADE;
//
var dl = require('../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query('my_database');
q.dropSchema('my_schema');
q.cascade(true);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('drop_schema succeeded!');
    }

    return client.close();
});
