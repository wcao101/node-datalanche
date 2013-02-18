var dlanche = require('../lib');

var API_KEY = '';    // Add your API key.
var API_SECRET = ''; // Leave blank until OAuth supported.
var DATA_SET = 'medical_codes_ndc';

var readParams = {
    fields: [
        'dosage_form',
        'route',
        'product_type'
    ],
    filter: null, // look at read-filter.js or read-complex-filter.js
    limit: 5,
    skip: 0,
    sort: [
        { field: 'dosage_form', type: dlanche.SortType.ASC },
        { field: 'product_type', type: dlanche.SortType.DESC }
    ],
    total: false
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

