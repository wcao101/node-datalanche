//
// Join multiple tables and retrieve the rows. Must have read access for the given database.
//
// equivalent SQL:
// SELECT * FROM t1
//     JOIN t2 ON t1.c1 = t2.c1
//     JOIN t3 ON t1.c1 = t3.c1
//
var dl = require('../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query('my_database');
q.select('*');
q.from(q.expr(
    q.table('t1'),
    '$join', q.table('t2'), '$on', q.column('t1.c1'), '=', q.column('t2.c1'),
    '$join', q.table('t3'), '$on', q.column('t1.c1'), '=', q.column('t3.c1')
));

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }

    return client.close();
});
