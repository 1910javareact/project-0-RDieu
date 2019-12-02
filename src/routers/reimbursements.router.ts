import express from 'express';
import { authorization } from '../middleware/auth.middleware';
import { getReimbursementByStatusId, getReimbursementByUserId, saveOneReimbursement, updateReimbursement } from '../services/reimbursement.service';
import { Reimbursement } from '../models/reimbursement';

export const reimbursementsRouter = express.Router();


// endpoint
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


// endpoint
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


// endpoint
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


// endpoint
reimbursementsRouter.patch('', [authorization(['finance-manager'])],
async (req, res) => {
    try {
        const { body } = req;
        const newR = new Reimbursement(0, 0, 0, 0, 0, '', 0, 0, 0);
        newR.reimbursementId = body.reimbursementId;
        newR.status = body.status;
        const update = await updateReimbursement(newR);
        res.status(200).json(update);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
});