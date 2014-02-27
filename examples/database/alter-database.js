//
// Alter the given database's properties. Must have admin access for the database.
//
// equivalent SQL:
// ALTER DATABASE my_database RENAME TO my_new_database;
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

var q = new dl.Query();
q.alterDatabase('my_database');
q.renameTo('my_new_database');
q.description('my_new_database description text');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
        process.exit(1);        
    } else {
        console.log('alter_database succeeded!');
     }
});
