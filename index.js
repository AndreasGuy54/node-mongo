const MongoClient = require('mongodb').MongoClient;
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'nucampsite';

// client connection to mongodb server
MongoClient.connect(url, { useUnifiedTopology: true }).then(client => {

    console.log('Connected correctly to server');

    const db = client.db(dbname);

    // delete campsites collection
    db.dropCollection('campsites')
    .then(result => {
        console.log('Dropped Collection:', result);
    })
    .catch(err => console.log('No collection to drop.'));

    // insert document and view documents in campsites collection
    dboper.insertDocument(db, {name: "Breadcrumb Trail Campground", description: "Test"}, 'campsites')
    .then(result => {
        console.log('Insert Document:', result.ops);

        return dboper.findDocuments(db, 'campsites');
    }) 
    .then(docs => {
        console.log('Found Documents:', docs);

        //update document and view list of documents to verify update
        return dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" },
            { description: "Updated Test Description" }, 'campsites');
    })
    .then(result => {
        console.log('Updated Document Count:', result.result.nModified); //count of updated documnets

        return dboper.findDocuments(db, 'campsites');
    })
    .then(docs => {
        console.log('Found Documents:', docs);

        //delete document and view list of documents to verify deletion
        return dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
            'campsites');
    })
    .then(result => {
        console.log('Deleted Document Count:', result.deletedCount); //count of deleted documents

        return client.close();
    })
    .catch(err => {
        console.log(err);
        client.close();
    });
})
.catch(err => console.log(err));
