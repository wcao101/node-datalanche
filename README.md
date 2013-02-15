node-datalanche
===============

Node.js client for Datalanche's REST API.

## Install

[Create an account](https://www.datalanche.com/signup) and obtain an API key. Then install the client using the
 following command:

    npm install datalanche
 
## Establishing a Connection

Create a connection object then authenticate using your account's API key which can be found in your 
[account settings](https://www.datalanche.com/account). A future release will support 
[OAuth](http://en.wikipedia.org/wiki/OAuth) which will require an API secret as well.

```javascript
var dlanche = require('datalanche');

var API_KEY = 'your_account_key';
var API_SECRET = ''; // leave empty, needed when OAuth supported

var connection = dlanche.createConnection();

// only need to authenticate once for a given connection
connection.authenticate(API_KEY, API_SECRET, function(err) {
    if (err) {
        console.log(err);
    }
    console.log('auth success');
});
```
    
## Getting Dataset List

In order to get a listing of the datasets avaialbe throught the API you must first call 'GetList()'. This will return a string object in JSON format with a list of the available datasets.

Definition:

    public string GetList();

Example:

    string result = connection.GetList();
    
## Get Chosen Dataset Schema

Each dataset has a Schema that it follows. To request the schema of any dataset call 'GetSchema()'

Definition:

    public string GetSchema(string datasetName); 

* datasetName - the name of the dataset you would like the schema for (can be found with GetList())

Example:

    string result = connection.GetSchema("medical_codes_ndc");

## Read Functions

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
