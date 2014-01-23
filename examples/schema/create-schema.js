//
// Create the given schema. Must have admin access for the given database.
//
// equivalent SQL:
// CREATE SCHEMA my_schema;
//
var dl = require('../../lib');

var client = new dl.Client({
    key: 'Uf88KldyReS95p4WqplE7w==',
    secret: 'OXPlXrBuSHuQdtDEU0bIkw==',
    host: 'localhost',
    port: 4001,
    verifySsl: false
});

var q = new dl.Query('test_database');
q.createSchema('my_schema');
q.description('my_schema description text');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('create_schema succeeded!');
    }
});
