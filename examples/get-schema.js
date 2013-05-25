var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

client.getSchema('example_dataset', function(err, schema) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(schema));
    }

    return client.close();
});
