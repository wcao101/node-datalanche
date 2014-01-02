//
// Create an index on the given table. Must have admin access for the given database.
//
// equivalent SQL:
// CREATE UNIQUE INDEX my_index ON my_schema.my_table USING btree (col1, col2);
//
var dl = require('../../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query('my_database');
q.createIndex('my_index');
q.unique(true);
q.onTable('my_schema.my_table');
q.method('btree');
q.columns([ 'col1', 'col2' ]);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('create_index succeeded!');
    }
});
