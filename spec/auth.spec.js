const sinon = require('sinon');
const auth = require('../auth'); // Assuming auth.js is where signup function resides
const userManager = require('../userManager'); // Assuming userManager module is required

describe('signup function', () => {
    let getUserStub;
    let addUserStub;

    beforeEach(() => {
        getUserStub = sinon.stub(userManager, 'getUser');
        addUserStub = sinon.stub(userManager, 'addUser');
    });

    afterEach(() => {
        getUserStub.restore();
        if (addUserStub) addUserStub.restore(); // Check if addUserStub exists before restoring
    });

    it('should signup a new user and redirect to browse page if user does not exist', async () => {
        // Mocking the request and response objects
        const req = { body: { username: 'newUser', password: 'password123' }, session: {} };
        const res = { redirect: sinon.stub() };

        // Stubbing getUser to simulate a non-existing user
        getUserStub.resolves(null);

        // Stubbing addUser to simulate successful user creation
        addUserStub.resolves({ id: 'fakeUserId' });

        // Call the function
        await auth.signup(req, res);

        // Assertions
        expect(userManager.getUser.calledOnceWith('newUser')).toBe(true);
        expect(userManager.addUser.calledOnceWith('newUser', 'password123')).toBe(true);
        expect(req.session.userId).toBe('fakeUserId');
        expect(res.redirect.calledOnceWith('/browse')).toBe(true);
    });

    it('should not signup a new user if user already exists', async () => {
        // Mocking the request and response objects
        const req = { body: { username: 'existingUser', password: 'password123' }, session: {} };
        const res = { redirect: sinon.stub() };

        // Stubbing getUser to simulate an existing user
        getUserStub.resolves({});

        // Call the function
        const result = await auth.signup(req, res);

        // Assertions
        expect(userManager.getUser.calledOnceWith('existingUser')).toBe(true);
        expect(result).toBe(false); // Expecting the function to return false if user already exists
        expect(res.redirect.called).toBe(false); // No redirect should occur
    });

    it('should handle errors if getUser function fails', async () => {
        // Mocking the request and response objects
        const req = { body: { username: 'newUser', password: 'password123' }, session: {} };
        const res = { redirect: sinon.stub() };

        // Stubbing getUser to simulate an error
        getUserStub.rejects(new Error('getUser failed'));

        // Call the function
        const result = await auth.signup(req, res);

        // Assertions
        expect(result).toBe(false); // Expecting the function to return false if an error occurs
        expect(res.redirect.called).toBe(false); // No redirect should occur
    });
    it('should handle invalid input if username or password is missing', async () => {               //results in an error when an aspect is missing. on actual webapp, it doesnt't allow it. May have something to do with firebase rules
        // Mocking the request and response objects with missing fields
        const req = { body: { username: 'missingPassword' }, session: {} };
        const res = { redirect: sinon.stub() };

        // Call the function
        const result = await auth.signup(req, res);

        // Assertions
        expect(result).toBe(false); // Expecting the function to return false for invalid input
        expect(res.redirect.called).toBe(false); // No redirect should occur
    });
});
