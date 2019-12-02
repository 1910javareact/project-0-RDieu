import express from 'express';
import { authorization } from '../middleware/auth.middleware';
import { getReimbursementByStatusId, getReimbursementByUserId, saveOneReimbursement, updateReimbursement } from '../services/reimbursement.service';
import { Reimbursement } from '../models/reimbursement';

export const reimbursementsRouter = express.Router();


// Endpoint to find reimbursements by status
reimbursementsRouter.get('/status/:statusId', [authorization(['finance-manager'])],
    async (req, res) => {
        const id = +req.params.statusId;
        if (isNaN(id)) {
            res.sendStatus(400);
        } else {
            try {
                const reimbursement = await getReimbursementByStatusId(id);
                res.status(200).json(reimbursement);
            } catch (e) {
                res.status(e.status).send(e.message);
            }
        }
    });


// Endpoint to find reimbursements by user
reimbursementsRouter.get('/author/userId/:userId', [authorization(['finance-manager', 'admin', 'user'])],
    async (req, res) => {
        const id = +req.params.userId;
        if (isNaN(id)) {
            res.sendStatus(400);
        } else if (req.session.user.role.role === 'finance-manager') {
            try {
                const reimbursement = await getReimbursementByUserId(id);
                res.status(200).json(reimbursement);
            } catch (e) {
                res.status(e.status).send(e.message);
            }
        } else {
            try {
                const reimbursement = await getReimbursementByUserId(id);
                if (req.session.user.userId === reimbursement[0].author) {
                    res.status(200).json(reimbursement);
                } else {
                    res.sendStatus(401);
                }
            } catch (e) {
                res.status(e.status).send(e.message);
            }
        }
    });


// Endpoint to submit reimbursement
reimbursementsRouter.post('', [authorization(['finance-manager', 'admin', 'user'])],
    async (req, res) => {
        const { body } = req;
        const newR = new Reimbursement(0, 0, 0, 0, 0, '', 0, 0, 0);
        try {
            let error = false;
            for (const key in newR) {
                if (body[key] === undefined) {
                    res.status(400).send('Please include all fields');
                    error = true;

                    break;
                } else {
                    newR[key] = body[key];
                }
            }
            if (!error) {
                newR.author = req.session.user.userId;
                const reimbursement = await saveOneReimbursement(newR);
                res.status(201).json(reimbursement);
            }
        } catch (e) {
            res.status(e.status).send(e.message);
        }
    });


// Endpoint to update reimbursement
reimbursementsRouter.patch('', [authorization(['Admin', 'Finance-manager']), async (req, res) => {
    const { body } = req;

    const reimbursement = new Reimbursement(0, 0, 0 , 0, 0, ``, 0, 0, 0);
    for (const key in reimbursement) {
        if (body[key] === undefined) {
            reimbursement[key] = undefined;
        } else {
            reimbursement[key] = body[key];
        }
    }
    const id = reimbursement.reimbursementId;
    if (isNaN(id)) {
        res.status(400).send(`Please enter a valid reimbursement id`);
    }
    try {
        const result = await updateReimbursement(id, reimbursement);
        res.status(201).json(result);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
}]);