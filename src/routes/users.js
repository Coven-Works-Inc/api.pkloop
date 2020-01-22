const express = require('express')
const userRouter = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const userController = require('../controllers/user')

const {
  fetchAllUsers,
  fetchUser,
  updateProfilePicture,
  updateMyBalance,
  reduceMyBalance
} = userController

const multer = require('multer');

//CONFIGURING MULTER FOR FILE UPLOADS
const path = require('path');

//Set Storage engine
const storage = multer.diskStorage({
  destination: __dirname + './uploads/images',
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


userRouter.post('/upload', upload.single('img'), (req, res) => {
  res.status(200).json({status: true, message: 'Done'})
});
userRouter.get('/', fetchAllUsers)
userRouter.get('/fetchUser', auth, fetchUser)
userRouter.patch('/updateMe', auth, userController.updateUser)
userRouter.put('/updateMyBalance', auth, updateMyBalance)
userRouter.put('/reduceMyBalance', auth, reduceMyBalance)



module.exports = userRouter
