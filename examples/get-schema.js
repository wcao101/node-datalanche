var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: ''  // Add your API secret.
});

client.getSchema('medical_codes_ndc', function(err, request, response, schema) {

    if (err) {
        console.log(JSON.stringify(err, null, '  '));
        return;
    }

    console.log(JSON.stringify(schema, null, '  '));
});
