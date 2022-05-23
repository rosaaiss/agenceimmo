const RepoUser = require('../repository/User');
const UploadImageProductService = require('../services/UploadImageProductService');

module.exports = class User {

    print(request, response) {
        if (typeof request.session.user !== 'undefined') {
            let repo = new RepoUser();
            repo.find().then((users) => {
                response.render('admin/User/list', { users });
            });
        } else {
            request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
            response.redirect('/connexion');
        }
    }

    printForm(request, response) {
        if (typeof request.session === 'undefined' || typeof request.session.user === 'undefined') {
            request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
            response.redirect('/connexion');
            return;
        }
        // on est en modification
        if (typeof request.params.id !== 'undefined') {
            let repo = new RepoUser();
            repo.findById(request.params.id).then((user) => {
                response.render('admin/user/form', { form: user });
            }, () => {
                request.flash('error', `L'utilisateur n'a pas été trouvé`)
                response.redirect('list');
            });
        }
        // on est en ajout
        else {
            response.render('admin/user/form', { form: { user: {} } });
        }
    }

    processForm(request, response) {
        console.log(request.body)
        // response.send('ok');
        let entity = {
            email: request.body.email || '',
            // password: request.body.user.email || '',
            civility: request.body.civility || '',
            firstname: request.body.firstname || '',
            lastname: request.body.lastname || '',
            phone: request.body.phone || '',
            roles: request.body.roles || '',
            date: request.body.date || '',
        };

        let repo = new RepoUser();

        let save;
        if (typeof request.params.id != 'undefined' && request.params.id != '') {
            save = repo.edit(request.params.id, entity);
        }
        else {
            save = repo.add(entity);
        }

        save.then((user) => {
            if (typeof request.params.id != 'undefined' && request.params.id != '') {
                request.flash('notify', "L'utilisateur a été modifié.");
            } else {
                request.flash('notify', "L'utlisateur a été créé.");
            }

            // Gestions d'upload des photos ici
            let photos = [];

            // Enregistrement des images
            if (typeof request.files != 'undefined' && request.files != null) {
                if (typeof request.files.photos[0] === 'undefined') {
                    request.files.photos = [request.files.photos];
                }
                const UploadImageProduct = new UploadImageProductService();
                if (typeof request.files.photos != 'undefined' && request.files.photos.length > 0) {

                    Object.values(request.files.photos).forEach(file => {
                        photos.push(UploadImageProduct.moveFile(file, user._id));
                    });
                }
            }
            Promise.all(photos).then((values) => {
                request.flash('success', `L'utilisateur a été enregistré`);
                response.redirect('/admin/user');
            });

        }, (err) => {
            response.render('admin/user/list', {
                error: `L'enregistrement en base de données a échoué`,
                form: entity
            });
        });

    }

    delete(request, response) {
        if (typeof request.session === 'undefined' || typeof request.session.user === 'undefined') {
            request.flash('error', `Vous devez être connecté pour accéder à l'administration.`);
            response.redirect('/connexion');
            return;
        }

        if (typeof request.params.id != 'undefined'
            && request.params.id != '') {
            let repo = new RepoUser();
            repo.delete({ _id: request.params.id }).then(() => {
                request.flash('notify', "L'utilisateur a été supprimé.");
                response.redirect('/admin/user');
            }, () => {
                request.flash('error', "La suppression de l'utilisateur a échoué.");
                response.redirect('/admin/user');
            });
        }
        else {
            request.flash('error', 'Une erreur est survenue.');
            response.redirect('/admin/user');
        }
    }

};