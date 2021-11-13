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

const funciones = {};

funciones.getHome = async (req, res)=>{
    try {
        const pool = await getConnection();
        const result = await pool.request().query(querys.getCarrusel);
        const result2 = await pool.request().query(querys.getReviews);
        res.render("index.ejs", {carrusel: result.recordset, reviews: result2.recordset});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

funciones.getCartelera = async(req, res)=>{
    try {
        const pool = await getConnection();
        const result = await pool.request().query(querys.getCartelera);
        res.render("cartelera.ejs", {datos: result.recordset});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

funciones.getReview = async(req, res)=>{
    try {
        const id = req.params.id;
        const pool = await getConnection();
        const review = await pool.request().query(`SELECT * FROM reviews WHERE reviews.id = ${id}`);
        const result = await pool.request().query(`SELECT comentario.id, comentario.texto, comentario.uid FROM reviews INNER JOIN comentario ON reviews.id = comentario.fkReview WHERE reviews.id = ${id}`);
        let comentarios = [];
        await result.recordset.forEach(async(e) => {
            let uid = e.uid
            const user = await pool.request().query(`SELECT usuarios.username, usuarios.foto FROM usuarios WHERE usuarios.id = ${uid}`);
            comentarios.push({
                texto: e.texto,
                uid: e.uid,
                id: e.id,
                username: user.recordset[0].username,
                foto: user.recordset[0].foto
            })
        })
        setTimeout(()=>{
            res.render("review.ejs" , {title: review.recordset[0]["titulo"], review: review.recordset[0], comentarios, id})
        }, 1000)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

funciones.postComentario = async(req, res)=>{
    const {texto, uid } = req.body;
    if (/^.{4,255}$/.test(texto) == false || uid == null) {
        return res.status(400).json({ msg: "ERROR 400 Bad Request. Please fill all fields" });
    }
    try {
        const id = req.params.id;
        const pool = await getConnection();
        const val = await pool.request().query(`SELECT * FROM usuarios WHERE usuarios.id = ${uid}`);
        if(val.recordset.length > 0){
            const result = await pool.request().query(`INSERT INTO comentario (fkReview, texto, uid) VALUES (${id},'${texto}',${uid})`);
            if (result.rowsAffected[0] === 0) return res.sendStatus(304).json({ msg: "ERROR 304 Not Modified." });
            res.redirect(`/review/${id}`)
        }else return res.sendStatus(401).json({ msg: "ERROR 401 Not Authorized." });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

funciones.deleteComentario = async(req, res)=>{
    const id = req.params.id;
    const cid = req.params.cid;
    const {cuid,uid} = req.body;
    if(cuid == uid){
        const pool = await getConnection();
        const result = await pool.request().query(`DELETE FROM comentario WHERE id = ${cid}`);
        if (result.rowsAffected[0] === 0) return res.sendStatus(304).json({ msg: "ERROR 304 Not Modified." });
        res.redirect(`/review/${id}`)
    }else return res.sendStatus(401).json({ msg: "ERROR 401 Not Authorized." });
}

funciones.getLogin = async(req, res)=>{
    res.render("login.ejs")
}

funciones.postRegister = async(req, res)=>{
    const {File} = req.files;
    const {mail, username, password} = req.body;
    if (/^.{6,12}$/.test(password) == false ||/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(mail) == false || (/\.(jpg|png)$/i).test(File.name) == false|| /^[a-zA-Z0-9\_\-]{4,16}$/.test(username) == false) {
        return res.status(400).json({ msg: "ERROR 400 Bad Request. Please fill all fields correctly" });
    }
    const pool = await getConnection();
    const consulta = await pool.request().query(`SELECT * FROM usuarios WHERE usuarios.email = '${mail}'`);
    const consulta2 = await pool.request().query(`SELECT * FROM usuarios WHERE usuarios.username = '${username}'`);
    if (consulta.recordset.length > 0 || consulta2.recordset.length > 0) return res.sendStatus(400).json({ msg: "ERROR 400 Bad Request. Email or username already in use" })
    else{
        let urlfoto = path.join(__dirname, `/public/img/userimg/`)
        fs.writeFile(`src/public/img/userimg/${username}.jpg`, File.data, e=>{
            if (e) return console.log(e);
        })
        const result = await pool.request().query(`INSERT INTO usuarios (foto, username, email, password) VALUES ('${urlfoto}','${username}','${mail}','${password}')`);
        if (result.rowsAffected[0] === 0) return res.sendStatus(304).json({ msg: "ERROR 304 Not Modified." });
        return res.sendStatus(200);
    }
}

funciones.getLogout = async(req, res)=>{
    req.logout()
    res.redirect("/")
}

module.exports = funciones