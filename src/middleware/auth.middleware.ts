


export function authorization(authRoles: string[]) {// authorization verification
    return (req, res, next) => {
        let isAuth = false;

        // verify if user is logged in
        if (!req.session.user) {
            res.status(401).send('Please Login');
            return;
        }
        // check for authorization level
        if (authRoles.includes(req.session.user.role.role)) {
            isAuth = true;
        } else {

            (isAuth);
                next();
        }


    };

}