var dl = require('../lib');

var client = new dl.Client({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

// Only q.createTable() is required. The rest are optional
// and the server will set defaults.

var q = new dl.Query();
q.createTable('my_table');
q.description('my_table description text');
q.isPrivate(true);
q.license({
    name: 'license name',
    url: 'http://license.com',
    description: 'license description text'
});
q.sources([
    {
        name: 'source1',
        url: 'http://source1.com',
        description: 'source1 description text'
    },
    {
        name: 'source2',
        url: 'http://source2.com',
        description: 'source2 description text'
    },
]);
q.columns([
    {
        name: 'col1',
        data_type: 'uuid',
        description: 'col1 description text'
    },
    {
        name: 'col2',
        data_type: 'timestamp',
        description: 'col2 description text'
    },
    {
        name: 'col3',
        data_type: 'string',
        description: 'col3 description text'
    }
]);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('create_table succeeded!');
    }

    return client.close();
});
