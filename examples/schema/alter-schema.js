//
// Alter the given schema's properties. Must have admin access for the given database.
//
// equivalent SQL:
// ALTER SCHEMA my_schema RENAME TO my_new_schema;
//
var dl = require('../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query('my_database');
q.alterSchema('my_schema');
q.renameTo('my_new_schema');
q.description('my_new_schema description text');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('alter_schema succeeded!');
    }

    return client.close();
});
