const express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');



/*
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');//service accounts private key - put on git ignore

//const serviceAccount = require('./.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

//firebase testing:

async function firebasetests() {
const docRef = db.collection('users').doc('alovelace');

await docRef.set({
  first: 'Ada',
  last: 'Lovelace',
  born: 1815
});

const aTuringRef = db.collection('users').doc('aturing');

await aTuringRef.set({
  'first': 'Alan',
  'middle': 'Mathison',
  'last': 'Turing',
  'born': 1912
});


const snapshot = await db.collection('users').get();
snapshot.forEach((doc) => {
  console.log(doc.id, '=>', doc.data());
});

const printval = await db.collection('collection').doc("document").get("field1");
return printval.data();

}
*/



// index page
app.get('/', function(req, res) {

    
    
    var mascots = [
        { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
        { name: 'Tux', organization: "Linux", birth_year: 1996},
        { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
      ];
      var tagline = "No programming concept is complete without a cute animal mascot.";
  res.render('pages/index', { // use res.render to load up an ejs view file
    mascots: mascots,
    tagline: tagline
  });
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

app.listen(8080);
console.log('Server is listening on port 8080');


