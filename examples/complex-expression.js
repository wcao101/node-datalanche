var dlanche = require('../lib');

var client = dl.createClient({
    key: '',    // Add your API key.
    secret: ''  // Add your API secret.
});

var e = new dl.Expression();
e.boolAnd([
    new dl.Expression().boolOr([
        new dl.Expression().column('col3').equals('hello'),
        new dl.Expression().column('col3').equals('world')
    ]),
    new dl.Expression().column('col1').equals('0f21b968-cd28-4d8b-9ea6-33dbcd517ec5')
]);

var q = new dl.Query();
q.select('*').from('my_table').where(e);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }

    return client.close();
});
