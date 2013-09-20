var dl = require('../lib');

var client = dl.createClient({
    key: '',    // Add your API key.
    secret: ''  // Add your API secret.
});

var e = new dl.Expression();
e.column('col3').contains('hello');

var q = new dl.Query();
q.select([ 'col1', 'col2' ]); // if you want all columns use q.select('*')
q.from('my_table');
q.where(e);
q.orderBy([
    { col1: '$asc' },
    { col2: '$desc' },
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
