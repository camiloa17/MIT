const utils = require('../utils');
const queries= require('../database/consultasSqlFront');

const conexion = require(`../database/conexionDB/conexionbd`);



exports.adquirirMenu = async () => {
    try {
        //const sql = "select m.nombre as materia,m.orden as orden_materia, t.nombre as tipo, t.orden as orden_tipo, n.nombre as nivel, n.orden as orden_nivel, mo.nombre as modalidad, mo.orden as orden_modalidad from materia m left join tipo t on t.materia_id = m.id left join nivel n on t.id = n.tipo_id left join modalidad mo on n.id = mo.nivel_id;"
        const sql = await queries.adquirirMenu();
        const respuesta = await utils.queryAsync(sql);
        const materias = [];
        const tipo = [];
        const nivel = [];
        const modo = [];

        respuesta.forEach(element => {
            if (!materias.find((objetoMateriaItem) => {
                return objetoMateriaItem.materias === element.materia
            })) {
                if (element.materia != null) {
                    materias.push({ materias: element.materia, orden: element.orden_materia });
                }
            }

            if (!tipo.find((objetoTipoItem) => {
                return objetoTipoItem.tipo === element.tipo;
            })) {
                if (element.tipo != null) {
                    tipo.push({ materia: element.materia, tipo: element.tipo, orden: element.orden_tipo, link: element.tipo.replace(/\s/g, "_") });
                }

            }
            if (!nivel.find((objetoNivelItem) => {
                return objetoNivelItem.nivel === element.nivel
            })) {
                if (element.nivel != null) {
                    nivel.push({ tipo: element.tipo, nivel: element.nivel, orden: element.orden_nivel, link: element.nivel.replace(/\s/g, "_") });
                }

            }
            if (element.modalidad != null) {
                modo.push({ nivel: element.nivel, modo: element.modalidad, orden: element.orden_modalidad, id: element.id_modalidad, link: element.modalidad.replace(/\s/g, "_") })
            }

        });

        function comparar(a, b) {
            return a.orden - b.orden
        }

        materias.sort(comparar);
        tipo.sort(comparar);
        nivel.sort(comparar);
        modo.sort(comparar);

        return {
            materias: materias,
            tipo: tipo,
            nivel: nivel,
            modo: modo
        };

    } catch (err) {
        console.error(err)
    }

}


exports.consultaExamenCheckout = async (uuid) => {
    try {
        //const sql = 'select n.descripcion as descripcion, mo.precio as precio from nivel as n join modalidad as mo on n.uuid=mo.nivel_uuid where n.nombre = ? and mo.nombre = ?;';
        const sql = await queries.consultaExamenPrecioDescripcion();
        const respuesta = await utils.queryAsync(sql, [uuid]);
        return {
            materia: respuesta[0].materia,
            tipo: respuesta[0].tipo,
            nivel: respuesta[0].nivel,
            modalidad: respuesta[0].modalidad,
            descripcion: respuesta[0].descripcion,
            precio: respuesta[0].precio,
            id: respuesta[0].id
        };
    } catch (err) {
        console.error(err)
    }

}


exports.consultaHorarios = async (modalidad, id) => {
    try {
        let horarios = {};
        let sql;
        let horarioFinal;

        switch (modalidad) {
            case "Completo":
                sql = await queries.consultaExamenCompletoCupos()

                const horariosCo = await utils.queryAsync(sql, [id,id]);
                horarios = {
                    horarios: horariosCo,
                }
                break

                break;
            case "Reading_&_Writing":
                sql = await queries.consultaExamenReadingAndWriting();
                const horariosRW = await utils.queryAsync(sql, [id]);
                
                 horarios = {
                    horarios: horariosRW,
                }
                break;

            case "Listening_&_Speaking":
                sql = await queries.consultaExamenListeningAndSpeaking();
                const horariosLS = await utils.queryAsync(sql, [id]);
                
                horarios = {
                    horarios: horariosLS,
                }
                
                break
        }

        return horarios;

    } catch (err) {
        return err
    }
}

async function diasATexto(horarios) {
    const textoHorarios = [];
    try {
        horarios.forEach(horario => {
            if (horario.fecha_Examen) {
                textoHorarios.push(horario.fecha_Examen.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', hour: 'numeric', minute: 'numeric' }));
            } else if (horario.semana_Examen) {
                textoHorarios.push(horario.semana_Examen.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }));
            }
        });
        return textoHorarios;

    } catch (err) {
        console.error(err)
    }

}

