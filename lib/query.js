var events = require('events');
var querystring = require('querystring');
var util = require('util');

// constructor

function Query(params) {

    events.EventEmitter.call(this);

    this.url = '/';
    this.params = {};
}
util.inherits(Query, events.EventEmitter);
module.exports = Query;

//
// ALTER TABLE
//

Query.prototype.alterTable = function(tableName) {

    this.url = '/alter_table';
    this.params.table_name = tableName;

    return this; // method chaining
};

Query.prototype.addCollaborator = function(username, permission) {

    if (!this.params.add_collaborators) {
        this.params.add_collaborators = {};
    }
    this.params.add_collaborators[username] = permission;

    return this; // method chaining
};

Query.prototype.addColumn = function(columnName, attributes) {

    if (!this.params.add_columns) {
        this.params.add_columns = {};
    }
    this.params.add_columns[columnName] = attributes;

    return this; // method chaining
};

Query.prototype.addSource = function(sourceName, attributes) {

    if (!this.params.add_sources) {
        this.params.add_sources = {};
    }
    this.params.add_sources[sourceName] = attributes;

    return this; // method chaining
};

Query.prototype.alterCollaborator = function(username, permission) {

    if (!this.params.alter_collaborators) {
        this.params.alter_collaborators = {};
    }
    this.params.alter_collaborators[username] = permission;

    return this; // method chaining
};

Query.prototype.alterColumn = function(columnName, attributes) {

    if (!this.params.alter_columns) {
        this.params.alter_columns = {};
    }
    this.params.alter_columns[columnName] = attributes;

    return this; // method chaining
};

Query.prototype.alterSource = function(sourceName, attributes) {

    if (!this.params.alter_sources) {
        this.params.alter_sources = {};
    }
    this.params.alter_sources[sourceName] = attributes;

    return this; // method chaining
};

Query.prototype.description = function(text) {

    this.params.description = text;

    return this; // method chaining
};

Query.prototype.dropCollaborator = function(username) {

    if (!this.params.drop_collaborators) {
        this.params.drop_collaborators = [];
    }
    this.params.drop_collaborators.push(username);

    return this; // method chaining
};

Query.prototype.dropColumn = function(columnName) {

    if (!this.params.drop_columns) {
        this.params.drop_columns = [];
    }
    this.params.drop_columns.push(columnName);

    return this; // method chaining
};

Query.prototype.dropSource = function(sourceName) {

    if (!this.params.drop_sources) {
        this.params.drop_sources = [];
    }
    this.params.drop_sources.push(sourceName);

    return this; // method chaining
};

Query.prototype.isPrivate = function(boolean) {

    this.params.is_private = boolean;

    return this; // method chaining
};

Query.prototype.license = function(attributes) {

    this.params.license = attributes;

    return this; // method chaining
};

Query.prototype.renameColumn = function(columnName, newName) {

    if (!this.params.rename_columns) {
        this.params.rename_columns = {};
    }
    this.params.rename_columns[columnName] = newName;

    return this; // method chaining
};

Query.prototype.renameSource = function(sourceName, newName) {

    if (!this.params.rename_sources) {
        this.params.rename_sources = {};
    }
    this.params.rename_sources[sourceName] = newName;

    return this; // method chaining
};

Query.prototype.renameTo = function(tableName) {

    this.params.rename_to = tableName;

    return this; // method chaining
};

Query.prototype.setSchema = function(schemaName) {

    this.params.set_schema = schemaName;

    return this; // method chaining
};

//
// CREATE TABLE
//

Query.prototype.createTable = function(definition) {

    this.url = '/create_table';
    this.params = definition;

    return this; // method chaining
};

//
// DELETE
//

Query.prototype.deleteFrom = function(tableName) {

    this.url = '/delete';
    this.params.table_name = tableName;

    return this; // method chaining
};

// where() defined below

//
// DROP TABLE
//

Query.prototype.dropTable = function(tableName) {

    this.url = '/drop_table';
    this.params.table_name = tableName;

    return this; // method chaining
};

//
// GET TABLE INFO
//

Query.prototype.getTableInfo = function(tableName) {

    this.url = '/get_table_info';
    this.params.table_name = tableName;

    return this; // method chaining
};

//
// GET TABLE LIST
//

Query.prototype.getTableList = function() {

    this.url = '/get_table_list';

    return this; // method chaining
};

//
// INSERT
//

Query.prototype.insertInto = function(tableName) {

    this.url = '/insert';
    this.params.table_name = tableName;

    return this; // method chaining
};

Query.prototype.values = function(rows) {

    this.params.values = rows;

    return this; // method chaining
};

//
// SELECT
//

Query.prototype.select = function(columns) {

    this.url = '/select';
    this.params.select = columns;

    return this; // method chaining
};

Query.prototype.distinct = function(boolean) {

    this.params.distinct = boolean;

    return this; // method chaining
};

Query.prototype.from = function(tables) {

    this.params.from = tables;

    return this; // method chaining
};

Query.prototype.groupBy = function(columns) {

    this.params.group_by = columns;

    return this; // method chaining
};

Query.prototype.limit = function(integer) {

    this.params.limit = integer;

    return this; // method chaining
};

Query.prototype.offset = function(integer) {

    this.params.offset = integer;

    return this; // method chaining
};

Query.prototype.orderBy = function(exprArray) {

    this.params.order_by = exprArray;

    return this; // method chaining
};

Query.prototype.total = function(boolean) {

    this.params.total = boolean;

    return this; // method chaining
};

// where() defined below

//
// UPDATE
//

Query.prototype.update = function(tableName) {

    this.url = '/update';
    this.params.table_name = tableName;

    return this; // method chaining
};

Query.prototype.set = function(map) {

    this.params.set = map;

    return this; // method chaining
};

// where() defined below

//
// COMMON CLAUSES
//

Query.prototype.where = function(expression) {

    this.params.where = expression;

    return this; // method chaining
};

//
// EXPRESSIONS
//

Query.prototype.column = function(columnName) {

    return { $column: columnName };
};

//
// usage examples
//
// q.expr(2, "$+", 2)
// q.expr("$~", 2)
// q.expr(2, "$!")
// q.expr(q.column("c1"), "$like", "%abc%")
// q.expr(q.column("c1"), "$not", "$in", [1, 2, 3, 4])
// q.expr(q.column("c1"), "$=", 1, "$and", "$c2", "$=", 2)
//
Query.prototype.expr = function() {

    // "arguments" is a built-in JS variable which is an array of function args
    return { $expr: arguments };
};
