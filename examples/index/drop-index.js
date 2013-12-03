//
// Drop the given index. Must have admin access for the given database.
//
// equivalent SQL:
// DROP INDEX my_schema.my_index CASCADE;
//
var dl = require('../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query('my_database');
q.dropIndex('my_schema.my_index');
q.cascade(true);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('drop_index succeeded!');
    }

    return client.close();
});
