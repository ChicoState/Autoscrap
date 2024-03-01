const express = require('express');
const auth = require('./auth');
const postManager = require('./postManager');
const userManager = require('./userManager');
const db = require('./firebase');
const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
auth.init(app);



app.get('/browse', async (req, res) => {
    const posts = await postManager.getPosts();
    res.render('browse', { posts });
});

app.get('/account', async (req, res) => {
    const username = await userManager.getUsername(req.session.userID);
    res.render('account', { userID : username });
})

app.get('/createPost', (req, res) => res.render('createPost'));
app.post('/createPost', (req, res) => postManager.handleCreatePost(req, res));

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
