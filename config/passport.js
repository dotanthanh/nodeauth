const localStrategy = require('passport-local').Strategy
const facebookStrategy = require('passport-facebook').Strategy

const configAuth = require('./auth')
const User = require('../app/models/user')

module.exports = (passport)=>{

  passport.serializeUser((user, done)=>{
    done(null, user.id)
  })

  passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user)=>{
      done(err, user)
    })
  })

  passport.use('local-signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done){
      process.nextTick(()=>{
        User.findOne({ 'local.username': username }, function(err, user){
          if (err){
            return done(err)
          }
          if (user){
            return done(null, false, req.flash('signupMessage', 'Username already taken.'))
          }
          else {
            var newUser = new User()
            newUser.local.username = username
            newUser.local.password = newUser.generateHash(password)

            newUser.save((err)=>{
              if(err){
                throw err;
              }
              return done(null, newUser)
            })
          }
        })
      })
  }))

  passport.use('local-login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, username, password, done) =>{
    User.findOne({'local.username': username}, (err, user)=>{
      if (err){
        throw err
      }
      if (!user){
        return done(null, false, req.flash('loginMessage', 'No user found.'))
      }
      if (!user.validPassword(password)){
        return done(null, false, req.flash('loginMessage', 'Wrong password'))
      }
      return done(null, user)
    })
  }))

  passport.use(new facebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL
  }, function(token, refreshToken, profile, done){
    process.nextTick(()=>{
      User.findOne({ 'facebook.id' : profile.id }, (err, user)=>{
        if(err){
          return done(err)
        }
        if(user){
          return done(null,user)
        }
        else{
          var newUser = new User()
          newUser.facebook.id    = profile.id;
          newUser.facebook.token = token;
          newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
          //newUser.facebook.email = profile.emails[0].value;

          newUser.save((err)=>{
            if(err){
              throw err
            }
            return done(null, newUser)
          })
        }
      })
    })
  }))

}
