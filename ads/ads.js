// mongodb
const { MongoClient } = require("mongodb");
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const DB = 'bugle';
const COLLECTION = 'ads';
const EVENTCOLLECTION = 'ad_events';

async function trackClicks(adPath) {
    let ret = 0;
    console.log(`Tracking clicks for ${adPath}`); // debug

    try {
        await client.connect();
        // console.log(`Connected to ${uri}`); // debug

        const collection = client.db(DB).collection(COLLECTION);
        const ad = await collection.findOne({ 'path': adPath });

        if (ad) {
            ad.times_clicked++;
            console.log(`Clicked ${ad.path}`);
            ret = ad.times_clicked;

            await collection.updateOne({ 'path': adPath }, { $set: ad });
        } else {
            console.error(`Ad not found: ${adPath}`);
            ret = `Ad not found: ${adPath}`
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
            await collection.updateOne({ 'path': ad.path }, { $set: ad });
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

async function getAd(adPath) {
    let ret;

    try {
        await client.connect();
        const collection = client.db(DB).collection(COLLECTION);
        ret = await collection.findOne({ 'path': adPath });
        ret.times_viewed++;
        await collection.updateOne({ 'path': adPath }, { $set: ret });
    }
    catch (error) {
        console.error(error);
        throw error;
    } finally {
        await client.close();
    }

    return {"_id":ret.path, "path":ret.path};
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
        await collection.updateOne({ 'path': ret.path }, { $set: ret });
    }
    catch (error) {
        console.error(error);
        throw error;
    } finally {
        await client.close();
    }

    return ret.path;
}

async function recordEvent(event, type) {
    // console.log(event) //debug
    event.date_created = new Date().toLocaleString();
    event.event_type = type;

    let id;
    try {
        await client.connect();
        const collection = client.db(DB).collection(COLLECTION);
        id = await collection.findOne({ 'path': event.ad_id }) // the _id is actually the path text
        if (id) {
            event.ad_id = id._id;
        }
        else {
            console.error(`Ad not found: ${event._id}`);
            throw `Ad not found: ${event._id}`;
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
    finally {
        await client.close();
    }

    try {
        await client.connect();
        const collection = client.db(DB).collection(EVENTCOLLECTION);
        console.log(event)
        await collection.insertOne(event);
    }
    catch (error) {
        console.error(error);
        throw error;
    } finally {
        await client.close();
    }
}


// server
let port = 3004;
let hostname = '0.0.0.0';
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
            // console.log(`Ad clicked: ${parse.query}`); //debug
            ret = await trackClicks(parse.query.ad_id);
            await recordEvent(parse.query, 'click');
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write(ret.toString());
            response.end();
            break;
        case '/ad':
            response.writeHead(200, {'Content-Type': 'application/json'});
            let write;
            await recordEvent(parse.query, 'view');
            if (parse.query.ad) {
                write = await getAd(parse.query.ad_id);
            }
            else {
                console.log('In /ad, no ad specified, returning random ad');
                write = await getRandomName();
            }
            response.write(write.toString());
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