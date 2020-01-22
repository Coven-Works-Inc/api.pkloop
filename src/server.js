const express = require('express')
const passport = require('passport')
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')
require('dotenv').config()

const multer = require('multer');

//CONFIGURING MULTER FOR FILE UPLOADS
const path = require('path');

//Set Storage engine
const storage = multer.diskStorage({
  destination: './uploads/images/profile',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

//Initialize the upload variable
const upload = multer({
  storage: storage,
  limits: {fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
})

//Check file type
function checkFileType(file, cb){
  //Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //Check mime
  const mimeType = filetypes.test(file.mimetype);
  
  if (mimeType && extname ){
    return cb(null, true)
  }else{
    cb('Error: Images Only!')
  }
  
}
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/profile/upload', upload.single('img'), (req, res) => {
  res.status(200).json({status: true, message: 'Done'})
})

const http = require('http')
setInterval(function () {
  http.get('http://pkloop-api.herokuapp.com')
}, 300000) // every 5 minutes (300000)

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')
require('./startup/validation')()
require('./startup/prod')(app)
require('./services/passport')

//monitoring request rates here
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 64 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
})

//Using the rate middleware to protect the api from multiple requests
app.use(/^api/, limiter)

const PORT = process.env.PORT || 8000

app.get(process.env.callbackURL, passport.authenticate('google'))

const server = app.listen(PORT, () =>
  console.log(`App is listening on port ${PORT}`)
)

module.exports = server
