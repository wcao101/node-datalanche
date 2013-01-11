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

function Connection() {
    
    events.EventEmitter.call(this);

    this.authKey = "";
    this.authSecret = "";
    this.client = restify.createJsonClient({
        url: "http://localhost:3000",
    });
}
util.inherits(Connection, events.EventEmitter);
module.exports = Connection;

Connection.prototype.authenticate = function(key, secret, callback) {
    this.authKey = key;
    this.authSecret = secret;
    callback(null);
};

Connection.prototype.getList = function(callback) {

    var url = "/list";
    url += "?key=" + querystring.escape(this.authKey);

    this.client.get(url, function(err, req, res, obj) {
        if (err) {
            callback(err);
            return;
        }
        callback(err, req, res, JSON.parse(obj));
    });
};

Connection.prototype.getSchema = function(dataSetName, callback) {

    var url = "/" + querystring.escape(dataSetName) + "/schema";
    url += "?key=" + querystring.escape(this.authKey);

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

    params.key = this.authKey;

    if (params.group) {
        var items = [];
        for (var i = 0; i < params.group.length; i++) {
            items.push(params.group[i].field + ":" + params.group[i].type);
        }

        if (items.length > 0) {
            params.group = items.toString();
        } else {
            params.group = undefined;
        }
    }

    if (params.order) {
        var items = [];
        for (var i = 0; i < params.order.length; i++) {
            items.push(params.order[i].field + ":" + params.order[i].type);
        }

        if (items.length > 0) {
            params.order = items.toString();
        } else {
            params.order = undefined;
        }
    }
    if (params.distinct) {
        params.distinct = params.distinct.toString();
    }
    if (params.limit) {
        params.limit = params.limit.toString();
    }
    if (params.skip) {
        params.skip = params.skip.toString();
    }
    if (params.total) {
        params.total = params.total.toString();
    }
    if (params.filter) {
        params.filter = JSON.stringify(params.filter);
    }
    if (params.fields) {
        params.fields = params.fields.toString();
    }

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

