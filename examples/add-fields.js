var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

// Only name and data_type are required.
// Only one field can be used as a primary key for the dataset.
var fields = [
    {
        name: 'column1',
        data_type: 'int64',
        description: 'column1 in an int64',
        is_primary: true,
    },
    {
        name: 'column2',
        data_type: 'timestamp',
        description: 'column2 is a timestamp',
        is_primary: false,
    },
    {
        name: 'column3',
        data_type: 'string',
    },
];

client.addFields('example_dataset', fields, function(err) {

    if (err) {
        console.log(err);
    } else {
        console.log('schema fields added');
    }

    return client.close();
});
