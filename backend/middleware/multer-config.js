const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'

};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'images')  // chemin ou stocker 
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');//remplacement des espaces
        const extension = MIME_TYPES[file.mimetype];//choix de l extension
        callback(null, name + Date.now() + '.' + extension);//assemblage unique
    }
});

module.exports = multer({storage}).single('image');//export uniquement telechargement de fichier image