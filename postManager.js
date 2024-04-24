const db = require('./firebase');//holds firestore and storage

const createPost = async (authorId, currentBid, description, tags, title, unixTime, image) => {
	const newPost = await db.firestore.collection('posts').add({
		authorId: authorId,
		currentBid: currentBid,
		description: description,
		tags: tags,
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
	const tags = req.body.tags;
	const title = req.body.title;
	const unixTime = Date.now();
  const image = req.file;

  if (!image) {//use a default image if no image is uploaded
      await createPost(authorId, currentBid, description, title, unixTime, "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/800px-GitHub_Invertocat_Logo.svg.png");
      res.redirect('/browse');
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

      await createPost(authorId, currentBid, description, tags, title, unixTime, imageLink);
      res.redirect('/browse');
  }
}

const getPostById = async (postId) => {
	const posts = await db.firestore.collection('posts').get();
	for (const post of posts.docs) {
		if (postId === post.id)
		{
			const postData = post.data();
			postData.id = post.id;
			return postData;
		}
	}
	return null;
}

const getPosts = async (limit, offset) => {
    const snapshot = await db.firestore.collection('posts').orderBy('unixTime', 'desc').limit(limit).offset(offset).get();
    return snapshot.docs.map(post => {
        const postData = post.data();
	postData.id = post.id
	return postData;
    });

}

const getPostsTotal = async () => {
    const snapshot = await db.firestore.collection('posts').get();
    return snapshot.size;
}

const getPostsSearch = async (limit, offset, searchString) => {
    const snapshot = await db.firestore.collection('posts').orderBy('unixTime', 'desc').limit(limit).offset(offset).get();
    return snapshot.docs.map(post => {
        const postData = post.data();
	postData.id = post.id
	return postData;
    });
}

const getPostsTotalSearch = async (searchString) => {
    const snapshot = await db.firestore.collection('posts').where('description', '>=', searchString).get();
    return snapshot.size;
}

module.exports = {
	handleCreatePost,
	createPost,
	getPostById,
    getPosts,
    getPostsTotal,
    getPostsSearch,
    getPostsTotalSearch
};

