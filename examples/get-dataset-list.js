var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

client.getDatasetList(function(err, list) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(list));
    }

    return client.close();
});
