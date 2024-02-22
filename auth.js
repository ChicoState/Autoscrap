const session = require('express-session');

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

const signup = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	console.log('Signed up with username ' + username + ' and password ' + password);
	// later this will login and redirect to /browse
}

const signin = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	console.log('Signed in with username ' + username + ' and password ' + password);

	// session id is arbitrary... for now
	req.session.userId = 1;
	res.redirect('/browse');
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
