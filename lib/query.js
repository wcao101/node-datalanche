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
// COMMON
//

Query.prototype.cascade = function(boolean) {

    this.params.cascade = boolean;
    return this; // method chaining
};

Query.prototype.columns = function(columns) {

    this.params.columns = columns;
    return this; // method chaining
};

Query.prototype.database = function(databaseName) {

    this.params.database = databaseName;
    return this; // method chaining
};

Query.prototype.description = function(text) {

    this.params.description = text;
    return this; // method chaining
};

Query.prototype.renameTo = function(tableName) {

    this.params.rename_to = tableName;
    return this; // method chaining
};

Query.prototype.where = function(expression) {

    this.params.where = expression;
    return this; // method chaining
};

//
// EXPRESSIONS
//

//
// usage examples
//
// q.expr(2, "+", 2)
// q.expr("~", 2)
// q.expr(2, "!")
// q.expr(q.column("c1"), "$like", "%abc%")
// q.expr(q.column("c1"), "$not", "$in", [1, 2, 3, 4])
// q.expr(q.column("c1"), "=", 1, "$and", q.column("c2"), "=", 2)
//
Query.prototype.expr = function() {
    // "arguments" is a built-in JS variable which is an array of function args
    return { $expr: arguments };
};

Query.prototype.alias = function(aliasName) {
    return { $alias: aliasName };
};

Query.prototype.column = function(columnName) {
    return { $column: columnName };
};

Query.prototype.literal = function(value) {
    return { $literal: value };
};

Query.prototype.table = function(tableName) {
    return { $table: tableName };
};

//
// FUNCTIONS
//

// NOTE: "arguments" is a built-in JS variable which is an array of function args

//
// usage examples
//
// q.func("$count", "*")
// q.func("$sum", q.column("c1"))
//
Query.prototype.func = function() {
    return { '$function': arguments };
};

Query.prototype.avg = function() {

    var args = [ '$avg' ];
    args = args.concat(arguments);
    return { '$function': args };
};

Query.prototype.count = function() {

    var args = [ '$count' ];
    args = args.concat(arguments);
    return { '$function': args };
};

Query.prototype.max = function() {

    var args = [ '$max' ];
    args = args.concat(arguments);
    return { '$function': args };
};

Query.prototype.min = function() {

    var args = [ '$min' ];
    args = args.concat(arguments);
    return { '$function': args };
};

Query.prototype.sum = function() {

    var args = [ '$sum' ];
    args = args.concat(arguments);
    return { '$function': args };
};

//
// ALTER DATABASE
//

Query.prototype.alterDatabase = function(databaseName) {

    this.url = '/alter_database';
    this.params.database = databaseName;
    return this; // method chaining
};

Query.prototype.addCollaborator = function(username, permission) {

    if (!this.params.add_collaborators) {
        this.params.add_collaborators = {};
    }
    this.params.add_collaborators[username] = permission;
    return this; // method chaining
};

Query.prototype.alterCollaborator = function(username, permission) {

    if (!this.params.alter_collaborators) {
        this.params.alter_collaborators = {};
    }
    this.params.alter_collaborators[username] = permission;
    return this; // method chaining
};

Query.prototype.dropCollaborator = function(username) {

    if (!this.params.drop_collaborators) {
        this.params.drop_collaborators = [];
    }
    this.params.drop_collaborators.push(username);
    return this; // method chaining
};

Query.prototype.isPrivate = function(boolean) {

    this.params.is_private = boolean;
    return this; // method chaining
};

//
// ALTER INDEX
//

Query.prototype.alterIndex = function(indexName) {

    this.url = '/alter_index';
    this.params.index_name = indexName;
    return this; // method chaining
};

//
// ALTER SCHEMA
//

Query.prototype.alterSchema = function(schemaName) {

    this.url = '/alter_schema';
    this.params.schema_name = schemaName;
    return this; // method chaining
};

//
// ALTER TABLE
//

Query.prototype.alterTable = function(tableName) {

    this.url = '/alter_table';
    this.params.table_name = tableName;
    return this; // method chaining
};

