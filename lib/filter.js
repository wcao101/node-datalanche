//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var Enum = require('enum');

var FilterOp = new Enum([
    'AND',          // and
    'OR',           // or
    'EQ',           // equal
    'NOT_EQ',       // not equal
    'GT',           // greater than
    'GTE',          // greater than or equal
    'LT',           // less than
    'LTE',          // less than or equal
    'IN',           // equals any in array
    'NOT_IN',       // does not equal any in array
    'EW',           // ends with
    'NOT_EW',       // does not end with
    'CONTAINS',     // contains string
    'NOT_CONTAINS', // does not contain string
    'SW',           // starts with
    'NOT_SW',       // does not start with
]);

function Filter(left, operator, right) {
    this.left = left;
    this.op = '';
    if (operator) {
        this.op = operator.toString().toLowerCase();
    }
    this.right = right;
}

module.exports = {
    Filter: Filter,
    FilterOp: FilterOp
};

