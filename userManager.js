const db = require('./firebase');


const addUser = async (username, password) => {
	const newUser = await db.firestore.collection('users').add({
		username: username,
		password: password
	});
	return newUser;
}

const getUser = async (username, password=null) => {
	const users = await db.firestore.collection('users').get();
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

const getUserById = async (userId) => {
	const users = await db.firestore.collection('users').get();
	for (const user of users.docs) {
		const data = user.data();
		if (userId === user.id)
		{
			data.userId = userId;
			return data
		}
	}
	return null;
}


module.exports = { 
	addUser,
	getUser,
	getUserById
};
