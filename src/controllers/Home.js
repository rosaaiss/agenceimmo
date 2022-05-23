
const RepoRealty = require('../repository/RealtyRepository');
const UploadImageProductService = require('../services/UploadImageProductService');
module.exports = class Home {

    print(req, res) {
        let repo = new RepoRealty();
        repo.find().then((realties) => {
            const UploadImageProduct = new UploadImageProductService();
            realties = realties.map((realty) => {
                realty.pictures = UploadImageProduct.getPictures(realty.id);
                return realty;
            });
            res.render('home', { realties });
        });
    }

    printRealty(req, res) {
        if (typeof req.params.id != 'undefined' && req.params.id != '') {
            let repo = new RepoRealty();
            repo.find({ _id: req.params.id }).then((realty) => {
                const UploadImageProduct = new UploadImageProductService();
                realty[0].pictures = UploadImageProduct.getPictures(realty[0].id);
                res.render('realty', { realty: realty[0] });
            }, () => {
                req.flash('error', 'Une erreur est survenue.');
                res.redirect('/');
            });
        }
    }

};


