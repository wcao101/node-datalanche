var dlanche = require('../lib');

var API_KEY = '';    // Add your API key.
var API_SECRET = ''; // Leave blank until OAuth supported.

// creates a complex filter
// only return rows where ((dosage_form = 'capsule' or dosage_form = 'tablet') and product_type contains 'esc')
var myFilter = dlanche.createFilter();
myFilter.and([
    dlanche.createFilter().or([
        dlanche.createFilter().field('dosage_form').equals('capsule'),
        dlanche.createFilter().field('dosage_form').equals('tablet')
    ]),
    dlanche.createFilter().field('product_type').contains('esc')
]);

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

