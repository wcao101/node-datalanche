//
// Create the given schema. Must have admin access for the given database.
//
// equivalent SQL:
// CREATE SCHEMA my_schema;
//
var dl = require('../../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query('my_database');
q.createSchema('my_schema');
q.description('my_schema description text');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('create_schema succeeded!');
    }
});
