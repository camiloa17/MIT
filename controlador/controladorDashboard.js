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

function queryToDb(connection, query, values) {
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
async function getMateria(req, res) {
  let data = await buscarEnDBMateria();
  res.send(JSON.stringify(data));
}

async function buscarEnDBMateria() {
  let connection;

  try {
    const query =
      "SELECT BIN_TO_UUID(uuid) as uuid, orden, nombre, activo, mostrar_cliente, edita_user_secundario FROM materia WHERE activo=1;";
    connection = await connectionToDb();
    const data = await queryToDb(connection, query);
    return data;
  } finally {
    if (connection) connection.release();
  }
}

async function getTipo(req, res) {
  let materia = req.params.materia;
  let data = await buscarEnDbTipo(materia);
  res.send(JSON.stringify(data));
}

async function buscarEnDbTipo(materia) {
  let connection;
  try {
    const query =
      "SELECT BIN_TO_UUID(uuid) AS uuid, orden, nombre, activo, mostrar_cliente, edita_user_secundario FROM tipo WHERE activo=1 AND BIN_TO_UUID(materia_uuid)= ? ";
    const values = [materia];
    connection = await connectionToDb();
    const data = await queryToDb(connection, query, values);
    return data;
  } finally {
    if (connection) connection.release();
  }
}

async function getNivel(req, res) {
  let nivel = req.params.nivel;
  let data = await buscarEnDbNivelCompleto(nivel);
  res.send(JSON.stringify(data));
}

async function buscarEnDbNivelCompleto(nivel) {
  let connection;
  try {
    const query =
      "SELECT BIN_TO_UUID(uuid) AS uuid, nombre, orden, activo, descripcion, mostrar_cliente, tipo_uuid, pdf, imagen FROM nivel WHERE activo=1 AND BIN_TO_UUID(uuid)= ?";
    const values = [nivel];
    connection = await connectionToDb();
    const data = await queryToDb(connection, query, values);
    return data;
  } finally {
    if (connection) connection.release();
  }
}

async function getNivelChips(req, res) {
  let tipo = req.params.tipo;
  let data = await buscarEnDbNivel(tipo);
  res.send(JSON.stringify(data));
}

async function buscarEnDbNivel(tipo) {
  let connection;
  try {
    const query =
      "SELECT BIN_TO_UUID(uuid) AS uuid, nombre, orden, activo FROM nivel WHERE activo=1 AND BIN_TO_UUID(tipo_uuid) = ?";
    let values = [tipo];
    connection = await connectionToDb();
    const data = await queryToDb(connection, query, values);
    return data;
  } finally {
    if (connection) connection.release();
  }
}

async function getModalidad(req, res) {
  let nivel = req.params.nivel;
  let data = await buscarEnDbModalidad(nivel);
  res.send(JSON.stringify(data));
}

async function buscarEnDbModalidad(nivel) {
  let connection;
  try {
    const query =
      "SELECT BIN_TO_UUID(uuid) AS uuid, nombre, orden, precio, activo, mostrar_cliente, examen_RW, examen_LS FROM modalidad WHERE activo=1 AND BIN_TO_UUID(nivel_uuid)= ?";
    let values = [nivel];
    connection = await connectionToDb();
    const data = await queryToDb(connection, query, values);
    return data;
  } finally {
    if (connection) connection.release();
  }
}

async function examenesCambios(req, res) {
  let cambios = req.body;
  let data = await updateEnDbExamenesCambios(cambios);
  res.send(JSON.stringify(data));
}

async function updateEnDbExamenesCambios(cambios) {
  let sql = "";
  let values = [];
  let connection;

  try {
    connection = await connectionToDb();

    //Cambia el valor de activo a los elementos. Se hace un borrado lógico. Un valor 1= se muestra en la web del cliente. Un valor 0= no se muestra en la web del cliente.
    if (cambios.remover.length) {
      cambios.remover.forEach(uuidToRemove => {
        sql += `UPDATE ${connection.escapeId(cambios.tabla)} SET activo=0 WHERE BIN_TO_UUID(uuid) = ${connection.escape(uuidToRemove)};`;
      });
    }

    //  Cambia el valor mostrar cliente. Chequea si hay Ids para cambiar su visibilidad, los busca en el listado de los elementos y cambia el estado a los necesarios.
    if (cambios.visibilidad_cambiar.length) {
      cambios.visibilidad_cambiar.forEach(uuidToChange => {
        cambios.listaEstado.map(element => {
          if (element.uuid === uuidToChange) {
            sql += `UPDATE ${connection.escapeId(
              cambios.tabla
            )} SET mostrar_cliente=${connection.escape(
              element.mostrar_cliente
            )} WHERE BIN_TO_UUID(uuid) = ${connection.escape(element.uuid)};`;
          }
        });
      });
    }

    //  Cambia el orden de los elementos de la tabla
    if (cambios.cambioOrden) {
      cambios.listaEstado.map(element => {
        sql += `UPDATE ${connection.escapeId(
          cambios.tabla
        )} SET orden=${connection.escape(
          element.orden
        )} WHERE BIN_TO_UUID(uuid) = ${connection.escape(element.uuid)};`;
      });
    }

    //  Cambia el texto del input value
    if (cambios.inputValue_cambiar.length) {
      cambios.inputValue_cambiar.forEach(uuidToChange => {
        cambios.listaEstado.map(element => {
          if (element.uuid === uuidToChange) {
            sql += `UPDATE ${connection.escapeId(
              cambios.tabla
            )} SET nombre=${connection.escape(
              element.nombre
            )} WHERE BIN_TO_UUID(uuid) = ${connection.escape(element.uuid)};`;
          }
        });
      });
    }

    //  Agrega un elemento nuevo a la tabla
    if (cambios.agregar.length) {
      if (cambios.tabla === "materia") {
        sql += `INSERT INTO ${connection.escapeId(
          cambios.tabla
        )} (uuid, orden, nombre, activo, mostrar_cliente, edita_user_secundario) VALUES ? ; `;
      } else if (cambios.tabla === "tipo") {
        sql += `INSERT INTO ${connection.escapeId(
          cambios.tabla
        )} (uuid, orden, nombre, activo, mostrar_cliente, edita_user_secundario, materia_uuid) VALUES ? ;`;
      }

      cambios.agregar.forEach(uuidToAdd => {
        cambios.listaEstado.map(element => {
          if (element.uuid === uuidToAdd) {
            const uuidToBin = mysql.raw(
              `UUID_TO_BIN(${connection.escape(element.uuid)})`
            );

            const cambiosMateria = mysql.raw(
              `UUID_TO_BIN(${connection.escape(cambios.materia)})`
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
                    cambiosMateria
                  ]
            );
          }
        });
      });
    }
    values = [values];

    const data = await queryToDb(connection, sql, values);
    return data;
  } finally {
    if (connection) connection.release();
  }
}

