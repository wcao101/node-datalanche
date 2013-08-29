var dl = require('../lib');

var client = new dl.Client({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

// q.where() is optional however all rows in the table
// will be updated if missing.

var e = new dl.Expression();
e.column('col3').equals('hello');

var q = new dl.Query();
q.update('my_table');
q.set({
    col3: 'hello world'
});
q.where(e);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }

    return client.close();
});
