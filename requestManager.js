const db = require('./firebase');

const createRequest = async (authorId, currentBid, description, tags, title, unixTime) => {
	const newRequest = await db.firestore.collection('requests').add({
		authorId: authorId,
		currentBid: currentBid,
		description: description,
		tags: tags,
		title: title,
		unixTime: unixTime,
	});
	return newRequest;
}

const handleCreateRequest = async (req, res) => {
	const authorId = req.session.userId;
	const currentBid = req.body.currentBid;
	const description = req.body.description;
	const tags = req.body.tags;
	const title = req.body.title;
	const unixTime = Date.now();
	await createRequest(authorId, currentBid, description, tags, title, unixTime);
	res.redirect('/request');
}

const getRequestById = async (requestId) => {
	const requests = await db.firestore.collection('requests').get();
	for (const request of requests.docs) {
		if (requestId === request.id)
		{
			const requestData = request.data();
			requestData.id = request.id;
			return requestData;
		}
	}
	return null;
}

const getRequestsByUserId = async (userId) => {
	const requests = await db.firestore.collection('requests').orderBy('unixTime', 'desc').get();
	return requests.docs.map(request => {
		const requestData = request.data();
		requestData.id = request.id;
		return requestData
	}).filter(request => {
		return request.authorId == userId;
	});
}

const getRequests = async (limit, offset) => {
	const snapshot = await db.firestore.collection('requests').orderBy('unixTime', 'desc').limit(limit).offset(offset).get();
    return snapshot.docs.map(request => {
        const requestData = request.data();
	requestData.id = request.id
	return requestData;
    });
}

const getRequestTotal = async () => {
    const snapshot = await db.firestore.collection('requests').get();
    return snapshot.size;
}

module.exports = {
	handleCreateRequest,
	getRequestById,
	getRequestsByUserId,
	createRequest,
    getRequests,
    getRequestTotal
};

