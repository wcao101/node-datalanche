//
// Drop the given table. Must have admin access for the given database.
//
// equivalent SQL:
// DROP TABLE my_schema.my_table CASCADE;
//
var dl = require('../../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query('my_database');
q.dropTable('my_schema.my_table');
q.cascade(true);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('drop_table succeeded!');
    }
});
