const session = require('express-session');
const userManager = require('./userManager');

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

const signup = async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const user = await userManager.getUser(username);

	if (user) {
		console.log('Failed to sign up, username ' + username + ' already exists.');
	} else {
		const newUser = await userManager.addUser(username, password);
		console.log('Signed up with username ' + username + ' and password ' + password);
		req.session.userId = newUser.id;
		res.redirect('/browse');
	}
}

const signin = async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const user = await userManager.getUser(username, password);
	if (user) {
		req.session.userId = user.id;
		res.redirect('/browse');
		return true;
	} else {
		return false;
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
