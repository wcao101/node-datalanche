var events = require('events');
var querystring = require('querystring');
var restify = require('restify');
var util = require('util');

// helper functions

function isArray(obj) {
    return toString.call(obj) == '[object Array]';
}

function isObject(obj) {
    return obj === Object(obj);
}

function isString(obj) {
    return toString.call(obj) == '[object String]';
}

function isObjectArray(obj) {
    if (isArray(obj) === true) {
        for (var i = 0; i < obj.length; i++) {
            if (isObject(obj[i]) === false) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function isStringArray(obj) {
    if (isArray(obj) === true) {
        for (var i = 0; i < obj.length; i++) {
            if (isString(obj[i]) === false) {
                return false;
            }
        }
        return true;
    }
    return false;
}

// constructor

function Connection(params) {

    events.EventEmitter.call(this);

    var host = 'api.datalanche.com';
    var port = null;

    if (params && params.host) {
        host = params.host;
    }

    if (params && params.port) {
        port = params.port;
    }

    var url = 'https://' + host;
    if (port) {
        url += ':' + port.toString();
    }

    this.authKey = '';
    this.authSecret = '';
    this.client = restify.createJsonClient({
        url: url,
        // TODO: investigate unzip performance issue
        //headers: { 'Accept-Encoding': 'gzip' },
    });
}
util.inherits(Connection, events.EventEmitter);
module.exports = Connection;

// methods

Connection.prototype.authenticate = function(key, secret, callback) {
    this.authKey = key;
    this.authSecret = secret;
    return callback(null);
};

Connection.prototype.getList = function(callback) {

    var url = '/list';
    url += '?key=' + querystring.escape(this.authKey);

    this.client.get(url, function(err, req, res, obj) {
        if (err) {
            return callback(err);
        }
        return callback(err, req, res, obj);
    });
};

Connection.prototype.getSchema = function(dataSetName, callback) {

    var url = '/schema';
    url += '?dataset=' + querystring.escape(dataSetName);
    url += '&key=' + querystring.escape(this.authKey);

    this.client.get(url, function(err, req, res, obj) {
        if (err) {
            return callback(err);
        }
        return callback(err, req, res, obj);
    });
};

Connection.prototype.read = function(params, callback) {

    var url = '/read';

    params.key = this.authKey;

    if (params.dataset) {
        params.dataset = params.dataset.toString();
    }

    if (params.sort) {

        if (isArray(params.sort) === true) {

            var items = [];
            for (var i = 0; i < params.sort.length; i++) {
                var item = params.sort[i];

                if (item.field && item.type) {
                    item = item.field + ':' + item.type.toString().toLowerCase();
                } else if (item.field) {
                    item = item.field;
                }

                items.push(item);
            }

            if (items.length > 0) {
                params.sort = items.toString();
            }
        } else {
            params.sort = params.sort.toString();
        }
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
        url += '?' + str;
    }

    //console.log(url);

    this.client.get(url, function(err, req, res, obj) {
        if (err) {
            return callback(err);
        }
        return callback(err, req, res, obj);
    });
};

