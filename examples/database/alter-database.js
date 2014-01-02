//
// Alter the given database's properties. Must have admin access for the database.
//
// equivalent SQL:
// ALTER DATABASE my_database RENAME TO my_new_database;
//
var dl = require('../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var q = new dl.Query();
q.alterDatabase('my_database');
q.renameTo('my_new_database');
q.description('my_new_database description text');

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('alter_database succeeded!');
    }

    return client.close();
});