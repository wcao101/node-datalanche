//
// Show details of given database. Must have read access for the database.
//
var fs = require('fs');
var dl = require('../../lib');
var path = require('path');

var config = JSON.parse(fs.readFileSync(path.join(__dirname, '/..', '/config.json')).toString());

// Please find your API credentials here: https://www.datalanche.com/account before use
var YOUR_API_KEY = config.api_key;
var YOUR_API_SECRET = config.api_secret;

var client = new dl.Client({
    key: YOUR_API_KEY,
    secret: YOUR_API_SECRET
});

var q = new dl.Query();
q.describeDatabase('my_database');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
        process.exit(1);        
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }
});
