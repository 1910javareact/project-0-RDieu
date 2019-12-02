
import { User } from '../models/user';
import { daoFindUsers, daoGetUserByUsernameAndPassword, daoGetUserById, daoUpdateUser } from '../repositories/users.dao';

// process requests
export function getAllUsers(): Promise<User[]> {
    try {
        return daoFindUsers();
    } catch (e) {
        throw e;
    }
}

// request username and password
export function getUserByUsernameAndPassword(username: string, password: string): Promise<User> {
    try {
        return daoGetUserByUsernameAndPassword(username, password);
    } catch (e) {
        throw e;
    }
}

// retrieve user Id
export function getUserById(id: number): Promise<User> {
    return daoGetUserById(id);
}

// Update user
export async function updateUser(id: number, user: User): Promise<User> {
    try {
        return await daoUpdateUser(id, user);
    } catch (e) {
        throw e;
    }
}