require('../../app/database.js');
find(search = {}) {
    return new Promise((resolve, reject) => {
        this.db.find(search, function (err, realty) {
            if (err) reject(err);
            resolve(realty);
        });
    });
}
