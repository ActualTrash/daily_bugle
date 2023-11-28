const { MongoClient } = require("mongodb");
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const DB = 'bugle';
const COLLECTION = 'ads';

ads = [
    {
        name: 'Oscorp Industries',
        image: 'ads/images/oscorp.webp',
        alt: 'oscorp',
        times_clicked: 0,
        times_viewed: 0
    },
    {
        name: 'Stark Industries',
        image: 'ads/images/stark.jpeg',
        alt: 'stark',
        times_clicked: 0,
        times_viewed: 0
    },
    {
        name: 'S.H.I.E.L.D.',
        image: 'ads/images/shield.png',
        alt: 'shield',
        times_clicked: 0,
        times_viewed: 0
    }
];

// store each ad in the database
try {
    client.connect();
    client.db(DB).collection(COLLECTION)
        .insertMany(ads)
        .then( results => console.log(results) )
        .catch( error => console.error(error) );
} catch (error) {
    console.error(error);
} finally {
    client.close();
}