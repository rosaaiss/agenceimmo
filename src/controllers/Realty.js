module.exports = class Realty {
    print(request, response) {
        if (typeof request.session.user !== 'undefined') {
            response.render('admin/realty/list');
            return;
        }
        request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
        response.redirect('/connexion');
    }

};
