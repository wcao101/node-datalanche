var dl = require('../lib');

var client = new dl.Client({
    key: 'nNErC0W5TFeISPW/MVFa6A==',    // Add your API key.
    secret: 'Y7N2qt7XTE6lBEUF/uGk6Q==',  // Add your API secret.
    host: 'localhost',
    port: 4001,
    verifySsl: false,
});

var q = new dl.Query();
q.selectAll().from('medical_codes_ndc').limit(20);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }

    return client.close();
});
