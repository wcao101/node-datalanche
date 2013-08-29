var async = require('async');
var csv = require('csv');
var dlanche = require('../lib');
var fs = require('fs');
var nconf = require('nconf');
var path = require('path');
var querystring = require('querystring');

//
// String extensions
//

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
};

String.prototype.endsWith = function(suffix) {
    return this.match(suffix + "$") == suffix;
};

//
// global variables
//

var numPassed = 0;
var client = null;

//
// helper functions
//

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
        return this.slice(0, str.length) == str;
    };
}

function isArray(value) {
    var s = typeof(value);
    if (value && s === 'object') {
        if (typeof(value.length) === 'number'
            && !(value.propertyIsEnumerable('length'))
            && typeof(value.splice) === 'function') {
            return true;
        }
    }
    return false;
}

function isObject(value) {
    return value && typeof value === 'object' && !isArray(value);
};

function addTests(tests, json) {
    for (var j = 0; j < json.tests.length; j++) {
        var test = json.tests[j];
        if (test.parameters.key === 'valid_key') {
            test.parameters.key = validKey;
        }
        if (test.parameters.secret === 'valid_secret') {
            test.parameters.secret = validSecret;
        }
        tests.push(json.tests[j]);
    }

    return tests;
}

function getRowsFromFile(filePath, callback) {
    var rows = [];

    csv()
    .from.path(filePath)
    .on('record', function(row, index) {
        if (index > 0) {
            rows.push({
                'record_id': row[0],
                'name': row[1],
                'email': row[2],
                'address': row[3],
                'city': row[4],
                'state': row[5],
                'zip_code': row[6],
                'phone_number': row[7],
                'date_field': row[8],
                'time_field': row[9],
                'timestamp_field': row[10],
                'boolean_field': row[11],
                'int16_field': row[12],
                'int32_field': row[13],
                'int64_field': row[14],
                'float_field': row[15],
                'double_field': row[16],
                'decimal_field': row[17],
            });
        }
    })
    .on('end', function(count) {
        return callback(rows);
    });
}

function handleResult(startTime, test, err, data, callback) {
    var diffTime = process.hrtime(startTime);
    diffTime = (diffTime[0] * 1e9 + diffTime[1]) / 1e6;

    var time = diffTime.toString() + ' ms';
    var result = 'FAIL';    
    var actual = {
        statusCode: '',
        exception: '',
        data: '',
    };

    if (err) {

        var message = err.body.message;

        // Postgres errors sometimes start with "Error:" or "error:". Not sure why.
        // We should be case-insenitive in this case, and match the definition in
        // the tests.
        if (message.startsWith('error:') === true) {
            message = message.replace('error:', 'Error:');
        }

        actual.statusCode = err.statusCode;
        actual.exception = err.body.code;
        actual.data = message;
    } else {
        actual.statusCode = 200;
        actual.data = data;
    }

    if (JSON.stringify(test.expected) === JSON.stringify(actual)) {
        result = 'PASS';
        numPassed++;
    } else {
        console.log(JSON.stringify(actual.data, null, '    '));
    }

    delete test.expected.data;
    delete actual.data;

    console.log(JSON.stringify({
        name: test.name,
        expected: test.expected,
        actual: actual,
        time: time,
        result: result,
    }));

    return callback(null);
}

function useRawQuery(keys, params) {
    var useRaw = false;
    for (k in params) {
        if (keys.indexOf(k) === -1) {
            useRaw = true;
            break;
        }
    }
    return useRaw;
}

// For testing unknown parameters. The API prevents users from adding
// unknown parameters so we need to circumvent it.
function queryRaw(type, url, params, callback) {

    client._httpClient.basicAuth(client._key, client._secret);

    if (type === 'del') {
        // URL encode parameters
        var str = querystring.stringify(params);
        if (str) {
            url += '?' + str;
        }

        client._httpClient.del(url, function(err, req, res, obj) {
            var result = client._getDebugInfo(req, res);
            result.data = obj;
            return callback(err, result);
        });
    } else if (type === 'post') {
        client._httpClient.post(url, params, function(err, req, res, obj) {
            req.body = params;
            var result = client._getDebugInfo(req, res);
            result.data = obj;
            return callback(err, result);
        });
    } else if (type === 'get') {
        // URL encode parameters
        var str = querystring.stringify(params);
        if (str) {
            url += '?' + str;
        }

        client._httpClient.get(url, function(err, req, res, obj) {
            var result = client._getDebugInfo(req, res);
            result.data = obj;
            return callback(err, result);
        });
    } else {
        return callback(new Error('unsupported query type'), null);
    }
}

