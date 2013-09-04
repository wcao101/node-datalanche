var events = require('events');
var querystring = require('querystring');
var util = require('util');

// constructor

function Query(params) {

    events.EventEmitter.call(this);

    this.urlType = 'get';
    this.baseUrl = '/';
    this.params = {};
}
util.inherits(Query, events.EventEmitter);
module.exports = Query;

//
//  PUBLIC METHODS
//

Query.prototype.addColumn = function(object) {

    if (!this.params.add_columns) {
        this.params.add_columns = [];
    }

    this.params.add_columns.push(object);

    return this; // method chaining
};

Query.prototype.alterColumn = function(columnName, object) {

    if (!this.params.alter_columns) {
        this.params.alter_columns = {};
    }
    this.params.alter_columns[columnName] = object;

    return this; // method chaining
};

Query.prototype.alterTable = function(tableName) {

    this.urlType = 'post';
    this.baseUrl = '/alter_table';
    this.params.table_name = tableName;

    return this; // method chaining
};

Query.prototype.columns = function(objectArray) {

    this.params.columns = objectArray;

    return this; // method chaining
};

Query.prototype.createTable = function(tableName) {

    this.urlType = 'post';
    this.baseUrl = '/create_table';
    this.params.table_name = tableName;

    return this; // method chaining
};

Query.prototype.deleteFrom = function(tableName) {

    this.urlType = 'post';
    this.baseUrl = '/delete_from';
    this.params.table_name = tableName;

    return this; // method chaining
};

Query.prototype.description = function(text) {

    this.params.description = text;

    return this; // method chaining
};

Query.prototype.distinct = function(boolean) {

    this.params.distinct = boolean;

    return this; // method chaining
};

Query.prototype.dropColumn = function(columnName) {

    if (!this.params.drop_columns) {
        this.params.drop_columns = [];
    }
    this.params.drop_columns.push(columnName);

    return this; // method chaining
};

Query.prototype.dropTable = function(tableName) {

    this.urlType = 'del';
    this.baseUrl = '/drop_table';
    this.params.table_name = tableName;

    return this; // method chaining
};

Query.prototype.from = function(tables) {

    this.params.from = tables;

    return this; // method chaining
};

Query.prototype.getTableInfo = function(tableName) {

    this.urlType = 'get';
    this.baseUrl = '/get_table_info';
    this.params.table_name = tableName;

    return this; // method chaining
};

Query.prototype.getTableList = function() {

    this.urlType = 'get';
    this.baseUrl = '/get_table_list';

    return this; // method chaining
};

Query.prototype.groupBy = function(columns) {

    this.params.group_by = columns;

    return this; // method chaining
};

Query.prototype.insertInto = function(tableName) {

    this.urlType = 'post';
    this.baseUrl = '/insert_into';
    this.params.table_name = tableName;

    return this; // method chaining
};

Query.prototype.isPrivate = function(boolean) {

    this.params.is_private = boolean;

    return this; // method chaining
};

Query.prototype.license = function(object) {

    this.params.license = object;

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

Query.prototype.orderBy = function(objectArray) {

    this.params.order_by = objectArray;

    return this; // method chaining
};

Query.prototype.rename = function(tableName) {

    this.params.rename = tableName;

    return this; // method chaining
};

Query.prototype.select = function(columns) {

    this.urlType = 'post';
    this.baseUrl = '/select_from';
    this.params.select = columns;

    return this; // method chaining
};

Query.prototype.set = function(map) {

    this.params.set = map;

    return this; // method chaining
};

Query.prototype.sources = function(objectArray) {

    this.params.sources = objectArray;

    return this; // method chaining
};

Query.prototype.total = function(boolean) {

    this.params.total = boolean;

    return this; // method chaining
};

Query.prototype.update = function(tableName) {

    this.urlType = 'post';
    this.baseUrl = '/update';
    this.params.table_name = tableName;

    return this; // method chaining
};

Query.prototype.values = function(rows) {

    this.params.values = rows;

    return this; // method chaining
};

Query.prototype.where = function(filter) {

    this.params.where = filter;

    return this; // method chaining
};
