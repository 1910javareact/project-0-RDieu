// data transfer object
export class ReimbursementDTO {
    reimbursement_id: number;
    author: number;
    amount: number;
    date_submitted: number;
    date_resolved: number;
    description: string;
    resolver: number;
    status_id: number;
    type_id: number;
}