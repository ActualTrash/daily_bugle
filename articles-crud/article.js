// articles microservice
const express = require('express');
const app = express();

const { MongoClient, ObjectId } = require("mongodb");
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
    const teaser = request.body.teaser;
    const author = request.body.author;
    const date_modified = new Date().toLocaleString();
    const body = request.body.body;

    if ( title == null || author == null || body == null || teaser == null ) {
        //return { 'succuss': false, 'message': 'missing fields in article. Expected title, author, body' }
        console.error('missing fields in comment. Expected title, author, body, teaser');
        response.status(400).send({'error': 'missing fields in article. Expected title, author, body, teaser'});
        return;
    }

    // Create an object to match article object in mongo
    const article = {
        'title': title,
        'teaser': title,
        'author': author,
        'date_created': date_modified,
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
        await client.close();
    }
});

// READ
app.get('/', async (request, response) => {
    // load voter data - READ
    let filter = {};
    if ( request.query.article_id ) {
        const id = request.query.article_id;
        if ( id.length !== 24 ) {
            console.error('Invalid article ID: ', id);
            response.status(400).send({'error': 'Invalid article id: ' + id});
            return;
        }
        filter = { '_id': new ObjectId(id) };
    }

    try {
        await client.connect();
        await client.db(DB).collection(COLLECTION)
            .find(filter)
            .toArray()
            .then ( results => {
                results.sort( (a,b) => {
                    return b.date_created - a.date_created;
                });
                if ( request.query.article_id && results.length ) {
                    results = results[0];
                }
                response.send( results );
            })
            .catch( error => console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
});




// UPDATE, PUT
app.put('/', async ( request, response) => {
    const id = request.body._id;
    const title = request.body.title;
    const teaser = request.body.teaser;
    const author = request.body.author;
    const date_modified = new Date().toLocaleString();
    const body = request.body.body;

    if ( id == null || title == null || author == null || body == null || teaser == null ) {
        console.error('missing fields in comment. Expected _id, title, author, body, teaser');
        response.status(400).send({'error': 'missing fields in article. Expected _id, title, author, body, teaser'});
        return;
    }

    // Create an object to match article object in mongo
    const newArticle = {
        'title': title,
        'teaser': title,
        'author': author,
        'date_modified': date_modified,
        'body': body,
    };

    console.log(`Updating article ${id}. New content:\n  title: ${title}\n  author: ${author}\n  date_modified: ${date_modified}\n  body: ${body}`);
    try {
        await client.connect();
        await client.db(DB).collection(COLLECTION)
            .updateOne({ '_id': new ObjectId(id) }, { $set: newArticle })
            .then( results => response.send(results) )
            .catch( error=> {
                console.error(error);
                response.status(500).send({'error': 'database error'});
            });
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
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
        await client.close();
    }
});

app.post('/comment', async (request, response) => {
    const comment = request.body.comment;
    const article_id = request.body.article_id;
    const contributer = request.body.contributer;

    if ( comment == null || article_id == null || contributer == null ) {
        console.error('missing fields in comment. Expected comment, article_id, contributer');
        response.status(400).send({'error': 'missing fields in comment. Expected comment, article_id, contributer'});
        return;
    }

    const myComment = {
        'comment': comment,
        'article_id': article_id,
        'contributer': contributer,
        'date_created': new Date().getTime()
    };

    try {
        await client.connect();
        await client.db(DB).collection('comments')
            .insertOne(myComment)
            .then( results => response.send(results) )
            .catch( error => console.error(error) );
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
});

app.get('/comment', async (request, response) => {
    const article_id = request.query.article_id;
    if ( article_id == null ) {
        console.error('Need article_id to get comments');
        response.status(400).send([]);
        return;
    }

    try {
        await client.connect();
        await client.db(DB).collection('comments')
            .find( { 'article_id': article_id } )
            .toArray()
            .then( (results) => {
                // sort by date_created
                results.sort( (a,b) => {
                    return b.date_created - a.date_created;
                });
                response.send(results);
            })
            .catch( error => console.error(error) );
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
});
