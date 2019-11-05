const con = require("../lib/conexiondb");
const model = require("../modelo/modeloDashboard");
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
    connection.query({ sql: query, timeout: 40000 }, function(
      error,
      data,
      fields
    ) {
      if (error) {
        reject(console.log("Hubo un error en la consulta " + error.message));
      } else {
        resolve(data);
      }
    });
  });
}

function queryToDbValues(connection, query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, [values], function(error, data, fields) {
      if (error) {
        reject(console.log("Hubo un error en la consulta " + error.message));
      } else {
        resolve(data);
      }
    });
  });
}

async function getMateria(req, res) {
  let data = await buscarEnDBMateria();
  res.send(JSON.stringify(data));
}

async function buscarEnDBMateria() {
  try {
    const query =
      "SELECT uuid, nombre, orden, activo, mostrar_cliente, edita_user_secundario FROM materia WHERE activo=1;";
    //const query = "SELECT BIN_TO_UUID(uuid) as uuid, nombre, activo,  mostrar_cliente, edita_user_secundario FROM materia WHERE activo=1;";
    const connection = await connectionToDb();
    const data = await queryToDb(connection, query);
    connection.release();
    return data;
  } catch (err) {
    console.log("Hubo un error en la consulta", err.message);
    return res.status(404).send("Hubo un error en la consulta" + err.message);
  }
}

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

async function getNivelChips(req, res) {
  let tipo = req.params.tipo;
  console.log("tipo", tipo);
  let data = await buscarEnDbNivel(tipo);
  console.log("niveles", data);
  res.send(JSON.stringify(data));
}

async function getNivel(req, res) {
  let nivel = req.params.nivel;
  console.log("nivel", nivel);
  let data = await buscarEnDbNivelCompleto(nivel);
  console.log("niveles", data);
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

async function examenesCambios(req, res) {
  let cambios = req.body;
  await updateEnDbExamenesCambios(cambios);
  //res.send(JSON.stringify(data));
}

async function updateEnDbExamenesCambios(cambios) {
  let sql = "";
  let values = [];

  //  Cambia el valor de activo a los elementos. Se hace un borrado lógico. Un valor 1= se muestra en la web del cliente. Un valor 0= no se muestra en la web del cliente.
  if (cambios.remover.length) {
    cambios.remover.forEach(uuidToRemove => {
      sql += `UPDATE ${cambios.tabla} SET activo=0 WHERE uuid = '${uuidToRemove}';`;
      //sql += `UPDATE materia SET activo=0 WHERE BIN_TO_UUID(materia.uuid)='${uuidToRemove}';`
    });
  }

  //  Cambia el valor mostrar cliente. Chequea si hay Ids para cambiar su visibilidad, los busca en el listado de los elementos y cambia el estado a los necesarios.
  if (cambios.visibilidad_cambiar.length) {
    cambios.visibilidad_cambiar.forEach(uuidToChange => {
      cambios.listaEstado.map(element => {
        if (element.uuid === uuidToChange) {
          sql += `UPDATE ${cambios.tabla} SET mostrar_cliente=${element.mostrar_cliente} WHERE uuid = '${element.uuid}';`;
        }
      });
    });
  }

  //  Cambia el orden de los elementos de la tabla
  if (cambios.cambioOrden) {
    cambios.listaEstado.map(element => {
      sql += `UPDATE ${cambios.tabla} SET orden=${element.orden} WHERE uuid = '${element.uuid}';`;
    });
  }

  //  Cambia el texto del input value
  if (cambios.inputValue_cambiar.length) {
    cambios.inputValue_cambiar.forEach(uuidToChange => {
      cambios.listaEstado.map(element => {
        if (element.uuid === uuidToChange) {
          sql += `UPDATE ${cambios.tabla} SET nombre='${element.nombre}' WHERE uuid = '${element.uuid}';`;
        }
      });
    });
  }

  //  Agrega un elemento nuevo a la tabla
  if (cambios.agregar.length) {
    if (cambios.tabla === "materia") {
      sql += `INSERT INTO ${cambios.tabla} (uuid, orden, nombre, activo, mostrar_cliente, edita_user_secundario) VALUES ? `;
    } else if (cambios.tabla === "tipo") {
      sql += `INSERT INTO ${cambios.tabla} (uuid, orden, nombre, activo, mostrar_cliente, edita_user_secundario, materia_uuid) VALUES ? `;
    }

    cambios.agregar.forEach(uuidToAdd => {
      cambios.listaEstado.map(element => {
        if (element.uuid === uuidToAdd) {
          values.push(
            !cambios.materia
              ? [
                  element.uuid,
                  element.orden,
                  element.nombre,
                  element.activo,
                  element.mostrar_cliente,
                  element.edita_user_secundario
                ]
              : [
                  element.uuid,
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

  console.log(sql, values);

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
  getNivelChips: getNivelChips,
  getNivel: getNivel,
  getModalidad: getModalidad,
  examenesCambios: examenesCambios,
};
