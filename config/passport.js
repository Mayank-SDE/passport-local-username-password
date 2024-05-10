const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("./database");
const { compareSync } = require("bcrypt");

passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            const user = await UserModel.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }

            const isPasswordValid = compareSync(password, user.password);
            if (!isPasswordValid) {
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));



//persist user data inside the session object
//store the user inside the session object.
passport.serializeUser((user, done) => {
    done(null, user.id)
})

// it will fetch the user based on the id stored inside the session object 
//getting the session details
passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
