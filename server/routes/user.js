const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
var auth     = require("../middleware/auth")

var validateInputForLogin        = require("../validation/validateLogin")
var validateInputForRegistration = require("../validation/validateRegister")

const User = require("../model/User");


 /**
 * @method - POST
 * @description - Route registering a specific user and returning a token.
 * @param - /api/user/register
 */
router.post("/register", async (req, res) => {
  const { name, email, password, confirm } = req.body;
  //check if input from user is valid
  const { isValid, errors } = validateInputForRegistration(req.body);

  if (!isValid) {
    console.log(errors);
    return res.status(400).json({ errors });
  }

  try {
    // check if email already exists in the db
    let user = await User.findOne({ email });

    if (user) {
      let errors          = {};
      errors.emailMessage = "Email already exists."
      return res.status(400).json({ errors });
    }

    //create user from data
    var newUser = new User({
      name, email, password
    });

    // hash the password received
    const salt       = await bcrypt.genSalt(7);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    res.status(200).json({ message: `User ${email} created` });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "We ran into an issue while registering you. Please try again later." });
  }

});


 /**
 * @method - POST
 * @description - Route registering a specific user and returning a token.
 * @param - /api/user/login
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //check if input from user is valid
  const { isValid, errors } = validateInputForLogin(req.body);

  try {
    // check if email exists in the db
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      return res.status(400).json({ error: "Invalid email or password."})
    }

    // create payload for jwt
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload,
      process.env.SECRET,
      {
        expiresIn: '10h'
      },
      (err, token) => {

        if (err) throw err;

        res.status(200).json({ token });

    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "We ran into an issue while logging you in. Please try again later." });
  }

});


 /**
 * @method - GET
 * @description - Route registering a specific user and returning a token.
 * @param - /api/user/whoami
 */
router.get("/whoami", auth, async (req, res) => {
  try {
    // find user after token authentication
    const user = await User.findById(req.user.id).select('-password');;
    res.status(200).json(user);

  } catch (error) {
    res.status(400).json({ error: "You are not logged in. Please login." })
  }

});

module.exports = router;
