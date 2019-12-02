import { daoGetReimbursementByStatusId, daoGetReimbursementByUserId, daoSaveOneReimbursement, daoUpdateReimbursement } from '../repositories/reimbursement.dao';
import { Reimbursement } from '../models/reimbursement';

// retrieve reimbursement from the doa
export async function getReimbursementByStatusId(id: number): Promise<Reimbursement[]> {
    try {
        return await daoGetReimbursementByStatusId(id);
    } catch (e) {
        throw e;
    }
}


export async function getReimbursementByUserId(id: number): Promise<Reimbursement[]> {
    try {
        return await daoGetReimbursementByUserId(id);
    } catch (e) {
        throw e;
    }
}

export async function saveOneReimbursement(reimbursement: Reimbursement): Promise<Reimbursement> {
    try {
        return await daoSaveOneReimbursement(reimbursement);
    } catch (e) {
        throw e;
    }
}

export async function updateReimbursement(reimbursement: Reimbursement): Promise<Reimbursement> {
    try {
        return await daoUpdateReimbursement(reimbursement);
    } catch (e) {
        throw e;
    }
}