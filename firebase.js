const admin = require('firebase-admin');
const account = require('./privatekeys/firebaseKey.json');

admin.initializeApp({
	credential: admin.credential.cert(account)
});

const storage = admin.storage();
const firestore = admin.firestore();

module.exports = {firestore, storage};