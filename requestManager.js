const db = require('./firebase');

const createRequest = async (authorId, currentBid, description, title, unixTime) => {
	const newRequest = await db.collection('requests').add({
		authorId: authorId,
		currentBid: currentBid,
		description: description,
		title: title,
		unixTime: unixTime,
		image: image
	});
	return newRequest;
}

const handleCreateRequest = async (req, res) => {
	const authorId = req.session.userId;
	const currentBid = req.body.currentBid;
	const description = req.body.description;
	const title = req.body.title;
	const unixTime = Date.now();
	const image = req.file;

	if (!image) {//use a default image if no image is uploaded
        await createRequest(authorId, currentBid, description, title, unixTime, "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/800px-GitHub_Invertocat_Logo.svg.png");
        res.redirect('/request');
    } else {//save image to firebase storage
        const [file] = await db.storage.bucket().upload(image.path, {
            metadata: {
                contentType: image.mimetype,
            }
        });
    	const config = {//settings for public link
        	action: 'read',
        	expires: '01-01-2100', //link will be permanently hosted (until 2100)
    	};
    	const [imageLink] = await file.getSignedUrl(config);
		await createRequest(authorId, currentBid, description, title, unixTime);
		res.redirect('/request'); // later, this should redirect to the page that views the newly-made post
	}
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

