import { User } from './models/user';
import { Role } from './models/role';
import { Reimbursement } from './models/reimbursement';
// Database
export let users = [
    new User(1, 'margaret', 'passworda', 'margaret', 'gravefield', 'margaretgrave@gmail.com', new Role(1, 'finance-manager')),
    new User(2, 'richemon', 'passwordb', 'richelet', 'dieujuste', 'richemon9@gmail.com', new Role(2, 'admin')),
    new User(3, 'roodcon', 'passwordc', 'roody', 'garfield', 'roodyvil@hotmail.com', new Role(3, 'User')),
];

export let reimbursements = [
    new Reimbursement(1, 1, 250, 101019, 101419, 'Trip to Mexico', 1, 2, 2),
    new Reimbursement(2, 2, 50, 111019, 111619, 'Dinner', 1, 2, 3)
];