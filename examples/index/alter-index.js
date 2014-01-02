//
// Alter the given index's properties. Must have admin access for the given database.
//
// equivalent SQL:
// ALTER INDEX my_schema.my_index RENAME TO my_new_index;
//
var dl = require('../../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query('my_database');
q.alterIndex('my_schema.my_index');
q.renameTo('my_new_index');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('alter_index succeeded!');
    }
});
