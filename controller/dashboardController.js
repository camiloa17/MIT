const con = require('../lib/conexiondb');
const process = require('process');

async function materia(req, res) {
    let extracto = await buscarEnDB();
    console.log("busqueda")
    res.send(JSON.stringify(extracto));

};




function connectionToDb() {
    return new Promise((resolve, reject) => {
        con.getConnection(function (error, connection) {

            if (error) {
                reject(error)
                
            } else {
                resolve(connection);
            }

        });
    });
}


function queryToDb(connection, query) {
    return new Promise((resolve, reject) => {
        connection.query({ sql: query, timeout: 40000 }, function (error, extracto, fields) {
            if (error) {
                reject(console.log("Hubo un error en la consulta " + error.message))
            } else {
                resolve(extracto);
            }
        });
    })
};

async function buscarEnDB() {
    try {
        const query = "select * from materia where activo=1;";
        const connection = await connectionToDb();
        const extracto = await queryToDb(connection, query);
        connection.release()
        return extracto;

    } catch (err) {
        console.log("Hubo un error en la consulta", err.message);
        return res.status(404).send("Hubo un error en la consulta" + err.message)
    }
}


process.on('uncaughtException', function (err) {
    console.log(err);
});

module.exports = {
    materia: materia,
};