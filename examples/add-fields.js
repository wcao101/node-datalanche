var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '7zNN1Pl9SQ6lNZwYe9mtQw==',    // Add your API key.
    secret: 'VCBA1hLyS2mYdrL6kO/iKQ==',  // Add your API secret.
    host: 'localhost',
    port: 4001,
    verifySsl: false,
});

var newFields = [
    {
        name: 'column1',
        data_type: 'int64',
        description: 'hello world',
    },
];

client.addFields('test_dataset', newFields, function(err) {

    if (err) {
        console.log(err);
    } else {
        console.log('schema fields added');
    }

    return client.close();
});
