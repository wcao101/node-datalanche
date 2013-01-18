var dlanche = require('../lib');

var API_KEY = '';    // Add your API key.
var API_SECRET = ''; // Leave blank until OAuth supported.
var DATA_SET = 'medical_codes_ndc';

var readParams = {
    // leave empty to use default read parameters
};

var connection = dlanche.createConnection();

// only need to call authenticate() once on any connection
connection.authenticate(API_KEY, API_SECRET, function(err) {

    if (err) {
        console.log(JSON.stringify(err, null, '  '));
        return;
    }

    connection.read(DATA_SET, readParams, function(err, request, response, data) {

        if (err) {
            console.log(JSON.stringify(err, null, '  '));
            return;
        }

        console.log(JSON.stringify(data, null, '  '));
    });
});

