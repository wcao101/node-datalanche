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

Client.prototype.addFields = function(datasetName, fields, callback) {

    var url = '/add_fields';

    var params = {
        dataset: datasetName,
    };

    if (params.dataset) {
        params.dataset = params.dataset.toString();
    }

    // URL encode parameters
    var str = querystring.stringify(params);
    if (str) {
        url += '?' + str;
    }

    var body = {
        num_fields: fields.length,
        fields: fields,
    };

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.post(url, body, function(err, req, res, obj) {
        return callback(err);
    });
};

Client.prototype.close = function() {
    this.client.close();
};

Client.prototype.createDataset = function(schema, callback) {

    var url = '/create_dataset';

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.post(url, schema, function(err, req, res, obj) {
        return callback(err);
    });
};

Client.prototype.deleteDataset = function(datasetName, callback) {

    var url = '/delete_dataset';

    var params = {
        dataset: datasetName,
    };

    if (params.dataset) {
        params.dataset = params.dataset.toString();
    }

    // URL encode parameters
    var str = querystring.stringify(params);
    if (str) {
        url += '?' + str;
    }

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.del(url, function(err, req, res, obj) {
        return callback(err);
    });
};

Client.prototype.deleteRecords = function(datasetName, filter, callback) {

    var url = '/delete_records';

    var params = {
        dataset: datasetName,
        filter: filter,
    };

    if (params.dataset) {
        params.dataset = params.dataset.toString();
    }

    if (params.filter) {
        params.filter = JSON.stringify(params.filter);
    }

    // URL encode parameters
    var str = querystring.stringify(params);
    if (str) {
        url += '?' + str;
    }

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.del(url, function(err, req, res, obj) {
        return callback(err);
    });
};

Client.prototype.getDatasetList = function(callback) {

    var url = '/get_dataset_list';

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.get(url, function(err, req, res, obj) {
        return callback(err, obj);
    });
};

Client.prototype.getSchema = function(datasetName, callback) {

    var url = '/get_schema';

    var params = {
        dataset: datasetName,
    };

    if (params.dataset) {
        params.dataset = params.dataset.toString();
    }

    // URL encode parameters
    var str = querystring.stringify(params);
    if (str) {
        url += '?' + str;
    }

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.get(url, function(err, req, res, obj) {
        return callback(err, obj);
    });
};

Client.prototype.insertRecords = function(datasetName, records, callback) {

    var url = '/insert_records';

    var params = {
        dataset: datasetName,
    };

    if (params.dataset) {
        params.dataset = params.dataset.toString();
    }

    // URL encode parameters
    var str = querystring.stringify(params);
    if (str) {
        url += '?' + str;
    }

    var body = {
        num_records: records.length,
        records: records,
    };

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.post(url, body, function(err, req, res, obj) {
        return callback(err);
    });
};

Client.prototype.readRecords = function(params, callback) {

    var url = '/read_records';

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
        return callback(err, obj);
    });
};

Client.prototype.removeFields = function(datasetName, fields, callback) {

    var url = '/remove_fields';

    var params = {
        dataset: datasetName,
        fields: fields,
    };

    if (params.dataset) {
        params.dataset = params.dataset.toString();
    }

    if (params.fields) {
        params.fields = params.fields.toString();
    }

    // URL encode parameters
    var str = querystring.stringify(params);
    if (str) {
        url += '?' + str;
    }

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.del(url, function(err, req, res, obj) {
        return callback(err);
    });
};

Client.prototype.setSchema = function(datasetName, schema, callback) {

    var url = '/set_schema';

    var params = {
        dataset: datasetName,
    };

    if (params.dataset) {
        params.dataset = params.dataset.toString();
    }

    // URL encode parameters
    var str = querystring.stringify(params);
    if (str) {
        url += '?' + str;
    }

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.post(url, schema, function(err, req, res, obj) {
        return callback(err);
    });
};

Client.prototype.updateFields = function(datasetName, fields, callback) {

    var url = '/update_fields';

    var params = {
        dataset: datasetName,
    };

    if (params.dataset) {
        params.dataset = params.dataset.toString();
    }

    // URL encode parameters
    var str = querystring.stringify(params);
    if (str) {
        url += '?' + str;
    }

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.post(url, fields, function(err, req, res, obj) {
        return callback(err);
    });
};

Client.prototype.updateRecords = function(datasetName, records, filter, callback) {

    var url = '/update_records';

    var params = {
        dataset: datasetName,
        filter: filter,
    };

    if (params.dataset) {
        params.dataset = params.dataset.toString();
    }

    if (params.filter) {
        params.filter = JSON.stringify(params.filter);
    }

    // URL encode parameters
    var str = querystring.stringify(params);
    if (str) {
        url += '?' + str;
    }

    this.client.basicAuth(this.authKey, this.authSecret);

    this.client.post(url, records, function(err, req, res, obj) {
        return callback(err);
    });
};
