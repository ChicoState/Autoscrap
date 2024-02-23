const session = require('express-session');
const db = require('./firebase');

const init = (app) => {
	app.use(session({
		secret: 'not sooper dooper secret', // to be secure we will need to read some secret key from privatekeys directory
		resave: false,
		saveUninitialized: true
	}));

	app.use((req, res, next) => {
		const isSessionRequired = req.path !== '/signin' && req.path !== '/signup';
		if (!req.session.userId && isSessionRequired) {
			res.redirect('/signin');
		} else {
			next();
		}
	});
}

const getUser = async (username, password=null) => {
	const users = await db.collection('users').get();
	for (const user of users.docs) {
		const data = user.data();
		if (data.username === username &&
		   (password === null || data.password == password))
		{
			return user;
		}
	}
	return null;
}

const signup = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	console.log('Signed up with username ' + username + ' and password ' + password);
	// later this will login and redirect to /browse
}

const signin = async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const user = await getUser(username, password);

	if (user) {
		console.log('Signed in with username ' + username + ' and password ' + password);
		req.session.userId = user.id;
		res.redirect('/browse');
	} else {
		console.log('Failed to sign in with username ' + username + ' and password ' + password);
	}		
}

const signout = (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			console.log('Signout failed.');
			res.sendStatus(500);
		} else {
			res.redirect('/signin');
		}
	});
}

module.exports = {
	init,
	signup,
	signin,
	signout
};