//
// API functions
//

function alterTable(test, callback) {

    var params = test.parameters;
    var keys = [
        'name',
        'rename',
        'description',
        'is_private',
        'license',
        'sources',
        'add_columns',
        'drop_columns',
        'alter_columns',
    ];

    client.key(params.key);
    client.secret(params.secret);

    // Delete key and secret from params. They can screw up
    // raw query test and client's auth has already been set to them.
    delete params.key;
    delete params.secret;

    var useRaw = useRawQuery(keys, params);
    
    if (useRaw === true) {

        var time = process.hrtime();
        queryRaw('post', '/alter_table', params, function(err, result) {
            return handleResult(time, test, err, null, callback);
        });

    } else {

        var q = new dlanche.Query();
        q.alterTable(params.name);
        q.rename(params.rename);
        q.description(params.description);
        q.isPrivate(params.is_private);
        q.license(params.license);
        q.sources(params.sources);

        if (isArray(params.add_columns) === true) {
            for (var i = 0; i < params.add_columns.length; i++) {
                q.addColumn(params.add_columns[i]);
            }
        } else {
            // bypass functions to test invalid types
            q.params.addColumns = params.add_columns;
        }

        if (isArray(params.drop_columns) === true) {
            for (var i = 0; i < params.drop_columns.length; i++) {
                q.dropColumn(params.drop_columns[i]);
            }
        } else {
            // bypass functions to test invalid types
            q.params.dropColumns = params.drop_columns;
        }

        if (isObject(params.alter_columns) === true && Object.keys(params.alter_columns).length > 0) {
            for (var key in params.alter_columns) {
                q.alterColumn(key, params.alter_columns[key]);
            }
        } else {
            // bypass functions to test invalid types
            q.params.alterColumns = params.alter_columns;
        }

        var time = process.hrtime();
        client.query(q, function(err, result) {
            return handleResult(time, test, err, null, callback);
        });
    }
}

function createTable(test, callback) {

    var params = test.parameters;
    var keys = [
        'name',
        'description',
        'is_private',
        'license',
        'sources',
        'columns',
    ];

    client.key(params.key);
    client.secret(params.secret);

    // Delete key and secret from params. They can screw up
    // raw query test and client's auth has already been set to them.
    delete params.key;
    delete params.secret;

    var useRaw = useRawQuery(keys, params);
    
    if (useRaw === true) {

        var time = process.hrtime();
        queryRaw('post', '/create_table', params, function(err, result) {
            return handleResult(time, test, err, null, callback);
        });

    } else {

        var q = new dlanche.Query();
        q.createTable(params.name);
        q.description(params.description);
        q.isPrivate(params.is_private);
        q.license(params.license);
        q.sources(params.sources);
        q.columns(params.columns);

        var time = process.hrtime();
        client.query(q, function(err, result) {
            return handleResult(time, test, err, null, callback);
        });
    }
}

function dropTable(test, callback) {

    var params = test.parameters;
    var keys = [ 'name' ];

    client.key(params.key);
    client.secret(params.secret);

    // Delete key and secret from params. They can screw up
    // raw query test and client's auth has already been set to them.
    delete params.key;
    delete params.secret;

    var useRaw = useRawQuery(keys, params);
    
    if (useRaw === true) {

        var time = process.hrtime();
        queryRaw('del', '/drop_table', params, function(err, result) {
            return handleResult(time, test, err, null, callback);
        });

    } else {

        var q = new dlanche.Query();
        q.dropTable(params.name);

        var time = process.hrtime();
        client.query(q, function(err, result) {
            return handleResult(time, test, err, null, callback);
        });
    }
}

function deleteFrom(test, callback) {

    var params = test.parameters;
    var keys = [ 'name', 'where' ];

    client.key(params.key);
    client.secret(params.secret);

    // Delete key and secret from params. They can screw up
    // raw query test and client's auth has already been set to them.
    delete params.key;
    delete params.secret;

    var useRaw = useRawQuery(keys, params);
    
    if (useRaw === true) {

        var time = process.hrtime();
        queryRaw('post', '/delete_from', params, function(err, result) {
            return handleResult(time, test, err, null, callback);
        });

    } else {

        var q = new dlanche.Query();
        q.deleteFrom(params.name).where(params.where);

        var time = process.hrtime();
        client.query(q, function(err, result) {
            return handleResult(time, test, err, null, callback);
        });
    }
}

