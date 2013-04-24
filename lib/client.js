var events = require('events');
var querystring = require('querystring');
var restify = require('restify');
var util = require('util');

// constructor

function Client(params) {

    events.EventEmitter.call(this);

    var host = 'api.datalanche.com';
    var port = null;
    var verifySsl = true;

    if (params && params.host !== null) {
        host = params.host;
    }

    if (params && params.port !== null) {
        port = params.port;
    }

    if (params && params.verifySsl !== null) {
        verifySsl = params.verifySsl;
    }

    var url = 'https://' + host;
    if (port) {
        url += ':' + port.toString();
    }

    this.authKey = '';
    if (params && params.key !== null) {
        this.authKey = params.key;
    }

    this.authSecret = '';
    if (params && params.secret !== null) {
        this.authSecret = params.secret;
    }

    this.client = restify.createJsonClient({
        headers: {
            'Accept-Encoding': 'gzip',
        },
        rejectUnauthorized: verifySsl,
        url: url,
        version: '*',
    });
}
util.inherits(Client, events.EventEmitter);
module.exports = Client;

// methods

Client.prototype.getList = function(callback) {

    var url = '/list';

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.get(url, function(err, req, res, obj) {
        if (err) {
            return callback(err);
        }
        return callback(err, req, res, obj);
    });
};

Client.prototype.getSchema = function(dataSetName, callback) {

    var url = '/schema';
    url += '?dataset=' + querystring.escape(dataSetName);

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.get(url, function(err, req, res, obj) {
        if (err) {
            return callback(err);
        }
        return callback(err, req, res, obj);
    });
};

Client.prototype.read = function(params, callback) {

    var url = '/read';

    if (params.dataset) {
        params.dataset = params.dataset.toString();
    }

    if (params.sort) {

        if (Array.isArray(params.sort) === true) {

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

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.get(url, function(err, req, res, obj) {
        if (err) {
            return callback(err);
        }
        return callback(err, req, res, obj);
    });
};

