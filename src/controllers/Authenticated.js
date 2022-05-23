const RepoUser = require("../repository/User.js");
const jwt = require('jsonwebtoken');
const Cookies = require("cookies");
const secretJwt = 'eyJeiwidHlwIjoiSyJhbGciOiJub25lIldUIn0Jub2wIjoiSldUIn0';
module.exports = class Authenticated {
    print(request, response) {
        response.render('authenticated/form', { form: {} });
    }
}
module.exports = class Authenticated {
    print(request, response) {
        response.render('authenticated/form', { form: {} });
    }

}
module.exports = class Authenticated {
    print(request, response) {
        response.render('authenticated/form', { form: {} });
    }

    process(request, response) {
        (new RepoUser).getUserByEmail(request.body.email).then((user) => {
            let bcrypt = require('bcryptjs');
            if (bcrypt.compareSync(request.body.password, user.password)) {
                user.password = null;
                request.session.user = user;
                let accessToken = jwt.sign({ user: { firstname: user.firstname, lastname: user.lastname }, roles: user.roles }, process.env.APP_KEY, { expiresIn: 604800 });
                new Cookies(request, response).set('access_token', accessToken, { httpOnly: true, secure: false })
                request.flash('notify', 'Vous êtes maintenant connecté.');
                response.redirect('/');
            } else {
                response.render('authenticated/form', {
                    error: `L'identification a échouée`,
                    form: { email: request.body.email || '' }
                });
            }
        }, () => {
            response.render('authenticated/form', {
                error: `L'identification a échouée`,
                form: { email: request.body.email || '' }
            });

        });

    }
    disconnect(request, response) {
        request.session.user = null;
        new Cookies(request, response).set('access_token', null, { expires: 0, httpOnly: true, secure: false });
        request.flash('notify', 'Vous êtes maintenant déconnecté.');
        response.redirect('/');
    }

}
