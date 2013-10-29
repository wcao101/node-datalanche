//
// equivalent SQL
//
// SELECT * FROM my_schema.my_table
//     WHERE (col3 = 'hello' OR col3 = 'world') AND col1 = '0f21b968-cd28-4d8b-9ea6-33dbcd517ec5';
//
var dl = require('../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query();

var e = q.expr(
    q.expr(
        q.column('col3'), '$=', 'hello',
        '$or',
        q.column('col3'), '$=', 'world'
    ),
    '$and',
    q.column('col1'), '$=', '0f21b968-cd28-4d8b-9ea6-33dbcd517ec5',
);

q.select('*').from('my_schema.my_table').where(e);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result.data, null, '  '));
    }

    return client.close();
});
