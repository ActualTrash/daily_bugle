const { MongoClient } = require("mongodb");

const uri = 'mongodb://localhost:27017';  // Use "localhost" because the MongoDB container is running in the same network namespace
const client = new MongoClient(uri, { useUnifiedTopology: true });

const DB = 'bugle';
const ADS = 'ads';
const ARTICLE = 'articles';
const USERS = 'users';

ads = [
    {
        name: 'Oscorp Industries',
        path: 'oscorp.png',
        times_clicked: 0,
        times_viewed: 0
    },
    {
        name: 'Stark Industries',
        path: 'stark',
        times_clicked: 0,
        times_viewed: 0
    },
    {
        name: 'S.H.I.E.L.D.',
        path: 'shield.png',
        times_clicked: 0,
        times_viewed: 0
    }
];

articles = [
    {
        title: 'The Daily Bugle',
        author: 'J. Jonah Jameson',
        date_created: new Date().toLocaleString(),
        date_modified: new Date().toLocaleString(),
        body: 'This is the first article in the Daily Bugle.'
    },
    {
        title: 'Spider-Man',
        author: 'Peter Parker',
        date_created: new Date().toLocaleString(),
        date_modified: new Date().toLocaleString(),
        body: 'Look at these cool photos I took!'
    },
    {
        title: 'The Avengers',
        author: 'Tony Stark',
        date_created: new Date().toLocaleString(),
        date_modified: new Date().toLocaleString(),
        body: 'I could literally buy the Daily Bugle.'
    }
];

users = [
    {
        username: 'jameson',
        password: 'password',
        role: 'author'
    },
    {
        username: 'parker',
        password: 'password',
        role: 'author'
    },
    {
        username: 'stark',
        password: 'password',
        role: 'author'
    },
    {
        username: 'fury',
        password: 'password',
        role: 'reader'
    },
    {
        username: 'osborn',
        password: 'password',
        role: 'reader'
    },
    {
        username: 'rogers',
        password: 'password',
        role: 'reader'
    }
];

async function populateCollection(collectionName, data) {
    try {
        await client.connect();
        const result = await client.db(DB).collection(collectionName).insertMany(data);
        console.log(`Inserted ${result.insertedCount} documents into ${collectionName}`);
    } catch (error) {
        console.error(`Error inserting documents into ${collectionName}:`, error);
    } finally {
        await client.close();
    }
}

// Populate collections
populateCollection(ADS, ads);
populateCollection(ARTICLE, articles);
populateCollection(USERS, users);