async function examenesUpdateNivelModalidad(req, res) {
  let cambios = req.body;
  let data = await updateEnDbExamenesCambiosNivelModalidad(cambios);
  res.send(JSON.stringify(data));
}

async function updateEnDbExamenesCambiosNivelModalidad(cambios) {
  let sql = "";
  let values = [];
  let connection;

  try {
    connection = await connectionToDb();

    console.log(cambios)

    if (cambios.removeNivel.length) {
      sql += `UPDATE nivel SET activo=0 WHERE BIN_TO_UUID(uuid) = ${connection.escape(cambios.removeNivel)};`;
    }

    if (cambios.addNivel) {
      sql += `INSERT INTO nivel (uuid, orden, tipo_uuid, nombre, descripcion, activo, mostrar_cliente, pdf, imagen, edita_user_secundario) VALUES 
    (UUID_TO_BIN(${connection.escape(
      cambios.uuid
    )}), '0',  UUID_TO_BIN(${connection.escape(
        cambios.tipo_uuid
      )}), ${connection.escape(cambios.nombre)}, ${connection.escape(
        cambios.descripcion
      )}, '1', ${connection.escape(
        cambios.mostrar_cliente
      )}, ${connection.escape(cambios.pdf)}, ${connection.escape(
        cambios.imagen
      )}, '0' ); `;
    }

    if (cambios.cambioDataNivel) {
      sql += `UPDATE nivel SET nombre=${connection.escape(cambios.nombre)}, descripcion=${connection.escape(cambios.descripcion)}, mostrar_cliente=${connection.escape(cambios.mostrar_cliente)}, pdf=${connection.escape(cambios.pdf)} , imagen=${connection.escape(cambios.imagen)} WHERE BIN_TO_UUID(uuid) = ${connection.escape(cambios.uuid)};`;
    }

    if (cambios.cambioOrdenChipNiveles) {
      cambios.niveles.forEach(element => {
        sql += `UPDATE nivel SET orden=${connection.escape(element.orden)} WHERE BIN_TO_UUID(uuid) = ${connection.escape(element.uuid)};`;
      });
    }

    if(cambios.cambioModalidades){
      if (cambios.removeModalidades.length) {
        cambios.removeModalidades.forEach(element => {
          sql += `UPDATE modalidad SET activo=0 WHERE BIN_TO_UUID(uuid)=${connection.escape(element)};`;
        });
      }

      if (cambios.addModalidades.length) {
        cambios.addModalidades.forEach(element => {
          sql += `INSERT INTO modalidad (uuid, activo, orden, nivel_uuid, nombre, precio, mostrar_cliente, edita_user_secundario, examen_RW, examen_LS) VALUES (UUID_TO_BIN(${connection.escape(element)}), '1', '0', UUID_TO_BIN(${connection.escape(cambios.uuid)}), ' ', 0, 0, 0, 0, 0);`; // Aqui solo se da de alta el elemento, se actualiza en el siguiente paso
        });
      }

      if (cambios.cambioModalidades) {
        cambios.modalidades.forEach(element => {
          sql += `UPDATE modalidad SET orden=${connection.escape(element.orden)}, nombre=${connection.escape(element.nombre)}, precio=${connection.escape(element.precio)}, mostrar_cliente=${connection.escape(element.mostrar_cliente)}, examen_RW=${connection.escape(element.examen_RW)}, examen_LS=${connection.escape(element.examen_LS)} WHERE BIN_TO_UUID(uuid)=${connection.escape(element.uuid)};`;      });
      }
    }

    const data = await queryToDb(connection, sql, values);
    return data;
  } finally {
    if (connection) connection.release();
  }
}

