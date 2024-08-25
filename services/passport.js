const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

// pull mongoDB _id to be used in session authentication
passport.serializeUser((user, done) => {
  // user.id is the mongo id
  // use mongo id since users may have multiple provider id's
  console.log(user.id);
  done(null, user.id);
});

// prior authentication allows passport to fetch full object by id
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
      proxy: true // trust third party proxy
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      // console.log(refreshToken);
      console.log(profile);
      // console.log(profile.photos[0].value);
      // Query user collection for github id
      const existingUser = await User.findOne({
        githubId: profile.id
      });
      // check if user exists
      if (existingUser) {
        // user has record
        return done(null, existingUser);
      }
      // user doesn't exist , need to generate record
      // save github profile id data in mongo user collection
      const user = await new User({
        githubId: profile.id,
        username: profile.username,
        displayname: profile.displayName,
        profileUrl: profile.profileUrl,
        avatarImgUrl: profile._json.avatar_url,
        provider: profile.provider,
        bio: profile._json.bio
      }).save(); // save record

      done(null, user); // second user instance from callback
    }
  )
);
