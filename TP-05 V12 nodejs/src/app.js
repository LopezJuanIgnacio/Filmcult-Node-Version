const express = require("express");
const Routes = require("./routes/routes");
const morgan = require("morgan");
const path = require("path")
const app = express();
const fileupload = require('express-fileupload')
const session = require("express-session")
const passport = require("passport")
const flash = require("flash")

// settings
app.set("port", 3000);
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.engine("html", require("ejs").renderFile)
require("./config/passport")

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileupload())
app.use(session({
    secret: "mysecretapp",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session())
app.use(flash())

//global variables
app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    next();
})
//static files
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use("/", Routes);

module.exports = app;
