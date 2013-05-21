var async = require('async');
var dlanche = require('../lib');
var fs = require('fs');
var nconf = require('nconf');

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
// functions
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

function readRecords(test, callback) {

    client.authKey = test.parameters.key;
    client.authSecret = test.parameters.secret;

    // readRecords() does not care about these, remove them
    delete test.parameters.key;
    delete test.parameters.secret;

    var time = process.hrtime();
    client.readRecords(test.parameters, function(err, data) {
        return handleResult(time, test, err, data, callback);
    });
}

function execute(test, callback) {

    if (test.method === 'create_dataset') {
        return createDataset(test, callback);
    }

    if (test.method === 'delete_dataset') {
        return deleteDataset(test, callback);
    }

    if (test.method === 'get_dataset_list') {
        return getDatasetList(test, callback);
    }

    if (test.method === 'get_schema') {
        return getSchema(test, callback);
    }

    if (test.method === 'read') {
        return readRecords(test, callback);
    }

    return callback(new Error(test.method + ' method not found'));
}

// load arguments
// node test.js --key API_KEY --testdir JSON_TEST_FILES_DIR

nconf.use('memory');
nconf.env().argv();

var rootDir = nconf.get('testdir');
var validKey = nconf.get('key') || '';
var validSecret = nconf.get('secret') || '';
var testFile = nconf.get('testfile') || '';
var host = nconf.get('host') || null;
var port = nconf.get('port') || null;
var ssl = nconf.get('ssl') || null;

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

if (testFile === '') {
    var testFiles = JSON.parse(fs.readFileSync(rootDir + '/test-list.json', 'utf8'));
    for (var i = 0; i < testFiles.tests.length; i++) {
        var json = JSON.parse(fs.readFileSync(rootDir + '/' + testFiles.tests[i], 'utf8'));
        tests = addTests(tests, json);
    }
} else {
    var json = JSON.parse(fs.readFileSync(testFile, 'utf8'));
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
