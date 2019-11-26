import express from 'express';
import { getAllUsers, getUserById, updateUser } from '../services/users.service';
import { authorization } from '../middleware/auth.middleware';

// usersRouter base path object
export const usersRouter = express.Router();

// Endpoint to finding a particular uer
usersRouter.get('', [authorization(['finance-manager'])],
async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
});

// Endpoint to finding a particular user
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

// Update User
usersRouter.patch('', [authorization(['admin'])], async (req, res) => {
    try {
        const {body} = req; // destructuring
        const update = await updateUser(body);
        res.status(200).json(update);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
});