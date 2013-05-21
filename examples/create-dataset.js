var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

var schema = {
    name: 'example_dataset',
    description: 'example_dataset description text',
    is_private: true,
    license: {
        name: 'public domain',
        url: 'http://example_dataset.license.com',
    },
    fields: [
        {
            name: 'column1',
            data_type: 'string',
            description: 'column1 description text',
            is_primary: true,
        },
        {
            name: 'column2',
            data_type: 'int32',
            description: 'column2 description text',
            is_primary: false,
        },
        {
            name: 'column3',
            data_type: 'timestamp',
            description: 'column3 description text',
            is_primary: false,
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
