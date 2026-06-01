const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if(err) {
                req.flash("error", "Error logging in after registration. Please try logging in manually.");
                return res.redirect("/login");
            }
            req.flash("success", "Welcome to StayNest!");
            res.redirect("/listings");
        });
    } catch (err) {
        console.error(err);
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
      // Authentication is handled by Passport middleware, so this route will only be reached if authentication is successful
    req.flash("success", "Welcome back to staynest!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            req.flash("error", "Error logging out. Please try again.");
            return res.redirect("/listings");
        }
        req.flash("success", "You have been logged out.");
        res.redirect("/listings");
    })
};