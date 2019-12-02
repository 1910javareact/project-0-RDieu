// authorization verification
export function authorization(authRoles: string[]) {
    return (req, res, next) => {
        let isAuth = false;
        // verify if user is logged in
        if (!req.session.user) {
            res.status(401).send('Please Login');
            return;
        }
        // verify authorization
        if (authRoles.includes(req.session.user.role.role)) {
            isAuth = true;
        }

        // only authorized users may go to the next step
        if (isAuth) {
            next();
        } else {
            res.status(401).send('The incoming token has expired');
        }
    };
}