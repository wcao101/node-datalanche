var Client = require('./client');
var Filter = require('./filter');
var ReadParams = require('./read-params');

exports.createClient = function(key, secret) {
    return new Client(key, secret);
};

exports.createFilter = function() {
    return new Filter();
};

exports.createReadParams = function() {
    return new ReadParams();
};
