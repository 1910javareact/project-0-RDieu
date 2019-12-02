import { daoGetReimbursementByStatusId, daoGetReimbursementByUserId, daoSaveOneReimbursement, daoUpdateReimbursement } from '../repositories/reimbursement.dao';
import { Reimbursement } from '../models/reimbursement';

// retrieve reimbursement from doa
export function getReimbursementByStatusId(id: number): Promise<Reimbursement[]> {
    try {
        return daoGetReimbursementByStatusId(id);
    } catch (e) {
        throw e;
    }
}

// get reimbursement from doa
export function getReimbursementByUserId(userId: number): Promise<Reimbursement[]> {
    try {
        return daoGetReimbursementByUserId(userId);
    } catch (e) {
        throw e;
    }
}

// send reimbursement to doa
export function saveOneReimbursement(reimbursement: Reimbursement): Promise<Reimbursement> {
    try {
        return daoSaveOneReimbursement(reimbursement);
    } catch (e) {
        throw e;
    }
}
// update reimbursement
export async function updateReimbursement(id: number, reimbursement: Reimbursement): Promise<Reimbursement> {
    try {
        return await daoUpdateReimbursement(id, reimbursement);
    } catch (e) {
        throw e;
    }
}