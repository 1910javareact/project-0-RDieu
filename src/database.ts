
import { User } from './models/user';
import { Role } from './models/role';
import { Reimbursement } from './models/reimbursement';
// Database
export let users = [
    new User(1, 'margaret', 'passworda', 'margaret', 'gravefield', 'margaretgrave@gmail.com', new Role(1, 'finance-manager')),
    new User(2, 'richemon', 'passwordb', 'richelet', 'dieujuste', 'richemon9@gmail.com', new Role(2, 'admin')),
    new User(3, 'roodcon', 'roody', 'roody', 'garfield', 'roodyvil@hotmail.com', new Role(3, 'user'))

];

export let reimbursements = [
    new Reimbursement(1, 2, 250, 101019, 141019, 'Trip to Mexico', 1, 1, 2),
    new Reimbursement(2, 3, 50, 101119, 161119, 'Dinner', 1, 2, 3)
];