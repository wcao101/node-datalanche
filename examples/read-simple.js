var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: ''  // Add your API secret.
});

// Use default read parameters. Only "dataset" is a required parameter.
var readParams = dlanche.createReadParams();
readParams.dataset = 'medical_codes_ndc';

client.read(readParams, function(err, request, response, data) {

    if (err) {
        console.log(JSON.stringify(err, null, '  '));
        return;
    }

    console.log(JSON.stringify(data, null, '  '));
});
