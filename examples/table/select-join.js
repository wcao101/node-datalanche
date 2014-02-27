//
// Join multiple tables and retrieve the rows. Must have read access for the given database.
//
// equivalent SQL:
// SELECT * FROM t1
//     JOIN t2 ON t1.c1 = t2.c1
//     JOIN t3 ON t1.c1 = t3.c1
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
q.selectAll();
q.from(q.expr(
    q.table('my_schema.t1'),
    '$join', q.table('my_schema.t2'), '$on', q.column('my_schema.t1.col1'), '=', q.column('my_schema.t2.col1'),
    '$join', q.table('my_schema.t3'), '$on', q.column('my_schema.t1.col1'), '=', q.column('my_schema.t3.col1')
));

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }
});
