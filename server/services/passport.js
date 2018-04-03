const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecert,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(oldUser => {
        if (!oldUser) {
          new User({ googleId: profile.id }).save().then(user => {
            done(null, user);
            return;
          });
        }
        done(null, oldUser);
      });
    }
  )
);
