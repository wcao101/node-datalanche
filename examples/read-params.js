var dlanche = require('../lib');

var client = dlanche.createClient({
    key: '',    // Add your API key.
    secret: ''  // Add your API secret.
});

var readParams = dlanche.createReadParams();
readParams.columns = [ 'dosage_form', 'route', 'product_type' ];
readParams.filter = null; // look at read-filter.js or read-complex-filter.js
readParams.limit = 5;
readParams.skip = 0;
readParams.sort = [ 'dosage_form:$asc', 'product_type:$desc' ];
readParams.total = false;

// you can also use helper methods for params.sort
readParams.sort = null;
readParams.sortAsc('dosage_form');
readParams.sortDesc('product_type');

client.readRecords('medical_codes_ndc', readParams, function(err, records) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(records));
    }

    return client.close();
});
