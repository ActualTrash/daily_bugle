// mongodb
const { MongoClient } = require("mongodb");
const uri = 'mongodb://192.168.0.182:27017';
const client = new MongoClient(uri);
const DB = 'bugle';
const COLLECTION = 'ads';

async function trackClicks(adAlt) {
    let ret = 0;
    // console.log(`Tracking clicks for ${adAlt}`); // debug

    try {
        await client.connect();
        // console.log(`Connected to ${uri}`); // debug

        const collection = client.db(DB).collection(COLLECTION);
        const ad = await collection.findOne({ 'alt': adAlt });

        if (ad) {
            ad.times_clicked++;
            console.log(`Clicked ${adAlt}`);
            ret = ad.times_clicked;

            await collection.updateOne({ 'alt': adAlt }, { $set: ad });
        } else {
            console.error(`Ad not found: ${adAlt}`);
            ret = `Ad not found: ${adAlt}. Remember the format is /adclick?ad=<name>`
        }
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await client.close();
        // console.log(`Closed connection to ${uri}`); // debug
    }

    return ret;
}

async function getAds() {
    let results;

    try {
        await client.connect();
        // console.log(`Connected to ${uri}`); // debug
        const collection = client.db(DB).collection(COLLECTION);

        results = await collection.find().toArray();

        for (const ad of results) {
            ad.times_viewed++;
            await collection.updateOne({ 'alt': ad.alt }, { $set: ad });
        }

        // console.log(`Transaction complete`); // debug
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await client.close();
        // console.log(`Closed connection to ${uri}`); // debug
    }

    return results;
}

async function getAd(adAlt) {
    let ret;

    try {
        await client.connect();
        const collection = client.db(DB).collection(COLLECTION);
        ret = await collection.findOne({ 'alt': adAlt });
        ret.times_viewed++;
        await collection.updateOne({ 'alt': adAlt }, { $set: ret });
    }
    catch (error) {
        console.error(error);
        throw error;
    } finally {
        await client.close();
    }

    return ret;
}

async function getRandomName() {
    let ret;

    try {
        await client.connect();
        const collection = client.db(DB).collection(COLLECTION);
        const ads = await collection.find().toArray();
        const index = Math.floor(Math.random() * ads.length);
        ret = ads[index];
        ret.times_viewed++;
        await collection.updateOne({ 'alt': ret.alt }, { $set: ret });
    }
    catch (error) {
        console.error(error);
        throw error;
    } finally {
        await client.close();
    }

    return {'alt': ret.alt, '_id': ret._id};
}


// server
let port = 3004;
let hostname = '0.0.0.0';
const url = require('url');
const http = require('http');
const { write } = require("fs");
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
            // console.log(`Ad clicked: ${parse.query}`); //debug
            ret = await trackClicks(parse.query.ad);
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write(ret.toString());
            response.end();
            break;
        case '/ad':
            response.writeHead(200, {'Content-Type': 'application/json'});
            let write;
            if (parse.query.ad) {
                write = await getAd(parse.query.ad);
            }
            else {
                console.log('In /ad, no ad specified, returning random ad');
                write = await getRandomName();
            }
            response.write(JSON.stringify(write));
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