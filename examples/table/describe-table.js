//
// Show the given table's details. Must have read access for the given database.
//
var dl = require('../../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query('my_database');
q.describeTable('my_schema.my_table');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }
});
