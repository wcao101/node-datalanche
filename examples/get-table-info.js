var dl = require('../lib');

var client = new dl.Client({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

var q = new dl.Query();
q.getTableInfo('my_table');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }

    return client.close();
});