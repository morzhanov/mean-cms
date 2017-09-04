const Post = require('../models/post.js')
const MevicsError = require('../error/mevics-error')

module.exports = {
  getAllPosts: async (req, res, next) => {
    try {
      const posts = await Post.find()

      if (!posts) {
        return next(new MevicsError('Posts not found'))
      }

      res.status(200).send()
    } catch (e) {
      return next(e)
    }
  },

  createPost: async ({body}, res, next) => {
    let post = new Post({
      title: body.title,
      content: body.content,
      date: new Date(Date.now())
    })

    try {
      post = await post.save()

      if (!post) {
        return next(new MevicsError('Post not saved'))
      }
    } catch (e) {
      return next(e)
    }
    res.status(200).send()
  },

  getPost: async ({params}, res, next) => {
    try {
      const page = await Post.findById(params.id)

      if (!page) {
        return next(new MevicsError('Post not found'))
      }

      res.status(200).send()
    } catch (e) {
      return next(e)
    }
  },

  updatePost: async ({body, params}, res, next) => {
    let post
    try {
      post = await Post.findById(params.id)

      if (!post) {
        return next(new MevicsError('Page not found'))
      }

      // update the post info only if its new
      if (body.title) post.title = body.title
      if (body.content) post.content = body.content
      if (body.date) post.date = body.date
      post.date = new Date(Date.now())

      // save the page
      post = await post.save()

      if (!post) {
        return next(new MevicsError('Post not saved'))
      }

      res.status(200).json(post)
    } catch (e) {
      return next(e)
    }
  },

  deletePost: async ({params}, res, next) => {
    try {
      await Post.remove({id: params.id})
    } catch (e) {
      return next(e)
    }
    return res.status(200).send('Post id- ' + params.id + 'has been deleted')
  }
}
