import { ReimbursementDTO } from '../dtos/reimbursement.dto';
import { Reimbursement } from '../models/reimbursement';


// Turn reimbursementDTO into a reimbursement object
export function reimbursementDTOtoreimbursement(rD: ReimbursementDTO[]): Reimbursement {
    return new Reimbursement(
        rD[0].reimbursement_id,
        rD[0].author,
        rD[0].amount,
        rD[0].date_submitted,
        rD[0].date_resolved,
        rD[0].description,
        rD[0].resolver,
        rD[0].status,
        rD[0].type
    );
}

// Turn reimbursementDTOs to Reimbursements
export function multiReimbursementDTOConverter(rD: ReimbursementDTO[]): Reimbursement[] {
    let currentReimbursement: ReimbursementDTO[] = [];
    const result: Reimbursement[] = [];
    for (const r of rD) {
        if (currentReimbursement.length === 0) {
            currentReimbursement.push(r);
        } else if (currentReimbursement[0].reimbursement_id === r.reimbursement_id) {
            currentReimbursement.push(r);
        } else {
            result.push(reimbursementDTOtoreimbursement(currentReimbursement));
            currentReimbursement = [];
            currentReimbursement.push(r);
        }
    }
    result.push(reimbursementDTOtoreimbursement(currentReimbursement));
    return result;
}