var Connection = require('./connection');
var Filter = require('./filter');
var ReadParams = require('./read-params');

exports.createConnection = function(key, secret) {
    return new Connection(key, secret);
};

exports.createFilter = function() {
    return new Filter();
};

exports.createReadParams = function() {
    return new ReadParams();
};
