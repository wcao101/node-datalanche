//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var Enum = require("enum");

var OPS = new Enum([
    "AND",
    "OR",
    "EQUAL",
]);

function Filter(left, operator, right) {
    this.left = left;
    this.op = operator;
    this.right = right;
}

module.exports = {
    Filter: Filter,
    OPS: OPS
};
