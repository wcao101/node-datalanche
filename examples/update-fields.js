var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '7zNN1Pl9SQ6lNZwYe9mtQw==',    // Add your API key.
    secret: 'VCBA1hLyS2mYdrL6kO/iKQ==',  // Add your API secret.
    host: 'localhost',
    port: 4001,
    verifySsl: false,
});

var newFields = {
    column1: {
        name: 'column1_dude',
        data_type: 'uuid',
        description: 'hello world again',
    },
    column2: {
        name: 'column2_dude',
        data_type: 'timestamp',
        description: 'hello world again',
    },
};

client.updateFields('test_dataset', newFields, function(err) {

    if (err) {
        console.log(err);
    } else {
        console.log('schema fields updated');
    }

    return client.close();
});
