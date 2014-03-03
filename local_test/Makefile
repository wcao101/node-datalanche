
#host localhost

all: pre_test test

pre_test: # setup the production server
	sh pre

test: schema table selects index alter_schema database # run examples test
	
schema:
	# schema examples
	# create a schema
	echo
	echo create a schema
	node ../local_examples/schema/create_schema.js

	# describe the schema
	echo
	echo describe the schema
	node ../local_examples/schema/describe_schema.js

	# show the created schema
	echo
	echo show schemas created in my_database
	node ../local_examples/schema/show_schemas.js

table:
	# table examples
	# create a table
	echo
	echo testing creation of a new table with the name of my_table
	node ../local_examples/table/create_table.js

	# describe the table
	echo
	echo testing description of the table
	node ../local_examples/table/describe_table.js

	# show the tables in my_database, should return 2 tables
	echo
	echo testing showing the created tables
	node ../local_examples/table/show_tables.js

	# insert data into my_schema.my_table
	echo
	echo testing insertion of the values into my_table
	node ../local_examples/table/insert.js

	# update my_schema.my_table
	echo
	echo testing updating my_table
	node ../local_examples/table/update.js

	# delete my_schema.my_table
	echo
	echo testing deletion of my_table
	node ../local_examples/table/delete.js

	# alther the table name and the table descriptions
	echo
	echo testing alterring my_table including alterring my_schema to my_new_schema
	node ../local_examples/table/alter_table.js

	# create table again after altering table.
	echo
	echo create table again so as to test droping table
	node ../local_examples/table/create_table.js

	# show table to make sure the new table is created before drop
	echo
	echo show table to make sure the new table is created before drop
	node ../local_examples/table/show_tables.js

	# drop my_schema.my_table
	echo
	echo testing dropping my_table
	node ../local_examples/table/drop_table.js

	# show table to make sure the new table is created before drop
	echo
	echo show table to make sure the new table is created before drop
	node ../local_examples/table/show_tables.js

selects:
	# create sample tables for selects
	sh create_sample_tables

	# testing select example
	echo
	echo testing select all example
	node ../local_examples/table/select_all.js

	# testing select_search example
	echo
	echo testing select search example
	node ../local_examples/table/select_search.js

	# testing select_join example
	echo
	echo testing select join example
	node ../local_examples/table/select_join.js

index:
	# create index on my_schema.my_table
	echo
	echo testing creation of index on my_schema.my_table
	node ../local_examples/index/create_index.js

	# show the tables with index
	echo
	echo testing show tables with created index
	node ../local_examples/table/describe_table.js

	# drop index on my_schema.my_table
	echo
	echo testing dropping of index on my_schema.my_table
	node ../local_examples/index/drop_index.js

	# show the tables with dropped index
	echo
	echo testing show tables with dropped index
	node ../local_examples/table/describe_table.js

	# create index on my_schema.my_table again for testing alterring index
	echo
	echo testing creation of index on my_schema.my_table again testing alterring index
	node ../local_examples/index/create_index.js

	# show the tables with index
	echo
	echo testing show tables with created index before alterring index
	node ../local_examples/table/describe_table.js

	# alter index on my_schema.my_table
	echo
	echo testing alterring of index on my_schema.my_table
	node ../local_examples/index/alter_index.js

	# show the tables with alterred index
	echo
	echo testing show tables with alterred index
	node ../local_examples/table/describe_table.js

alter_schema:
	#echo drop the schema: my_new_schema before testing alter_schema example
	echo
	echo drop the schema: my_new_schema before testing alter_schema example
	curl https://localhost:4001/my_database/query \
	 	-X POST -k \
		-u "xeeFjAIlQMi/E+q4uFe1Rg==:6X3eolu/QFyds2BpJdMONg==" \
		-H "Content-Type: application/json" \
		-d '{ "drop_schema": "my_new_schema", "cascade": true }'

	# alter my_schema to my_new_schema
	echo
	echo alter the schema from my_schema to my_new_schema
	node ../local_examples/schema/alter_schema.js

	# show schema which should show my_new_schema
	echo
	echo testing show schema for making sure schema is alterred.
	node ../local_examples/schema/show_schemas.js

	#create the schema again to test drop schema.
	echo
	echo create schema again to test dropping schema
	node ../local_examples/schema/create_schema.js

	# show schema which should show my_schema and my_new_schema
	echo
	echo make sure my_schema is existed.
	node ../local_examples/schema/show_schemas.js

	# drop my_schema
	echo
	echo testing droping schema
	node ../local_examples/schema/drop_schema.js

	# show schema which should show new_schema only
	echo
	echo testing show schema for making sure my_schema is dropped.
	node ../local_examples/schema/show_schemas.js

database:
	# database examples
	# describe the database
	echo
	echo testing describe database
	node ../local_examples/database/describe_database.js

	# show the database
	echo
	echo testing showing database
	node ../local_examples/database/show_databases.js

	# alther the database
	echo
	echo testing altering database
	node ../local_examples/database/alter_database.js

	# show the database after altered
	echo
	echo testing show database, should display my_new_database
	node ../local_examples/database/show_databases.js

	# alter the my_new_database to my_database
	echo
	echo  alter the my_new_database to my_database
	curl https://localhost:4001/query -X POST \
	-k -u "xeeFjAIlQMi/E+q4uFe1Rg==:6X3eolu/QFyds2BpJdMONg==" \
	-H "Content-Type: application/json" \
	-d '{ "alter_database": "my_new_database", "rename_to": "my_database"}'

	# show the database to check if the database is altered back to my_database
	echo
	echo Make sure the name of my_new_database is changed back to my_database
	node ../local_examples/database/show_databases.js
