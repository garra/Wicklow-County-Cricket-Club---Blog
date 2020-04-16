require('../config')

const User        = require('../model/User')
const jwt         = require('jsonwebtoken')
const bcrypt      = require('bcrypt')
const sanitize    = require('mongo-sanitize');
const log4js      = require('log4js');

const { check, validationResult } = require('express-validator');

log4js.configure({
    appenders:  { 'file': { type: 'file', filename: 'logs/loggers.log' , maxLogSize: 10485760, backups: 3, compress: true } },
    categories: { default: { appenders: ['file'], level: 'debug' } }
  });
  
const logger = log4js.getLogger('loggers');

exports.createValidationFor = (value) => {
    switch (value) {

        case 'create':
            return [
                check('username').exists().withMessage('Username is required')
                    .custom(value => !/\s/.test(value)).withMessage('No spaces are allowed in the username'),
               
                    check('email').exists().withMessage('Email is required').isEmail().withMessage('Invalid email'),
              
                    check('mobile').isNumeric().isLength({ min: 10, max: 11 }).withMessage('Invalid Mobile number')
                    .custom(val => {
                        if (val[0] == '0') return true;
                        return false;
                    }).withMessage('Mobile number should start with 0'),
                  
                    check('password').exists()
                    .withMessage('Password should not be empty')
                    .isLength({ min: 8 })
                    .withMessage('Password should minimum eight characters')
                    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
                    .withMessage('Password should be at least one capital and one small letter, one number and one special character')
                
                ]
        default:
            return []
    }
}

exports.checkValidationResult = (req, res, next) => {
    const result = validationResult(req);
    logger.info ('==Register Validation==',result);
    if (result.isEmpty()) {
        return next();
    }

    res.status(422).json(result.array());
}

exports.createUser = (req, res, next) => {

    const today = new Date()
    const userData = {
        first_name: sanitize(req.body.first_name),
        surname: sanitize(req.body.surname),
        username: sanitize(req.body.username),
        email: sanitize(req.body.email),
        mobile: sanitize(req.body.mobile),
        password: sanitize(req.body.password),
        created: sanitize(today)
    }
    User.findOne ({
        username: req.body.username
     })
     .then (user => {
         if (!user) {
            User.findOne({
                email: req.body.email
            })
                .then(user => {
                    if (!user ) {
                        bcrypt.genSalt (Number (process.env.ROUNDS), function (err, salt) {
                            if (err) {
                                logger.error (err)
                                res.send ('error: '+err)
                            }
                            else {
                            bcrypt.hash (userData.password, salt, function (err, hash) {
                                if (err) {
                                    logger.error (err)
                                    res.send ('error: '+err)
                                }
                                else {
                                    userData.password = hash
                                    User.create(userData)
                                        .then(user => {
                                            logger.log (user)
                                            res.json({ status: 'ok' })
                                        })
                                        .catch(err => {
                                            logger.error (err)
                                            res.send('error: ' + err)
                                        })
                                }
                            })}
                            })
                         
                    } 
                    else {
                        logger.info ('Email ID already registered')
                        res.json({ error: 'Username or email is already registered!!' })
                    }
                })
                .catch(err => {
                    logger.error (err)
                    res.send('error: ' + err)
                })
         }
         else {
             logger.info ('Username already registered')
            res.json({ error: 'Username is already taken!!' })
         }
     })
     .catch (err => {
         logger.error (err)
        res.send('error: ' + err)
     })

}


exports.verifyUser = (req, res, next) => {
    User.findOne({
        username: sanitize (req.body.username)
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, sanitize (user.password))) {
                    // Passwords match
                    const payload = {
                        _id: user._id,
                        first_name: user.first_name,
                        surname: user.surname,
                        username: user.username,
                        mobile: user.mobile,
                        email: user.email
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn : 86400
                    })
                    logger.info ('==userToken fetched==')
                    res.send(token)
                } else {
                    // Passwords don't match
                    logger.info ('Passwords did not match')
                    res.json({ error: 'Please enter valid credentials for Wicklow CCC Blog' })
                }
            } else {
                logger.info ('Username not registered')
                res.json({ error: 'Please enter valid credentials for Wicklow CCC Blog' })
            }
        })
        .catch(err => {
            logger.error (err)
            res.send('error: ' + err)
        })
}

exports.getUserProfile = (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, function (err, decoded) {
        if ( err ) {
            logger.error (err)
            res.send (err)
            }
            else {
                User.findOne({
                    _id: decoded._id
                })
                    .then(user => {
                        if (user) {
                            logger.info ('====User Profile fetched====' )
                            res.json(user)
                        } else {
                            logger.info ('User ID not present')
                            res.send('User does not exist')
                        }
                    })
                    .catch(err => {
                        logger.error (err)
                        res.send('error: ' + err)
                    })
            }
    })

}

exports.getAllUsers = (req, res, next) => {
    
    User.find({})
        .then(user => {
            logger.info ('All users data fetched')
                res.json(user)
        })
        .catch(err => {
            logger.error (err)
            res.send('error: ' + err)
        })
}


exports.removeUser = (req, response, next) => {
    
    User.findByIdAndRemove(req.params.id)
    .then (res => {
        logger.info ('User Removed with id, ', req.params.id)
        response.status(200).send (res)
    })
    .catch (err => {
        logger.log (err)
        response.status(400).send('error '+err);
    })
}
