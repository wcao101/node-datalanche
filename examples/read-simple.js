var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

client.readRecords('medical_codes_ndc', null, function(err, records) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(records));
    }

    return client.close();
});
