const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const compression = require('compression')

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body parser
app.use(express.json({ limit: '500kb' }))
app.use(express.urlencoded({ extended: false, limit: '500kb' }))

// Compression middleware
app.use(compression({
  level: 6,
  threshold: 0
}))

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  deleteComment,
  select,
} = require('./helpers/hbs')
const { publicDecrypt } = require('crypto')

// Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      deleteComment,
      select,
      checkingCurrentPagePublic: function (currentPage, pages) {
        let current = parseInt(currentPage)
        let total = parseInt(pages)
        if (current == 1 && total > 1) {
          return `<div class="row" style="margin-bottom: 3rem;">
          <div class="col s12 right-align"><a 
                href="/?page=${parseInt(currentPage) + 1}" class="btn"> <span>
                  Page ${parseInt(currentPage) + 1}
                  <i class="fas fa-chevron-right"></i>
                </span>
                </a></div>
          
      </div>`
        } else if (current < total) {
          return `<div class="row" style="margin-bottom: 3rem;">
          <div class="col s6"><a 
                href="/?page=${parseInt(currentPage) - 1}" class="btn"> <span>
                  <i class="fas fa-chevron-left"></i> Page ${parseInt(currentPage) - 1}
                </span>
                </a>
              </div>
          <div class="col s6 right-align"><a 
                href="/?page=${parseInt(currentPage) + 1}" class="btn"> <span>
                  Page ${parseInt(currentPage) + 1}
                  <i class="fas fa-chevron-right"></i>
                </span>
                </a></div>
          
      </div>`
        } else if (current == total && total > 1) {
          return `<div class="row" style="margin-bottom: 3rem;">
          <div class="col s12 left-align"><a 
                href="/?page=${parseInt(currentPage) - 1}" class="btn"> <span>
                  <i class="fas fa-chevron-left"></i> Page ${parseInt(currentPage) - 1}
                </span>
                </a>
              </div>
              </div>`
        }
      },
      checkingCurrentPage: function (currentPage, pages) {
        let current = parseInt(currentPage)
        let total = parseInt(pages)
        if (current == 1 && total > 1) {
          return `<div class="row" style="margin-bottom: 3rem;">
          <div class="col s12 right-align"><a 
                href="/stories/?page=${parseInt(currentPage) + 1}" class="btn"> <span>
                  Page ${parseInt(currentPage) + 1}
                  <i class="fas fa-chevron-right"></i>
                </span>
                </a></div>
          
      </div>`
        } else if (current < total) {
          return `<div class="row" style="margin-bottom: 3rem;">
          <div class="col s6"><a 
                href="/stories/?page=${parseInt(currentPage) - 1}" class="btn"> <span>
                  <i class="fas fa-chevron-left"></i> Page ${parseInt(currentPage) - 1}
                </span>
                </a>
              </div>
          <div class="col s6 right-align"><a 
                href="/stories/?page=${parseInt(currentPage) + 1}" class="btn"> <span>
                  Page ${parseInt(currentPage) + 1}
                  <i class="fas fa-chevron-right"></i>
                </span>
                </a></div>
          
      </div>`
        } else if (current == total && total > 1) {
          return `<div class="row" style="margin-bottom: 3rem;">
          <div class="col s12 left-align"><a 
                href="/stories/?page=${parseInt(currentPage) - 1}" class="btn"> <span>
                  <i class="fas fa-chevron-left"></i> Page ${parseInt(currentPage) - 1}
                </span>
                </a>
              </div>
              </div>`
        }
      },
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs')

// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var 
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

/* Routes  */
// Public Routes
app.use('/', require('./routes/public routes/homepage'))
app.use('/publicStories', require('./routes/public routes/pstories'))
app.use('/singleUser', require('./routes/public routes/pUserStories'))
// Authenticated Routes
app.use('/login', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
app.use('/do-comment', require('./routes/public routes/pstories'))

// /* Showing stories to public and let them read each single story */
// // public stories route
// app.get('/',async (req, res) => {
//   try {
//     const stories = await Story.find({ status: 'public' })
//       .populate('user')
//       .sort({ createdAt: 'desc' })
//       .lean()

//     res.render('public/pstories', {
//       layout: 'public',
//       stories,
//     })
//   } catch (err) {
//     console.error(err)
//     res.render('error/500')
//   }
// })

// // taking the gues to read a single story
// app.get('/stories/:id', async (req, res) => {
//   try {
//     let story = await Story.findById(req.params.id).populate('user').lean()

//     if (!story) {
//       return res.render('error/500')
//     }

//     res.render('public/showpstory', {
//       layout: 'public',
//       story,
//     })
//   } catch (err) {
//     console.error(err)
//     res.render('error/404')
//   }
// })





const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
)
