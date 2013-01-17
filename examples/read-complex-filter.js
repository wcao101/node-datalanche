var dlanche = require('datalanche');

var API_KEY = '';    // Add your API key.
var API_SECRET = ''; // Leave blank until OAuth supported.
var DATA_SET = 'medical_codes_ndc';

// creates a complex filter
// only return rows where (dosage_form = 'capsule' or dosage_form = 'tablet') and product_type = 'human otc drug'
var myFilter = dlanche.createFilter(
    dlanche.createFilter(
        dlanche.createFilter('dosage_form', dlanche.FilterOp.EQ, 'capsule'),
        dlanche.FilterOp.OR,
        dlanche.createFilter('dosage_form', dlanche.FilterOp.EQ, 'tablet')
    ),
    dlanche.FilterOp.AND,
    dlanche.createFilter('product_type', dlanche.FilterOp.EQ, 'human otc drug')
);

var readParams = {
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

    connection.read(DATA_SET, readParams, function(err, request, response, data) {

        if (err) {
            console.log(JSON.stringify(err, null, '  '));
            return;
        }

        console.log(JSON.stringify(data, null, '  '));
    });
});
