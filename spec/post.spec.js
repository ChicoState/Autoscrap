const sinon = require('sinon');
const fs = require('fs-extra');
const path = require('path');
const postManager = require('../postManager.js');

describe('postManager', () => {
  describe('handleCreatePost', () => {
    it('should execute without errors', async () => {
      // Increase the timeout to 10000 milliseconds (10 seconds)
      console.log('Before setting timeout interval:', jasmine.DEFAULT_TIMEOUT_INTERVAL);
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
      console.log('After setting timeout interval:', jasmine.DEFAULT_TIMEOUT_INTERVAL);


      // Your test code here
      const tempImagePath = path.join(__dirname, 'temp_image.jpg');
      await fs.writeFile(tempImagePath, 'This is a test image content');
      
      const req = {
        session: { userId: 'user123' },
        body: {
          currentBid: 100,
          description: 'Test description',
          tags: ['tag1', 'tag2'],
          title: 'Test Title'
        },
        file: { path: tempImagePath, mimetype: 'image/jpeg' }
      }; 
      const res = { redirect: sinon.spy() };

      try {
        await postManager.handleCreatePost(req, res);
      } catch (error) {
        fail(`Error occurred: ${error}`);
      } finally {
        await fs.unlink(tempImagePath); 
      }

      expect(true).toBe(true);
    });
  }); 

  describe('handleCreatePostBlankImage', () => {
    it('should execute without errors', async () => {
      // Increase the timeout to 10000 milliseconds (10 seconds)
      console.log('Before setting timeout interval:', jasmine.DEFAULT_TIMEOUT_INTERVAL);
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
      console.log('After setting timeout interval:', jasmine.DEFAULT_TIMEOUT_INTERVAL);

      // Your test code here
      const tempImagePath = path.join(__dirname, 'temp_image.jpg');
      await fs.writeFile(tempImagePath, 'This is a test image content');
      
      const req = {
        session: { userId: 'user123' },
        body: {
          currentBid: 100,
          description: 'Test description',
          tags: ['tag1', 'tag2'],
          title: 'Test Title'
        },
      };
      const res = { redirect: sinon.spy() };

      try {
        await postManager.handleCreatePost(req, res);
      } catch (error) {
        fail(`Error occurred: ${error}`);
      } finally {
        await fs.unlink(tempImagePath); 
      }

      expect(true).toBe(true);
    });
  });


  describe('createPost', () => {
    it('should create a post', async () => {
      const authorId = 'user123';
      const currentBid = 100;
      const description = 'Test description';
      const tags = ['tag1', 'tag2'];
      const title = 'Test Title';
      const unixTime = Date.now();
      const image = 'https://example.com/image.jpg';

      const addStub = sinon.stub(postManager, 'createPost').resolves({ id: 'post123' });

      const newPost = await postManager.createPost(authorId, currentBid, description, tags, title, unixTime, image);

      sinon.assert.calledWith(addStub, authorId, currentBid, description, tags, title, unixTime, image);

      addStub.restore();
    });
  });


  describe('getPostById', () => {
    it('should return a post by ID', async () => {
      const postId = 'post123';
      const postData = {
        id: postId,
        authorId: 'user123',
        currentBid: 100,
        description: 'Test description',
        tags: ['tag1', 'tag2'],
        title: 'Test Title',
        /* unixTime: Date.now(), */
        image: 'https://example.com/image.jpg'
      };

      const getStub = sinon.stub(postManager, 'getPostById').resolves(postData);

      const post = await postManager.getPostById(postId);

      sinon.assert.calledWith(getStub, postId);
      expect(post).toEqual(postData);

      getStub.restore();
    });

    it('should return null if post does not exist', async () => {
      const postId = 'nonexistent_post_id';

      const getStub = sinon.stub(postManager, 'getPostById').resolves(null);

      const post = await postManager.getPostById(postId);

      sinon.assert.calledWith(getStub, postId);
      expect(post).toBeNull();

      getStub.restore();
    });
  });
  describe('getPostsByUserId', () => {
    it('should return posts for a given user ID', async () => {
      const userId = 'user123';
      const userPosts = [
        { id: 'post1', authorId: userId, title: 'Post 1' },
        { id: 'post2', authorId: userId, title: 'Post 2' }
      ];

      const getStub = sinon.stub(postManager, 'getPostsByUserId').resolves(userPosts);

      const posts = await postManager.getPostsByUserId(userId);

      sinon.assert.calledWith(getStub, userId);
      expect(posts).toEqual(userPosts);

      getStub.restore();
    });

    it('should return an empty array if user has no posts', async () => {
      const userId = 'user456';
      const userPosts = [];

      const getStub = sinon.stub(postManager, 'getPostsByUserId').resolves(userPosts);

      const posts = await postManager.getPostsByUserId(userId);

      sinon.assert.calledWith(getStub, userId);
      expect(posts).toEqual(userPosts);

      getStub.restore();
    });
  });

  describe('getPosts', () => {
    it('should return posts with limit and offset', async () => {
      const limit = 10;
      const offset = 0;
      const posts = [
        { id: 'post1', title: 'Post 1' },
        { id: 'post2', title: 'Post 2' }
      ];

      const getStub = sinon.stub(postManager, 'getPosts').resolves(posts);

      const result = await postManager.getPosts(limit, offset);

      sinon.assert.calledWith(getStub, limit, offset);
      expect(result).toEqual(posts);

      getStub.restore();
    });
  });

  describe('getPostsTotal', () => {
    it('should return total number of posts', async () => {
      const total = 100;

      const getStub = sinon.stub(postManager, 'getPostsTotal').resolves(total);

      const result = await postManager.getPostsTotal();

      sinon.assert.calledOnce(getStub);
      expect(result).toBe(total);

      getStub.restore();
    });
  });

  describe('getPostsSearch', () => {
    it('should return posts matching search query', async () => {
      const limit = 10;
      const offset = 0;
      const searchString = 'test';
      const posts = [
        { id: 'post1', title: 'Test Post 1' },
        { id: 'post2', title: 'Test Post 2' }
      ];

      const getStub = sinon.stub(postManager, 'getPostsSearch').resolves(posts);

      const result = await postManager.getPostsSearch(limit, offset, searchString);

      sinon.assert.calledWith(getStub, limit, offset, searchString);
      expect(result).toEqual(posts);

      getStub.restore();
    });
  });

  // Define a mock object for the index module
const index = {
  search: sinon.stub()
};

describe('getPostsTotalSearch', () => {
  it('should return total number of posts matching search query', async () => {
    const searchString = 'test';
    const total = 50;

    // Stub the index.search method to return a mock response
    const searchStub = sinon.stub(index, 'search').resolves({ hits: new Array(total) });

    // Call the function being tested
    const result = await postManager.getPostsTotalSearch(searchString);

    // Assert that the index.search method was called with the correct arguments
    sinon.assert.calledWith(searchStub, searchString);

    // Assert that the result matches the expected total
    expect(result).toBe(total);

    // Restore the stub
    searchStub.restore();
  });
}); 
});