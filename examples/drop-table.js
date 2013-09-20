var dl = require('../lib');

var client = new dl.Client({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

var q = new dl.Query();
q.dropTable('my_table');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('drop_table succeeded!');
    }

    return client.close();
});
