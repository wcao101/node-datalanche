//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var Enum = require("enum");

var OPS = new Enum({
    "AND":                  "and",
    "OR":                   "or",
    "IN":                   "in",
    "NOT_IN":               "nin",
    "EQUAL":                "eq",
    "NOT_EQUAL":            "neq",
    "GREATER_THAN":         "gt",
    "GREATER_THAN_EQUAL":   "gte",
    "LESS_THAN":            "lt",
    "LESS_THAN_EQUAL":      "lte",
    "ENDS_WITH":            "ew",
    "ENDS_WITH_IN":         "ewin",
    "NOT_ENDS_WITH":        "new",
    "NOT_ENDS_WITH_IN":     "newin",
    "CONTAINS":             "con",
    "NOT_CONTAINS":         "ncon",
    "STARTS_WITH":          "sw",
    "STARTS_WITH_IN":       "swin",
    "NOT_STARTS_WITH":      "nsw",
    "NOT_STARTS_WITH_IN":   "nswin",
});

function Filter(left, operator, right) {
    this.left = left;
    this.op = operator;
    if (operator.value) {
        this.op = operator.value;
    }
    this.right = right;
}

module.exports = {
    Filter: Filter,
    OPS: OPS
};

