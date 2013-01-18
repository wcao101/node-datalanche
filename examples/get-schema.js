var dlanche = require('../lib');

var API_KEY = '';    // Add your API key.
var API_SECRET = ''; // Leave blank until OAuth supported.
var DATA_SET = 'medical_codes_ndc';

var connection = dlanche.createConnection();

// only need to call authenticate() once on any connection
connection.authenticate(API_KEY, API_SECRET, function(err) {

    if (err) {
        console.log(JSON.stringify(err, null, '  '));
        return;
    }

    connection.getSchema(DATA_SET, function(err, request, response, schema) {

        if (err) {
            console.log(JSON.stringify(err, null, '  '));
            return;
        }

        console.log(JSON.stringify(schema, null, '  '));
    });
});

