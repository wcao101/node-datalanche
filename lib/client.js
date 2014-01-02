var events = require('events');
var request = require('request');
var util = require('util');
var zlib = require('zlib');

// constructor

function Client(params) {

    events.EventEmitter.call(this);

    this._key = '';
    this._secret = '';
    this._baseUrl = 'https://api.datalanche.com';
    this._verifySsl = true;

    if (params) {
        if (params.host !== undefined && params.host !== null) {
            this._baseUrl = 'https://' + params.host;
        }

        if (params.port !== undefined && params.port !== null) {
            this._baseUrl += ':' + params.port.toString();
        }

        if (params.verifySsl !== undefined && params.verifySsl !== null) {
            this._verifySsl = params.verifySsl;
        }

        if (params.key !== undefined && params.key !== null) {
            this._key = params.key;
        }

        if (params.secret !== undefined && params.secret !== null) {
            this._secret = params.secret;
        }
    }
}
util.inherits(Client, events.EventEmitter);
module.exports = Client;

//
// PUBLIC METHODS
//

Client.prototype.key = function(key) {
    this._key = key;
};

// callback has form: function(error, result)
Client.prototype.query = function(q, callback) {

    var startTime = process.hrtime();

    if (!q) {
        return callback(new Error('query is null'));
    }

    var self = this;

    var url = '/query';
    if (q.params.database !== undefined && q.params.database !== null) {
        url = '/' + encodeURIComponent(q.params.database.toString()) + url;
        delete q.params.database;
    }

    var body = {};
    if (q.params) {
        body = q.params;
    }

    request.post({
        url: self._baseUrl + url,
        auth: {
            user: self._key,
            pass: self._secret,
            sendImmediately: true,
        },
        headers: {
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/json',
            'User-Agent': 'Datalanche Node.js Client',
        },
        encoding: null,
        body: JSON.stringify(body),
        strictSSL: self._verifySsl,
    },
    function(err, res, resBody) {

        var diffTime = process.hrtime(startTime);
        diffTime = (diffTime[0] * 1e9 + diffTime[1]) / 1e6; // convert to ms

        if (err) {
            return callback(err);
        }

        if (resBody !== undefined && resBody !== null) {

            if (res.headers['content-encoding'] === 'gzip') {
                zlib.gunzip(resBody, function(err, unzipBody) {
                    if (err) {
                        return callback(err);
                    }
                    unzipBody = JSON.parse(unzipBody);
                    return self._handleResult(res.request, res, unzipBody, diffTime, callback);
                });
            } else {
                resBody = JSON.parse(resBody.toString());
                return self._handleResult(res.request, res, resBody, diffTime, callback);
            }

        } else {
            resBody = null;
            return self._handleResult(res.request, res, resBody, diffTime, callback);
        }
    });
};

Client.prototype.secret = function(secret) {
    this._secret = secret;
};

//
// PRIVATE METHODS
//

// Don't need to add res.body to response since already returned to user.
Client.prototype._getDebugInfo = function(req, res, queryTime) {

    var request = null;
    var response = null;

    if (req) {

        var reqBody = null;
        if (req.body) {
            reqBody = JSON.parse(req.body.toString());
        }

        request = {
            method: req.method,
            url: req.href,
            headers: req.headers,
            body: reqBody,
        };
    }

    if (res) {
        response = {
            http_status: res.statusCode,
            http_version: res.httpVersion,
            headers: res.headers,
            time_in_ms: queryTime,
        };
    }

    return {
        request: request,
        response: response,

    };
};

Client.prototype._handleResult = function(req, res, resBody, queryTime, callback) {

    var result = this._getDebugInfo(res.request, res, queryTime);

    if (res.statusCode < 200 || res.statusCode >= 300) {
        result.response.body = resBody;
        result.status_code = result.response.http_status;
        result.error_message = resBody.message;
        result.error_tyoe = resBody.code;
        return callback(result);
    } else {
        result.data = resBody;
        return callback(null, result);
    }
};
