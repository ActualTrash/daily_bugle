// articles microservice
const express = require('express');
const app = express();

const { MongoClient, ObjectId } = require("mongodb");
const uri = 'mongodb://10.10.140.27:27017';
const client = new MongoClient(uri);
const DB = 'bugle';
const COLLECTION = 'users';

let port = 3005;

app.use(express.json());
app.listen(port, () => console.log(`listening on port ${port}`));

// READ
app.get('/authenticate', async (request, response) => {
    console.log('GET /authenticate', JSON.stringify(request.query));
    const username = request.query.username;
    const password = request.query.password;
    if ( username == null || password == null ) {
        console.error('missing fields in authenticate. Expected username, password');
        response.status(400).send({'error': 'missing fields in authenticate. Expected username, password'});
        return;
    }

    try {
        await client.connect();
        await client.db(DB).collection(COLLECTION)
            .find({'username': username, 'password': password})
            .toArray()
            .then ( results => {
                if ( results.length ) {
                    response.send( results[0] );
                } else {
                    response.send( {} );
                }
            })
            .catch( error => {
                response.error(400).send({'error':'error'});
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
});
