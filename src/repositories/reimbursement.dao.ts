import { Reimbursement } from '../models/reimbursement';
import { PoolClient } from 'pg';
import { connectionPool } from '.';
import { multiReimbursementDTOConverter, reimbursementDTOtoreimbursement, } from '../util/reimbursementdto.to.reimbursement';











// check if id matches the database and returns it
export async function daoGetReimbursementByUserId(userId: number): Promise<Reimbursement[]> {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const result = await client.query(`SELECT * FROM ers.reimbursements inner join ers.users on author = $1 ORDER BY date_submitted desc;`, [userId]);
        if (result.rowCount > 0) {
            return multiReimbursementDTOConverter(result.rows);
        } else {
            throw 'No Such Reimbursement';
        }

    } catch (e) {
        if (e === 'No Such Reimbursement') {
            throw {
                status: 404,
                message: 'There are no reimbursements from this user'
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







// check if id matches the database and returns it
export async function daoGetReimbursementByStatusId(id: number): Promise <Reimbursement[]> {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM ers.reimbursements where status_id = $1 order by date_submitted', [id]);
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






// add reimbursement to the database
export async function daoSaveOneReimbursement(r: Reimbursement): Promise<Reimbursement> {
    let client: PoolClient;
    client = await connectionPool.connect();
    try {
        await client.query(`INSERT INTO ers.reimbursements(reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status_id, type_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING reimbursement_id;`,
        [r.reimbursementId, r.author, r.amount, r.dateSubmitted, r.dateResolved, r.description, r.resolver, r.status, r.type]);
        return r;

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




// save update reimbursement to the database
export async function daoUpdateReimbursement(id: number, r: Reimbursement): Promise<Reimbursement> {
    let client: PoolClient;
    client = await connectionPool.connect();
    try {
        //Get all values from the reimbursement
        const temp = await client.query(`SELECT * FROM ers.reimbursements WHERE reimbursement_id = $1`, [id]);
        const tempReimburse = reimbursementDTOtoreimbursement(temp.rows);

        for (const key in r) {
            if (r[key] === undefined) {
                r[key] = tempReimburse[key];
            }
        }
            await client.query(`UPDATE ers.reimbursements SET reimbursement_id = $1,
            author = $2, amount = $3, date_submitted = $4, date_resolved = $5, description = $6,
            resolver = $7, status_id = $8, type_id = $9 WHERE reimbursement_id = $10;`,
            [r.reimbursementId, r.author, r.amount, r.dateSubmitted, r.dateResolved, r.description, r.resolver, r.status, r.type, id]);
            return r;
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