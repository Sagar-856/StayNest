if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
    
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";
const dbUrl = process.env.ATLASDB_URL;

main().then( () => {
    console.log("Connected to DB");
}).catch( err => { console.log(err)});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view-engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


// Debug middleware to log request body
app.use((req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
        console.log("📝 Request Body:", JSON.stringify(req.body, null, 2));
    }
    next();
});


const store = mongoStore.default.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60 
});

store.on("error", (err) => {
    console.log("mongo Session store error:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());   // Serialize user for session
passport.deserializeUser(User.deserializeUser());  // Deserialize user from session
passport.use(new LocalStrategy(User.authenticate()));


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user || null;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// app.get("/fakeUser", async (req, res) => {
//     let fUser = new User({
//         email:"fake@gmail.com",
//         username:"fakeUser"
//     });
//     let registeredUser = await User.register(fUser, "chicken");
//     res.send(registeredUser);
// });


app.all(/.*/, (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) =>{
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(8700,() => {
    console.log("server is running on port 8700");
});
