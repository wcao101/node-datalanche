var dl = require('../lib');

var client = new dl.Client({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

// Only q.alterTable() is required. The rest are optional and, if present,
// will override current values. However add/drop/alter columns are broken
// up into individual functions and will do the appropriate function. Note
// that dropping or altering columns of an existing table can delete existing data.

var q = new dl.Query();
q.alterTable('my_table');
q.rename('my_new_table');
q.description('my_new_table description text');
q.isPrivate(false);
q.license({
    name: 'new license name',
    url: 'http://new_license.com',
    description: 'new license description text'
});
q.sources([
    {
        name: 'new source1',
        url: 'http://new_source1.com',
        description: 'new source1 description text'
    },
    {
        name: 'new source2',
        url: 'http://new_source2.com',
        description: 'new source2 description text'
    },
]);
q.addColumn({
    name: 'new_col',
    data_type: 'int32',
    description: 'new_col description text'
});
q.dropColumn('col2');
q.dropColumn('col3');
q.alterColumn('col1', {
    // will only alter col1's data type
    data_type: 'string'
});

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('alter_table succeeded!');
    }

    return client.close();
});
