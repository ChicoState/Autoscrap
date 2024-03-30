const db = require('./firebase');

const createPost = async (authorId, currentBid, description, title, unixTime, image) => {
	const newPost = await db.firestore.collection('posts').add({
		authorId: authorId,
		currentBid: currentBid,
		description: description,
		title: title,
		unixTime: unixTime,
        image: image
	});
	return newPost;
}

const handleCreatePost = async (req, res) => {
	const authorId = req.session.userId;
	const currentBid = req.body.currentBid;
	const description = req.body.description;
	const title = req.body.title;
	const unixTime = Date.now();
    const image = req.body.image;
	await createPost(authorId, currentBid, description, title, unixTime, image);
	res.redirect('/browse'); // later, this should redirect to the page that views the newly-made post
}

const getPosts = async (limit, offset) => {
    const snapshot = await db.firestore.collection('posts').orderBy('unixTime', 'desc').limit(limit).offset(offset).get();
    return snapshot.docs.map(doc => doc.data());
}

const getPostsTotal = async () => {
    const snapshot = await db.firestore.collection('posts').get();
    return snapshot.size;
}

module.exports = {
	handleCreatePost,
	createPost,
    getPosts,
    getPostsTotal
};

