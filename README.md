node-datalanche
===============

Node.js client for [Datalanche's](https://www.datalanche.com) REST API.

## Install

[Create an account](https://www.datalanche.com/signup) and obtain an API key. Then install the client using the
 following command:

    npm install datalanche
 
## Establishing a Connection

Create a connection object then call `authenticate()` using your account's API key which can be found in your 
[account settings](https://www.datalanche.com/account). A future release will support 
[OAuth](http://en.wikipedia.org/wiki/OAuth) which will require an API secret as well.

```js
var dlanche = require('datalanche');

var key = 'your_api_key';
var secret = ''; // leave empty, needed when OAuth supported

var connection = dlanche.createConnection();

// only need to authenticate once for a given connection
connection.authenticate(key, secret, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('auth success');
});
```
    
## GetList

`connection.getList()` will retrieve a list of all data sets you have access to. Data sets are also listed on our 
[website](https://www.datalanche.com/datasets).

```js
connection.getList(function(err, req, res, list)) {
    console.log(JSON.stringify(list, null, '  '));
});
```
 
## GetSchema

`connection.getSchema()` will retrieve the schema for a given data set. It has the following format:
* `description` Description of the data set.
* `last_update` The date and time when the data set was last updated with this format: `YYYY-mm-dd HH:ii:ss`.
* `license` The license for the data set.
    * `name` The name of the license.
    * `url` A URL to the license (optional).
* `fields` A list of fields each with the following attributes:
    * `name` The name of the field.
    * `data_type` The field's type: `boolean, string, int16, int32, int64, float, double`.
    * `description` The field's description.

```js
var dataSetName = 'medical_codes_ndc';

connection.getSchema(dataSetName, function(err, req, res, schema)) {
    console.log(JSON.stringify(schema, null, '  '));
});
```

## Read

`connection.read()` will retrieve rows of data for a given data set. The returned data can be 
filtered, sorted, and you can choose which fields are returned. It is similar to a SELECT statement 
in SQL.

#### Parameters

* `fields` An array of fields to return. `default = all fields`
* `filter` A filter which defines which rows are returned. See [Filtering](#filtering) for details.
* `limit` The number of rows to return. `default = 25, min = 1, max = 100`
* `skip` The number of rows to skip. `default = 0`
* `sort` An array of field and sort type pairs. Returned rows will be sorted in the order specified 
with the following sort types: `asc, desc`.
* `total` Boolean whether or not to include the total number of rows in the result. This may increase query time.

```js
var dataSetName = 'medical_codes_ndc';
var params = {
    fields: [
        'dosage_form',
        'route',
        'product_type'
    ],
    filter: myFilter, // look at the Filtering section below
    limit: 5,
    skip: 0,
    sort: [
        { field: 'dosage_form', type: dlanche.OrderType.ASC },
        { field: 'product_type', type: dlanche.OrderType.DESC }
    ],
    total: false
};

connection.read(dataSetName, params, function(err, req, res, data)) {
    console.log(JSON.stringify(data, null, '  '));
});
```

<a name='filtering'/>
#### Filtering

Filtering is by far the most powerful method of definig what type of data will be returned. It can also be the most complex.

##### Simple Example:

    DLFilter filter = new DLFilter("dosage_form", DLFilterOp.EQ, "capsule");
    
##### Complex Filter:

    DLFilter filter = new DLFilter(
      new DLFilter(
          new DLFilter("dosage_form", DLFilterOp.EQ, "capsule"),
          DLFilterOp.OR,
          new DLFilter("dosage_form", DLFilterOp.EQ, "tablet")
          ),
      DLFilterOp.AND,
      new DLFilter("product_type", DLFilterOp.CONTAINS, "esc"));
