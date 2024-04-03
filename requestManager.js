const db = require('./firebase');

const createRequest = async (authorId, currentBid, description, title, unixTime) => {
	const newRequest = await db.collection('requests').add({
		authorId: authorId,
		currentBid: currentBid,
		description: description,
		title: title,
		unixTime: unixTime
	});
	return newRequest;
}

const handleCreateRequest = async (req, res) => {
	const authorId = req.session.userId;
	const currentBid = req.body.currentBid;
	const description = req.body.description;
	const title = req.body.title;
	const unixTime = Date.now();
	await createRequest(authorId, currentBid, description, title, unixTime);
	res.redirect('/request'); // later, this should redirect to the page that views the newly-made post
}

const getRequests = async (limit, offset) => {
    const snapshot = await db.firestore.collection('requests').orderBy('unixTime', 'desc').limit(limit).offset(offset).get();
    return snapshot.docs.map(doc => doc.data());
}

const getRequestTotal = async () => {
    const snapshot = await db.firestore.collection('requests').get();
    return snapshot.size;
}

module.exports = {
	handleCreateRequest,
	createRequest,
    getRequests,
    getRequestTotal
};

