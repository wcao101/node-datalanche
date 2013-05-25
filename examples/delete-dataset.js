var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

client.deleteDataset('example_dataset', function(err) {

    if (err) {
        console.log(err);
    } else {
        console.log('dataset deleted');
    }

    return client.close();
});
