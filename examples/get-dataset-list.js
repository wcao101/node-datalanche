var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '7zNN1Pl9SQ6lNZwYe9mtQw==',    // Add your API key.
    secret: 'VCBA1hLyS2mYdrL6kO/iKQ==',  // Add your API secret.
    host: 'localhost',
    port: 4001,
    verifySsl: false,
});

client.getDatasetList(function(err, list) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(list));
    }

    return client.close();
});
