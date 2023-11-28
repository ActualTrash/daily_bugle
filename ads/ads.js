// mongodb
const { MongoClient } = require("mongodb");
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const DB = 'bugle';
const COLLECTION = 'ads';

async function trackClick(adAlt) {
    try {
        client.connect();
        client.db(DB).collection(COLLECTION)
            .findOne({ 'alt': adAlt })
            .then( results => {
                results.times_clicked++;
                console.log(`Clicked ${adAlt}`);
                client.db(DB).collection(COLLECTION)
                    .updateOne({ 'alt': adAlt }, { $set: results })
                    .then( results => console.log(results) )
                    .catch( error => console.error(error) );
            })
            .catch( error => console.error(error) );
    } catch (error) {console.error(error);} finally {client.close();}

    // clicked = document.getElementById('clicks');
    // clicked.innerHTML = "<u>Clicks</u>";
    // ads.forEach(ad => {
    //     clicked.innerHTML += `<br>${ad.name}: ${ad.times_clicked}`;
    // });
}

async function getAds() {
    try {
        client.connect();
        client.db(DB).collection(COLLECTION)
            .find()
            .toArray()
            .then( results => {
                console.log(results);
                return results;
            })
            .catch( error => console.error(error) );
    } catch (error) {console.error(error);} finally {client.close();}
}


// server
let port = 3004; 
const url = require('url');
const http = require('http');
const server = http.createServer();
server.on('error', error => console.error(error.stack));

// invoke async function based on path
server.on('request', async (request, response) => {
    console.log(`Request: ${request.method} ${request.url}`);
    parse = url.parse(request.url, true);

    switch (parse.pathname) {
        case '/':
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify(await getAds()));
            response.end();
            break;
        case '/adclick':
            await trackClick(parse.query.ad);
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify(await getAds()));
            response.end();
            break;
        default:
            response.statusCode = 404;
            response.end();
            break;
    }
});