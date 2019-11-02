const con = require('../lib/conexiondb');


function examenes(data) {

    // let sql;

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





    console.log(sql)

}

module.exports = {
    examenes: examenes
}

/*
//Crea una nueva competencia en la tabla competencia
const agregaMateria = "INSERT INTO materia (uuid, nombre, activo, mostrar_cliente, edita_user_secundario) " +
                         "VALUE( UUID_TO_BIN(?), ?, ?, ? ) ";
                         */
