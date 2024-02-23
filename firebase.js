const admin = require('firebase-admin');
const account = require('./privatekeys/firebaseKey.json');

admin.initializeApp({
	credential: admin.credential.cert(account)
});

module.exports = admin.firestore();

