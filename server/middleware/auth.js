const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");

const User = require("../model/User");

 const verifyTokenAndRetriveUser = function(req, res, next) {
   const token = req.header("token");

   // if token doesn't come through, the user is not logged in
   if (!token) {
     return res.status(401).json({error: "You have to be loggged in."});
   }

   try {

     const verified = jwt.verify(token, process.env.SECRET);
     req.user = verified.user;
     next();

   } catch (error) {
     console.log(error);
     res.status(400).json({error: "Invalid user."});
   }
};

module.exports = verifyTokenAndRetriveUser;
