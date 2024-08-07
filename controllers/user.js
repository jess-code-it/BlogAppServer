const bcrypt = require('bcrypt');
const User = require("../models/User");
const auth = require("../auth");
const { errorHandler } = auth;
// Function to log in a user
module.exports.loginUser = (req, res) => {
  if (req.body.email.includes("@")) {
    return User.findOne({ email: req.body.email })
      .then(result => {
        if (!result) {
          return res.status(404).send({ message: 'No email found' });
        } else {
          const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
          if (isPasswordCorrect) {
            return res.status(200).send({
              message: 'User logged in successfully',
              access: auth.createAccessToken(result)
            });
          } else {
            return res.status(401).send({ message: "Incorrect email or password" });
          }
        }
      })
      .catch(error => errorHandler(error, req, res));
  } else {
    return res.status(400).send({ message: "Invalid email format" });
  }
};

// Function to register a user
module.exports.registerUser = (req, res) => {
  if (!req.body.email.includes('@')) {
    return res.status(400).send({ message: 'Invalid email format' });
  } else if (req.body.password.length < 8) {
    return res.status(400).send({ message: 'Password must be at least 8 characters long' });
  } else {
    let newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10)
    });

    return newUser.save()
      .then((result) => res.status(201).send({
        message: 'User registered successfully'
      }))
      .catch(error => errorHandler(error, req, res));
  }
};

// Function to get authenticated user details
module.exports.getUserDetails = async (req, res) => {
  try {
    if (!req.user || !req.user.id) { // Adjusted to req.user.id
      return res.status(400).send({ message: 'User information is missing or incomplete' });
    }

    const userId = req.user.id; // Adjusted to req.user.id
    console.log('Fetching user with ID:', userId); // Debugging line

    const user = await User.findById(userId).select('email username createdAt');

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ user });
  } catch (error) {
    errorHandler(error, req, res);
  }
};


