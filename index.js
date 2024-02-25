const express = require('express');
const auth = require('./auth');
const db = require('./firebase');
const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
auth.init(app);

const getListings = async () => {
    const snapshot = await db.collection('listings').get();
    return snapshot.docs.map(doc => doc.data());
  }

app.get('/browse', async (req, res) => {
    const listings = await getListings();
    res.render('browse', { listings });
});
app.get('/signin', (req, res) => res.render('signin'));
app.post('/signin', (req, res) => auth.signin(req, res));

app.get('/signup', (req, res) => res.render('signup'));
app.post('/signup', (req, res) => auth.signup(req, res));

app.post('/signout', (req, res) => auth.signout(req, res));

app.get('/about', (req, res) => res.render('about'));

app.get('*', (req, res) => res.redirect('/signin'));

app.listen(port, () => {
    console.log('Server started on port ' + port + '...');
});
