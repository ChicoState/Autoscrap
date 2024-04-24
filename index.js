const express = require('express');
const auth = require('./auth');
const postManager = require('./postManager');
const userManager = require('./userManager');
const upload = require('./fileManager');
const requestManager = require('./requestManager');
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

app.get('/request', async (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = (page - 1) * limit;
    const requests = await requestManager.getRequests(limit, offset);
    const total = await requestManager.getRequestTotal();
    res.render('request', { requests: requests, page: page, limit:limit, total: total });
});

app.get('/viewPost', async (req, res) => {
	const postId = req.query.postId;
	const post = await postManager.getPostById(postId);
	const user = await userManager.getUserById(post.authorId);
	res.render('viewPost', {post: post, user: user});
});

app.get('/account', async (req, res) => {
	const userId = req.query.userId || req.session.userId;
	const isOwnAccount = userId === req.session.userId;
    	const user = await userManager.getUserById(userId)
    	const posts = await postManager.getPostsByUserId(userId);
    	res.render('account', {isOwnAccount: isOwnAccount, username: user.username,  posts: posts});
});

app.get('/createPost', (req, res) => res.render('createPost'));
app.post('/createPost', upload.single('image'), postManager.handleCreatePost);

app.get('/createRequest', (req, res) => res.render('createRequest'));
app.post('/createRequest', upload.single('image'), requestManager.handleCreateRequest);

app.get('/signin', (req, res) => {
    const signinFailure = req.query.signinFailure == 'true';
    res.render('signin', {signinFailure: signinFailure});
});

app.post('/signin', async (req, res) => {
    const isSuccessful = await auth.signin(req, res);
    if (!isSuccessful) {
        res.redirect('/signin?signinFailure=true');
    }
});


app.get('/signup', (req, res) => {
	const signupFailure = req.query.signupFailure == 'true';
	res.render('signup', {signupFailure: signupFailure});
});

app.post('/signup', async (req, res) => {
	const isSuccessful = await auth.signup(req, res);
	if (!isSuccessful) {
		res.redirect('signup?signupFailure=true');
	}
});

app.post('/signout', (req, res) => auth.signout(req, res));

app.get('/about', (req, res) => res.render('about'));

app.get('*', (req, res) => res.redirect('/signin'));

app.listen(port, () => {
    console.log('Server started on port ' + port + '...');
});