////////////////////////////////////////////////////////////////// SOLAPA FECHAS //////////////////////////////////////////////////////////////////



async function agregarExamenFechaDia(req, res) {
  let cambios = req.body;
  let data = await agregarExamenFechaDiaEnDb(cambios);
  res.send(JSON.stringify(data));
}

async function agregarExamenFechaDiaEnDb(cambios) {
  let sql = "";
  let values = [];
  let connection;

  console.log(cambios)
  
  try {
    connection = await connectionToDb();

    console.log(cambios.addExamenesFechaDia.length, cambios.addExamenesFechaDia)

    if(cambios.addExamenesFechaDia.length && cambios.tipoDeLista === "RW"){
      console.log("guardamos un RW")
      cambios.addExamenesFechaDia.forEach( (uuidExamen) => {
        console.log(uuidExamen)
        cambios.estadoListaExamenesDia.map(element => {
          if(element.examen === uuidExamen){
            sql += `INSERT INTO examen_en_dia_RW (uuid, dia_RW_uuid, modalidad_uuid, activo, pausado) VALUES ( UUID_TO_BIN(${connection.escape(element.uuid)}) ,  UUID_TO_BIN(${connection.escape(element.fecha)}), UUID_TO_BIN(${connection.escape(element.examen)}), 1 , ${connection.escape(element.pausado)});`;
          }
        });     
      });
    }

      if(cambios.addExamenesFechaDia.length && cambios.tipoDeLista.length === 6){
        console.log("guardamos una SEMANA")
        cambios.addExamenesFechaDia.forEach( (uuidExamen) => {
          console.log(uuidExamen)
          cambios.estadoListaExamenesDia.map(element => {
            if(element.examen === uuidExamen){
              sql += `INSERT INTO examen_en_semana_LS (uuid, semana_LS_uuid, modalidad_uuid, activo, pausado) VALUES ( UUID_TO_BIN(${connection.escape(element.uuid)}) ,  UUID_TO_BIN(${connection.escape(element.fecha)}), UUID_TO_BIN(${connection.escape(element.examen)}), 1 , ${connection.escape(element.pausado)});`;
            }
          });     
        });
      }
    
 

    const data = await queryToDb(connection, sql, values);
    return data;
  } finally {
    if (connection) connection.release();
  }
}

async function agregarFechaDia(req, res) {
  let cambios = req.body;
  let data = await agregarFechaDiaEnDb(cambios);
  res.send(JSON.stringify(data));
}

