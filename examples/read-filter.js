var dlanche = require('../lib');

var API_KEY = '';    // Add your API key.
var API_SECRET = ''; // Leave blank until OAuth supported.

// creates a simple filter
// only return rows where dosage_form = 'capsule'
var myFilter = dlanche.createFilter();
myFilter.field('dosage_form').notEquals('capsule');

var readParams = {
    dataset: 'medical_codes_ndc',
    filter: myFilter,
    limit: 5
};

var connection = dlanche.createConnection();

// only need to call authenticate() once on any connection
connection.authenticate(API_KEY, API_SECRET, function(err) {

    if (err) {
        console.log(JSON.stringify(err, null, '  '));
        return;
    }

    connection.read(readParams, function(err, request, response, data) {

        if (err) {
            console.log(JSON.stringify(err, null, '  '));
            return;
        }

        console.log(JSON.stringify(data, null, '  '));
    });
});

