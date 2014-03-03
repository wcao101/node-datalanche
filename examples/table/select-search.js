//
// Search the table and retrieve the rows. Must have read access for the given database.
//
// equivalent SQL:
// SELECT * FROM my_schema.my_table WHERE SEARCH 'hello world'
//
// NOTE: Search clause is sent to ElasticSearch. The search
// results are used as a filter when executing the SQL query.
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
q.selectAll().from('my_schema.my_table').search('hello world');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }
});
