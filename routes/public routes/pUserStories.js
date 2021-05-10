const express = require('express')
const router = express.Router()

// Loading Story model for public stories
const Story = require('../../models/Story')


// Route to show the stories posted by a single user
router.get('/user/:userId', async (req, res) => {
    try {
      const stories = await Story.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
        let detail = stories[0].user
  
      res.render('public/singleUserStory', {
        layout: 'public',
        stories,
        detail,
      })
      
      console.log(stories);
    } catch (err) {
      console.error(err)
      res.render('error/public_error/500')
    }
})

module.exports = router