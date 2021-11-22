//importation Multer pour gérer les fichiers entrants(images)
const multer = require('multer');
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      // chemin ou stocker les fichiers
      callback(null, 'images')   
    },
    filename: (req, file, callback) => {
        //remplacement des espaces
        const name      = file.originalname.split(' ').join('_');
        //choix de l extension appropriée
        const extension = MIME_TYPES[file.mimetype];
        //assemblage unique(nom d'origine, date du jour . extension)
        callback(null, name + Date.now() + '.' + extension);
    }
});

//export:uniquement telechargement de fichier image
module.exports = multer({storage}).single('image');