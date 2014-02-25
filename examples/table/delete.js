//
// Delete rows from the given table. Must have write access for the given database.
//
// equivalent SQL:
// DELETE FROM my_schema.my_table WHERE col3 = 'hello';
//
var fs = require('fs');
var dl = require('../../lib');

var config = fs.readFileSync('../config.json');
config = JSON.parse(config.toString());

// Please find your API credentials here: https://www.datalanche.com/account before use
var YOUR_API_KEY = config.api_key;
var YOUR_API_SECRET = config.api_secret;

var client = new dl.Client({
    key: YOUR_API_KEY,
    secret: YOUR_API_SECRET
});

var q = new dl.Query('my_database');
q.deleteFrom('my_schema.my_table');
q.where(q.expr(q.column('col3'), '=', 'hello'));

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }
});
