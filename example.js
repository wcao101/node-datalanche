//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var dlanche = require("./lib");

// filter

var f = dlanche.createFilter(
    dlanche.createFilter(
        dlanche.createFilter("dosage_form", dlanche.OPS.EQUAL, "capsule"),
        dlanche.OPS.OR,
        dlanche.createFilter("route", dlanche.OPS.EQUAL, "oral")
    ),
    dlanche.OPS.AND,
    dlanche.createFilter("dosage_form", dlanche.OPS.EQUAL, "capsule")
);

console.log(JSON.stringify(f, null, '  '));

// params

var params = {
    fields: [
        "dosage_form",
        "route",
        "product_type",
    ],
    filter: f,
    group: [
        { field: "dosage_form", type: "asc" },
        { field: "product_type", type: "desc" },
    ],
    limit: 10,
    order: [
        { field: "dosage_form", type: "asc" },
        { field: "product_type", type: "desc" },
    ],
    skip: 4,
    total: false,
};

// connection

var connection = dlanche.createConnection("", "");

connection.getSchema("medical-codes-ndc", function(err, req, res, schema) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(JSON.stringify(schema, null, '  '));
});

connection.read("medical-codes-ndc", params, function(err, req, res, data) {   
    if (err) {
        console.log(err);
        return;
    }
    console.log(JSON.stringify(data, null, '  '));
});














