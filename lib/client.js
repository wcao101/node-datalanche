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

    var body = {};
    if (q.params) {
        body = q.params;
    }

    self._httpClient.post(q.url, body, function(err, req, res, resBody) {

        req.body = body;
        var result = self._getDebugInfo(req, res);
        result.data = resBody;

        return callback(err, result);
    });
};

Client.prototype.secret = function(secret) {
    this._secret = secret;
};

//
// PRIVATE METHODS
//

// Don't need to add res.body to response since already returned to user.
Client.prototype._getDebugInfo = function(req, res) {

    var request = null;
    var response = null;

    if (req) {
        request = {
            method: req.method,
            url: 'https://' + req._headers.host + req.path,
            headers: req._headers,
            body: req.body || null,
        };
    }

    if (res) {
        response = {
            http_status: res.statusCode,
            http_version: res.httpVersion,
            headers: res.headers,
        };
    }

    return {
        request: request,
        response: response,
    };
}
