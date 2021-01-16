const router   = require("express").Router();
const upload   = require('../middleware/upload');
const fs       = require('fs');
const path     = require('path');

const escapeStringRegexp = require('escape-string-regexp');

var Photo = require('../model/Photo');

// check if email was sent from user
const verifyEmailSent = (req, res, next) => {
  const email = req.headers.email;

  // if email is not sent over then the user is not logged in
  if (email == undefined) {
    return res.status(400).json({ error: "Please login." });
  }

  next();
}

 /**
 * @method - GET
 * @description - Route serving all photos from specific user.
 * @param - /api/photo
 */
router.get('/', verifyEmailSent, async (req, res) => {
  const email = req.headers.email;

  try {
    // find photos by user email so no other user's photo shows up
    const photos = await Photo.find({userEmail: email}).distinct('_id');
    res.status(200).json({ photos: photos });

  } catch (error) {
    res.status(400).json({ error: "Error retrieving images. Please try again" });
  }

});


 /**
 * @method - GET
 * @description - Route serving all photo ids and names from specific user's search.
 * @param - /api/photo/search
 * @query - ?searchString=
 */
router.get('/search', verifyEmailSent, async (req, res) => {
  const email = req.headers.email;

  var searchString = req.query.searchString;

  if (searchString) {
    // put the search string in lowercase, and then escape all special characters
    const $regex = escapeStringRegexp(searchString.toLowerCase());

    try {
      // find photo where the photo belongs to the specified user and
      // the search string is included in the caption or the filename of the photo
      const photoResults = await Photo.find({
        $and: [
          { userEmail: email },
          { $or: [
              { captionLower: { $regex } },
              { nameLower: { $regex } }
            ]
          }
        ]
      })
      .select('-photo -userEmail '); // only return the filenames

      console.log(photoResults);
      res.status(200).json({ total: Object.keys(photoResults).length, photos: photoResults });

    } catch (error) {
      res.status(400).json({ error: "Error retrieving photos." });
    }
  } else {
    res.end();
  }
});


 /**
 * @method - GET
 * @description - Route serving a specified photo from specific user's request.
 * @param - /api/photo/{photoid}
 */
router.get('/:photoid', verifyEmailSent, async (req, res) => {
  const photoid = req.params.photoid;
  const email = req.headers.email;

  try {

    const photo = await Photo.findById(photoid);

    // user requesting photo did not upload it
    if ( photo.userEmail != email ) {
      return res.status(400).json({ error: "Access denied." });
    }

    res.status(200).json(photo);

  } catch (error) {
    res.status(400).json({ error: "Unable to retrieve photo." });
  }
});


 /**
 * @method - DELETE
 * @description - Route deleting a specific photo.
 * @param - /api/photo/{photoid}
 */
router.delete('/:photoid', verifyEmailSent, async (req, res) => {
  const photoid = req.params.photoid;
  const email = req.headers.email;

  try {

    const photoExists = await Photo.findById(photoid);

    if ( photoExists.userEmail !== email ) {
      return res.status(400).json({ error: "Access denied." });
    }

    const photo = await photoExists.remove();
    res.status(200).json({ message: `Photo ${photo.name} deleted successfully` });

  } catch (error) {
    res.status(400).json({ error: "Unable to delete photo." });
  }
})


 /**
 * @method - POST
 * @description - Route uploading a specific photo from a specific user.
 * @param - /api/photo/upload
 */
router.post('/upload', upload.single('photo'), (req, res, next) => {

  console.log(req.file);

  if (req.file == undefined) {
    return res.status(400).json({ error: "You must select a file." });
  }

  // append date to filename so duplicates can be uploaded
  const filename = `${Date.now()}-${req.file.originalname}`;

  var photoObj = {
    name:      filename,
    caption:   req.body.caption,
    userEmail: req.body.email,
    photo: {
      data: fs.readFileSync(path.join(__dirname, '..', 'uploads/', req.file.filename)), // read from file system into db
      contentType: req.file.mimetype
    }
  }

  Photo.create(photoObj, async (error, photo) => {

    if (error) {
      console.log(error);
      return res.status(400).json({ error: `Error when trying upload file: ${photo}`});
    }
    else {
      await photo.save();
      return res.status(201).json({ message: "File has been uploaded." });
    }
  });

});

module.exports = router;
