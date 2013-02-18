var Connection = require('./connection');
var Enum = require('enum');
var Filter = require('./filter').Filter;
var FilterOp = require('./filter').FilterOp;

exports.SortType = new Enum([
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

