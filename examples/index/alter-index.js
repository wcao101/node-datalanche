//
// Alter the given index's properties. Must have admin access for the given database.
//
// equivalent SQL:
// ALTER INDEX my_schema.my_index RENAME TO my_new_index;
//
var fs = require('fs');
var dl = require('../../lib');
var path = require('path');
var dir_name = __dirname;

var config = JSON.parse(fs.readFileSync(path.join(dir_name, '/..', '/config.json')).toString());

// Please find your API credentials here: https://www.datalanche.com/account before use
var YOUR_API_KEY = config.api_key;
var YOUR_API_SECRET = config.api_secret;

var client = new dl.Client({
    key: YOUR_API_KEY,
    secret: YOUR_API_SECRET
});

var q = new dl.Query('my_database');
q.alterIndex('my_schema.my_index');
q.renameTo('my_new_index');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
        process.exit(1);        
    } else {
        console.log('alter_index succeeded!');
    }
});
