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

//
// PUBLIC METHODS
//

Client.prototype.close = function() {
    this.client.close();
};

// callback has form: function(error, result)
Client.prototype.query = function(q, callback) {

    if (!q) {
        return callback(new Error('query is null'), null);
    }

    this.client.basicAuth(this.authKey, this.authSecret);

    if (q.urlType === 'del') {
        this.client.del(getUrl(q), function(err, req, res, obj) {
            return callback(err, null);
        });
    } else if (q.urlType === 'post') {
        this.client.post(getUrl(q), getBody(q), function(err, req, res, obj) {
            return callback(err, obj);
        });
    } else if (q.urlType === 'get') {
        this.client.get(getUrl(q), function(err, req, res, obj) {
            return callback(err, obj);
        });
    } else {
        return callback(new Error('unsupported query type'), null);
    }
};

//
// PRIVATE METHODS
//

// For POST, all parameters are in the body so that they are also encrypted.
// For example, the WHERE clause may have unique identifiers, plain-text
// passwords, and other potential sensitive information.
function getBody(query) {

    var body = {};

    if (!query) {
        return body;
    }

    if (query.params.debug !== undefined && query.params.debug !== null) {
        body.debug = query.params.debug;
    }

    if (query.baseUrl === '/alter_table') {

        if (query.params.addColumns) {
            body.add_columns = query.params.addColumns;
        }
        if (query.params.alterColumns) {
            body.alter_columns = query.params.alterColumns;
        }
        if (query.params.name) {
            body.name = query.params.name;
        }
        if (query.params.description) {
            body.description = query.params.description;
        }
        if (query.params.dropColumns) {
            body.drop_columns = query.params.dropColumns;
        }
        if (query.params.isPrivate !== undefined && query.params.isPrivate !== null) {
            body.is_private = query.params.isPrivate;
        }
        if (query.params.license) {
            body.license = query.params.license;
        }
        if (query.params.rename) {
            body.rename = query.params.rename;
        }
        if (query.params.sources) {
            body.sources = query.params.sources;
        }
    } else if (query.baseUrl === '/create_table') {

        if (query.params.columns) {
            body.columns = query.params.columns;
        }
        if (query.params.name) {
            body.name = query.params.name;
        }
        if (query.params.description) {
            body.description = query.params.description;
        }
        if (query.params.isPrivate !== undefined && query.params.isPrivate !== null) {
            body.is_private = query.params.isPrivate;
        }
        if (query.params.license) {
            body.license = query.params.license;
        }
        if (query.params.sources) {
            body.sources = query.params.sources;
        }

    } else if (query.baseUrl === '/delete_from') {

        if (query.params.name) {
            body.name = query.params.name;
        }
        if (query.params.where) {
            body.where = query.params.where;
        }

    } else if (query.baseUrl === '/insert_into') {

        if (query.params.name) {
            body.name = query.params.name;
        }
        if (query.params.values) {
            body.values = query.params.values;
        }

    } else if (query.baseUrl === '/select_from') {

        if (query.params.distinct !== undefined && query.params.distinct !== null) {
            body.distinct = query.params.distinct;
        }
        if (query.params.from) {
            body.from = query.params.from;
        }
        if (query.params.groupBy) {
            body.group_by = query.params.groupBy;
        }
        if (query.params.limit !== undefined && query.params.limit !== null) {
            body.limit = query.params.limit;
        }
        if (query.params.offset !== undefined && query.params.offset !== null) {
            body.offset = query.params.offset;
        }
        if (query.params.orderBy) {
            body.order_by = query.params.orderBy;
        }
        if (query.params.select) {
            body.select = query.params.select;
        }
        if (query.params.total !== undefined && query.params.total !== null) {
            body.total = query.params.total;
        }
        if (query.params.where) {
            body.where = query.params.where;
        }

    } else if (query.baseUrl === '/update') {

        if (query.params.name) {
            body.name = query.params.name;
        }
        if (query.params.set) {
            body.set = query.params.set;
        }
        if (query.params.where) {
            body.where = query.params.where;
        }
    }

    return body;
}

// For POST, all parameters are in the body so that they are also encrypted.
// For example, the WHERE clause may have unique identifiers, plain-text
// passwords, and other potentially sensitive information.
function getUrl(query) {

    if (!query) {
        return '/';
    }

    var url = query.baseUrl;
    var parameters = {};

    if (query.params.debug !== undefined && query.params.debug !== null) {
        parameters.debug = query.params.debug;
    }

    if (url === '/drop_table') {
        if (query.params.name) {
            parameters.name = query.params.name;
        }
    } else if (url === '/get_table_info') {
        if (query.params.name) {
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
