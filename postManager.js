const db = require('./firebase');

const createPost = async (authorId, currentBid, description, title, unixTime) => {
	const newPost = await db.collection('posts').add({
		authorId: authorId,
		currentBid: currentBid,
		description: description,
		title: title,
		unixTime: unixTime
	});
	return newPost;
}

const handleCreatePost = async (req, res) => {
	const authorId = req.session.userId;
	const currentBid = req.body.currentBid;
	const description = req.body.description;
	const title = req.body.title;
	const unixTime = Date.now();
	await createPost(authorId, currentBid, description, title, unixTime);
	res.redirect('/browse'); // later, this should redirect to the page that views the newly-made post
}

const getPosts = async () => {
    const snapshot = await db.collection('posts').orderBy('unixTime', 'desc').get();
    return snapshot.docs.map(doc => doc.data());
}

module.exports = {
	handleCreatePost,
	createPost,
    getPosts
};

