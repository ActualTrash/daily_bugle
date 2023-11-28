const { MongoClient } = require("mongodb");
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
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
        teaser: 'The Daily Bugle',
        body: 'This is the first article in the Daily Bugle.'
        author: 'J. Jonah Jameson',
        date_created: new Date().toLocaleString(),
        date_modified: new Date().toLocaleString(),
    },
    {
        title: 'Spider-Man',
        teaser: 'The Daily Bugle',
        body: 'Look at these cool photos I took!'
        author: 'Peter Parker',
        date_created: new Date().toLocaleString(),
        date_modified: new Date().toLocaleString(),
    },
    {
        title: 'The Avengers',
        teaser: 'The Daily Bugle',
        body: 'I could literally buy the Daily Bugle.'
        author: 'Tony Stark',
        date_created: new Date().toLocaleString(),
        date_modified: new Date().toLocaleString(),
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

// store each ad in the database
try {
    client.connect();
    client.db(DB).collection(ADS)
        .insertMany(ads)
        .then( results => console.log(results) )
        .catch( error => console.error(error) );
} catch (error) {
    console.error(error);
} finally {
    client.close();
}

// store each article in the database
try {
    client.connect();
    client.db(DB).collection(ARTICLE)
        .insertMany(articles)
        .then( results => console.log(results) )
        .catch( error => console.error(error) );
} catch (error) {
    console.error(error);
} finally {
    client.close();
}

try {
    client.connect();
    client.db(DB).collection(USERS)
        .insertMany(users)
        .then( results => console.log(results) )
        .catch( error => console.error(error) );
} catch (error) {
    console.error(error);
} finally {
    client.close();
}
