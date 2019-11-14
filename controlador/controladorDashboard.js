const con = require("../lib/conexiondb");
const mysql = require("mysql");
const process = require("process");

function connectionToDb() {
  return new Promise((resolve, reject) => {
    con.getConnection(function(error, connection) {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });
}

function queryToDb(connection, query) {
  return new Promise((resolve, reject) => {
    connection.query({ sql: query }, function(
      error,
      data,
      fields
    ) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function queryToDbValues(connection, query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, function(error, data, fields) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

////////////////////////////////////////////////////////////////// SOLAPA EXAMENES //////////////////////////////////////////////////////////////////
// async function getMateria(req, res) {
//   let data = await buscarEnDBMateria();
//   res.send(JSON.stringify(data));
// }

// async function buscarEnDBMateria() {
//   try {
//     const query =
//       "SELECT uuid, nombre, orden, activo, mostrar_cliente, edita_user_secundario FROM materia WHERE activo=1;";
//     //const query= "SELECT BIN_TO_UUID(uuid) as uuid, nombre, activo,  mostrar_cliente, edita_user_secundario FROM materia WHERE activo=1;";
//     const connection = await connectionToDb();
//     const data = await queryToDb(connection, query);
//     connection.release();
//     return data;
//   } catch (err) {
//     console.log("Hubo un error en la consulta", err.message);
//     return res.status(404).send("Hubo un error en la consulta" + err.message);
//   }
// }

//////////////////////   TEST UUID
async function getMateria(req, res) {
  let data = await buscarEnDBMateria();
  res.send(JSON.stringify(data));
}

async function buscarEnDBMateria() {
  let connection;
  try {
    //const query ="SELECT uuid, nombre, orden, activo, mostrar_cliente, edita_user_secundario FROM materia WHERE activo=1;";
    const query =
      "SELECT BIN_TO_UUID(uuid) as uuid, nombre, activo, mostrar_cliente, edita_user_secundario FROM materia WHERE activo=1;";
    connection = await connectionToDb();
    const data = await queryToDb(connection, query);
    
    return data;
  } finally {
    if(connection) connection.release();
  }
}
////////////////////////// borrar lo de arriba

async function getTipo(req, res) {
  let materia = req.params.materia;
  let data = await buscarEnDbTipo(materia);
  res.send(JSON.stringify(data));
}

async function buscarEnDbTipo(materia) {
  try {
    const query = `SELECT uuid, nombre, orden, activo, mostrar_cliente, edita_user_secundario FROM tipo WHERE activo=1 AND materia_uuid='${materia}'`;
    //const query = `SELECT BIN_TO_UUID(uuid) AS uuid, nombre, activo, mostrar_cliente, edita_user_secundario FROM tipo WHERE activo=1 AND BIN_TO_UUID(materia_uuid)='${materia}'`;

    const connection = await connectionToDb();
    const data = await queryToDb(connection, query);
    connection.release();
    return data;
  } catch (err) {
    console.log("Hubo un error en la consulta", err.message);
    return res.status(404).send("Hubo un error en la consulta" + err.message);
  }
}

async function getNivel(req, res) {
  let nivel = req.params.nivel;
  let data = await buscarEnDbNivelCompleto(nivel);
  res.send(JSON.stringify(data));
}

async function buscarEnDbNivelCompleto(nivel) {
  try {
    const query = `SELECT uuid, nombre, orden, activo, descripcion, mostrar_cliente, tipo_uuid, pdf, imagen FROM nivel WHERE activo=1 AND uuid='${nivel}'`;

    const connection = await connectionToDb();
    const data = await queryToDb(connection, query);
    connection.release();
    return data;
  } catch (err) {
    console.log("Hubo un error en la consulta", err.message);
    return res.status(404).send("Hubo un error en la consulta" + err.message);
  }
}

async function getNivelChips(req, res) {
  let tipo = req.params.tipo;
  let data = await buscarEnDbNivel(tipo);
  res.send(JSON.stringify(data));
}

async function buscarEnDbNivel(tipo) {
  try {
    const query = `SELECT uuid, nombre, orden, activo FROM nivel WHERE activo=1 AND tipo_uuid='${tipo}'`;

    const connection = await connectionToDb();
    const data = await queryToDb(connection, query);
    connection.release();
    return data;
  } catch (err) {
    console.log("Hubo un error en la consulta", err.message);
    return res.status(404).send("Hubo un error en la consulta" + err.message);
  }
}

async function getModalidad(req, res) {
  let nivel = req.params.nivel;
  let data = await buscarEnDbModalidad(nivel);
  res.send(JSON.stringify(data));
}

async function buscarEnDbModalidad(tipo) {
  try {
    const query = `SELECT uuid, nombre, orden, precio, activo, mostrar_cliente, examen_RW, examen_LS FROM modalidad WHERE activo=1 AND nivel_uuid='${tipo}'`;

    const connection = await connectionToDb();
    const data = await queryToDb(connection, query);
    connection.release();
    return data;
  } catch (err) {
    console.log("Hubo un error en la consulta", err.message);
    return res.status(404).send("Hubo un error en la consulta" + err.message);
  }
}

// async function examenesCambios(req, res) {
//   let cambios = req.body;
//   await updateEnDbExamenesCambios(cambios);
//   res.send(JSON.stringify(data));
// }

// async function updateEnDbExamenesCambios(cambios) {
//   let sql = "";
//   let values = [];

//   //  Cambia el valor de activo a los elementos. Se hace un borrado lógico. Un valor 1= se muestra en la web del cliente. Un valor 0= no se muestra en la web del cliente.
//   if (cambios.remover.length) {
//     cambios.remover.forEach(uuidToRemove => {
//       sql += `UPDATE ${cambios.tabla} SET activo=0 WHERE uuid = '${uuidToRemove}';`;
//       //sql += `UPDATE materia SET activo=0 WHERE BIN_TO_UUID(materia.uuid)='${uuidToRemove}';`
//     });
//   }

//   //  Cambia el valor mostrar cliente. Chequea si hay Ids para cambiar su visibilidad, los busca en el listado de los elementos y cambia el estado a los necesarios.
//   if (cambios.visibilidad_cambiar.length) {
//     cambios.visibilidad_cambiar.forEach(uuidToChange => {
//       cambios.listaEstado.map(element => {
//         if (element.uuid === uuidToChange) {
//           sql += `UPDATE ${cambios.tabla} SET mostrar_cliente=${element.mostrar_cliente} WHERE uuid = '${element.uuid}';`;
//         }
//       });
//     });
//   }

//   //  Cambia el orden de los elementos de la tabla
//   if (cambios.cambioOrden) {
//     cambios.listaEstado.map(element => {
//       sql += `UPDATE ${cambios.tabla} SET orden=${element.orden} WHERE uuid = '${element.uuid}';`;
//     });
//   }

//   //  Cambia el texto del input value
//   if (cambios.inputValue_cambiar.length) {
//     cambios.inputValue_cambiar.forEach(uuidToChange => {
//       cambios.listaEstado.map(element => {
//         if (element.uuid === uuidToChange) {
//           sql += `UPDATE ${cambios.tabla} SET nombre='${element.nombre}' WHERE uuid = '${element.uuid}';`;
//         }
//       });
//     });
//   }

//   //  Agrega un elemento nuevo a la tabla
//   if (cambios.agregar.length) {
//     if (cambios.tabla === "materia") {
//       sql += `INSERT INTO ${cambios.tabla} (uuid, orden, nombre, activo, mostrar_cliente, edita_user_secundario) VALUES ? ; `;
//     } else if (cambios.tabla === "tipo") {
//       sql += `INSERT INTO ${cambios.tabla} (uuid, orden, nombre, activo, mostrar_cliente, edita_user_secundario, materia_uuid) VALUES ? `;
//     }

//     cambios.agregar.forEach(uuidToAdd => {
//       cambios.listaEstado.map(element => {
//         if (element.uuid === uuidToAdd) {
//           values.push(
//             !cambios.materia
//               ? [
//                   element.uuid,
//                   element.orden,
//                   element.nombre,
//                   element.activo,
//                   element.mostrar_cliente,
//                   element.edita_user_secundario
//                 ]
//               : [
//                   element.uuid,
//                   element.orden,
//                   element.nombre,
//                   element.activo,
//                   element.mostrar_cliente,
//                   element.edita_user_secundario,
//                   cambios.materia
//                 ]
//           );
//         }
//       });
//     });
//   }

//   try {
//     const connection = await connectionToDb();
//     const data = await queryToDbValues(connection, sql, values);
//     connection.release();
//     //return res.status(200).send("Los cambios se han realizado con éxito");
//   } catch (err) {
//     console.log("Hubo un error en la consulta", err.message);
//     return res.status(404).send("Hubo un error en la consulta" + err.message);
//   }
// }

async function examenesCambios(req, res) {
  let cambios = req.body;
  let data = await updateEnDbExamenesCambios(cambios);
  res.send(JSON.stringify(data));
}

async function updateEnDbExamenesCambios(cambios) {
  let sql = "";
  let values = [];

  try {
    const connection = await connectionToDb();

    //  Agrega un elemento nuevo a la tabla
    if (cambios.agregar.length) {
      sql += "INSERT INTO materia (uuid, orden, nombre, activo, mostrar_cliente, edita_user_secundario) VALUES ?; ";
      //sql +=       "INSERT INTO materia (uuid, orden, nombre, activo, mostrar_cliente, edita_user_secundario) VALUES( UUID_TO_BIN(?), ?); ";

      cambios.agregar.forEach(uuidToAdd => {
        cambios.listaEstado.map(element => {
          if (element.uuid === uuidToAdd) {
            const uuidToBin = mysql.raw(
              `UUID_TO_BIN(${connection.escape(element.uuid)})`
            );
            values.push(
              !cambios.materia
                ? [
                    uuidToBin,
                    element.orden,
                    element.nombre,
                    element.activo,
                    element.mostrar_cliente,
                    element.edita_user_secundario
                  ]
                : [
                    uuidToBin,
                    element.orden,
                    element.nombre,
                    element.activo,
                    element.mostrar_cliente,
                    element.edita_user_secundario,
                    cambios.materia
                  ]
            );
          }
        });
      });
    }
    values = [values];
    console.log(mysql.format(sql, values));
    // console.log(
    //   "AGREGAMOS: ",
    //   cambios.agregar,
    //   "SQL STRING :",
    //   sql,
    //   "ARRAY VALUES: ",
    //   values
    // );

    const data = await queryToDbValues(connection, sql, values);
    connection.release();
    //return res.status(200).send("Los cambios se han realizado con éxito");
  } catch (err) {
    console.log("Hubo un error en la consulta", err.message);
    return res.status(404).send("Hubo un error en la consulta" + err.message);
  }
}

async function examenesUpdateNivelModalidad(req, res) {
  let cambios = req.body;
  await updateEnDbExamenesCambiosNivelModalidad(cambios);
}

async function updateEnDbExamenesCambiosNivelModalidad(cambios) {
  let sql = "";
  let values = [];

  if (cambios.removeNivel) {
    sql += `UPDATE nivel SET activo=0 WHERE uuid = '${cambios.removeNivel}';`;
  }

  if (cambios.addNivel) {
    sql += `INSERT INTO nivel (uuid, orden, tipo_uuid, nombre, descripcion, activo, mostrar_cliente, pdf, imagen, edita_user_secundario) VALUES 
    ('${cambios.uuid}', '0',  '${cambios.tipo_uuid}', '${cambios.nombre}', '${cambios.descripcion}', '1', '${cambios.mostrar_cliente}', '${cambios.pdf}', '${cambios.imagen}', '0' ) ; `;
  }

  if (cambios.cambioDataNivel) {
    sql += `UPDATE nivel SET nombre='${cambios.nombre}', descripcion='${cambios.descripcion}', mostrar_cliente='${cambios.mostrar_cliente}', pdf='${cambios.pdf}' , imagen='${cambios.imagen}' WHERE uuid = '${cambios.uuid}';`;
  }

  if (cambios.cambioOrdenChipNiveles) {
    cambios.niveles.forEach(element => {
      sql += `UPDATE nivel SET orden=${element.orden} WHERE uuid = '${element.uuid}';`;
    });
  }

  if (cambios.removeModalidades) {
    cambios.removeModalidades.forEach(element => {
      sql += `UPDATE modalidad SET activo=0 WHERE uuid='${element}';`;
    });
  }

  if (cambios.addModalidades) {
    cambios.addModalidades.forEach(element => {
      sql += `INSERT INTO modalidad (uuid, activo, orden, nivel_uuid, nombre, precio, mostrar_cliente, edita_user_secundario, examen_RW, examen_LS) 
      VALUES ('${element}', '1', '0', '${
        cambios.uuid
      }', '${""}', '${0}','${0}','${0}','${0}','${0}');`;
    });
  }

  if (cambios.cambioModalidades) {
    cambios.modalidades.forEach(element => {
      sql += `UPDATE modalidad SET orden='${element.orden}', nombre='${element.nombre}', precio='${element.precio}', mostrar_cliente='${element.mostrar_cliente}', examen_RW=${element.examen_RW}, examen_LS=${element.examen_LS} WHERE uuid='${element.uuid}';  `;
    });
  }

  try {
    const connection = await connectionToDb();
    const data = await queryToDbValues(connection, sql, values);
    connection.release();
    //return res.status(200).send("Los cambios se han realizado con éxito", data);
  } catch (err) {
    console.log("Hubo un error en la consulta", err.message);
    return res.status(404).send("Hubo un error en la consulta" + err.message);
  }
}

////////////////////////////////////////////////////////////////// SOLAPA FECHAS //////////////////////////////////////////////////////////////////

async function agregarFechaDia(req, res) {
  let cambios = req.body;
  let data = await agregarFechaEnDb(cambios);
  res.send(JSON.stringify(data));
}

async function agregarFechaEnDb(fechas) {
  let sql = "";
  let values = [];

  switch (fechas.tipo) {
    case "LS":
      sql += `INSERT INTO diaLS (uuid, fechaExamen, cupoMaximo, finalizaInscripcion, pausado, activo) VALUES
      ('${fechas.uuid}', '${fechas.dia} ${fechas.hora}', '${fechas.cupo}', '${fechas.finaliza}', '0', '1');`;
      break;

    case "RW":
      sql += `INSERT INTO diaRW (uuid, fechaExamen, cupoMaximo, finalizaInscripcion, pausado, activo) VALUES
        ('${fechas.uuid}', '${fechas.dia} ${fechas.hora}', '${fechas.cupo}', '${fechas.finaliza}', '0', '1');`;
      break;
  }

  try {
    const connection = await connectionToDb();
    const data = await queryToDbValues(connection, sql, values);
    connection.release();
    //return res.status(200).send("Los cambios se han realizado con éxito", data);
  } catch (err) {
    console.log("Hubo un error en la consulta", err.message);
    return res.status(404).send("Hubo un error en la consulta" + err.message);
  }
}

async function listarHorarios(req, res) {
  let data = await buscarEnDBListaHorarios();
  res.send(JSON.stringify(data));
}

async function buscarEnDBListaHorarios() {
  try {
    const query =
      "SELECT uuid, fechaExamen, cupoMaximo, finalizaInscripcion, pausado, activo FROM diaLS WHERE activo=1;";

    const connection = await connectionToDb();
    const data = await queryToDb(connection, query);
    connection.release();
    return data;
  } catch (err) {
    console.log("Hubo un error en la consulta", err.message);
    return res.status(404).send("Hubo un error en la consulta" + err.message);
  }
}

async function listarExamenes(req, res) {
  let data = await buscarEnDBListaExamenes();
  res.send(JSON.stringify(data));
}

async function buscarEnDBListaExamenes() {
  try {
    const query =
      "select m.nombre as materia, m.orden as orden_materia, t.nombre as tipo, t.orden as orden_tipo, n.nombre as nivel, n.orden as orden_nivel, mo.nombre as modalidad, mo.orden as orden_modalidad, mo.uuid as uuid from materia m left join tipo t on t.materia_uuid = m.uuid left join nivel n on t.uuid = n.tipo_uuid left join modalidad mo on n.uuid = mo.nivel_uuid where ((m.mostrar_cliente = 1 or m.mostrar_cliente is NULL) and (t.mostrar_cliente=1 or t.mostrar_cliente is NULL) and(n.mostrar_cliente=1 or n.mostrar_cliente is NULL) and (mo.mostrar_cliente=1 or mo.mostrar_cliente is NULL)) AND((m.activo is NULL or m.activo = 1) and(t.activo is NULL or t.activo = 1) and (n.activo is NULL or n.activo = 1) and (mo.activo is NULL or mo.activo = 1));";

    const connection = await connectionToDb();
    const data = await queryToDb(connection, query);
    connection.release();
    return data;
  } catch (err) {
    console.log("Hubo un error en la consulta", err.message);
    return res.status(404).send("Hubo un error en la consulta" + err.message);
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ESTO ES LO QUE NO FUNCIONA. COMO PONGO LA FUNCION UUID_TO_BIN EN UN ARRAY DE VALUES ??
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

// var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
// var sql = mysql.format('UPDATE posts SET modified = ? WHERE id = ?', [CURRENT_TIMESTAMP, 42]);
// console.log(sql); // UPDATE posts SET modified = CURRENT_TIMESTAMP() WHERE id = 42

// let BIN_TO_UUID(uuid) = { toSqlString: function(uuid) { return `BIN_TO_UUID(${uuid})`; } };
// let sql2 = mysql.format('UPDATE posts SET modified = ? WHERE id = ?', [BIN_TO_UUID, 42]);
//

// Este codigo te permite atajar un error no contemplado y evita que te tire el server abajo.
process.on("uncaughtException", function(err) {
  console.log(err);
});

module.exports = {
  getMateria: getMateria,
  getTipo: getTipo,
  getNivel: getNivel,
  getNivelChips: getNivelChips,
  getModalidad: getModalidad,
  examenesCambios: examenesCambios,
  examenesUpdateNivelModalidad: examenesUpdateNivelModalidad,

  agregarFechaDia: agregarFechaDia,
  listarHorarios: listarHorarios,
  listarExamenes: listarExamenes
};
