//
// equivalent SQL
//
// DROP TABLE my_schema.my_table;
//
var dl = require('../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query();
q.dropTable('my_schema.my_table');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('drop_table succeeded!');
    }

    return client.close();
});
