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

var API_KEY = 'your_api_key';
var API_SECRET = ''; // leave empty, needed when OAuth supported

var connection = dlanche.createConnection();

// only need to authenticate once for a given connection
connection.authenticate(API_KEY, API_SECRET, function(err) {
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

The 'Read()' function allows complex data to be retieved. Think of the 'Read()' as a SELECT statement in SQL. You decide what types of data you would like and through defined paramters and filters a set of data will be retuned as a string in JSON format.

Definition:

    public string Read(string dataSetName, DLReadParams parameters);
    
#### Simple Read

The most baisc 'Read()' call is to provide default read parameters to the function:

    DLReadParams parameters = new DLReadParams();
    string result = connection.Read("medical_codes_ndc", parameters);

The result will be a string object in JSON format of 25 records. This is not filtered, sorted, or contains any special parameters.

#### Read Paramters

The available read parameters allow for greater control over what data is returned. The available read parameters are:

DLReadParams:
* List<string> fields - a list of fields to be returned in each record
* string filter - a JSON oject of filter elements (created with DLFilter see Filtering below)
* int limit - the total number of records to be returned
* int skip - the amount of records to skip before returning data
* bool total - return all data or not
* List<DLSortStruct> sort - the sort order of the data (ascending or descending, see Sorting below)

Example:
DLReadParams parameters = new DLReadParams();
    
    DLReadParams parameters = new DLReadParams();
    parameters.Fields.Add("dosage_form");                        // returns the fields dosage_form, route, and product_type
    parameters.Fields.Add("route");
    parameters.Fields.Add("product_type");
    parameters.Limit = 10;                                       // return only 10 records
    parameters.AddSort("dosage_form", DLSortType.Ascending);    // dosage form is sorted in ascending order
    parameters.AddSort("product_type", DLSortType.Descending);  // product_type is sorted in descending order
    parameters.Skip = 4;                                         // the first 4 records are skipped
    parameters.Total = false;                                    // do not return all data

    string result = connection.Read("medical_codes_ndc", parameters);
    
#### Sorting

By default, rows returned by read() are sorted in ascending order by row_index, a field all data sets possess. Rows can also be sorted in ascending or descending order based on fields in a given data set. The behavior is similar to an ORDER BY clause in SQL.
This must be applied on each field returned through the 'AddSort()'.

Example:

    parameters.AddSort("dosage_form", DLSortType.Ascending);    // dosage form is sorted in ascending order
    parameters.AddSort("product_type", DLSortType.Descending);  // product_type is sorted in descending order


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
