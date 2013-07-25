
var q = new dl.Query();

// get_dataset_info
#q.getDatasetInfo(''); // DONE

// get_dataset_list
#q.getDatasetList(); // DONE

// create_table
#q.createTable('') // DONE
#q.description('')
#q.isPrivate(true)
#q.license({})
#q.sources([{}])
#q.columns([{}]);

// drop_table
#q.dropTable(''); // DONE

// alter_table
#q.alterTable(''); // DONE
#q.rename('');
#q.description('');
#q.isPrivate(true);
#q.license({});
#q.sources([{}]);
#q.addColumn({});
#q.dropColumn('');
#q.alterColumn('', {});

// select_from
#q.select(''); OR q.select([]); OR q.selectAll(); // DONE
#q.distinct(true);
#q.from(''); OR q.from([]);
#q.where({});
#q.orderBy({}); OR q.orderBy([ {} ]);
#q.offset(1);
#q.limit(1);
#q.total(false);

// insert_into
#q.insertInto(''); // DONE
#q.values({}); OR q.values([ {} ]);

// delete_from
#q.deleteFrom(''); // DONE
#q.where({});

// update
#q.update(''); // DONE
#q.set({});
#q.where({});

q.share('');
q.addCollaborator({});
q.dropCollaborator('');
q.alterCollaborator('', '');

var client = new dl.Client();

client.query(q, function(err, result) { ... });

client.close();
