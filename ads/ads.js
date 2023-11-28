// mongodb
const { MongoClient } = require("mongodb");
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const DB = 'bugle';
const COLLECTION = 'ads';

async function trackClicks(adAlt) {
    try {
        await client.connect();
        const collection = client.db(DB).collection(COLLECTION);

        const ad = await collection.findOne({ 'alt': adAlt });
        if (ad) {
            ad.times_clicked++;
            console.log(`Clicked ${adAlt}`);
            await collection.updateOne({ 'alt': adAlt }, { $set: ad });
            return ad.times_clicked;
        } else {
            console.error(`Ad not found: ${adAlt}`);
            return 0;
        }
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await client.close();
    }
}

async function getAds() {
    try {
        await client.connect();
        const collection = client.db(DB).collection(COLLECTION);

        const results = await collection.find().toArray();
        results.forEach(async (ad) => {
            ad.times_viewed++;
            await collection.updateOne({ 'alt': ad.alt }, { $set: ad });
        });
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await client.close();
    }
}

// server
let port = 3004;
let hostname = 'localhost';
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
            num = await trackClicks(parse.query.ad);
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write(num.toString());
            response.end();
            break;
        default:
            response.statusCode = 404;
            response.end();
            break;
    }
});

server.listen(port, hostname, () => {
    console.log(`Ads server running at http://${hostname}:${port}/`);
});