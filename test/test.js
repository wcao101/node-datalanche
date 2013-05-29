var async = require('async');
var csv = require('csv');
var dlanche = require('../lib');
var fs = require('fs');
var nconf = require('nconf');
var path = require('path');

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

function getRecordsFromFile(filePath, callback) {
    var records = [];

    csv()
    .from.path(filePath)
    .on('record', function(row, index) {
        if (index > 0) {
            records.push({
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
        return callback(records);
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
        actual.statusCode = err.statusCode;
        actual.exception = err.body.code;
        actual.data = err.body.message;
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

//
// API functions
//

function addColumns(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    var time = process.hrtime();
    client.addColumns(test.parameters.dataset, test.body.columns, function(err) {
        return handleResult(time, test, err, null, callback);
    });
}

function createDataset(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    var time = process.hrtime();
    client.createDataset(test.body, function(err) {
        return handleResult(time, test, err, null, callback);
    });
}

function deleteDataset(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    var time = process.hrtime();
    client.deleteDataset(test.parameters.dataset, function(err) {
        return handleResult(time, test, err, null, callback);
    });
}

function deleteRecords(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    var time = process.hrtime();
    client.deleteRecords(test.parameters.dataset, test.parameters.filter, function(err) {
        return handleResult(time, test, err, null, callback);
    });
}

function getDatasetList(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    var time = process.hrtime();
    client.getDatasetList(function(err, list) {

        // getDatasetList() test is a bit different than the rest
        // because a server can have any number of datasets. We test
        // that the expected dataset(s) is listed rather than
        // checking the entire result is valid, but only if a valid
        // response is expected.

        if (test.expected.statusCode === 200) {

            var datasets = [];
            
            for (var i = 0; i < list.num_datasets; i++) {
                var dataset = list.datasets[i];

                for (var j = 0; j < test.expected.data.num_datasets; j++) {
                    if (JSON.stringify(dataset) === JSON.stringify(test.expected.data.datasets[j])) {
                        datasets.push(dataset);
                        break;
                    }
                }
            }

            list.num_datasets = datasets.length;
            list.datasets = datasets;
        }

        return handleResult(time, test, err, list, callback);
    });
}

function getSchema(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    var time = process.hrtime();
    client.getSchema(test.parameters.dataset, function(err, data) {

        // Delete date/time properties since they are probably
        // different than the test data. This is okay because
        // the server sets these values on write operations.
        delete data.when_created;
        delete data.last_updated;

        return handleResult(time, test, err, data, callback);
    });
}

function insertRecords(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    if (test.body === 'dataset_file') {
        getRecordsFromFile(testDatasetPath, function(records) {
            var time = process.hrtime();
            client.insertRecords(test.parameters.dataset, records, function(err) {
                return handleResult(time, test, err, null, callback);
            });
        });
    } else {
        var time = process.hrtime();
        client.insertRecords(test.parameters.dataset, test.body.records, function(err) {
            return handleResult(time, test, err, null, callback);
        });
    }
}

function readRecords(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    var datasetName = test.parameters.dataset;

    // readRecords() does not care about these, remove them
    delete test.parameters.key;
    delete test.parameters.secret;
    delete test.parameters.dataset;

    var time = process.hrtime();
    client.readRecords(datasetName, test.parameters, function(err, data) {
        return handleResult(time, test, err, data, callback);
    });
}

function removeColumns(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    var time = process.hrtime();
    client.removeColumns(test.parameters.dataset, test.parameters.columns, function(err) {
        return handleResult(time, test, err, null, callback);
    });
}

function setDetails(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    var time = process.hrtime();
    client.setDetails(test.parameters.dataset, test.body, function(err) {
        return handleResult(time, test, err, null, callback);
    });
}

function updateColumns(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    var time = process.hrtime();
    client.updateColumns(test.parameters.dataset, test.body, function(err) {
        return handleResult(time, test, err, null, callback);
    });
}

function updateRecords(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    var time = process.hrtime();
    client.updateRecords(test.parameters.dataset, test.body, test.parameters.filter, function(err) {
        return handleResult(time, test, err, null, callback);
    });
}

function execute(test, callback) {

    if (test.method === 'add_columns') {
        return addColumns(test, callback);
    }

    if (test.method === 'create_dataset') {
        return createDataset(test, callback);
    }

    if (test.method === 'delete_dataset') {
        return deleteDataset(test, callback);
    }

    if (test.method === 'delete_records') {
        return deleteRecords(test, callback);
    }

    if (test.method === 'get_dataset_list') {
        return getDatasetList(test, callback);
    }

    if (test.method === 'get_schema') {
        return getSchema(test, callback);
    }

    if (test.method === 'insert_records') {
        return insertRecords(test, callback);
    }

    if (test.method === 'read_records') {
        return readRecords(test, callback);
    }

    if (test.method === 'remove_columns') {
        return removeColumns(test, callback);
    }

    if (test.method === 'set_details') {
        return setDetails(test, callback);
    }

    if (test.method === 'update_columns') {
        return updateColumns(test, callback);
    }

    if (test.method === 'update_records') {
        return updateRecords(test, callback);
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
client = dlanche.createClient({
    key: validKey,
    secret: validSecret,
    host: host,
    port: port,
    verifySsl: ssl,
});

// make sure dataset is deleted before running test
client.deleteDataset("test_dataset", function(err) {
    // ignore error

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