async function agregarFechaDiaEnDb(fechas) {
  let sql = "";
  let values = [];
  let connection;
  let fechaHora;
  
  console.log(fechas)

  try {
    connection = await connectionToDb();
    console.log(fechas.tipo)

    switch (fechas.tipo) {
      case "LS":
        //fechaHora = `${fechas.dia} ${fechas.hora}`;
        console.log("INGRESA FECHA ", fechas.fecha)
        sql += `INSERT INTO dia_LS (uuid, fecha_Examen, cupo_maximo, fecha_finalizacion, pausado, activo) VALUES ( UUID_TO_BIN(${connection.escape(fechas.uuid)}) , ${connection.escape(fechas.fecha)}, ${connection.escape(fechas.cupo)}, ${connection.escape(fechas.finaliza)}, '0', '1');`;
        break;

      case "RW":
        fechaHora = `${fechas.dia} ${fechas.hora}`;
        sql += `INSERT INTO dia_RW (uuid, fecha_Examen, cupo_maximo, fecha_finalizacion, pausado, activo) VALUES (UUID_TO_BIN(${connection.escape(fechas.uuid)}) , ${connection.escape(fechas.fecha)}, ${connection.escape(fechas.cupo)}, ${connection.escape(fechas.finaliza)}, '0', '1');`;        break;
    }

    const data = await queryToDb(connection, sql, values);
    return data;
  } finally {
    if (connection) connection.release();
  }
}

async function agregarFechaSemana(req, res) {
  let cambios = req.body;
  let data = await agregarFechaSemanaEnDb(cambios);
  res.send(JSON.stringify(data));
}

async function agregarFechaSemanaEnDb(fechas) {
  let sql = "";
  let values = [];
  let connection;

  try {
    connection = await connectionToDb();
 

    sql += `INSERT INTO semana_LS (uuid, semana_Examen, cupo_maximo, finaliza_inscripcion, pausado, activo) VALUES ( UUID_TO_BIN(${connection.escape(fechas.uuid)}) , ${connection.escape(fechas.semana)}, ${connection.escape(fechas.cupo)}, ${connection.escape(fechas.finaliza)}, '0', '1');`;
       

    const data = await queryToDb(connection, sql, values);
    return data;
  } finally {
    if (connection) connection.release();
  }
}



async function listarSemanas(req, res) {
  let data = await buscarEnDBListaSemanas();
  res.send(JSON.stringify(data));
}

async function buscarEnDBListaSemanas() {
  let connection;
  try {
    // YEARKEER(date, 3) segun ISO 8601 
    const query =
      "SELECT BIN_TO_UUID(uuid) as uuid, YEARWEEK(semana_Examen,3) AS yyyyss, cupo_maximo, finaliza_inscripcion, pausado, activo FROM semana_LS WHERE activo=1 ORDER BY semana_Examen;";
    connection = await connectionToDb();
  
    const data = await queryToDb(connection, query);
    return data;
  } finally {
    if (connection) connection.release();
  }
}



async function listarHorarios(req, res) {
  let data = await buscarEnDBListaHorarios();
  res.send(JSON.stringify(data));
}

async function buscarEnDBListaHorarios() {
  let connection;
  try {
    const query =
      "SELECT BIN_TO_UUID(uuid) as uuid, fecha_Examen, cupo_maximo, fecha_finalizacion, pausado, activo, 'LS' as source FROM dia_LS UNION SELECT BIN_TO_UUID(uuid) as uuid, fecha_Examen, cupo_maximo, fecha_finalizacion, pausado, activo, 'RW' as source FROM dia_RW WHERE activo=1 ORDER BY fecha_Examen;";
    connection = await connectionToDb();
  
    const data = await queryToDb(connection, query);
    return data;
  } finally {
    if (connection) connection.release();
  }
}



async function listarHorariosOrales(req, res) {
  let data = await buscarEnDBListaHorariosOrales();
  res.send(JSON.stringify(data));
}

async function buscarEnDBListaHorariosOrales() {
  let connection;
  try {
    const query =
      "SELECT BIN_TO_UUID(uuid) as uuid, fecha_Examen, cupo_maximo, fecha_finalizacion, pausado, activo, 'LS' as source FROM dia_LS WHERE activo=1 ;";
    connection = await connectionToDb();
  
    const data = await queryToDb(connection, query);
    return data;
  } finally {
    if (connection) connection.release();
  }
}

async function listarExamenes(req, res) {
  let data = await buscarEnDBListaExamenes();
  res.send(JSON.stringify(data));
}

