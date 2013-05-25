var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

var fieldNames = [ 'column1' ];

client.removeFields('example_dataset', fieldNames, function(err) {

    if (err) {
        console.log(err);
    } else {
        console.log('schema fields removed');
    }

    return client.close();
});
