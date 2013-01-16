//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var nconf = require('nconf');
var dlanche = require('./lib');

// CMD: node example.js --key YOUR_API_KEY

nconf.use('memory');
nconf.env().argv();

var apiKey = nconf.get('key');

// filter

var f = dlanche.createFilter(
    dlanche.createFilter(
        dlanche.createFilter('dosage_form', dlanche.FilterOp.EQ, 'capsule'),
        dlanche.FilterOp.OR,
        dlanche.createFilter('dosage_form', dlanche.FilterOp.EQ, 'tablet')
    ),
    dlanche.FilterOp.AND,
    dlanche.createFilter('product_type', dlanche.FilterOp.EQ, 'human otc drug')
);

// params

var params = {
    distinct: false,
    fields: [
        'dosage_form',
        'route',
        'product_type',
    ],
    filter: f,
    group: [
        { field: 'dosage_form', type: dlanche.GroupType.ASC },
        { field: 'product_type', type: dlanche.GroupType.DESC },
    ],
    limit: 10,
    order: [
        { field: 'dosage_form', type: dlanche.OrderType.ASC },
        { field: 'product_type', type: dlanche.OrderType.DESC },
    ],
    skip: 0,
    total: false,
};

// connection

var connection = dlanche.createConnection();

connection.authenticate(apiKey, '', function(err) {
    console.log('\nAUTH');
    if (err) {
        console.log(err);
        return;
    }
    console.log('authentication successful');

    // /list
    connection.getList(function(err, req, res, list) {
        console.log('\nLIST');
        if (err) {
            console.log(err);
            return;
        }
        console.log(JSON.stringify(list, null, '  '));

        var dataSet = list.datasets[0];

        // /:data_set_name/schema
        connection.getSchema(dataSet, function(err, req, res, schema) {
            console.log('\nSCHEMA');
            if (err) {
                console.log(err);
                return;
            }
            console.log(JSON.stringify(schema, null, '  '));

            // /:data_set_name/read
            connection.read(dataSet, params, function(err, req, res, data) {
                console.log('\nREAD');
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(JSON.stringify(data, null, '  '));

                // TODO: connection.write()
            });
        });
    });
});



