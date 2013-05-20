var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: ''  // Add your API secret.
});

// creates a complex filter
// only return rows where ((dosage_form = 'capsule' or dosage_form = 'tablet') and product_type contains 'esc')
var myFilter = dlanche.createFilter();
myFilter.boolAnd([
    dlanche.createFilter().boolOr([
        dlanche.createFilter().field('dosage_form').equals('capsule'),
        dlanche.createFilter().field('dosage_form').equals('tablet')
    ]),
    dlanche.createFilter().field('product_type').contains('esc')
]);

var readParams = dlanche.createReadParams();
readParams.dataset = 'medical_codes_ndc';
readParams.filter = myFilter;
readParams.limit = 5;

client.readRecords(readParams, function(err, records) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(records));
    }

    return client.close();
});
