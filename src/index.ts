import express from 'express';
import bodyparser from 'body-parser';
import { usersRouter } from './routers/users.router';
import { sessionMiddleware } from './middleware/session.middleware';
import { getUserByUsernameAndPassword } from './services/users.service';
import { reimbursementsRouter } from './routers/reimbursements.router';

// Build application from express
const app = express();

// Turn json string on req into js object
app.use(bodyparser.json());


// Session object for each req object
app.use(sessionMiddleware);

// register the routers with endpoints
app.use('/users', usersRouter);

app.use('/reimbursements', reimbursementsRouter);

// Login credentails
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        res.status(400).send('Please have a username and password field');
        return;
    }

    try {
        const user = await getUserByUsernameAndPassword(username, password);
        req.session.user = user;
        res.json(user);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
});



// Make server listen for request
app.listen(5500, () => {
    console.log('app has started in port 5500');
});