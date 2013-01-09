//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var Connection = require("./connection");
var Filter = require("./filter").Filter;
var OPS = require("./filter").OPS;

exports.OPS = OPS;

exports.createConnection = function(key, secret) {
    return new Connection(key, secret);
};

exports.createFilter = function(left, operator, right) {
    return new Filter(left, operator, right);
};

