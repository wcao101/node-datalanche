//
// equivalent SQL
//
// CREATE TABLE my_schema.my_table(
//     col1 uuid NOT NULL,
//     col2 text,
//     col3 integer DEFAULT 0 NOT NULL
// );
//
var dl = require('../lib');

var client = new dl.Client({
    key: 'YOUR_API_KEY',
    secret: 'YOUR_API_SECRET'
});

var definition = {
    schema_name: 'my_schema',
    table_name: 'my_table',
    description: 'my_table description text',
    is_private: true,
    license: {
        name: 'public domain',
        description: 'this table is public domain',
        url: null
    },
    sources: {
        source1: {
            url: 'http://source1.com',
            description: 'source1 description text'
        },
        source2: {
            url: 'http://source2.com',
            description: 'source2 description text'
        }
    },
    columns: {
        col1: {
            data_type: 'uuid',
            description: 'col1 description text',
            not_null: true
        },
        col2: {
            data_type: 'text',
            description: 'col2 description text',
            default_value: null,
            not_null: false
        },
        col3: {
            data_type: 'integer',
            description: 'col3 description text',
            default_value: 0,
            not_null: true
        }
    },
    constraints: {
        primary_key: 'col1'
    },
    indexes: {
    },
    collaborators: {
        bob: 'read',
        slob: 'read/write',
        knob: 'admin'
    }
};

var q = new dl.Query();
q.createTable(definition);

client.query(q, function(err, result) {

    if (err) {
        console.log(err);
    } else {
        console.log('create_table succeeded!');
    }

    return client.close();
});
