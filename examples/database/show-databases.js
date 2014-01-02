//
// Show all databases you have access to.
//
var dl = require('../../lib');

var client = new dl.Client({
    key: 'TZeSCqF4Q86AuDm6da2aSQ==',
    secret: '432IzS/ERcuNlSIMv0+9Mg=='
});

var q = new dl.Query();
q.showDatabases();

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }
});
