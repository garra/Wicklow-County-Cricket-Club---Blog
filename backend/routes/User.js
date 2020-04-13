const express    = require('express')
const controller = require ('../controller/User')
const cors       = require ('cors')
const rateLimit = require("express-rate-limit");

const router     = express.Router()

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: "Too many accounts created from this IP, please try again after an hour"
  });

  
const verifyAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: "Too many logins from this IP, please try again after an hour"
  });
  
router.use (cors ())
router.post ('/register', controller.createValidationFor('create'), controller.checkValidationResult, createAccountLimiter, controller.createUser)
router.post ('/login',    verifyAccountLimiter, controller.verifyUser)
router.get ('/profile',   controller.getUserProfile)
router.get ('/getall',   controller.getAllUsers)
router.delete  ('/deleteuser/:id',  controller.removeUser)

module.exports = router