async function buscarEnDBListaExamenes() {
  let connection;
  try {
    const query =
      "select m.nombre as materia, m.orden as orden_materia, t.nombre as tipo, t.orden as orden_tipo, n.nombre as nivel, n.orden as orden_nivel, mo.nombre as modalidad, mo.orden as orden_modalidad, mo.examen_rw as rw, mo.examen_ls as ls, BIN_TO_UUID(mo.uuid) as uuid from materia m left join tipo t on t.materia_uuid = m.uuid left join nivel n on t.uuid = n.tipo_uuid left join modalidad mo on n.uuid = mo.nivel_uuid where ((m.mostrar_cliente = 1 or m.mostrar_cliente is NULL) and (t.mostrar_cliente=1 or t.mostrar_cliente is NULL) and(n.mostrar_cliente=1 or n.mostrar_cliente is NULL) and (mo.mostrar_cliente=1 or mo.mostrar_cliente is NULL)) AND((m.activo is NULL or m.activo = 1) and(t.activo is NULL or t.activo = 1) and (n.activo is NULL or n.activo = 1) and (mo.activo is NULL or mo.activo = 1));";

    connection = await connectionToDb();
    const data = await queryToDb(connection, query);
    return data;
  } finally {
    if (connection) connection.release();
  }
}



async function getExamenesEnSemana(req, res) {
  let semana = req.params.semana;
  console.log(semana)
  let data = await buscarEnDbExamenesEnSemana(semana);
  res.send(JSON.stringify(data));
}

async function buscarEnDbExamenesEnSemana(semana_uuid) {
  let connection;
  try {
    connection = await connectionToDb();
    let query = `SELECT BIN_TO_UUID(uuid) AS uuid, BIN_TO_UUID(modalidad_uuid) AS modalidad_uuid, BIN_TO_UUID(semana_LS_uuid) as semana_uuid, pausado FROM examen_en_semana_LS WHERE activo=1 AND BIN_TO_UUID(semana_LS_uuid)= ${connection.escape(semana_uuid)} `; 

    console.log(query)
    
    const data = await queryToDb(connection, query);
    return data;
  } finally {
    if (connection) connection.release();
  }
}





async function getExamenesEnFecha(req, res) {
  let fecha = req.params.fecha;
  let tipo = req.params.tipo;
  let data = await buscarEnDbExamenesEnFecha(fecha, tipo);
  res.send(JSON.stringify(data));
}

async function buscarEnDbExamenesEnFecha(fecha, tipo) {
  let connection;
  try {
    connection = await connectionToDb();
    let query; 

    switch (tipo) {
      case "RW":
        query = `SELECT BIN_TO_UUID(uuid) AS uuid, BIN_TO_UUID(modalidad_uuid) AS modalidad_uuid, BIN_TO_UUID(dia_RW_uuid) as fecha_uuid, pausado FROM examen_en_dia_RW WHERE activo=1 AND BIN_TO_UUID(dia_RW_uuid)= ? `;
      break;
      case "LS":
        query = `SELECT BIN_TO_UUID(uuid) AS uuid, BIN_TO_UUID(modalidad_uuid) AS modalidad_uuid, BIN_TO_UUID(dia_LS_uuid) as fecha_uuid, pausado FROM examen_en_dia_LS WHERE activo=1 AND BIN_TO_UUID(dia_LS_uuid)= ? `;
      break;
    }
    const values = [fecha];
    
    const data = await queryToDb(connection, query, values);
    return data;
  } finally {
    if (connection) connection.release();
  }
}


async function listarReservaSemanasLs(req, res) {
  let semana = req.params.semana;
  let data = await buscarEnDbReservaEnSemanaLs(semana);
  res.send(JSON.stringify(data));
}

async function buscarEnDbReservaEnSemanaLs(semana) {
  let connection;
  try {
    connection = await connectionToDb();
   
    let query = `SELECT
    BIN_TO_UUID(r.uuid) as reserva_uuid,
    BIN_TO_UUID(r.alumno_uuid) as alumno_uuid,
    BIN_TO_UUID(r.examen_en_dia_RW_uuid) as examen_dia_RW_uuid,
    BIN_TO_UUID(r.dia_LS_uuid) as dia_LS_uuid,
    BIN_TO_UUID(r.examen_en_semana_LS_uuid) as examen_semana_LS_uuid,
    BIN_TO_UUID(examen_en_semana_LS.semana_LS_uuid) as uuid_semana_LS,
    dia_LS.fecha_Examen as dia_LS_fecha_examen,
    semana_LS.semana_examen as fecha_semana_examen,
    
    a.nombre as alumno_nombre,
    a.apellido as alumno_apellido,
    a.documento as alumno_documento_id,
    a.candidate_number as alumno_candidate_number,
    a.genero as alumno_genero,
    a.email as alumno_email
    
    from reserva r
    LEFT JOIN alumno a on r.alumno_uuid = a.uuid
    LEFT JOIN examen_en_semana_LS on BIN_TO_UUID(examen_en_semana_LS.uuid) =  BIN_TO_UUID(r.examen_en_semana_LS_uuid)
    LEFT JOIN semana_LS on BIN_TO_UUID(examen_en_semana_LS.semana_LS_uuid) = BIN_TO_UUID(semana_LS.uuid)
    LEFT JOIN dia_LS on BIN_TO_UUID(dia_LS.uuid) = BIN_TO_UUID(r.dia_LS_uuid)
    WHERE BIN_TO_UUID(semana_LS.uuid) = ${connection.escape(semana)};`;

    console.log("BUSCANDO RESERVAS")

    const data = await queryToDb(connection, query);
    return data;
  } finally {
    if (connection) connection.release();
  }
}

