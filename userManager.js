const db = require('./firebase');


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

const getUsername = async (userID) => {
	const users = await db.collection('users').get();
	for (const user of users.docs) {
		const data = user.data();
		if (data.userID === userID )
		{
			return data.username;
		}
	}
	return null;
}

module.exports = { 
	addUser,
	getUser,
	getUsername,
};