function getTableList(test, callback) {

    var params = test.parameters;
    var keys = [];

    client.key(params.key);
    client.secret(params.secret);

    // Delete key and secret from params. They can screw up
    // raw query test and client's auth has already been set to them.
    delete params.key;
    delete params.secret;

    var useRaw = useRawQuery(keys, params);
    
    if (useRaw === true) {

        var time = process.hrtime();
        queryRaw('get', '/get_table_list', params, function(err, result) {

            // getTableList() test is a bit different than the rest
            // because a server can have any number of tables. We test
            // that the expected table(s) is listed rather than
            // checking the entire result is valid, but only if a valid
            // response is expected.
            if (test.expected.statusCode === 200) {

                var tables = [];
                
                for (var i = 0; i < result.data.num_tables; i++) {
                    var table = result.data.tables[i];

                    // too variable to test
                    delete table.last_updated;
                    delete table.when_created;

                    for (var j = 0; j < test.expected.data.num_tables; j++) {
                        if (JSON.stringify(table) === JSON.stringify(test.expected.data.tables[j])) {
                            tables.push(table);
                            break;
                        }
                    }
                }

                result.data.num_tables = tables.length;
                result.data.tables = tables;
            }

            return handleResult(time, test, err, result.data, callback);
        });

    } else {

        var q = new dlanche.Query();
        q.getTableList();

        var time = process.hrtime();
        client.query(q, function(err, result) {

            // getTableList() test is a bit different than the rest
            // because a server can have any number of tables. We test
            // that the expected table(s) is listed rather than
            // checking the entire result is valid, but only if a valid
            // response is expected.
            if (test.expected.statusCode === 200) {

                var tables = [];
                
                for (var i = 0; i < result.data.num_tables; i++) {
                    var table = result.data.tables[i];

                    // too variable to test
                    delete table.last_updated;
                    delete table.when_created;

                    for (var j = 0; j < test.expected.data.num_tables; j++) {
                        if (JSON.stringify(table) === JSON.stringify(test.expected.data.tables[j])) {
                            tables.push(table);
                            break;
                        }
                    }
                }

                result.data.num_tables = tables.length;
                result.data.tables = tables;
            }

            return handleResult(time, test, err, result.data, callback);
        });
    }
}

function getTableInfo(test, callback) {

    var params = test.parameters;
    var keys = [ 'name' ];

    client.key(params.key);
    client.secret(params.secret);

    // Delete key and secret from params. They can screw up
    // raw query test and client's auth has already been set to them.
    delete params.key;
    delete params.secret;

    var useRaw = useRawQuery(keys, params);
    
    if (useRaw === true) {

        var time = process.hrtime();
        queryRaw('get', '/get_table_info', params, function(err, result) {

            // Delete date/time properties since they are probably
            // different than the test data. This is okay because
            // the server sets these values on write operations.
            delete result.data.when_created;
            delete result.data.last_updated;

            return handleResult(time, test, err, result.data, callback);
        });

    } else {

        var q = new dlanche.Query();
        q.getTableInfo(params.name);

        var time = process.hrtime();
        client.query(q, function(err, result) {

            // Delete date/time properties since they are probably
            // different than the test data. This is okay because
            // the server sets these values on write operations.
            delete result.data.when_created;
            delete result.data.last_updated;

            return handleResult(time, test, err, result.data, callback);
        });
    }
}

function insertInto(test, callback) {

    var params = test.parameters;
    var keys = [ 'name', 'values' ];

    client.key(params.key);
    client.secret(params.secret);

    // Delete key and secret from params. They can screw up
    // raw query test and client's auth has already been set to them.
    delete params.key;
    delete params.secret;

    var useRaw = useRawQuery(keys, params);
    
    if (useRaw === true) {

        var time = process.hrtime();
        queryRaw('post', '/insert_into', params, function(err, result) {
            return handleResult(time, test, err, null, callback);
        });

    } else {

        var q = new dlanche.Query();
        q.insertInto(params.name);

        if (params.values === 'dataset_file') {
            getRowsFromFile(testDatasetPath, function(rows) {
                q.values(rows);

                var time = process.hrtime();
                client.query(q, function(err, result) {
                    return handleResult(time, test, err, null, callback);
                });
            });
        } else {
            q.values(params.values);

            var time = process.hrtime();
            client.query(q, function(err, result) {
                return handleResult(time, test, err, null, callback);
            });
        }
    }
}