async function listarReservaDiaRw(req, res) {
  let fecha = req.params.fecha;
  let data = await buscarEnDbReservaDiaRw(fecha);
  res.send(JSON.stringify(data));
}

async function buscarEnDbReservaDiaRw(fecha) {
  let connection;
  try {
    connection = await connectionToDb();
   
    let query = `SELECT
    BIN_TO_UUID(r.uuid) as reserva_uuid,
    BIN_TO_UUID(r.alumno_uuid) as alumno_uuid,
    BIN_TO_UUID(r.examen_en_dia_RW_uuid) as examen_dia_RW_uuid,

    a.nombre as alumno_nombre,
    a.apellido as alumno_apellido,
    a.documento as alumno_documento_id,
    a.candidate_number as alumno_candidate_number,
    a.genero as alumno_genero,
    a.email as alumno_email
    
    from reserva r
    LEFT JOIN alumno a on r.alumno_uuid = a.uuid
    LEFT JOIN examen_en_semana_LS on BIN_TO_UUID(examen_en_semana_LS.uuid) =  BIN_TO_UUID(r.examen_en_semana_LS_uuid)
    LEFT JOIN semana_LS on BIN_TO_UUID(examen_en_semana_LS.semana_LS_uuid) = BIN_TO_UUID(semana_LS.uuid)
    LEFT JOIN dia_LS on BIN_TO_UUID(dia_LS.uuid) = BIN_TO_UUID(r.dia_LS_uuid)
    LEFT JOIN examen_en_dia_RW on BIN_TO_UUID(examen_en_dia_RW.uuid) = BIN_TO_UUID(r.examen_en_dia_RW_uuid)
    LEFT JOIN dia_RW on BIN_TO_UUID(dia_RW.uuid) = BIN_TO_UUID(examen_en_dia_RW.uuid)
    WHERE BIN_TO_UUID(examen_en_dia_RW.dia_RW_uuid) = ${connection.escape(fecha)};`;

    console.log("BUSCANDO RESERVAS DIA RW")

    const data = await queryToDb(connection, query);
    return data;
  } finally {
    if (connection) connection.release();
  }
}



async function asignarDiaASemanaExamenOral(req, res) {
  console.log("LLEGAMO")
  let cambios = req.body;
  console.log(cambios)
  let data = await asignarDiaASemanaExamenOralEnDB(cambios);
  res.send(JSON.stringify(data));
}

async function asignarDiaASemanaExamenOralEnDB(cambios) {
  let sql = "";
  let connection;

  try {
    connection = await connectionToDb();

    cambios.reservas.forEach( reserva => {

      sql += `UPDATE reserva SET dia_LS_uuid=UUID_TO_BIN(${connection.escape(cambios.fecha)}) WHERE BIN_TO_UUID(uuid)=${connection.escape(reserva)};`;
      console.log(sql)
    });
  
    const data = await queryToDb(connection, sql);
    return data;
  } finally {
    if (connection) connection.release();
  }
}




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
  listarHorariosOrales: listarHorariosOrales,
  listarExamenes: listarExamenes,
  getExamenesEnFecha: getExamenesEnFecha,
  agregarExamenFechaDia: agregarExamenFechaDia,
  agregarFechaSemana: agregarFechaSemana,
  listarSemanas: listarSemanas,
  getExamenesEnSemana: getExamenesEnSemana,
  listarReservaSemanasLs: listarReservaSemanasLs,
  listarReservaDiaRw: listarReservaDiaRw,

  asignarDiaASemanaExamenOral: asignarDiaASemanaExamenOral,
  
};
