const con = require('../lib/conexiondb');
const model = require ('../modelo/modeloDashboard');
const process = require('process');


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
        connection.query({ sql: query, timeout: 40000 }, function (error, data, fields) {
            if (error) {
                reject(console.log("Hubo un error en la consulta " + error.message))
            } else {
                resolve(data);
            }
        });
    })
};


async function materia(req, res) {
    let data = await buscarEnDB();
    res.send(JSON.stringify(data));
};


async function tipo(req, res) {
    let materia = req.params.materia;
    let data = await buscarEnDbTipo(materia);
    res.send(JSON.stringify(data));
};


async function examenesCambios(req, res) { 
    let data = req.body;
    let sql;

    if (data.agregar) {
        data.agregar.forEach(uuidToAdd => {
            data.listaEstado.map( element => { 
                if (element.uuid === uuidToAdd) {
                    sql += `INSERT INTO materia (uuid, nombre, activo, mostrar_cliente, edita_user_secundario)
                    VALUES 
                    ( UUID_TO_BIN('${element.uuid}'), "${element.nombre}", ${element.activo}, ${element.mostrar_cliente}, ${element.edita_user_secundario});`
                }
            });
        });
    }

    console.log(sql)
}





async function buscarEnDB() {
    try {
        const query = "select BIN_TO_UUID(uuid) as uuid, nombre, activo,  mostrar_cliente, edita_user_secundario from materia where activo=1;";
        const connection = await connectionToDb();
        const data = await queryToDb(connection, query);
        connection.release()
        return data;

    } catch (err) {
        console.log("Hubo un error en la consulta", err.message);
        return res.status(404).send("Hubo un error en la consulta" + err.message)
    }
}

async function buscarEnDbTipo(materia) {
    try {
        const query = `select * from tipo where activo=1 and BIN_TO_UUID(materia_uuid)='${materia}'`;
        const connection = await connectionToDb();
        const data = await queryToDb(connection, query);
        connection.release()
        return data;

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
    tipo: tipo,
    examenesCambios: examenesCambios,
};