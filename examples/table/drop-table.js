//
// Drop the given table. Must have admin access for the given database.
//
// equivalent SQL:
// DROP TABLE my_schema.my_table CASCADE;
//
var fs = require('fs');
var dl = require('../../lib');

var config = fs.readFileSync('../examples/config.json');
config = JSON.parse(config.toString());

// Please find your API credentials here: https://www.datalanche.com/account before use
var YOUR_API_KEY = config.api_key;
var YOUR_API_SECRET = config.api_secret;

var client = new dl.Client({
    key: YOUR_API_KEY,
    secret: YOUR_API_SECRET
});

var q = new dl.Query('my_database');
q.dropTable('my_schema.my_table');
q.cascade(true);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('drop_table succeeded!');
    }
});
