//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var events = require('events');
var util = require('util');
var restify = require('restify');

var client = restify.createJsonClient({
    url: 'http://localhost:3000',
});

function addParam(url, numParams, param, value) {
    if (numParams === 0) {
        url += '?';
    } else {
        url += '&';
    }
    url += param + '=' + value;
    return url;
}

function ReadQuery(dataSetName) {
    
    events.EventEmitter.call(this);

    this._limit = undefined;
    this._offset = undefined;
    this._total = undefined;
    this._group = [];
    this._sort = [];
    this._fields = undefined;
    this._dataSetName = dataSetName;
}
util.inherits(ReadQuery, events.EventEmitter);
module.exports = ReadQuery;

ReadQuery.prototype.dataSetName = function(value) {
    this._dataSetName = value;
};

ReadQuery.prototype.limit = function(value) {
    this._limit = value;
};

ReadQuery.prototype.offset = function(value) {
    this._offset = value;
};

ReadQuery.prototype.hasTotal = function(value) {
    this._total = value;
};

ReadQuery.prototype.fields = function(array) {
    this._fields = array;
};

ReadQuery.prototype.groupAsc = function(field) {
    this._group.push(field + ':asc');
};

ReadQuery.prototype.groupDesc = function(field) {
    this._group.push(field + ':desc');
};

ReadQuery.prototype.sortAsc = function(field) {
    this._sort.push(field + ':asc');
};

ReadQuery.prototype.sortDesc = function(field) {
    this._sort.push(field + ':desc');
};

ReadQuery.prototype.getSchema = function(callback) {

    var url = '/' + this._dataSetName + '/schema';

    client.get(url, function(err, req, res, obj) {
        if (err) {
            callback(err);
            return;
        }
        callback(err, req, res, JSON.parse(obj));
    });
};

ReadQuery.prototype.read = function(callback) {

    var numParams = 0;
    var url = '/' + this._dataSetName + '/read';

    if (this._limit) {
        url = addParam(url, numParams++, 'limit', this._limit.toString());
    }
    if (this._offset) {
        url = addParam(url, numParams++, 'offset', this._offset.toString());
    }
    if (this._total) {
        url = addParam(url, numParams++, 'total', this._total.toString());
    }
    if (this._group.length > 0) {
        url = addParam(url, numParams++, 'groupby', this._group.toString());
    }
    if (this._sort.length > 0) {
        url = addParam(url, numParams++, 'orderby', this._sort.toString());
    }
    if (this._fields) {
        url = addParam(url, numParams++, 'select', this._fields.toString());
    }

    console.log(url);

    client.get(url, function(err, req, res, obj) {
        if (err) {
            callback(err);
            return;
        }
        callback(err, req, res, JSON.parse(obj));
    });
};

