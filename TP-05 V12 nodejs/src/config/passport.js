const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy
const express = require("express")
const router = express.Router();
const sql = require("mssql")
const fs = require('fs');
const getConnection = require("../database/connection")
const querys = require("../database/querys");
const { url } = require("inspector");
const FileReader = require('filereader')
const path = require("path")

passport.use(new LocalStrategy({
    usernameField: "mail"
}, async (mail, password, done)=>{
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM usuarios WHERE usuarios.email = '${mail}' AND usuarios.password = '${password}'`);
    if (result.recordset.length == 0) return done(null, false,{message: "El usuario y la cotraseña no coinciden. Verfifique que ambos existan"})
    else return done(null, result.recordset[0])
}));

passport.serializeUser((user,done)=>{
    done(null, user.id)
})

passport.deserializeUser(async(id,done)=>{
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM usuarios WHERE usuarios.id = '${id}'`);
    done(null, result.recordset[0])
})