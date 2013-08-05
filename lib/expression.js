// constructor

function Expression() {
    this._hasNot = false;
    this._column = null;
    this._filters = null;
    this._operator = null;
    this._value = null;
}
module.exports = Expression;

// methods

Expression.prototype.column = function(str) {
    this._column = str;
    return this; // allow method chaining
}

Expression.prototype.anyIn = function(value) {
    this._hasNot = false;
    this._operator = '$in';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.boolAnd = function(filterList) {
    this._filters = filterList;
    this._operator = '$and';
    return this; // allow method chaining
}

Expression.prototype.boolOr = function(filterList) {
    this._filters = filterList;
    this._operator = '$or';
    return this; // allow method chaining
}

Expression.prototype.contains = function(value) {
    this._hasNot = false;
    this._operator = '$contains';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.endsWith = function(value) {
    this._hasNot = false;
    this._operator = '$ends';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.equals = function(value) {
    this._hasNot = false;
    this._operator = '$eq';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.greaterThan = function(value) {
    this._hasNot = false;
    this._operator = '$gt';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.greaterThanEqual = function(value) {
    this._hasNot = false;
    this._operator = '$gte';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.lessThan = function(value) {
    this._hasNot = false;
    this._operator = '$lt';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.lessThanEqual = function(value) {
    this._hasNot = false;
    this._operator = '$lte';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.notContains = function(value) {
    this._hasNot = true;
    this._operator = '$contains';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.notEndsWith = function(value) {
    this._hasNot = true;
    this._operator = '$ends';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.notEquals = function(value) {
    this._hasNot = true;
    this._operator = '$eq';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.notAnyIn = function(value) {
    this._hasNot = true;
    this._operator = '$in';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.notStartsWith = function(value) {
    this._hasNot = true;
    this._operator = '$starts';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.startsWith = function(value) {
    this._hasNot = false;
    this._operator = '$starts';
    this._value = value;
    return this; // allow method chaining
}

Expression.prototype.toJSON = function() {
    // return empty when not formatted correctly
    if (this._operator === null) {
        return {};
    }

    if (this._operator === '$and' || this._operator === '$or') {

        // return empty when not formatted correctly
        if (this._filters === null) {
            return {};
        }

        var jsonList = [];
        for (var i = 0; i < this._filters.length; i++) {
            var item = {};
            if (this._filters[i] instanceof Expression) {
                item = this._filters[i].toJSON();
            } else {
                item = this._filters[i];
            }
            jsonList.push(item);
        }

        var json = {};
        json[this._operator.toString()] = jsonList;

        return json;

    } else {

        // return empty when not formatted correctly
        if (this._column === null || this._value === null) {
            return {};
        }

        var opExpression = {};
        opExpression[this._operator] = this._value;

        if (this._hasNot === true) {
            opExpression = { $not: opExpression };
        }

        var json = {};
        json[this._column.toString()] = opExpression;

        return json;
    }
}

Expression.prototype.toString = function() {
    return JSON.stringify(this.toJSON());
}
