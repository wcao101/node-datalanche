var dlanche = require('../lib');

var API_KEY = '';    // Add your API key.
var API_SECRET = ''; // Leave blank until OAuth supported.

var client = dlanche.createClient();

// only need to call authenticate() once on any client
client.authenticate(API_KEY, API_SECRET, function(err) {

    if (err) {
        console.log(JSON.stringify(err, null, '  '));
        return;
    }

    client.getList(function(err, request, response, list) {

        if (err) {
            console.log(JSON.stringify(err, null, '  '));
            return;
        }

        console.log(JSON.stringify(list, null, '  '));
    });
});

