//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var Connection = require('./connection');
var Enum = require('enum');
var Filter = require('./filter').Filter;
var FilterOp = require('./filter').FilterOp;

exports.OrderType = new Enum([
    'ASC',      // ascending
    'DESC',     // descending
]);

exports.GroupType = new Enum([
    'ASC',      // ascending
    'DESC',     // descending
]);

exports.FilterOp = FilterOp;

exports.createConnection = function(key, secret) {
    return new Connection(key, secret);
};

exports.createFilter = function(left, operator, right) {
    return new Filter(left, operator, right);
};

