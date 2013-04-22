var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: ''  // Add your API secret.
});

var readParams = dlanche.createReadParams();
readParams.dataset = 'medical_codes_ndc';
readParams.fields = [ 'dosage_form', 'route', 'product_type' ];
readParams.filter = null; // look at read-filter.js or read-complex-filter.js
readParams.limit = 5;
readParams.skip = 0;
readParams.sort = [ 'dosage_form:$asc', 'product_type:$desc' ];
readParams.total = false;

// you can also use helper methods for params.sort
readParams.sort = null;
readParams.sortAsc('dosage_form');
readParams.sortDesc('product_type');

client.read(readParams, function(err, request, response, data) {

    if (err) {
        console.log(JSON.stringify(err, null, '  '));
        return;
    }

    console.log(JSON.stringify(data, null, '  '));
});
