var dl = require('../lib');

var client = new dl.Client({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

// q.where() is optional however all rows will be deleted
// from the table if missing.

var e = new dl.Expression();
e.column('col3').equals('hello');

var q = new dl.Query();
q.deleteFrom('my_table');
q.where(e);

client.query(q, function(err) {

    if (err) {
        console.log(err);
    } else {
        console.log('rows deleted from my_table');
    }

    return client.close();
});
