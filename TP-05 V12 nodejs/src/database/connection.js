const sql = require("mssql");
module.exports = getConnection = async () => {
    try {
    const pool = await sql.connect({
        user: "prueba",
        password: "pruebacontra",
        server: "localhost",
        database: "tp5 nodejs",
        port: 1433,
        dialect: "mssql",
        options: {
          encrypt: true, // for azure
          trustServerCertificate: true, // change to true for local dev / self-signed certs
        },
    });
    return pool;
    } catch (error) {
    console.error(error);
    }
};