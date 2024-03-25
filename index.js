const express = require('express');
const auth = require('./auth');
const session = require('express-session');
const postManager = require('./postManager');
const userManager = require('./userManager');
const db = require('./firebase');
const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
auth.init(app);

app.get('/browse', async (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = (page - 1) * limit;
    const posts = await postManager.getPosts(limit, offset);
    const total = await postManager.getPostsTotal();
    res.render('browse', { posts: posts, page: page, limit:limit, total: total });
});

app.get('/account', async (req, res) => {
    const username = await userManager.getUsernamebyID(req.session.userId);
    res.render('account', { username : username });
});

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
