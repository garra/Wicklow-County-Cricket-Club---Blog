const Image = require('../model/Image')
const log4js      = require('log4js');

log4js.configure({
    appenders: { 'file': { type: 'file', filename: 'logs/loggers.log' , maxLogSize: 10485760, backups: 3, compress: true } },
    categories: { default: { appenders: ['file'], level: 'debug' } }
  });
  
const logger = log4js.getLogger('loggers');

exports.addBlog =  (req, res) => {
   const newImage = new Image ({
       userId : req.body.userId,
       name   : req.body.name,
       title  : req.body.title,
       report : req.body.report,
       image  : req.body.image
   })
   newImage.save ()
   .then (response => {
        logger.info ('Blog added ====')
        res.json({ status: 'ok' })
}) 
   .catch (err => {
       logger.error (err)
       res.send('error: ' + err)})
}

exports.getBlogs = (req, response) => {
    Image.find ()
    .then (res => {
        logger.info ('=== All Blogs fetched ====')
        response.status(200).send (res)
    })
    .catch (err => {
        logger.info (err)
       response.status(400).send('error '+err);
    })
}

exports.getUserBlogs = (req, response) => {
    Image.find ({userId: req.params.id})
    .then (res => {
        logger.info ('==User blogs fetched==')
        response.status(200).send (res)
    })
    .catch (err => {
        logger.error (err)
       response.status(400).send('error '+err);
    })
}

exports.deleteUserBlog = (req, response) => {
    Image.findByIdAndRemove(req.params.id)
    .then (res => {
        logger.info ('==Blog deleted id ==', req.params.id)
        response.status(200).send (res)
    })
    .catch (err => {
        logger.error (err)
        response.status(400).send('error '+err);
    })
}

exports.getBlog = (req, response) => {
    Image.find ({_id: req.params.id})
    .then (res => {
        logger.info ('====Blog data fetched====')
        response.status(200).send (res)
    })
    .catch (err => {
        logger.error (err)
       response.status(400).send('error '+err);
    })
}

exports.updateUserBlog = (req, response) => {
    Image.update ({_id: req.params.id},
        {
            $set:
      {
        title: req.body.title,
        report: req.body.report,
        image: req.body.image
      }
        })
    .then (res => {
       logger.info ('====Blog updated====')
        response.status (200).send (res)
    } )
    .catch (err => {
        logger.error (err)
        response.status (400).send('error '+err);
    })
}
