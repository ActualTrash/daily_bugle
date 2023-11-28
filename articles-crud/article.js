// articles microservice
const express = require('express');
const app = express();

const { MongoClient } = require("mongodb");
const uri = 'mongodb://10.10.140.27:27017';
const client = new MongoClient(uri);
const DB = 'bugle';
const COLLECTION = 'articles';

let port = 3003;

app.use(express.json());
app.listen(port, () => console.log(`listening on port ${port}`));

// CREATE
app.post('/', async (request, response) => {
    const title = request.body.title;
    const author = request.body.author;
    const date_modified = new Date().toLocaleString();
    const body = request.body.body;

    if ( !title || !author || !body ) {
        //return { 'succuss': false, 'message': 'missing fields in article. Expected title, author, body' }
        return;
    }

    // Create an object to match article object in mongo
    const article = {
        'title': title,
        'author': request,
        'date_modified': date_modified,
        'body': body,
    };

    // write to mongo
    try {
        await client.connect();
        await client.db(DB).collection(COLLECTION)
            .insertOne(article)
            .then( results => response.send(results) )
            .catch( error => console.error(error) );
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
});

// READ
app.get('/', async (request, response) => {
    // load voter data - READ
    try {
        await client.connect();
        await client.db(DB).collection(COLLECTION)
            .find()
            .toArray()
            .then ( results => {
                response.send( results );
            })
            .catch( error => console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
});


// UPDATE, PUT
app.put('/', async ( request, response) => {
    const id = request.body._id;
    const title = request.body.title;
    const author = request.body.author;
    const date_modified = new Date().toLocaleString();
    const body = request.body.body;

    if ( !id || !title || !author || !body ) {
        return;
    }

    // Create an object to match article object in mongo
    const newArticle = {
        'title': title,
        'author': request,
        'date_modified': date_modified,
        'body': body,
    };

    console.log(`Updating article ${_id}. New content:\n  title: ${title}\n  author: ${author}\n  date_modified: ${date_modified}\n  body: ${body}`);
    const articleFilter = { '_id': id }; // the article we are updating
    try {
        await client.connect();
        await client.db(DB).collection(COLLECTION)
            .updateOne(articleFilter, newArticle)
            .then( results => response.send(results) )
            .catch( error=> console.error(error) );
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
});


// DELETE, DELETE
app.delete('/', async (request,response) => {
    const articleFilter = { '_id': request.body._id };
    try {
        await client.connect();
        await client.db(DB).collection(COLLECTION)
            .deleteOne(articleFilter)
            .then( results => response.send(results) )
            .catch( error => console.error(error) );
    } catch(error) {
        console.error(error);
    } finally {
        client.close();
    }
});
