//
// Copyright © 2012 Datalanche, Inc., all rights reserved.
//
// This code is the proprietary and confidential information of
// Datalanche, Inc. and may not be used, copied, or distributed
// without its express permission.
//
var async = require("async");
var dlanche = require("../lib");

var API_KEY = "sCgdGsctSqKcKePLvdl1sA==";
var DATA_SET = "medical_codes_ndc";

var invalidFields = [
    dlanche.createFilter(undefined, dlanche.OPS.EQ, undefined),
    dlanche.createFilter(undefined, dlanche.OPS.EQ, "capsule"),
    dlanche.createFilter("capsule", dlanche.OPS.EQ, undefined),
    dlanche.createFilter("", dlanche.OPS.EQ, ""),
    dlanche.createFilter("", dlanche.OPS.EQ, "capsule"),
    dlanche.createFilter("capsule", dlanche.OPS.EQ, ""),
    dlanche.createFilter("bad_field_name", dlanche.OPS.EQ, "bad_field_name"),
    dlanche.createFilter("bad_field_name", dlanche.OPS.EQ, "capsule"),
    dlanche.createFilter("capsule", dlanche.OPS.EQ, "bad_field_name"),
];

var invalidOperators = [
    dlanche.createFilter("dosage_form", undefined, "capsule"),
    dlanche.createFilter("dosage_form", "", "capsule"),
    dlanche.createFilter("dosage_form", "invalid_operator", "capsule"),
    dlanche.createFilter("dosage_form", 3, "capsule"),
    dlanche.createFilter("dosage_form", 3.01, "capsule"),
    dlanche.createFilter("dosage_form", true, "capsule"),
    dlanche.createFilter("dosage_form", ["and", "or"], "capsule"),
    dlanche.createFilter("dosage_form", { object: "object" }, "capsule"),
];

var invalidValueTypes = [
    // dosage_form is string
    dlanche.createFilter("dosage_form", dlanche.OPS.EQ, 3),
    dlanche.createFilter("dosage_form", dlanche.OPS.EQ, 3.01),
    dlanche.createFilter("dosage_form", dlanche.OPS.EQ, true),
    dlanche.createFilter("dosage_form", dlanche.OPS.EQ, { object: "object" }),
    dlanche.createFilter("dosage_form", dlanche.OPS.EQ, []),
    dlanche.createFilter("dosage_form", dlanche.OPS.EQ, [true, false]),
    dlanche.createFilter("dosage_form", dlanche.OPS.EQ, [1, 2, 3]),
    dlanche.createFilter("dosage_form", dlanche.OPS.EQ, [1.1, 2.2, 3.3]),
    dlanche.createFilter("dosage_form", dlanche.OPS.EQ, ["capsule", "tablet"]),
    dlanche.createFilter("dosage_form", dlanche.OPS.EQ, [{ object1: "object1" }, { object2: "object2" }]),
    dlanche.createFilter("dosage_form", dlanche.OPS.IN, []),
    dlanche.createFilter("dosage_form", dlanche.OPS.IN, [true, false]),
    dlanche.createFilter("dosage_form", dlanche.OPS.IN, [1, 2, 3]),
    dlanche.createFilter("dosage_form", dlanche.OPS.IN, [1.1, 2.2, 3.3]),
    dlanche.createFilter("dosage_form", dlanche.OPS.IN, [{ object1: "object1" }, { object2: "object2" }]),

    // record_id is integer, also test right side can be field name
    dlanche.createFilter("text", dlanche.OPS.EQ, "record_id"),
    dlanche.createFilter(3.01, dlanche.OPS.EQ, "record_id"),
    dlanche.createFilter(true, dlanche.OPS.EQ, "record_id"),
    dlanche.createFilter({ object: "object" }, dlanche.OPS.EQ, "record_id"),
    dlanche.createFilter([], dlanche.OPS.EQ, "record_id"),
    dlanche.createFilter([true, false], dlanche.OPS.EQ, "record_id"),
    dlanche.createFilter([1, 2, 3], dlanche.OPS.EQ, "record_id"),
    dlanche.createFilter([1.1, 2.2, 3.3], dlanche.OPS.EQ, "record_id"),
    dlanche.createFilter(["capsule", "tablet"], dlanche.OPS.EQ, "record_id"),
    dlanche.createFilter([{ object1: "object1" }, { object2: "object2" }], dlanche.OPS.EQ, "record_id"),
    dlanche.createFilter([], dlanche.OPS.IN, "record_id"),
    dlanche.createFilter([true, false], dlanche.OPS.IN, "record_id"),
    dlanche.createFilter(["capsule", "tablet"], dlanche.OPS.IN, "record_id"),
    dlanche.createFilter([1.1, 2.2, 3.3], dlanche.OPS.IN, "record_id"),
    dlanche.createFilter([{ object1: "object1" }, { object2: "object2" }], dlanche.OPS.IN, "record_id"),

    // from_old_fda_db is boolean
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.EQ, 3),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.EQ, 3.01),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.EQ, "text"),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.EQ, { object: "object" }),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.EQ, []),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.EQ, [true, false]),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.EQ, [1, 2, 3]),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.EQ, [1.1, 2.2, 3.3]),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.EQ, ["capsule", "tablet"]),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.EQ, [{ object1: "object1" }, { object2: "object2" }]),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.IN, []),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.IN, ["text1", "text2"]),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.IN, [1, 2, 3]),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.IN, [1.1, 2.2, 3.3]),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.IN, [{ object1: "object1" }, { object2: "object2" }]),
];

