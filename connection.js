//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var events = require("events");
var util = require("util");
var restify = require("restify");

function addParam(url, numParams, param, value) {
    if (numParams === 0) {
        url += "?";
    } else {
        url += "&";
    }
    url += param + "=" + value;
    return url;
}

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

    var url = "/" + dataSetName + "/schema";

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

    var numParams = 0;
    var url = "/" + dataSetName + "/read";

    // TODO: auth

    if (params.limit) {
        url = addParam(url, numParams++, "limit", params.limit.toString());
    }
    if (params.skip) {
        url = addParam(url, numParams++, "offset", params.skip.toString());
    }
    if (params.total) {
        url = addParam(url, numParams++, "total", params.total.toString());
    }
    if (params.filter) {
        url = addParam(url, numParams++, "where", JSON.stringify(params.filter));
    }
    if (params.group && params.group.length > 0) {
        var items = [];
        for (var i = 0; i < params.group.length; i++) {
            items.push(params.group[i].field + ":" + params.group[i].type);
        }
        url = addParam(url, numParams++, "groupby", items.toString());
    }
    if (params.order && params.order.length > 0) {
        var items = [];
        for (var i = 0; i < params.order.length; i++) {
            items.push(params.order[i].field + ":" + params.order[i].type);
        }
        url = addParam(url, numParams++, "orderby", items.toString());
    }
    if (params.fields && params.fields.length > 0) {
        url = addParam(url, numParams++, "select", params.fields.toString());
    }

    console.log(url);

    this.client.get(url, function(err, req, res, obj) {
        if (err) {
            callback(err);
            return;
        }
        callback(err, req, res, JSON.parse(obj));
    });
};

