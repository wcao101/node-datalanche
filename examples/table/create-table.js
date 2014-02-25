//
// Create the given table. Must have admin access for the given database.
//
// equivalent SQL:
// CREATE TABLE my_schema.my_table(
//     col1 uuid NOT NULL,
//     col2 varchar(50),
//     col3 integer DEFAULT 0 NOT NULL
// );
//
var fs = require('fs');
var dl = require('../../lib');

var config = fs.readFileSync('../config.json');
config = JSON.parse(config.toString());

// Please find your API credentials here: https://www.datalanche.com/account before use
var YOUR_API_KEY = config.api_key;
var YOUR_API_SECRET = config.api_secret;

var client = new dl.Client({
    key: YOUR_API_KEY,
    secret: YOUR_API_SECRET
});

var q = new dl.Query('my_database');
q.createTable('my_schema.my_table');
q.description('my_table description text');
q.columns({
    col1: {
        data_type: {
            name: 'uuid'
        },
        description: 'col1 description text',
        not_null: true
    },
    col2: {
        data_type: {
            name: 'timestamptz',
            args: [ 50 ]
        },
        description: 'col2 description text',
        default_value: null,
        not_null: false
    },
    col3: {
        data_type: {
            name: 'text'
        },
        description: 'col3 description text',
        default_value: 0,
        not_null: true
    },
    col4: {
        data_type: {
            name: 'varchar',
            args: [ 50 ]
        },
        description: 'col4 description text',
        default_value: null,
        not_null: false
    }
});

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('create_table succeeded!');
    }
});
