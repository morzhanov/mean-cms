const MevicsError = require('../error/mevics-error')
const Post = require('../models/post.js')
const Page = require('../models/page.js')

module.exports = {

  getPages: async (req, res, next) => {
    try {
      const pages = await Page.find()

      if (!pages) {
        return next(new MevicsError('Pages not found'))
      }

      res.status(200).send()
    } catch (e) {
      return next(e)
    }
  },

  createPage: async (req, res, next) => {
    let page = new Page({
      title: req.body.title,
      url: req.body.url,
      contentHeader: req.body.contentHeader,
      contentFooter: req.body.contentFooter,
      posts: req.body.posts,
      menuIndex: req.body.menuIndex,
      date: new Date(Date.now())
    })

    try {
      page = await page.save()

      if (!page) {
        return next(new MevicsError('Pages not saved'))
      }
    } catch (e) {
      return next(e)
    }
    res.status(200).send()
  },

  getPage: async ({params}, res, next) => {
    try {
      const page = await Page.findById(params.id)

      if (!page) {
        return next(new MevicsError('Page not found'))
      }

      res.status(200).send()
    } catch (e) {
      return next(e)
    }
  },

  updatePage: async ({params, body}, res, next) => {
    let page
    try {
      page = await Page.findById(params.id)

      if (!page) {
        return next(new MevicsError('Page not found'))
      }

      // update the pages info only if its new
      if (body.title) page.title = body.title
      if (body.url) page.url = body.url
      if (body.contentHeader) page.contentHeader = body.contentHeader
      if (body.contentFooter) page.contentFooter = body.contentFooter
      if (body.posts) page.posts = body.posts
      if (body.menuIndex) page.menuIndex = body.menuIndex
      page.date = new Date(Date.now())

      // save the page
      page = await page.save()

      if (!page) {
        return next(new MevicsError('Page not saved'))
      }

      res.status(200).json(page)
    } catch (e) {
      return next(e)
    }
  },

  deletePage: async ({params}, res, next) => {
    try {
      await Page.remove({id: params.id})
    } catch (e) {
      return next(e)
    }
    res.status(200).send('Page id- ' + params.id + 'has been deleted')
  },

  getPostsOfPage: async ({params}, res, next) => {
    try {
      const page = await Page.findById(params.id)

      if (!page) {
        return next(new MevicsError('Page not found'))
      }

      const posts = await Post.find({_id: {$in: page.posts}})

      if (!posts) {
        return next(new MevicsError('Posts not found'))
      }

      res.status(200).json(posts)
    } catch (e) {
      return next(e)
    }
  },

  createPostOfPage: async (req, res, next) => {
    let page = new Page({
      title: req.body.title,
      url: req.body.url,
      contentFooter: req.body.contentFooter,
      contentHeader: req.body.contentHeader,
      menuIndex: req.body.menuIndex,
      date: new Date(Date.now())
    })

    try {
      page = await page.save()

      if (!page) {
        return next(new MevicsError('Page not saved'))
      }

      res.status(200).send()
    } catch (e) {
      return next(e)
    }
  },

  getPostOfPage: async ({params}, res, next) => {
    try {
      const page = await Page.findById(params.page_id)

      if (!page) {
        return next(new MevicsError('Page not found'))
      }

      const post = await Post.findById(params.post_id)

      if (!post) {
        return next(new MevicsError('Posts not found'))
      }

      res.status(200).json(post)
    } catch (e) {
      return next(e)
    }
  },

  deletePostOfPage: async ({params}, res, next) => {
    try {
      const page = await Page.findById(params.page_id)

      if (!page) {
        return next(new MevicsError('Page not found'))
      }

      await Post.remove(params.post_id)

      res.status(200).send()
    } catch (e) {
      return next(e)
    }
  }
}
