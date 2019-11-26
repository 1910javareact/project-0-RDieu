
import { User } from '../models/user';
import { daoFindUsers, daoGetUserByUsernameAndPassword, daoGetUserById, daoUpdateUser } from '../repositories/users.dao';

// process requests
export async function getAllUsers(): Promise<User[]> {
    try {
        return await daoFindUsers();
    } catch (e) {
        throw e;
    }
}

// request username and password from the dao
export async function getUserByUsernameAndPassword(username: string, password: string): Promise<User> {
    try {
        return await daoGetUserByUsernameAndPassword(username, password);
    } catch (e) {
        throw e;
    }
}

// retrieve user Id
export async function getUserById(id: number): Promise<User> {
    return await daoGetUserById(id);
}

// Update user
export async function updateUser(user: User): Promise<User> {
    try {
        const dUser = await daoGetUserById(user.userId);
        for (const u in user) {
            if (user[u] !== dUser.hasOwnProperty(u)) {
                dUser[u] = user[u];
            }
        }
        return daoUpdateUser(dUser);
    } catch (e) {
        throw e;
    }
}
