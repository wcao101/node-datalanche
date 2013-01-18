var dlanche = require('../lib');

var API_KEY = '';    // Add your API key.
var API_SECRET = ''; // Leave blank until OAuth supported.
var DATA_SET = 'medical_codes_ndc';

var readParams = {
    distinct: false,
    fields: [
        'dosage_form',
        'route',
        'product_type'
    ],
    filter: null, // look at read-filter.js or read-complex-filter.js
    group: [
        { field: 'dosage_form', type: dlanche.GroupType.ASC },
        { field: 'product_type', type: dlanche.GroupType.DESC }
    ],
    limit: 5,
    order: [
        { field: 'dosage_form', type: dlanche.OrderType.ASC },
        { field: 'product_type', type: dlanche.OrderType.DESC }
    ],
    skip: 0,
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

