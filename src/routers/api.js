const {Router} = require('express')
const Auth = require('../controllers/auth')
const General = require('../controllers/general')
const Page = require('../controllers/page')
const Post = require('../controllers/post')
const User = require('../controllers/user')
const JwtCheck = require('../middleware/jwtCheck')
const ErrorHandler = require('../middleware/error-handler')
const NotFound = require('../middleware/not-found')

/**
 * Express router
 * @type {*|createApplication.Router}
 */
const apiRouter = new Router()

apiRouter
  .post('/login', Auth.login)
  .post('/signup', Auth.signup)
  .get('/dashboard', JwtCheck, General.dashboard)
  .get('/me', JwtCheck, General.me)
  .get('/pages', JwtCheck, Page.getPages)
  .get('/pages/:id', JwtCheck, Page.getPage)
  .post('/createPage', JwtCheck, Page.createPage)
  .put('/pages/:id', JwtCheck, Page.updatePage)
  .delete('/pages/:id', JwtCheck, Page.deletePage)
  .get('/pages/:id/posts/', JwtCheck, Page.getPostsOfPage)
  .post('/pages/:id/posts/', JwtCheck, Page.createPostOfPage)
  .get('/pages/:page_id/posts/:post_id', JwtCheck, Page.getPostOfPage)
  .delete('/pages/:page_id/posts/:post_id', Page.deletePostOfPage)
  .get('/posts/', JwtCheck, Post.getAllPosts)
  .post('/posts/', JwtCheck, Post.createPost)
  .get('/posts/:id', JwtCheck, Post.getPost)
  .put('/posts/:id', JwtCheck, Post.updatePost)
  .delete('/posts/:id', JwtCheck, Post.deletePost)
  .post('/users/', JwtCheck, User.createUser)
  .get('/users/', JwtCheck, User.getUsers)
  .get('/users/:id', JwtCheck, User.getUser)
  .put('/users/:id', JwtCheck, User.updateUser)
  .delete('/users/:id', JwtCheck, User.deleteUser)
  .post('/upload/image/user', JwtCheck, User.uploadUserPhoto)
  .use(ErrorHandler())
  .use(NotFound('Not Found'))

module.exports = apiRouter
