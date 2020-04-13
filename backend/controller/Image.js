const Image = require('../model/Image')

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
    res.json({ status: 'ok' })
}) 
   .catch (err => {
       res.send('error: ' + err)})
}

exports.getBlogs = (req, response) => {
    Image.find ()
    .then (res => {
        response.status(200).send (res)
    })
    .catch (err => {
       response.status(400).send('error '+err);
    })
}

exports.getUserBlogs = (req, response) => {
    Image.find ({userId: req.params.id})
    .then (res => {
        response.status(200).send (res)
    })
    .catch (err => {
       response.status(400).send('error '+err);
    })
}

exports.deleteUserBlog = (req, response) => {
    Image.findByIdAndRemove(req.params.id)
    .then (res => {
        response.status(200).send (res)
    })
    .catch (err => {
        response.status(400).send('error '+err);
    })
}

exports.getBlog = (req, response) => {
    Image.find ({_id: req.params.id})
    .then (res => {
        response.status(200).send (res)
    })
    .catch (err => {
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
        response.status(200).send (res)
    } )
    .catch (err => {
        response.status(400).send('error '+err);
    })
}


exports.getAllBlogs = (req, res, next) => {
    
    Image.find({})
        .then(blogs => {   
                res.json(blogs)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
}


exports.removeUser = (req, response, next) => {
    
    User.findByIdAndRemove(req.params.id)
    .then (res => {
        console.log ('res')
        response.status(200).send (res)
    })
    .catch (err => {
        response.status(400).send('error '+err);
    })
}
