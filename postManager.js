const db = require('./firebase');

const createPost = async (authorId, currentBid, description, tags, title, unixTime) => {
	const newPost = await db.collection('posts').add({
		authorId: authorId,
		currentBid: currentBid,
		description: description,
		tags: tags,
		title: title,
		unixTime: unixTime
	});
	return newPost;
}

const handleCreatePost = async (req, res) => {
	const authorId = req.session.userId;
	const currentBid = req.body.currentBid;
	const description = req.body.description;
	const tags = req.body.tags;
	const title = req.body.title;
	const unixTime = Date.now();
	await createPost(authorId, currentBid, description, tags, title, unixTime);
	res.redirect('/browse'); // later, this should redirect to the page that views the newly-made post
}

const getPosts = async (limit, offset) => {
    const snapshot = await db.collection('posts').orderBy('unixTime', 'desc').limit(limit).offset(offset).get();
    return snapshot.docs.map(doc => doc.data());
}

const getPostsTotal = async () => {
    const snapshot = await db.collection('posts').get();
    return snapshot.size;
}

module.exports = {
	handleCreatePost,
	createPost,
    getPosts,
    getPostsTotal
};

