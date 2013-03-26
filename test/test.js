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
        actual.exception = err.body.code;
        actual.data = err.body.message;
    } else {
        actual.statusCode = res.statusCode;
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
var testFile = nconf.get('testfile') || '';
var host = nconf.get('host') || null;
var port = nconf.get('port') || null;

if (testFile === '') {
    testFile = '.json'
}

// load tests
var tests = [];
var testFiles = fs.readdirSync(rootDir);

for (var i = 0; i < testFiles.length; i++) {
    if (testFiles[i].endsWith(testFile) === true) {
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
connection = dlanche.createConnection({ host: host, port: port });

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
    process.exit();
});

