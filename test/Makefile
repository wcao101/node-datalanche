
#host api.datalanche.com

all: pre_test test post_test

pre_test: # setup the production server
	sh pre

test: schema table selects index alter_schema database # run examples test
	
schema:
	# schema examples
	# create a schema
	echo
	echo create a schema
	node ../examples/schema/create-schema.js

	# describe the schema
	echo
	echo describe the schema
	node ../examples/schema/describe-schema.js

	# show the created schema
	echo
	echo show schemas created in my_database
	node ../examples/schema/show-schemas.js

table:
	# table examples
	# create a table
	echo
	echo testing creation of a new table with the name of my_table
	node ../examples/table/create-table.js

	# describe the table
	echo
	echo testing description of the table
	node ../examples/table/describe-table.js

	# show the tables in my_database, should return 2 tables
	echo
	echo testing showing the created tables
	node ../examples/table/show-tables.js

	# insert data into my_schema.my_table
	echo
	echo testing insertion of the values into my_table
	node ../examples/table/insert.js

	# update my_schema.my_table
	echo
	echo testing updating my_table
	node ../examples/table/update.js

	# delete my_schema.my_table
	echo
	echo testing deletion of my_table
	node ../examples/table/delete.js

	# alther the table name and the table descriptions
	echo
	echo testing alterring my_table including alterring my_schema to my_new_schema
	node ../examples/table/alter-table.js

	# create table again after altering table.
	echo
	echo create table again so as to test droping table
	node ../examples/table/create-table.js

	# show table to make sure the new table is created before drop
	echo
	echo show table to make sure the new table is created before drop
	node ../examples/table/show-tables.js

	# drop my_schema.my_table
	echo
	echo testing dropping my_table
	node ../examples/table/drop-table.js

	# show table to make sure the new table is created before drop
	echo
	echo show table to make sure the new table is created before drop
	node ../examples/table/show-tables.js

selects:
	# create sample tables for selects
	sh create_sample_tables

	# testing select example
	echo
	echo testing select all example
	node ../examples/table/select-all.js

	# testing select_search example
	echo
	echo testing select search example
	node ../examples/table/select-search.js

	# testing select_join example
	echo
	echo testing select join example
	node ../examples/table/select-join.js

index:
	# create index on my_schema.my_table
	echo
	echo testing creation of index on my_schema.my_table
	node ../examples/index/create-index.js

	# show the tables with index
	echo
	echo testing show tables with created index
	node ../examples/table/describe-table.js

	# drop index on my_schema.my_table
	echo
	echo testing dropping of index on my_schema.my_table
	node ../examples/index/drop-index.js

	# show the tables with dropped index
	echo
	echo testing show tables with dropped index
	node ../examples/table/describe-table.js

	# create index on my_schema.my_table again for testing alterring index
	echo
	echo testing creation of index on my_schema.my_table again testing alterring index
	node ../examples/index/create-index.js

	# show the tables with index
	echo
	echo testing show tables with created index before alterring index
	node ../examples/table/describe-table.js

	# alter index on my_schema.my_table
	echo
	echo testing alterring of index on my_schema.my_table
	node ../examples/index/alter-index.js

	# show the tables with alterred index
	echo
	echo testing show tables with alterred index
	node ../examples/table/describe-table.js

alter_schema:
	#echo drop the schema: my_new_schema before testing alter_schema example
	echo
	echo drop the schema: my_new_schema before testing alter_schema example
	curl https://api.datalanche.com/my_database/query -X POST -u "GoyY7hI2S5igDS4pG2Vdyg==:e02C96sqR5mvUoQXkCC2Gg==" -H "Content-Type: application/json" -d '{
	"drop_schema": "my_new_schema",
	"cascade": true
	}'

	# alter my_schema to my_new_schema
	echo
	echo alter the schema from my_schema to my_new_schema
	node ../examples/schema/alter-schema.js

	# show schema which should show my_new_schema
	echo
	echo testing show schema for making sure schema is alterred.
	node ../examples/schema/show-schemas.js

	#create the schema again to test drop schema.
	echo
	echo create schema again to test dropping schema
	node ../examples/schema/create-schema.js

	# show schema which should show my_schema and my_new_schema
	echo
	echo make sure my_schema is existed.
	node ../examples/schema/show-schemas.js

	# drop my_schema
	echo
	echo testing droping schema
	node ../examples/schema/drop-schema.js

	# show schema which should show new_schema only
	echo
	echo testing show schema for making sure my_schema is dropped.
	node ../examples/schema/show-schemas.js

database:
	# database examples
	# describe the database
	echo
	echo testing describe database
	node ../examples/database/describe-database.js

	# show the database
	echo
	echo testing showing database
	node ../examples/database/show-databases.js

	# alther the database
	echo
	echo testing altering database
	node ../examples/database/alter-database.js

	# show the database after altered
	echo
	echo testing show database, should display my_new_database
	node ../examples/database/show-databases.js

	# alter the my_new_database to my_database
	echo
	echo  alter the my_new_database to my_database
	curl https://api.datalanche.com/query -X POST -u "GoyY7hI2S5igDS4pG2Vdyg==:e02C96sqR5mvUoQXkCC2Gg==" -H "Content-Type: application/json" -d '{
	"alter_database": "my_new_database",
	"rename_to": "my_database"
	}'

	# show the database to check if the database is altered back to my_database
	echo
	echo Make sure the name of my_new_database is changed back to my_database
	node ../examples/database/show-databases.js
