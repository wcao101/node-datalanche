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
    fields: [
        {
            name: 'column1',
            data_type: 'string',
            is_primary: true,
        },
        {
            name: 'column2',
            data_type: 'int32',
            is_primary: true,
        },
        {
            name: 'column3',
            data_type: 'timestamp',
        },
    ],
};

client.createDataset(schema, function(err) {

    if (err) {
        console.log(err);
    } else {
        console.log('dataset created');
    }

    return client.close();
});
