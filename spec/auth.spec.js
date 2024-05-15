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
        if (addUserStub) addUserStub.restore();
    });

    it('should signup a new user and redirect to browse page if user does not exist', async () => {
        const req = { body: { username: 'newUser', password: 'password123' }, session: {} };
        const res = { redirect: sinon.stub() };
        getUserStub.resolves(null);
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
        const req = { body: { username: 'existingUser', password: 'password123' }, session: {} };
        const res = { redirect: sinon.stub() };
        getUserStub.resolves({});
        const result = await auth.signup(req, res);
        expect(userManager.getUser.calledOnceWith('existingUser')).toBe(true);
        expect(result).toBe(false);
        expect(res.redirect.called).toBe(false);
    });

    it('should handle errors if getUser function fails', async () => {
        const req = { body: { username: 'newUser', password: 'password123' }, session: {} };
        const res = { redirect: sinon.stub() };
        getUserStub.rejects(new Error('getUser failed'));
        const result = await auth.signup(req, res);
        expect(result).toBe(false);
        expect(res.redirect.called).toBe(false);
    });

    it('should handle invalid input if username or password is missing', async () => {
        const req = { body: { username: 'missingPassword' }, session: {} };
        const res = { redirect: sinon.stub() };
        const result = await auth.signup(req, res);
        expect(result).toBe(false);
        expect(res.redirect.called).toBe(false);
    });
});

describe('signin function', () => {
    let getUserStub;
    let req, res;

    beforeEach(() => {
        getUserStub = sinon.stub(userManager, 'getUser');
        req = { body: {}, session: {} };
        res = { redirect: sinon.stub() };
    });

    afterEach(() => {
        getUserStub.restore();
    });

    it('should sign in a user with valid credentials and redirect to the browse page', async () => {
        const username = 'validUser';
        const password = 'validPassword';
        const user = { id: 'falseUserId' };
        getUserStub.resolves(user);
        req.body.username = username;
        req.body.password = password;
        await auth.signin(req, res);
        expect(userManager.getUser.calledOnceWith(username, password)).toBe(true);
        expect(req.session.userId).toBe(user.id);
        expect(res.redirect.calledOnceWith('/browse')).toBe(true);
    });

    it('should not sign in a user with invalid credentials', async () => {
        const username = 'invalidUser';
        const password = 'invalidPassword';
        getUserStub.resolves(null);
        req.body.username = username;
        req.body.password = password;
        const result = await auth.signin(req, res);
        expect(userManager.getUser.calledOnceWith(username, password)).toBe(true);
        expect(result).toBe(false);
        expect(res.redirect.called).toBe(false);
    });
});
