import { User } from '../models/user';
import { PoolClient } from 'pg';
import { connectionPool } from '.';
import { userDTOtoUser, multiUserDTOConverter } from '../util/userdto.to.user';

export async function daoFindUsers(): Promise<User[]> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM ers_users natural join user_role_id natural join user_roles');
        return multiUserDTOConverter(result.rows);
    } catch (e) {
        throw {
            status: 500,
            message: 'Internal Server Error'
        };
    } finally {
        client && client.release();
    }
}


export async function daoGetUserByUsernameAndPassword(username: string, password: string): Promise<User> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM ers_users natural join ers_user_roles natural join user_role_id WHERE username = $1 and password = $2',
            [username, password]);
        if (result.rowCount === 0) {
            throw 'Invalid Credentials';
        } else {
            return userDTOtoUser(result.rows);
        }
    } catch (e) {
        if (e === 'Invalid Credentials') {
            throw {
                status: 400,
                message: 'Invalid Credentials'
            };
        } else {
            throw {
                status: 500,
                message: 'Internal Server Error'
            };
        }
    } finally {
        client && client.release();
    }
}

// Gets the garden by id from database
export async function daoGetUserById(id: number): Promise<User> {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM ers_users natural join user_role_id natural join ers_user_roles where ers_user_role_id = $1', [id]);
        if (result.rowCount > 0) {
            return userDTOtoUser(result.rows);
        } else {
            throw 'No Such User';
        }
    } catch (e) {
        if (e === 'No Such User') {
            throw {
                status: 404,
                message: 'This user does not exist'
            };
        } else {
            throw {
                status: 500,
                message: 'Internal Server Error'
            };
        }
    } finally {
        client && client.release();
    }
}

// saves the updated user to database
export async function daoUpdateUser(user: User): Promise<User> {
    let client: PoolClient;
    client = await connectionPool.connect();
    try {
        await client.query('BEGIN');
        await client.query('update ers_users set ers_username = $1, ers_password = $2, user_first_name = $3, user_last_name = $4, user_email = $5 where user_role_id = $6',
        [user.username, user.password, user.firstName, user.lastName, user.email, user.userId]);
        await client.query('update ers_user_roles set ers_user_role_id = $1 where ers_user_role_id = $2',
        [user.role.roleId, user.userId]);
        await client.query('COMMIT');
        const result = await client.query('SELECT * FROM ers_users natural join ers_user_roles natural join ers_user_role_id where ers_user_role_id = $1',
        [user.userId]);
        if (result.rowCount > 0) {
            return userDTOtoUser(result.rows);
        } else {
            throw 'No Such User';
        }
    } catch (e) {
        await client.query('ROLLBACK');
        throw {
            status: 500,
            message: 'Internal Server Error'
        };
    } finally {
        client && client.release();
    }
}