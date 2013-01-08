//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var ReadQuery = require('./read-query');
//var WriteQuery = require('./write-query');

//module.exports = {
//    ReadQuery: ReadQuery,
    //WriteQuery: WriteQuery,
//};

var q = new ReadQuery('medical-codes-ndc');
q.dataSetName('medical-codes-ndc');
q.limit(10);
q.offset(4);
q.hasTotal(false);
q.sortAsc('dosage_form');
q.sortDesc('product_type');
q.groupAsc('dosage_form');
q.groupDesc('product_type');
q.fields([
    'dosage_form',
    'route',
    'product_type',
]);

q.read(function(err, req, res, obj) {
    if (err) {
        console.log(JSON.stringify(err, null, '  '));
        return;
    }
    //console.log(JSON.stringify(res));
    console.log(JSON.stringify(obj, null, '  '));
});

