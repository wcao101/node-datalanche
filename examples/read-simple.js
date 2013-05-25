var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

// Use default read parameters. Only "dataset" is a required parameter.
var readParams = dlanche.createReadParams();
readParams.dataset = 'example_dataset';

client.readRecords(readParams, function(err, records) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(records));
    }

    return client.close();
});
