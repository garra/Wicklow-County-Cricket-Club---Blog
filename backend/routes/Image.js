const express    = require('express')
const controller = require ('../controller/Image')
const router     = express.Router()
const cors       = require ('cors')

router.use (cors ())

router.post    ('/add',         controller.addBlog)
router.get     ('/get',         controller.getBlogs)
router.get     ('/getid/:id',   controller.getUserBlogs)
router.get     ('/getblog/:id', controller.getBlog)
router.delete  ('/delete/:id',  controller.deleteUserBlog)
router.put     ('/update/:id',  controller.updateUserBlog)

module.exports = router
