const multer = require('multer');
const path   = require('path');

const upload = multer({
  dest: 'uploads/',
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024 // 2 MB file limit
  },
  fileFilter (req, file, cb) {
    console.log(file)
    var extension = path.extname(file.originalname);
    if(extension !== '.png' && extension !== '.jpg' && extension !== '.jpeg') {
        return cb(new Error('Please upload only images with png, jpg, or jpeg extensions.'));
    }
    cb(null, true);
  }
});

module.exports = upload;
