//
// Create an index on the given table. Must have admin access for the given database.
//
// equivalent SQL:
// CREATE UNIQUE INDEX my_index ON my_schema.my_table USING btree (col1, col2);
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
q.createIndex('my_index');
q.unique(true);
q.onTable('my_schema.my_table');
q.usingMethod('btree');
q.columns([ 'col1', 'col2' ]);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
        process.exit(1);        
    } else {
        console.log('create_index succeeded!');
    }
});
