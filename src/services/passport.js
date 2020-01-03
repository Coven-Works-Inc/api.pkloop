const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/User')

const { Google_clientID, Google_clientSecret } = process.env
const callbackURL = process.env.callbackURL

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

passport.use(
  new GoogleStrategy(
    {
      Google_clientID,
      Google_clientSecret,
      callbackURL,
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ email: profile.emails[0].value })
      if (!user) {
        const newUser = new User({
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          email: profile.emails[0].value,
          photo: profile._json.picture
        })
        await newUser.save()

        console.log('Saved User')
      } else {
        console.log('Process terminated!')
      }
    }
  )
)
