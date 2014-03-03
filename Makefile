API_CREDENTIALS =  GoyY7hI2S5igDS4pG2Vdyg==:e02C96sqR5mvUoQXkCC2Gg==
DB_QUERY_URL = https://api.datalanche.com/my_database/query 
QUERY_URL = https://api.datalanche.com/query 
CURL_OPTS_DROP_SCHEMA = -X POST -u "$(API_CREDENTIALS)" -H "Content-Type: application/json" -d '{ "drop_schema": "my_new_schema", "cascade": true }'
CURL_OPTS_ALTER_DATABASE = -X POST -u "$(API_CREDENTIALS)" -H "Content-Type: application/json" -d '{ "alter_database": "my_new_database", "rename_to": "my_database"}'

#host api.datalanche.com
all: target

target:  test

test: pre_test test_schema test_table test_selects test_index test_alter_schema test_database # run examples test
	
test_schema: pre_test
	# schema examples
	# create a schema
	node ./examples/schema/create_schema.js

	# describe the schema
	node ./examples/schema/describe_schema.js

	# show the created schema
	node ./examples/schema/show_schemas.js

test_table: test_schema
	# table examples
	# create a table
	node ./examples/table/create_table.js

	# describe the table
	node ./examples/table/describe_table.js

	# show the tables in my_database, should return 2 tables
	node ./examples/table/show_tables.js

	# insert data into my_schema.my_table
	node ./examples/table/insert.js

	# update my_schema.my_table
	node ./examples/table/update.js

	# delete my_schema.my_table
	node ./examples/table/delete.js

	# alther the table name and the table descriptions
	node ./examples/table/alter_table.js

	# create table again after altering table.
	node ./examples/table/create_table.js

	# show table to make sure the new table is created before drop
	node ./examples/table/show_tables.js

	# drop my_schema.my_table
	node ./examples/table/drop_table.js

	# show table to make sure the new table is created before drop
	node ./examples/table/show_tables.js

test_selects: test_schema
	# create sample tables for selects
	sh ./test/create_sample_tables

	# testing select example
	node ./examples/table/select_all.js

	# testing select_search example
	node ./examples/table/select_search.js

	# testing select_join example
	node ./examples/table/select_join.js

test_index: test_selects
	# create index on my_schema.my_table
	node ./examples/index/create_index.js

	# show the tables with index
	node ./examples/table/describe_table.js

	# drop index on my_schema.my_table
	node ./examples/index/drop_index.js

	# show the tables with dropped index
	node ./examples/table/describe_table.js

	# create index on my_schema.my_table again for testing alterring index
	node ./examples/index/create_index.js

	# show the tables with index
	node ./examples/table/describe_table.js

	# alter index on my_schema.my_table
	node ./examples/index/alter_index.js

	# show the tables with alterred index
	node ./examples/table/describe_table.js

test_alter_schema: test_schema
	#echo drop the schema: my_new_schema before testing alter_schema example
	curl $(DB_QUERY_URL) $(CURL_OPTS_DROP_SCHEMA)

	# alter my_schema to my_new_schema
	node ./examples/schema/alter_schema.js

	# show schema which should show my_new_schema
	node ./examples/schema/show_schemas.js

	#create the schema again to test drop schema.
	node ./examples/schema/create_schema.js

	# show schema which should show my_schema and my_new_schema
	node ./examples/schema/show_schemas.js

	# drop my_schema
	node ./examples/schema/drop_schema.js

	# show schema which should show new_schema only
	node ./examples/schema/show_schemas.js

test_database:
	# database examples
	# describe the database
	node ./examples/database/describe_database.js

	# show the database
	node ./examples/database/show_databases.js

	# alther the database
	node ./examples/database/alter_database.js

	# show the database after altered
	node ./examples/database/show_databases.js

	# alter the my_new_database to my_database
	curl $(QUERY_URL) $(CURL_OPTS_ALTER_DATABASE)

	# show the database to check if the database is altered back to my_database
	node ./examples/database/show_databases.js

pre_test: # setup the production server
	sh ./test/pre

.PHONY: test test_schema test_tables test_database test_
