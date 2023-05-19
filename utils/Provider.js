const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Users = require('../models/userModel');

exports.connectPassport = ()=>{
    passport.use(new GoogleStrategy({
        clientID : process.env.GOOGLE_CLIENT_ID,
        callbackURL : process.env.GOOGLE_CALLBACK_URL,
    }, async function (accessToken , refreshToken , profile , done){

        // database comes here

        const user = await Users.findOne({googleId : profile.id });
        if(!user){
            const newUser = await Users.create({
                name : profile.displayName,
                email : profile.emails[0].value,
                googleId : profile.id,
            });
            return done(null , newUser);
        }else{
            return done(null , user);
        }
    }))


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(async function(id, done) {
        // const user = await User.findById(id);
        done(null, user);
    }
    );
}