async function verDispnonibilidad(horarios, modalida) {
    try {
        const idsExamenEnDia = [];
        horarios.forEach(horario => {
            idsExamenEnDia.push(horario.id_2);
        });
        const disponible = await verVentasCupos(idsExamenEnDia, modalida);

        return disponible
    } catch (err) {
        console.error(err)
    }

}

async function verVentasCupos(id, modalidad) {
    try {
        if (id.length > 0) {
            let verVentas;
            if (modalidad == 'Reading_&_Writing' || modalidad == 'Completo') {
                verVentas = `select
  (drw.cupo_maximo - count(r.uuid)) as disponible,
  BIN_TO_UUID(drw.uuid) as dia_ID
from reserva r
join examen_en_dia_RW as erw on erw.uuid = r.examen_en_dia_RW_uuid
join dia_RW as drw on erw.dia_RW_uuid = drw.uuid
where
  drw.uuid = UUID_TO_BIN(?)`;
            } else if (modalidad == 'Listening_&_Speaking') {
                verVentas = ` select 
  BIN_TO_UUID(r.examen_en_semana_LS_uuid) as id,
  (semana.cupo_maximo-count(r.uuid)) as disponible,
  BIN_TO_UUID(semana.uuid) as dia_ID
  from reserva r
  join examen_en_semana_LS as semanaLS on semanaLS.uuid=r.examen_en_semana_LS_uuid
  join semana_LS as semana on semana.uuid=semanaLS.semana_LS_uuid
  where
  semana.uuid=UUID_TO_BIN(?)`
            }
            const sqlArray = [];
            for (let index = 0; index < id.length; index++) {
                sqlArray.push(verVentas)
            }
            verVentas = sqlArray.join(' union all ');

            const ventas = await utils.queryAsync(verVentas, id);
            return ventas;
        }

    } catch (err) {
        console.error(err)
    }

}

async function corroborarCupos(objetoHorario) {
    try {
        const horario = objetoHorario;
        const arrayHorarios = horario.horario;
        const cupos = horario.cupo;
        const arrayHorarioLs = horario.horariols;
        const cupoLS = horario.cupoLs

        arrayHorarios.forEach(horario => {
            cupos.forEach(cupo => {
                if (cupo.id != 'null') {
                    if (horario.id_2 == cupo.dia_ID)
                        horario.cupo_maximo = cupo.disponible;
                }
            })
        })

        return {
            horarios: horario.horario,
            text: horario.text
        }
    } catch (err) {
        console.error(err)
    }
}

exports.crearReservaEnProceso = async (idExamenEnDia, modalidad, idExamenEnSemana) => {
    
    switch (modalidad) {
        case "Completo":
            let corroborarExistenciaExamenCompleto = await corroborarHorario(modalidad,idExamenEnDia, idExamenEnSemana);
            break;
        case "Reading & Writing":
            let corroborarExistenciaExamenRW = await corroborarHorario(modalidad,idExamenEnDia, false);
            break;

        case "Listening & Speaking":
            let corroborarExistenciaExamenLS = await corroborarHorario(modalidad,false, idExamenEnDia);
            break;

    }

}

async function corroborarHorario(modalidad,idExamenEnDia, idExamenEnSemana) {
    const sqlRW = "select BIN_TO_UUID(UUID) as id from examen_en_dia_RW where uuid = UUID_TO_BIN(?);"
    const sqlLS = "select BIN_TO_UUID(uuid) as Id from examen_en_semana_LS where uuid = UUID_TO_BIN(?);"
    

    if (modalidad==="Completo") {
        let hoarioRwCo = await utils.queryAsync(sqlRW, idExamenEnDia);
        let horarioLsCo = await utils.queryAsync(sqlLS, idExamenEnSemana);
        console.log('Corroborar Completo', hoarioRwCo.length, horarioLsCo.length);
    } else if (modalidad==="Reading & Writing") {
        let horarioRw = await utils.queryAsync(sqlRW, idExamenEnDia);
        console.log('Corroborar dia', horarioRw.length);
    } else if (modalidad ==="Listening & Speaking") {
        let horarioLs = await utils.queryAsync(sqlLS, idExamenEnSemana);
        console.log('Corroborar semana', horarioLs.length);
    }
}



