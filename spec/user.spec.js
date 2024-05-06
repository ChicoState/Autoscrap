const sinon = require('sinon');
const userManager = require('../userManager.js');
const { addUser } = require('../userManager.js');

describe('find user(admin)', () => {
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
});