var invalidOperatorTypes = [
    // left and right must be expressions
    dlanche.createFilter("record_id", dlanche.OPS.AND, 3),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.AND, true),
    dlanche.createFilter("dosage_form", dlanche.OPS.AND, "text"),
    dlanche.createFilter("dosage_form", dlanche.OPS.AND, ["text1", "text2"]),
    dlanche.createFilter("dosage_form", dlanche.OPS.AND, { left: "dosage_form", op: "eq", right: "text" }),
    dlanche.createFilter({ object: "object1" }, dlanche.OPS.AND, { object: "object2" }),

    // left and right must be expressions
    dlanche.createFilter("record_id", dlanche.OPS.OR, 3),
    dlanche.createFilter("from_old_fda_db", dlanche.OPS.OR, true),
    dlanche.createFilter("dosage_form", dlanche.OPS.OR, "text"),
    dlanche.createFilter("dosage_form", dlanche.OPS.OR, ["text1", "text2"]),
    dlanche.createFilter("dosage_form", dlanche.OPS.OR, { left: "dosage_form", op: "eq", right: "text" }),
    dlanche.createFilter({ object: "object1" }, dlanche.OPS.OR, { object: "object2" }),

    // EQ cannot be used with array or object
    dlanche.createFilter("record_id", dlanche.OPS.EQ, []),
    dlanche.createFilter("record_id", dlanche.OPS.EQ, [1, 2, 3]),
    dlanche.createFilter("record_id", dlanche.OPS.EQ, {}),
    dlanche.createFilter("record_id", dlanche.OPS.EQ, { object: "object" }),

    // NOT_EQ cannot be used with array or object
    dlanche.createFilter("record_id", dlanche.OPS.NOT_EQ, []),
    dlanche.createFilter("record_id", dlanche.OPS.NOT_EQ, [1, 2, 3]),
    dlanche.createFilter("record_id", dlanche.OPS.NOT_EQ, {}),
    dlanche.createFilter("record_id", dlanche.OPS.NOT_EQ, { object: "object" }),

    // GT can only be used with integers and floating-point decimals
    dlanche.createFilter("record_id", dlanche.OPS.GT, ""),
    dlanche.createFilter("record_id", dlanche.OPS.GT, "text"),
    dlanche.createFilter("record_id", dlanche.OPS.GT, []),
    dlanche.createFilter("record_id", dlanche.OPS.GT, [1, 2, 3]),
    dlanche.createFilter("record_id", dlanche.OPS.GT, {}),
    dlanche.createFilter("record_id", dlanche.OPS.GT, { object: "object" }),

    // GTE can only be used with integers and floating-point decimals
    dlanche.createFilter("record_id", dlanche.OPS.GTE, ""),
    dlanche.createFilter("record_id", dlanche.OPS.GTE, "text"),
    dlanche.createFilter("record_id", dlanche.OPS.GTE, []),
    dlanche.createFilter("record_id", dlanche.OPS.GTE, [1, 2, 3]),
    dlanche.createFilter("record_id", dlanche.OPS.GTE, {}),
    dlanche.createFilter("record_id", dlanche.OPS.GTE, { object: "object" }),

    // LT can only be used with integers and floating-point decimals
    dlanche.createFilter("record_id", dlanche.OPS.LT, ""),
    dlanche.createFilter("record_id", dlanche.OPS.LT, "text"),
    dlanche.createFilter("record_id", dlanche.OPS.LT, []),
    dlanche.createFilter("record_id", dlanche.OPS.LT, [1, 2, 3]),
    dlanche.createFilter("record_id", dlanche.OPS.LT, {}),
    dlanche.createFilter("record_id", dlanche.OPS.LT, { object: "object" }),

    // LTE can only be used with integers and floating-point decimals
    dlanche.createFilter("record_id", dlanche.OPS.LTE, ""),
    dlanche.createFilter("record_id", dlanche.OPS.LTE, "text"),
    dlanche.createFilter("record_id", dlanche.OPS.LTE, []),
    dlanche.createFilter("record_id", dlanche.OPS.LTE, [1, 2, 3]),
    dlanche.createFilter("record_id", dlanche.OPS.LTE, {}),
    dlanche.createFilter("record_id", dlanche.OPS.LTE, { object: "object" }),

    // IN can only be used with arrays
    dlanche.createFilter("record_id", dlanche.OPS.IN, undefined),
    dlanche.createFilter("record_id", dlanche.OPS.IN, 3),
    dlanche.createFilter("record_id", dlanche.OPS.IN, 3.01),
    dlanche.createFilter("dosage_form", dlanche.OPS.IN, ""),
    dlanche.createFilter("dosage_form", dlanche.OPS.IN, "text"),
    dlanche.createFilter("dosage_form", dlanche.OPS.IN, {}),
    dlanche.createFilter("dosage_form", dlanche.OPS.IN, { object: "object" }),

    // NOT_IN can only be used with arrays
    dlanche.createFilter("record_id", dlanche.OPS.NOT_IN, undefined),
    dlanche.createFilter("record_id", dlanche.OPS.NOT_IN, 3),
    dlanche.createFilter("record_id", dlanche.OPS.NOT_IN, 3.01),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_IN, ""),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_IN, "text"),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_IN, {}),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_IN, { object: "object" }),

    // EW can only be used with strings
    dlanche.createFilter("dosage_form", dlanche.OPS.EW, undefined),
    dlanche.createFilter("dosage_form", dlanche.OPS.EW, 3),
    dlanche.createFilter("dosage_form", dlanche.OPS.EW, 3.01),
    dlanche.createFilter("dosage_form", dlanche.OPS.EW, []),
    dlanche.createFilter("dosage_form", dlanche.OPS.EW, [1, 2, 3]),
    dlanche.createFilter("dosage_form", dlanche.OPS.EW, {}),
    dlanche.createFilter("dosage_form", dlanche.OPS.EW, { object: "object" }),

    // NOT_EW can only be used with strings
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_EW, undefined),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_EW, 3),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_EW, 3.01),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_EW, []),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_EW, [1, 2, 3]),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_EW, {}),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_EW, { object: "object" }),

    // CONTAINS can only be used with strings
    dlanche.createFilter("dosage_form", dlanche.OPS.CONTAINS, undefined),
    dlanche.createFilter("dosage_form", dlanche.OPS.CONTAINS, 3),
    dlanche.createFilter("dosage_form", dlanche.OPS.CONTAINS, 3.01),
    dlanche.createFilter("dosage_form", dlanche.OPS.CONTAINS, []),
    dlanche.createFilter("dosage_form", dlanche.OPS.CONTAINS, [1, 2, 3]),
    dlanche.createFilter("dosage_form", dlanche.OPS.CONTAINS, {}),
    dlanche.createFilter("dosage_form", dlanche.OPS.CONTAINS, { object: "object" }),

    // NOT_CONTAINS can only be used with strings
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_CONTAINS, undefined),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_CONTAINS, 3),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_CONTAINS, 3.01),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_CONTAINS, []),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_CONTAINS, [1, 2, 3]),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_CONTAINS, {}),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_CONTAINS, { object: "object" }),

    // SW can only be used with strings
    dlanche.createFilter("dosage_form", dlanche.OPS.SW, undefined),
    dlanche.createFilter("dosage_form", dlanche.OPS.SW, 3),
    dlanche.createFilter("dosage_form", dlanche.OPS.SW, 3.01),
    dlanche.createFilter("dosage_form", dlanche.OPS.SW, []),
    dlanche.createFilter("dosage_form", dlanche.OPS.SW, [1, 2, 3]),
    dlanche.createFilter("dosage_form", dlanche.OPS.SW, {}),
    dlanche.createFilter("dosage_form", dlanche.OPS.SW, { object: "object" }),

    // NOT_SW can only be used with strings
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_SW, undefined),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_SW, 3),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_SW, 3.01),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_SW, []),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_SW, [1, 2, 3]),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_SW, {}),
    dlanche.createFilter("dosage_form", dlanche.OPS.NOT_SW, { object: "object" }),
];