function selectFrom(test, callback) {

    var params = test.parameters;
    var keys = [
        'select',
        'distinct',
        'from',
        'where',
        'group_by',
        'order_by',
        'offset',
        'limit',
        'total',
    ];

    client.key(params.key);
    client.secret(params.secret);

    // Delete key and secret from params. They can screw up
    // raw query test and client's auth has already been set to them.
    delete params.key;
    delete params.secret;

    var useRaw = useRawQuery(keys, params);
    
    if (useRaw === true) {

        var time = process.hrtime();
        queryRaw('post', '/select_from', params, function(err, result) {
            return handleResult(time, test, err, result.data, callback);
        });

    } else {

        var q = new dlanche.Query();
        q.select(params.select);
        q.distinct(params.distinct);
        q.from(params.from);
        q.where(params.where);
        q.groupBy(params.group_by);
        q.orderBy(params.order_by);
        q.offset(params.offset);
        q.limit(params.limit);
        q.total(params.total);

        var time = process.hrtime();
        client.query(q, function(err, result) {
            return handleResult(time, test, err, result.data, callback);
        });
    }
}

function update(test, callback) {

    var params = test.parameters;
    var keys = [ 'name', 'set', 'where' ];

    client.key(params.key);
    client.secret(params.secret);

    // Delete key and secret from params. They can screw up
    // raw query test and client's auth has already been set to them.
    delete params.key;
    delete params.secret;

    var useRaw = useRawQuery(keys, params);
    
    if (useRaw === true) {

        var time = process.hrtime();
        queryRaw('post', '/update', params, function(err, result) {
            return handleResult(time, test, err, null, callback);
        });

    } else {

        var q = new dlanche.Query();
        q.update(params.name);
        q.set(params.set);
        q.where(params.where);

        var time = process.hrtime();
        client.query(q, function(err, result) {
            return handleResult(time, test, err, null, callback);
        });
    }
}

function execute(test, callback) {

    if (test.method === 'alter_table') {
        return alterTable(test, callback);
    }

    if (test.method === 'create_table') {
        return createTable(test, callback);
    }

    if (test.method === 'delete_from') {
        return deleteFrom(test, callback);
    }

    if (test.method === 'drop_table') {
        return dropTable(test, callback);
    }

    if (test.method === 'get_table_info') {
        return getTableInfo(test, callback);
    }

    if (test.method === 'get_table_list') {
        return getTableList(test, callback);
    }

    if (test.method === 'insert_into') {
        return insertInto(test, callback);
    }

    if (test.method === 'select_from') {
        return selectFrom(test, callback);
    }

    if (test.method === 'update') {
        return update(test, callback);
    }

    return callback(new Error(test.method + ' method not found'));
}

// load arguments
// node test.js --key API_KEY --testdir JSON_TEST_FILES_DIR

nconf.use('memory');
nconf.env().argv();

var testFile = nconf.get('testfile');
var validKey = nconf.get('key') || '';
var validSecret = nconf.get('secret') || '';
var host = nconf.get('host') || null;
var port = nconf.get('port') || null;
var ssl = nconf.get('ssl') || null;
var suite = nconf.get('suite') || 'all';
var testDatasetPath = null;
var rootDir = '';

if (ssl) {
    ssl = ssl.toLowerCase();
    if (ssl === 'false' || ssl === 0) {
        ssl = false;
    } else if (ssl === 'true' || ssl === 1) {
        ssl = true;
    } else {
        ssl = null;
    }
}

// load tests
var tests = [];
var contents = JSON.parse(fs.readFileSync(testFile, 'utf8'));

rootDir = path.dirname(testFile);
testDatasetPath = rootDir + '/' + contents.dataset_file;

for (var i = 0; i < contents.suites[suite].length; i++) {
    var json = JSON.parse(fs.readFileSync(rootDir + '/' + contents.suites[suite][i], 'utf8'));
    tests = addTests(tests, json);
}

// create client
client = new dlanche.Client({
    key: validKey,
    secret: validSecret,
    host: host,
    port: port,
    verifySsl: ssl,
});

var q = new dlanche.Query();

// make sure table is deleted before running test
client.query(q.dropTable('test_dataset'), function(err) {
    if (err) {
        //console.log(err);
        // ignore error
    }

    client.query(q.dropTable('new_test_dataset'), function(err) {
        if (err) {
            //console.log(err);
            // ignore error
        }

        // loop through tests and execute them
        async.forEachSeries(tests, execute, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('-------------------------------');
                console.log('passed: ' + numPassed.toString());
                console.log('failed: ' + (tests.length - numPassed).toString());
                console.log('total:  ' + tests.length.toString());
            }
            return client.close();
        });
    });
});
