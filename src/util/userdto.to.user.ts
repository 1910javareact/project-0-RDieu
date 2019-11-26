import { UserDTO } from '../dtos/user.dto';
import { User } from '../models/user';
import { Role } from '../models/role';

// Takes array of userDTOs, loop through, and grabs role name and id
// then build a new user object and passes in all the values
export function userDTOtoUser(uD: UserDTO[]): User {
    const role = new Role(uD[0].role_id, uD[0].role_name);
    return new User(
        uD[0].user_id,
        uD[0].username,
        uD[0].password,
        uD[0].first_name,
        uD[0].last_name,
        uD[0].email,
        role
    );
}

// Take in many user DTOs to Users
export function multiUserDTOConverter(uD: UserDTO[]): User[] {
    let currentUser: UserDTO[] = [];
    const result: User[] = [];
    for (const u of uD) {
        if (currentUser.length === 0) {
            currentUser.push(u);
        } else if (currentUser[0].user_id === u.user_id) {
            currentUser.push(u);
        } else {
            result.push(userDTOtoUser(currentUser));
            currentUser = [];
            currentUser.push(u);
        }
    }
    result.push(userDTOtoUser(currentUser));
    return result;
}