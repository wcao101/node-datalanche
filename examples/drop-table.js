var dl = require('../lib');

var client = new dl.Client({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

var q = new dl.Query();
q.dropTable('my_table');

client.query(q, function(err) {

    if (err) {
        console.log(err);
    } else {
        console.log('my_table has been dropped/deleted');
    }

    return client.close();
});
