//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var events = require("events");
var querystring = require('querystring');
var restify = require("restify");
var util = require("util");

function Connection(key, secret) {
    
    events.EventEmitter.call(this);

    this.authKey = key;
    this.authSecret = secret;
    this.client = restify.createJsonClient({
        url: "http://localhost:3000",
    });
}
util.inherits(Connection, events.EventEmitter);
module.exports = Connection;

Connection.prototype.getSchema = function(dataSetName, callback) {

    var url = "/" + querystring.escape(dataSetName) + "/schema";

    // TODO: auth

    this.client.get(url, function(err, req, res, obj) {
        if (err) {
            callback(err);
            return;
        }
        callback(err, req, res, JSON.parse(obj));
    });
};

Connection.prototype.read = function(dataSetName, params, callback) {

    var url = "/" + querystring.escape(dataSetName) + "/read";

    // TODO: auth

    if (params.group && params.group.length > 0) {
        var items = [];
        for (var i = 0; i < params.group.length; i++) {
            items.push(params.group[i].field + ":" + params.group[i].type);
        }
        params.group = items.toString();
    }

    if (params.order && params.order.length > 0) {
        var items = [];
        for (var i = 0; i < params.order.length; i++) {
            items.push(params.order[i].field + ":" + params.order[i].type);
        }
        params.order = items.toString();
    }

    params.limit = params.limit.toString();
    params.skip = params.skip.toString();
    params.total = params.total.toString();
    params.filter = JSON.stringify(params.filter);
    params.fields = params.fields.toString();

    // URL encode parameters
    var str = querystring.stringify(params);
    if (str) {
        url += "?" + str;
    }

    //console.log(url);

    this.client.get(url, function(err, req, res, obj) {
        if (err) {
            callback(err);
            return;
        }
        callback(err, req, res, JSON.parse(obj));
    });
};