Query.prototype.addColumn = function(columnName, attributes) {

    if (!this.params.add_columns) {
        this.params.add_columns = {};
    }
    this.params.add_columns[columnName] = attributes;
    return this; // method chaining
};

// TODO: addConstraint

Query.prototype.alterColumn = function(columnName, attributes) {

    if (!this.params.alter_columns) {
        this.params.alter_columns = {};
    }
    this.params.alter_columns[columnName] = attributes;
    return this; // method chaining
};

Query.prototype.dropColumn = function(columnName) {

    if (!this.params.drop_columns) {
        this.params.drop_columns = [];
    }
    this.params.drop_columns.push(columnName);
    return this; // method chaining
};

// TODO: dropConstraint

Query.prototype.renameColumn = function(columnName, newName) {

    if (!this.params.rename_columns) {
        this.params.rename_columns = {};
    }
    this.params.rename_columns[columnName] = newName;
    return this; // method chaining
};

// TODO: renameConstraint

Query.prototype.setSchema = function(schemaName) {

    this.params.set_schema = schemaName;
    return this; // method chaining
};

//
// CREATE INDEX
//

Query.prototype.createIndex = function(indexName) {

    this.url = '/create_index';
    this.params.index_name = indexName;
    return this; // method chaining
};

Query.prototype.isUnique = function(boolean) {

    this.params.is_unique = boolean;
    return this; // method chaining
};

Query.prototype.method = function(text) {

    this.params.method = text;
    return this; // method chaining
};

Query.prototype.onTable = function(tableName) {

    this.params.table_name = tableName;
    return this; // method chaining
};

//
// CREATE SCHEMA
//

Query.prototype.createSchema = function(schemaName) {

    this.url = '/create_schema';
    this.params.schema_name = schemaName;
    return this; // method chaining
};

//
// CREATE TABLE
//

Query.prototype.createTable = function(tableName) {

    this.url = '/create_table';
    this.params.table_name = tableName;
    return this; // method chaining
};

// TODO: constraints

//
// DELETE
//

Query.prototype.deleteFrom = function(tableName) {

    this.url = '/delete';
    this.params.table_name = tableName;
    return this; // method chaining
};

//
// DESCRIBE DATABASE
//

Query.prototype.describeDatabase = function(databaseName) {

    this.url = '/describe_database';
    this.params.database = databaseName;
    return this; // method chaining
};

//
// DESCRIBE SCHEMA
//

Query.prototype.describeSchema = function(schemaName) {

    this.url = '/describe_schema';
    this.params.schema_name = schemaName;
    return this; // method chaining
};

//
// DESCRIBE TABLE
//

Query.prototype.describeTable = function(tableName) {

    this.url = '/describe_table';
    this.params.table_name = tableName;
    return this; // method chaining
};

//
// DROP INDEX
//

Query.prototype.dropIndex = function(indexName) {

    this.url = '/drop_index';
    this.params.index_name = indexName;
    return this; // method chaining
};

//
// DROP SCHEMA
//

Query.prototype.dropSchema = function(schemaName) {

    this.url = '/drop_schema';
    this.params.schema_name = schemaName;
    return this; // method chaining
};

//
// DROP TABLE
//

Query.prototype.dropTable = function(tableName) {

    this.url = '/drop_table';
    this.params.table_name = tableName;
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

Query.prototype.having = function(expression) {

    this.params.having = expression;
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

Query.prototype.search = function(queryText) {

    this.params.search = queryText;
    return this; // method chaining
};

//
// SHOW DATABASES
//

Query.prototype.showDatabases = function() {

    this.url = '/show_databases';
    return this; // method chaining
};

//
// SHOW SCHEMAS
//

Query.prototype.showSchemas = function() {

    this.url = '/show_schemas';
    return this; // method chaining
};

//
// SHOW TABLES
//

Query.prototype.showTables = function() {

    this.url = '/show_tables';
    return this; // method chaining
};

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
