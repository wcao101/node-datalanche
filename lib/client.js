var events = require('events');
var querystring = require('querystring');
var restify = require('restify');
var util = require('util');

// constructor

function Client(params) {

    events.EventEmitter.call(this);

    this._key = '';
    this._secret = '';

    var host = 'api.datalanche.com';
    var port = null;
    var verifySsl = true;

    if (params) {
        if (params.host !== undefined && params.host !== null) {
            host = params.host;
        }

        if (params.port !== undefined && params.port !== null) {
            port = params.port;
        }

        if (params.verifySsl !== undefined && params.verifySsl !== null) {
            verifySsl = params.verifySsl;
        }

        if (params.key !== undefined && params.key !== null) {
            this._key = params.key;
        }

        if (params.secret !== undefined && params.secret !== null) {
            this._secret = params.secret;
        }
    }

    var url = 'https://' + host;
    if (port) {
        url += ':' + port.toString();
    }

    this._httpClient = restify.createJsonClient({
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

//
// PUBLIC METHODS
//

Client.prototype.close = function() {
    this._httpClient.close();
};

Client.prototype.key = function(key) {
    this._key = key;
};

// callback has form: function(error, result)
Client.prototype.query = function(q, callback) {

    if (!q) {
        return callback(new Error('query is null'), null);
    }

    var self = this;

    self._httpClient.basicAuth(self._key, self._secret);

    if (q.urlType === 'del') {

        this._httpClient.del(self._getUrl(q), function(err, req, res, obj) {
            var result = self._getDebugInfo(req, res);
            result.data = obj;
            return callback(err, result);
        });

    } else if (q.urlType === 'post') {

        var body = this._getBody(q);
        self._httpClient.post(self._getUrl(q), body, function(err, req, res, obj) {
            req.body = body;
            var result = self._getDebugInfo(req, res);
            result.data = obj;
            return callback(err, result);
        });

    } else if (q.urlType === 'get') {

        self._httpClient.get(self._getUrl(q), function(err, req, res, obj) {
            var result = self._getDebugInfo(req, res);
            result.data = obj;
            return callback(err, result);
        });

    } else {
        return callback(new Error('unsupported query type'), null);
    }
};

Client.prototype.secret = function(secret) {
    this._secret = secret;
};

//
// PRIVATE METHODS
//

// For POST, all parameters are in the body so that they are also encrypted.
// For example, the WHERE clause may have unique identifiers, plain-text
// passwords, and other potential sensitive information.
Client.prototype._getBody = function(query) {

    if (!query) {
        return {};
    }

    return query.params;
}

// Don't need to add res.body to response since already returned to user.
Client.prototype._getDebugInfo = function(req, res) {

    return {
        request: {
            method: req.method,
            url: 'https://' + req._headers.host + req.path,
            headers: req._headers,
            body: req.body || null,
        },
        response: {
            http_status: res.statusCode,
            http_version: res.httpVersion,
            headers: res.headers,
        },
    };
}

// For POST, all parameters are in the body so that they are also encrypted.
// For example, the WHERE clause may have unique identifiers, plain-text
// passwords, and other potentially sensitive information.
Client.prototype._getUrl = function(query) {

    if (!query) {
        return '/';
    }

    var url = query.baseUrl;
    var parameters = {};

    switch (url) {
        case '/drop_table':
        case '/get_table_info':
        case '/get_table_list':
            parameters = query.params;
            break;
        default:
            break;
    }

    // remove undefined parameters

    for (var key in parameters) {
        if (parameters[key] === undefined) {
            delete parameters[key];
        }
    }

    // URL encode parameters

    var str = querystring.stringify(parameters);
    if (str) {
        url += '?' + str;
    }

    return url;
}
