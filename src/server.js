const express = require('express')
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')
const cors = require('cors')
require('custom-env').env('local')
const multer = require('multer')
const app = express()

/* Image Upload logic starts here
/*======================================================*/
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    cb(null, `user-img-${Date.now()}.${ext}`)
  }
})

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an Image!, please upload only images.', 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

/**
 * const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

  next();
});
 */

/* Image Upload logic ends here
/*======================================================*/
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

if ((process.env.NODE_ENV = 'development')) {
  app.use(cors({ origin: `http://localhost:3000` }))
} else if ((process.env.NODE_ENV = 'production')) {
  app.use(cors({ origin: `https://mypkloop.com` }))
} else {
  app.use(cors())
}

app.use('/api/profile/upload', upload.single('img'), (req, res) => {
  res.status(200).json({ status: true, message: 'Done' })
})

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')
require('./startup/validation')()
require('./startup/prod')(app)

//monitoring request rates here
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 64 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
})

//Using the rate middleware to protect the api from multiple requests
app.use(/^api/, limiter)

const PORT = process.env.PORT || 8000

const server = app.listen(PORT, () =>
  console.log(`App is listening on port ${PORT}`)
)

module.exports = server
