import { User } from '../models/user';
import { PoolClient } from 'pg';
import { connectionPool } from '.';
import { userDTOtoUser, multiUserDTOConverter } from '../util/userdto.to.user';

export async function daoFindUsers(): Promise<User[]> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM ers.users natural join ers.user_roles');
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

// Check the input username and password
export async function daoGetUserByUsernameAndPassword(username: string, password: string): Promise<User> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM ers.users natural join ers.user_roles WHERE username = $1 and password = $2', [username, password]);
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






// Get user by id from database
export async function daoGetUserById(id: number): Promise<User> {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM ers.users INNER JOIN ers.user_roles ON users.user_id = user_roles.role_id where user_id = $1', [id]);
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




// save updated user to database
export async function daoUpdateUser(id: number, u: User): Promise<User> {
    let client: PoolClient;
    client = await connectionPool.connect();
    try {
        const temp = await client.query(`SELECT * FROM ers.users WHERE user_id = $1;`, [id]);
        const tempUser = userDTOtoUser(temp.rows);
        for (const key in u) {
            if (u[key] === undefined) {
                u[key] = tempUser[key];
            }
        }
        await client.query(`update ers.users SET user_id = $1, username = $2,
        "password" = $3, first_name = $4, last_name = $5, email = $6 WHERE user_id = $7`,
        [u.userId, u.username, u.password, u.firstName, u.lastName, u.email, id]);
        return u;
    } catch (e) {
        console.log(e);

        throw {
            status: 500,
            message: `Internal Server Error`
        };
    } finally {
        client && client.release();
    }
}