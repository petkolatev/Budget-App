import { MongoMemoryServer } from 'mongodb-memory-server'
import User from '../../types/User'
import mongoose from 'mongoose';
import { authorizeUserTest } from './authorizeUserTest';

let mongoServer: MongoMemoryServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)

    await User.create([
        { email: 'user1@example.com', password: 'test123', name: 'Test User 1' },
        { email: 'user2@example.com', password: 'wrongpass', name: 'Test User 2' },
    ])
})

afterAll(async () => {
    await mongoose.connection.close()
})

describe('authorizeUser()', () => {
    it('should authorize valid credentials', async () => {
        const user = await authorizeUserTest("user1@example.com", 'test123')
        expect(user).toBeTruthy()
        expect(user?.email).toBe('user1@example.com')
    })

    it('should reject wrong password', async () => {
        const user = await authorizeUserTest("user1@example.com", 'notcorrect')
        expect(user).toBeNull()
    })

    it('should reject non-existent user', async () => {
        const user = await authorizeUserTest('nouser@example.com', 'whatever')
        expect(user).toBeNull()
    })
})




