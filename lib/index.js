var Connection = require('./connection');
var Enum = require('enum');
var Filter = require('./filter');

exports.SortType = new Enum([
    'ASC',      // ascending
    'DESC',     // descending
]);

exports.createConnection = function(key, secret) {
    return new Connection(key, secret);
};

exports.createFilter = function() {
    return new Filter();
};
