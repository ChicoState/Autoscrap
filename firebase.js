const admin = require('firebase-admin');
const account = require('./privatekeys/firebaseKey.json');

admin.initializeApp({
	credential: admin.credential.cert(account),
    storageBucket: "gs://autoscrap-4910c.appspot.com"
});

const storage = admin.storage();
const firestore = admin.firestore();

module.exports = {firestore, storage};