//
// Alter the given table's properties. Must have admin access for the given database.
//
// equivalent SQL:
//
// BEGIN TRANSACTION;
//
// ALTER TABLE my_schema.my_table
//     DROP COLUMN col2,
//     ALTER COLUMN col1 DROP NOT NULL,
//     ALTER COLUMN col1 SET DATA TYPE text,
//     ADD COLUMN new_col integer;
// ALTER TABLE my_schema.my_table RENAME COLUMN col3 TO col_renamed;
// ALTER TABLE my_schema.my_table RENAME TO my_new_table;
// ALTER TABLE my_schema.my_new_table SET SCHEMA my_new_schema;
//
// COMMIT;
//
var fs = require('fs');
var dl = require('../../lib');
var path = require('path');

var config = JSON.parse(fs.readFileSync(path.join(__dirname, '/..', '/config.json')).toString());

// Please find your API credentials here: https://www.datalanche.com/account before use
var YOUR_API_KEY = config.api_key;
var YOUR_API_SECRET = config.api_secret;

var client = new dl.Client({
    key: YOUR_API_KEY,
    secret: YOUR_API_SECRET
});

var q = new dl.Query('my_database');
q.alterTable('my_schema.my_table');
q.setSchema('my_new_schema');
q.renameTo('my_new_table');
q.description('my_new_table description text');
q.addColumn('new_col', {
    data_type: {
        name: 'integer'
    },
    description: 'new_col description text'
});
q.alterColumn('col1', {
    data_type: {
        name: 'text'
    },
    description: 'new col1 description text'
});
q.dropColumn('col2');
q.renameColumn('col3', 'col_renamed');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
        process.exit(1);        
    } else {
        console.log('alter_table succeeded!');
    }
});
