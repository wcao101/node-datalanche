//
// Update rows in the given table. Must have write access for the given database.
//
// equivalent SQL:
// UPDATE my_schema.my_table SET col3 = 'hello world' WHERE col3 = 'hello';
//
var dl = require('../../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query('my_database');
q.update('my_schema.my_table');
q.set({
    col3: 'hello world'
});
q.where(q.expr(q.column('col3'), '=', 'hello'));

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }
});
