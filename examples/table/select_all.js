//
// Select rows from the given table. Must have read access for the given database.
//
// equivalent SQL:
// SELECT DISTINCT col1, col2
//     FROM my_schema.my_table
//     WHERE col3 LIKE '%hello%'
//     ORDER BY col1 ASC, col2 DESC
//     OFFSET 0 LIMIT 10;
//
var dl = require('../../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query('my_database');
q.select([ 'col1', 'col2' ]);
q.distinct(true);
q.from('my_schema.my_table');
q.where(q.expr(q.column('col3'), '$like', '%hello%'));
q.orderBy([
    q.expr(q.column('col1'), '$asc'),
    q.expr(q.column('col2'), '$desc')
]);
q.offset(0);
q.limit(10);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }
});
