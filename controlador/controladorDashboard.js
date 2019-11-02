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

async function buscarEnDB() {
    try {
        const query = "select uuid, nombre, orden, activo,  mostrar_cliente, edita_user_secundario from materia where activo=1;";
        //const query = "select BIN_TO_UUID(uuid) as uuid, nombre, activo,  mostrar_cliente, edita_user_secundario from materia where activo=1;";
        const connection = await connectionToDb();
        const data = await queryToDb(connection, query);
        connection.release()
        return data;

    } catch (err) {
        console.log("Hubo un error en la consulta", err.message);
        return res.status(404).send("Hubo un error en la consulta" + err.message)
    }
}

async function tipo(req, res) {
    let materia = req.params.materia;
    let data = await buscarEnDbTipo(materia);
    
    res.send(JSON.stringify(data));
};

async function buscarEnDbTipo(materia) {
    try {
        const query = `select uuid, nombre, activo,  mostrar_cliente, edita_user_secundario from tipo where activo=1 and uuid='${materia}'`;
        //const query = `select BIN_TO_UUID(uuid) as uuid, nombre, activo,  mostrar_cliente, edita_user_secundario from tipo where activo=1 and BIN_TO_UUID(materia_uuid)='${materia}'`;
        
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


function hex2bin(hex){
    return (parseInt(hex, 16));
}

async function examenesCambios(req, res) { 
    let data = req.body;
    let sql = '';
    let values = [];

    if(data.visibilidad_cambiar.length) {
        data.visibilidad_cambiar.forEach(uuidToChange => {
            data.listaEstado.map( element => { 
                if (element.uuid === uuidToChange) {
                    sql += `UPDATE materia SET mostrar_cliente=${element.mostrar_cliente} WHERE uuid = '${element.uuid}';`
                }
            });
        });        
    }

    if(data.cambioOrden){
        console.log("DEBO GUARDAR NUEVO ORDEN")
        data.listaEstado.map( element => { 
            sql += `UPDATE materia SET orden=${element.orden} WHERE uuid = '${element.uuid}';`
            
        });
    }

    if(data.inputValue_cambiar.length) {
        data.inputValue_cambiar.forEach(uuidToChange => {
            data.listaEstado.map( element => { 
                if (element.uuid === uuidToChange) {
                    sql += `UPDATE materia SET nombre='${element.nombre}' WHERE uuid = '${element.uuid}';`
                }
            });
        });
        
    }

    if (data.agregar.length) {
        sql += "INSERT INTO materia (uuid, orden, nombre, activo, mostrar_cliente, edita_user_secundario) VALUES ? "
        data.agregar.forEach(uuidToAdd => {
            data.listaEstado.map( element => { 
                if (element.uuid === uuidToAdd) {
                    values.push( [ element.uuid , element.orden, element.nombre, element.activo, element.mostrar_cliente, element.edita_user_secundario] );
                }
            });
        });
    }

    // if (data.agregar) {
    //     data.agregar.forEach(uuidToAdd => {
    //         data.listaEstado.map( element => { 
    //             if (element.uuid === uuidToAdd) {
    //                 sql += `INSERT INTO materia (uuid, nombre, activo, mostrar_cliente, edita_user_secundario)
    //                 VALUES 
    //                 ( UUID_TO_BIN('${element.uuid}'), "${element.nombre}", ${element.activo}, ${element.mostrar_cliente}, ${element.edita_user_secundario});`
    //             }
    //         });
    //     });
    // }

    
    if (data.remover.length) {
                //sql += `UPDATE materia SET activo=0 WHERE BIN_TO_UUID(materia.uuid)='${uuidToRemove}';`
        data.remover.forEach(uuidToRemove => {
            sql += `UPDATE materia SET activo=0 WHERE uuid = '${uuidToRemove}';`
        })
    }

    /*
    var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
    var sql = mysql.format('UPDATE posts SET modified = ? WHERE id = ?', [CURRENT_TIMESTAMP, 42]);
    console.log(sql); // UPDATE posts SET modified = CURRENT_TIMESTAMP() WHERE id = 42

    let BIN_TO_UUID(uuid) = { toSqlString: function(uuid) { return `BIN_TO_UUID(${uuid})`; } };
    let sql2 = mysql.format('UPDATE posts SET modified = ? WHERE id = ?', [BIN_TO_UUID, 42]);
    */
    
    console.log(sql, values)

    try {
        const connection = await connectionToDb();
        const data = await queryToDbValues(connection, sql, values);
        connection.release()
        return data;

    } catch (err) {
        console.log("Hubo un error en la consulta", err.message);
        return res.status(404).send("Hubo un error en la consulta" + err.message)
    }
}

function queryToDbValues(connection, sql, values) {

    connection.query(sql, [values], function (error) {
        if (error) {
            console.log("Hubo un error en la consulta " + error.message)
        } 
    });
    
};




module.exports = {
    materia: materia,
    tipo: tipo,
    examenesCambios: examenesCambios,
};