//
// equivalent SQL assuming createTable() example called first
//
// BEGIN TRANSACTION;
//
// ALTER TABLE my_schema.my_table
//     DROP COLUMN col2,
//     ALTER COLUMN col1 DROP NOT NULL,
//     ALTER COLUMN col1 SET DATA TYPE text,
//     ADD COLUMN new_col integer;
//
// ALTER TABLE my_schema.my_table RENAME COLUMN col3 TO col_renamed;
//
// ALTER TABLE my_schema.my_table RENAME TO my_new_table;
//
// ALTER TABLE my_schema.my_new_table SET SCHEMA my_new_schema;
//
// COMMIT;
//
var dl = require('../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query();
q.alterTable('my_schema.my_table');

// modify table schema and name
q.setSchema('my_new_schema');
q.renameTo('my_new_table');

// modify metadata
q.description('my_new_table description text');
q.isPrivate(false);
q.license({
    name: 'new license name',
    url: 'http://new_license.com',
    description: 'new license description text'
});

// modify data sources
q.addSource('newSource1', {
    url: 'http://new_source1.com',
    description: 'new source1 description text'
});
q.alterSource('source1', {
    url: 'http://new_source1.com',
    description: 'new source1 description text'
});
q.dropSource('source2');
q.renameSource('source1', 'source1_renamed');

// modify columns
q.addColumn('new_col', {
    data_type: 'integer',
    description: 'new_col description text'
});
q.alterColumn('col1', {
    data_type: 'text',
    description: 'new col1 description text'
});
q.dropColumn('col2');
q.renameColumn('col3', 'col_renamed');

// modify collaborators
q.addCollaborator('new_bob', 'read/write');
q.alterCollaborator('knob', 'read');
q.dropCollaborator('slob');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('alter_table succeeded!');
    }

    return client.close();
});
