import session from 'express-session';

const sessionconfig = {
    secret: 'secret',
    cookie: {secure: false},
    resave: false,
    saveUninitialized: false
};

export const sessionMiddleware = session(sessionconfig);