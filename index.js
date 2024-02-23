const express = require('express');
const auth = require('./auth');
const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
auth.init(app);

app.get('/browse', (req, res) => res.render('browse'));

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
