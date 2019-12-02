import express from 'express';
import { getAllUsers, getUserById, updateUser } from '../services/users.service';
 import { authorization } from '../middleware/auth.middleware';
import { User } from '../models/user';
import { Role } from '../models/role';


// usersRouter base path object
export const usersRouter = express.Router();

// Endpoint to find users
usersRouter.get('', [authorization(['finance-manager'])],
async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
});

// Endpoint to find users by id
usersRouter.get('/:id', [authorization(['finance-manager', 'admin', 'user'])],
async (req, res) => {
    const id = +req.params.id;
    if (isNaN(id)) {
        res.sendStatus(400);
    } else if (req.session.user.role.role === 'finance-manager') {
        try {
            const user = await getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            res.status(error.status).send(error.message);
        }
    } else {
        try {
            const user = await getUserById(id);
            if (req.session.user.userId === user.userId) {
                res.status(200).json(user);
            } else {
                res.sendStatus(401);
            }
        } catch (error) {
            res.status(error.status).send(error.message);
        }
    }
});



// Endpoint to update user
usersRouter.patch('', [authorization(['Admin']), async (req, res) => {
    const { body } = req;

    const user = new User(0, ``, ``, ``, ``, ``, new Role(0, ''));
    for (const key in user) {
        if (body[key] === undefined) {
            user[key] = undefined;
        } else {
            user[key] = body[key];
        }
    }
    const id = user.userId;
    if (isNaN(id)) {

        res.status(400).send(`Please enter a valid user id`);
    }
    try {
       const result = await updateUser(id, user);
        res.status(201).json(result);
    } catch (e) {
        console.log(e);
        res.status(e.status).send(e.message);
    }
}]);