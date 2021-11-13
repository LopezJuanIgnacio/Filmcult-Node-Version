const express = require("express")
const router = express.Router();
const sql = require("mssql")
const fs = require('fs');
const getConnection = require("../database/connection")
const querys = require("../database/querys");
const { url } = require("inspector");
const FileReader = require('filereader')
const path = require("path")
const passport = require("passport")
const {isAuthenticated} = require("../helpers/auth")
const {getHome, getCartelera, getReview, postComentario, deleteComentario, getLogin, postRegister, getLogout} = require("../controllers/controller")

router.get("/", getHome)
router.get("/cartelera", getCartelera)
router.get("/review/:id", getReview)
router.post("/review/:id", isAuthenticated, postComentario)
router.post("/review/:id/delete/:cid", isAuthenticated, deleteComentario)
router.get("/login", getLogin)
router.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login"
}))
router.post("/login/register", postRegister)
router.get("/logout", isAuthenticated, getLogout)
module.exports = router;