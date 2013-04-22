var dlanche = require('../lib');

var API_KEY = '';    // Add your API key.
var API_SECRET = ''; // Leave blank until OAuth supported.

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

var client = dlanche.createClient();

// only need to call authenticate() once on any client
client.authenticate(API_KEY, API_SECRET, function(err) {

    if (err) {
        console.log(JSON.stringify(err, null, '  '));
        return;
    }

    client.read(readParams, function(err, request, response, data) {

        if (err) {
            console.log(JSON.stringify(err, null, '  '));
            return;
        }

        console.log(JSON.stringify(data, null, '  '));
    });
});

