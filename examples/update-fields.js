var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

var fields = {
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

client.updateFields('example_dataset', fields, function(err) {

    if (err) {
        console.log(err);
    } else {
        console.log('schema fields updated');
    }

    return client.close();
});
