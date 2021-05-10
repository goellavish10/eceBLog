const express = require('express')
const router = express.Router()
const querystring = require('querystring');

// Loading Story model for public stories
const Story = require('../../models/Story')

// asking for guest or logged in user
// router.get('/', (req,res)=>{
//   res.render('public/asking', {
//     layout: 'asking',
//   })
// })

// Loading the homepage for not logged in users
router.get('/',async (req, res) => {
  const resPerPage = 6; // results per page
  // req.query.page = page || 1
  let page = req.query.page || 1

    try {
      
      // let html = `<button class="btn waves-effect waves-light" id="dec" name="action" onclick="actOnPost(event)">
      //               <i class="fas fa-chevron-left"></i>  Prev
      //             </button>`

      // const limit = parseInt(size)
      // const skip = (page - 1) * size
      
      const stories = await Story.find({ status: 'public' })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()
        .skip((resPerPage * page) - resPerPage)
        .limit(resPerPage);
      // console.log(stories);
      // const story = await Story.find({_id: req.params.purpose})
      // let comments = story.comments
      const numOfStories = await Story.countDocuments({ status: 'public' });
      console.log(page)
      console.log(Math.ceil(numOfStories/resPerPage))

        res.render('public/pstories', {
          layout: 'public',
          stories,
          currentPage: page,
          pages: Math.ceil(numOfStories/resPerPage),
        })
    } catch (err) {
      console.error(err)
      res.render('error/public_error/500')
    }
})

/* Show Stories according to the category */

// @desc    Show blogs category
// @route   GET /public/category/blogs
router.get('/public/category/blogs',async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public', category: 'blog' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()
    let category = "Blogs"
    res.render('public/category', {
      layout: 'public',
      stories,
      category,
    })
  } catch (err) {
    console.error(err)
    res.render('error/public_error/500')
  }
})

// @desc    Show story category
// @route   GET /public/category/story
router.get('/public/category/story',async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public', category: 'story' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

      let category = "Stories"

    res.render('public/category', {
      layout: 'public',
      stories,
      category,
    })
  } catch (err) {
    console.error(err)
    res.render('error/public_error/500')
  }
})

// @desc    Show poem category
// @route   GET /public/category/poems
router.get('/public/category/poems',async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public', category: 'poem' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    let category = "Poems"

    res.render('public/category', {
      layout: 'public',
      stories,
      category,
    })
  } catch (err) {
    console.error(err)
    res.render('error/public_error/500')
  }
})

// @desc    Show writeUp category
// @route   GET /public/category/poems
router.get('/public/category/writeups',async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public', category: 'writeUp' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    let category = "Write-Ups"

    res.render('public/category', {
      layout: 'public',
      stories,
      category,
    })
  } catch (err) {
    console.error(err)
    res.render('error/public_error/500')
  }
})

module.exports = router