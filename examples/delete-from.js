//
// equivalent SQL
//
// DELETE FROM my_schema.my_table WHERE col3 = 'hello';
//
var dl = require('../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query();
q.deleteFrom('my_schema.my_table');
q.where(q.expr(q.column('col3'), '$=', 'hello'));

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('delete_from succeeded!');
    }

    return client.close();
});
