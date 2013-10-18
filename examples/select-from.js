var dl = require('../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query();
q.select([ 'col1', 'col2' ]);
q.from('my_table');
q.where(q.expr(q.column('col3'), '$like', '%hello%'));
q.orderBy([
    q.expr(q.column('col1'), '$asc'),
    q.expr(q.column('col2'), '$desc')
]);
q.offset(0);
q.limit(10);
q.total(true);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result.data, null, '  '));
    }

    return client.close();
});
