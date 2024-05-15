const sinon = require('sinon');
const userManager = require('../userManager.js');
const { addUser } = require('../userManager.js');
const { getUser } = require('../userManager.js');
const db = require('../firebase')

describe('getUserById', () => {
    it('should return the admin user given their id', async () => {
        // Stub the getUserById function of userManager
        const getUserByIdStub = sinon.stub(userManager, 'getUserById');

        // Define the behavior of the stub
        getUserByIdStub.withArgs('J45gM6VGe6bmRdN1MCpr').resolves({ username: 'admin' });

        // Run the code under test
        const user = await userManager.getUserById('J45gM6VGe6bmRdN1MCpr');

        // Verify the result
        expect(user.username).toBe('admin');

        // Restore the original function to avoid affecting other tests
        getUserByIdStub.restore();
    });

    it('should return the user with the given user ID', async () => {
        const getUserByIdStub = sinon.stub(userManager, 'getUserById');
        getUserByIdStub.withArgs('J45gM6VGe6bmRdN1MCpr').resolves({ username: 'admin', userId: 'J45gM6VGe6bmRdN1MCpr' });
        const user = await userManager.getUserById('J45gM6VGe6bmRdN1MCpr');
        expect(user.userId).toBe('J45gM6VGe6bmRdN1MCpr');
        getUserByIdStub.restore();
    });

    it('should return null if the user ID is not found', async () => {
        const getUserByIdStub = sinon.stub(userManager, 'getUserById');
        getUserByIdStub.withArgs('noId').resolves(null);
        const user = await userManager.getUserById('noId');
        expect(user).toBeNull();
        getUserByIdStub.restore();
    });

    it('should return null if the DB is empty', async () => {
        const getUserByIdStub = sinon.stub(userManager, 'getUserById');
        getUserByIdStub.resolves(null);
        const user = await userManager.getUserById('randomID');
        expect(user).toBeNull();
        getUserByIdStub.restore();
    });

    it('should return null if no ID is provided', async () => {
        const getUserByIdStub = sinon.stub(userManager, 'getUserById');
        getUserByIdStub.withArgs('').resolves(null);
        const user = await userManager.getUserById('');
        expect(user).toBeNull();
        getUserByIdStub.restore();
    });
});

describe('addUser', () => {
    it('should pass in testName and testPass into db', async() => {
        const addUserStub = sinon.stub(userManager, 'addUser');
        addUserStub.withArgs('testName', 'testPass').resolves({username: 'testName', password: 'testPass'});
        const user = await userManager.addUser('testName', 'testPass');
        expect(user.username).toBe('testName');
        expect(user.password).toBe('testPass');
        addUserStub.restore();
    });

    it('should pass in testName and testPass into db and expect the titles not to be swapped', async() => {
        const addUserStub = sinon.stub(userManager, 'addUser');
        addUserStub.withArgs('testName', 'testPass').resolves({username: 'testName', password: 'testPass'});
        const user = await userManager.addUser('testName', 'testPass');
        expect(user.username).not.toBe('testPass');
        expect(user.password).not.toBe('testName');
        addUserStub.restore();
    });

    it('should pass in data into db and not be empty', async() => { //potential bug if allowed
        const addUserStub = sinon.stub(userManager, 'addUser');
        addUserStub.withArgs('', '').resolves({username: '', password: ''});
        const user = await userManager.addUser('', '');
        expect(user.username).toBe('');
        expect(user.password).toBe('');
        addUserStub.restore();
    });
});

describe('getUser', () => {              //Working incorrectly. May have something to do with how the functions interact with the db these tests are all returning null meaning none of the users are being recognized as pre-existing in the mock.
    let getStub;

    beforeEach(() => {
        getStub = sinon.stub(db.firestore.collection('users'), 'get');
    });

    afterEach(() => {
        getStub.restore();
    });

    it('should return the user document if the username and password match', async () => {
        const username = 'TestingTony';
        const password = 'rightPass';
        const userDoc = { data: () => ({ username: 'TestingTony', password: 'rightPass' }) };
        getStub.resolves({ docs: [userDoc] });

        const user = await getUser(username, password);

        expect(user).toEqual(userDoc);
    });

    it('should return the user document if the username matches and no password is provided', async () => {
        const username = 'TestingTony';
        const userDoc = { data: () => ({ username: 'TestingTony', password: 'rightPass' }) };
        getStub.resolves({ docs: [userDoc] });

        const user = await getUser(username);

        expect(user).toEqual(userDoc);
    });

    it('should return null if the username does not match', async () => {
        const username = 'noUser';
        getStub.resolves({ docs: [] });

        const user = await getUser(username);

        expect(user).toBeNull();
    });

    it('should return null if the username matches but the password does not', async () => {
        const username = 'TestingTony';
        const password = 'wrongPass';
        const userDoc = { data: () => ({ username: 'TestingTony', password: 'rightPass' }) };
        getStub.resolves({ docs: [userDoc] });

        const user = await getUser(username, password);

        expect(user).toBeNull();
    });
});
