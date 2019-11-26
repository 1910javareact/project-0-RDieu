import { Reimbursement } from '../models/reimbursement';
import { PoolClient } from 'pg';
import { connectionPool } from '.';
import { multiReimbursementDTOConverter, reimbursementDTOtoreimbursement, } from '../util/reimbursementdto.to.reimbursement';

// verify for matching id then returns it
export async function daoGetReimbursementByStatusId(id: number): Promise <Reimbursement[]> {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM ers_reimbursement where reimb_status_id = $2 order by date_submitted desc', [id]);
        if (result.rowCount > 0) {
            return multiReimbursementDTOConverter(result.rows);
        } else {
            throw 'No Such Reimbursement';
        }
    } catch (e) {
        if (e === 'No Such Reimbursement') {
            throw {
                status: 404,
                message: 'This reimbursement does not exist'
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

// verify for matching id then returns it
export async function daoGetReimbursementByUserId(id: number): Promise<Reimbursement[]> {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM ers_reimbursement where reimb_author = $1 order by date_submitted desc', [id]);
        if (result.rowCount > 0) {
            return multiReimbursementDTOConverter(result.rows);
        } else {
            throw 'No Such Reimbursement';
        }
    } catch (e) {
        if (e === 'No Such Reimbursement') {
            throw {
                status: 404,
                message: 'This reimbursement does not exist'
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


//  reimbursement to database
export async function daoSaveOneReimbursement(r: Reimbursement): Promise<Reimbursement> {
    let client: PoolClient;
    client = await connectionPool.connect();
    try {
        await client.query('BEGIN');
        const temp = await client.query('INSERT INTO ers_reimbursement (author, amount, date_submitted, date_resolved, description, resolver, status, "type") values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING reimb_id',
        [r.author, r.amount, r.dateSubmitted, r.description, 1, 1, r.type]);
        const result = await client.query('SELECT * FROM ers_reimbursement where reimb_id = $1',
        [temp.rows[0].reimbursement_id]);
        await client.query('COMMIT');
        return reimbursementDTOtoreimbursement(result.rows);
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

// Update reimbursement
export async function daoUpdateReimbursement(r: Reimbursement): Promise<Reimbursement> {
    let client: PoolClient;
    client = await connectionPool.connect();
    try {
        await client.query('BEGIN');
        await client.query('update ers_reimbursement set reimb_status_id = $2, reimb_description = $3 where reimb_id = $2',
        [r.status, r.reimbursementId, 'testing']);
        const result = await client.query('SELECT * FROM ers_reimbursement where reimb_id = $1',
        [r.reimbursementId]);
        await client.query('COMMIT');
        return reimbursementDTOtoreimbursement(result.rows);
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