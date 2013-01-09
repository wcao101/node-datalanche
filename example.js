//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var dlanche = require("./lib");

var apiKey = "";    // insert your API key
var dataSet = "medical-codes-ndc";

// filter

var f = dlanche.createFilter(
    dlanche.createFilter(
        dlanche.createFilter("dosage_form", dlanche.OPS.EQ, "capsule"),
        dlanche.OPS.OR,
        dlanche.createFilter("route", dlanche.OPS.EQ, "oral")
    ),
    dlanche.OPS.AND,
    dlanche.createFilter("dosage_form", dlanche.OPS.EQ, "capsule")
);

console.log("FILTER");
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

var connection = dlanche.createConnection(apiKey, "");

connection.getSchema(dataSet, function(err, req, res, schema) {
    console.log("\nSCHEMA");
    if (err) {
        console.log(err);
        return;
    }
    console.log(JSON.stringify(schema, null, '  '));

    connection.read(dataSet, params, function(err, req, res, data) {
        console.log("\nREAD DATA");
        if (err) {
            console.log(err);
            return;
        }
        console.log(JSON.stringify(data, null, '  '));

        // TODO: connection.write()
    });
});

