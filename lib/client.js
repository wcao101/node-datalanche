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

    var body = {};

    if (!query) {
        return body;
    }

    if (query.baseUrl === '/alter_table') {

        if (query.params.addColumns !== null) {
            body.add_columns = query.params.addColumns;
        }
        if (query.params.alterColumns !== null) {
            body.alter_columns = query.params.alterColumns;
        }
        if (query.params.name !== null) {
            body.name = query.params.name;
        }
        if (query.params.description !== null) {
            body.description = query.params.description;
        }
        if (query.params.dropColumns !== null) {
            body.drop_columns = query.params.dropColumns;
        }
        if (query.params.isPrivate !== undefined && query.params.isPrivate !== null) {
            body.is_private = query.params.isPrivate;
        }
        if (query.params.license !== null) {
            body.license = query.params.license;
        }
        if (query.params.rename !== null) {
            body.rename = query.params.rename;
        }
        if (query.params.sources !== null) {
            body.sources = query.params.sources;
        }

    } else if (query.baseUrl === '/create_table') {

        if (query.params.columns !== null) {
            body.columns = query.params.columns;
        }
        if (query.params.name !== null) {
            body.name = query.params.name;
        }
        if (query.params.description !== null) {
            body.description = query.params.description;
        }
        if (query.params.isPrivate !== undefined && query.params.isPrivate !== null) {
            body.is_private = query.params.isPrivate;
        }
        if (query.params.license !== null) {
            body.license = query.params.license;
        }
        if (query.params.sources !== null) {
            body.sources = query.params.sources;
        }

    } else if (query.baseUrl === '/delete_from') {

        if (query.params.name !== null) {
            body.name = query.params.name;
        }
        if (query.params.where !== null) {
            body.where = query.params.where;
        }

    } else if (query.baseUrl === '/insert_into') {

        if (query.params.name !== null) {
            body.name = query.params.name;
        }
        if (query.params.values !== null) {
            body.values = query.params.values;
        }

    } else if (query.baseUrl === '/select_from') {

        if (query.params.distinct !== undefined && query.params.distinct !== null) {
            body.distinct = query.params.distinct;
        }
        if (query.params.from !== null) {
            body.from = query.params.from;
        }
        if (query.params.groupBy !== null) {
            body.group_by = query.params.groupBy;
        }
        if (query.params.limit !== undefined && query.params.limit !== null) {
            body.limit = query.params.limit;
        }
        if (query.params.offset !== undefined && query.params.offset !== null) {
            body.offset = query.params.offset;
        }
        if (query.params.orderBy !== null) {
            body.order_by = query.params.orderBy;
        }
        if (query.params.select !== null) {
            body.select = query.params.select;
        }
        if (query.params.total !== undefined && query.params.total !== null) {
            body.total = query.params.total;
        }
        if (query.params.where !== null) {
            body.where = query.params.where;
        }

    } else if (query.baseUrl === '/update') {

        if (query.params.name !== null) {
            body.name = query.params.name;
        }
        if (query.params.set !== null) {
            body.set = query.params.set;
        }
        if (query.params.where !== null) {
            body.where = query.params.where;
        }
    }

    return body;
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

    if (url === '/drop_table') {

        if (query.params.name !== null) {
            parameters.name = query.params.name;
        }

    } else if (url === '/get_table_info') {

        if (query.params.name !== null) {
            parameters.name = query.params.name;
        }

    } else if (url === '/get_table_list') {
        // do nothing
    }

    // URL encode parameters
    var str = querystring.stringify(parameters);
    if (str) {
        url += '?' + str;
    }

    return url;
}