function testFilter(filter, statusCode, exception, callback) {

    var params = {
        filter: filter,
        limit: 1,   // testing invalid filters, dont care about results
    };

    var expected = {
        statusCode: statusCode,
        exception: exception,
    };

    connection.read(DATA_SET, params, function(err, req, res, data) {

        var actual = {
            statusCode: "",
            exception: "",
        };

        if (err) {
            actual.statusCode = err.statusCode;
            actual.exception = err.name;
        } else {
            actual.statusCode = res.statusCode;
        }

        var result = "FAIL";
        if (JSON.stringify(expected) === JSON.stringify(actual)) {
            result = "PASS";
        }

        callback(null, {
            description: "filter: " + JSON.stringify(filter),
            expected: expected,
            actual: actual,
            result: result,
        });
    });
}

var connection = dlanche.createConnection();

connection.authenticate(API_KEY, "", function(err) {

    // function(callback) { ... } form so that async library works properly.
    async.series([

        // invalid format
        function(callback) { testFilter([], 400, "InvalidContentError", callback) },
        function(callback) { testFilter({}, 400, "InvalidContentError", callback) },
        function(callback) { testFilter({ object: "object1" }, 400, "InvalidContentError", callback) },
        function(callback) { testFilter({ op: "and", left: "dosage_form" }, 400, "InvalidContentError", callback) },
        function(callback) { testFilter({ op: "and", left: "dosage_form", right: "tablet", object: "object1" }, 400, "InvalidContentError", callback) },

        // invalid field names
        function(callback) { testFilter(invalidFields[0], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidFields[1], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidFields[2], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidFields[3], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidFields[4], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidFields[5], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidFields[6], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidFields[7], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidFields[8], 400, "InvalidContentError", callback) },

        // invalid operators
        function(callback) { testFilter(invalidOperators[0], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperators[1], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperators[2], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperators[3], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperators[4], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperators[5], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperators[6], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperators[7], 400, "InvalidContentError", callback) },

        // invalid value types
        function(callback) { testFilter(invalidValueTypes[0], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[1], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[2], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[3], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[4], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[5], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[6], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[7], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[8], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[9], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[10], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[11], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[12], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[13], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[14], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[15], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[16], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[17], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[18], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[19], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[20], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[21], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[22], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[23], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[24], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[25], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[26], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[27], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[28], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[29], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[30], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[31], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[32], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[33], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[34], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[35], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[36], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[37], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[38], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[39], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[40], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[41], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[42], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[43], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidValueTypes[44], 400, "InvalidContentError", callback) },

        // invalid operator types
        function(callback) { testFilter(invalidOperatorTypes[0], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[1], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[2], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[3], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[4], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[5], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[6], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[7], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[8], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[9], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[10], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[11], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[12], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[13], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[14], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[15], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[16], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[17], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[18], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[19], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[20], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[21], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[22], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[23], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[24], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[25], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[26], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[27], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[28], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[29], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[30], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[31], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[32], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[33], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[34], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[35], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[36], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[37], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[38], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[39], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[40], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[41], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[42], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[43], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[44], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[45], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[46], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[47], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[48], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[49], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[50], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[51], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[52], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[53], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[54], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[55], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[56], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[57], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[58], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[59], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[60], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[61], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[62], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[63], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[64], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[65], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[66], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[67], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[68], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[69], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[70], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[71], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[72], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[73], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[74], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[75], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[76], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[77], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[78], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[79], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[80], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[81], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[82], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[83], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[84], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[85], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[86], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[87], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[88], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[89], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[90], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[91], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[92], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[93], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[94], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[95], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[96], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[97], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[98], 400, "InvalidContentError", callback) },
        function(callback) { testFilter(invalidOperatorTypes[99], 400, "InvalidContentError", callback) },
    ],
    function(err, results) {
        var numPass = 0;
        for (var i = 0; i < results.length; i++) {
            if (results[i].result === "PASS") {
                numPass++;
            }
            console.log(JSON.stringify(results[i]));
        }
        console.log("passed: " + numPass.toString());
        console.log("failed: " + (results.length - numPass).toString());
    });

});

