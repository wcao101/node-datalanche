var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '7zNN1Pl9SQ6lNZwYe9mtQw==',    // Add your API key.
    secret: 'VCBA1hLyS2mYdrL6kO/iKQ==',  // Add your API secret.
    host: 'localhost',
    port: 4001,
    verifySsl: false,
});

var schema = {
    name: 'test_dataset',
};

client.createDataset(schema, function(err, request, response, list) {

    if (err) {
        console.log(JSON.stringify(err, null, '  '));
        return;
    }

    console.log(JSON.stringify(list, null, '  '));
});
