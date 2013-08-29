var dl = require('../lib');

var client = new dl.Client({
    key: '',    // Add your API key.
    secret: '',  // Add your API secret.
});

var q = new dl.Query();
q.insertInto('my_table');
q.values([
    {
        col1: '0f21b968-cd28-4d8b-9ea6-33dbcd517ec5',
        col2: '2012-11-13T01:04:33.389Z',
        col3: 'hello'
    },
    {
        col1: '8bf38716-95ef-4a58-9c1b-b7c0f3185746',
        col2: '2012-07-26T01:09:04.140Z',
        col3: 'world'
    },
    {
        col1: '45db0793-3c99-4e0d-b1d0-43ab875638d3',
        col2: '2012-11-30T07:10:36.871Z',
        col3: 'hello world'
    }
]);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(result, null, '  '));
    }

    return client.close();
});
