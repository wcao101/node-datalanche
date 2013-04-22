var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: ''  // Add your API secret.
});

// creates a simple filter
// only return rows where dosage_form = 'capsule'
var myFilter = dlanche.createFilter();
myFilter.field('dosage_form').notEquals('capsule');

var readParams = dlanche.createReadParams();
readParams.dataset = 'medical_codes_ndc';
readParams.filter = myFilter;
readParams.limit = 5;

client.read(readParams, function(err, request, response, data) {

    if (err) {
        console.log(JSON.stringify(err, null, '  '));
        return;
    }

    console.log(JSON.stringify(data, null, '  '));
});
