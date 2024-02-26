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

const addUser = async (username, password) => {
	const newUser = await db.collection('users').add({
		username: username,
		password: password
	});
	return newUser;
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



const signup = async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const user = await getUser(username);

	if (user) {
		console.log('Failed to sign up, username ' + username + ' already exists.');
	} else {
		const newUser = await addUser(username, password);
		console.log('Signed up with username ' + username + ' and password ' + password);
		req.session.userId = newUser.id;
		res.redirect('/browse');
	}
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
