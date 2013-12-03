//
// Search the table and retrieve the rows. Must have read access for the given database.
//
// equivalent SQL:
// SELECT * FROM my_schema.my_table WHERE SEARCH 'hello world'
//
// NOTE: Search clause is sent to ElasticSearch. The search
// results are used as a filter when executing the SQL query.
//
var dl = require('../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query('my_database');
q.select('*').from('my_schema.my_table').search('hello world');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }

    return client.close();
});
