//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var async = require('async');
var dlanche = require('../lib');
var fs = require('fs');
var nconf = require('nconf');
var jdiff = require('jsondiffpatch');

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
var connection = null;

//
// functions
//

function handleResult(startTime, test, err, req, res, data, callback) {
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
        actual.exception = err.name;
        actual.data = err.message;
    } else {
        actual.statusCode = res.statusCode;
        actual.data = data;
    }

    if (JSON.stringify(test.expected) === JSON.stringify(actual)) {
        result = 'PASS';
        numPassed++;
    }

    // only print difference between data with format:
    //
    // "property":["expected_value","actual_value"], // modified
    // "property":["actual_value"],                  // added
    // "property":["expected_value",0,0]             // deleted

    var dataDiff = jdiff.diff(test.expected.data, actual.data);
    if (!dataDiff) {
        dataDiff = '';
    } else {
        //console.log(JSON.stringify(actual.data, null, '    '));
    }

    delete test.expected.data;
    delete actual.data;

    console.log(JSON.stringify({
        name: test.name,
        expected: test.expected,
        actual: actual,
        dataDiff: dataDiff,
        time: time,
        result: result,
    }));

    callback(null);
}

function getList(test, callback) {

    connection.authenticate(test.parameters.key, test.parameters.secret, function(err) {

        if (err) {
            // something really bad happened
            callback(err);
            return;
        }

        var time = process.hrtime();
        connection.getList(function(err, req, res, data) {
            handleResult(time, test, err, req, res, data, callback);
        });
    });
}

function getSchema(test, callback) {

    connection.authenticate(test.parameters.key, test.parameters.secret, function(err) {

        if (err) {
            // something really bad happened
            callback(err);
            return;
        }

        var time = process.hrtime();
        connection.getSchema(test.dataset, function(err, req, res, data) {
            handleResult(time, test, err, req, res, data, callback);
        });
    });
}

function read(test, callback) {

    connection.authenticate(test.parameters.key, test.parameters.secret, function(err) {

        if (err) {
            // something really bad happened
            callback(err);
            return;
        }

        // read() does not care about these, remove them
        delete test.parameters.key;
        delete test.parameters.secret;

        var time = process.hrtime();
        connection.read(test.dataset, test.parameters, function(err, req, res, data) {
            handleResult(time, test, err, req, res, data, callback);
        });
    });
}

function execute(test, callback) {

    if (test.method === 'list') {
        getList(test, callback);
    } else if (test.method === 'schema') {
        getSchema(test, callback);
    } else if (test.method === 'read') {
        read(test, callback);
    } else {
        callback(new Error(test.method + ' method not found'));
    }
}

// load arguments
// node test.js --key API_KEY --testdir JSON_TEST_FILES_DIR

nconf.use('memory');
nconf.env().argv();

var rootDir = nconf.get('testdir');
var validKey = nconf.get('key');

// load tests
var tests = [];
var testFiles = fs.readdirSync(rootDir);

for (var i = 0; i < testFiles.length; i++) {
    if (testFiles[i].endsWith('.json') === true) {
        var json = JSON.parse(fs.readFileSync(rootDir + '/' + testFiles[i], 'utf8'));
        for (var j = 0; j < json.tests.length; j++) {
            var test = json.tests[j];
            if (test.parameters.key === 'valid_key') {
                test.parameters.key = validKey;
            }
            tests.push(json.tests[j]);
        }
    }
}

// create connection
connection = dlanche.createConnection();

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
});

