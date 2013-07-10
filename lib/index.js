/*
var Client = require('./client');
var Filter = require('./filter');
var ReadParams = require('./read-params');

exports.createClient = function(params) {
    return new Client(params);
};

exports.createFilter = function() {
    return new Filter();
};

exports.createReadParams = function() {
    return new ReadParams();
};

// for extending functionality

exports.Client = Client;
exports.Filter = Filter;
exports.ReadParams = ReadParams;
*/
module.exports = {
    Client: require('./client.js'),
    Filter: require('./filter.js'),
    Query:  require('./query.js'),
};
