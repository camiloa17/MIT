const utils = require('../utils');

const conexion = require(`../database/conexionDB/conexionbd`);



exports.adquirirMenu = async () => {
    try {
        //const sql = "select m.nombre as materia,m.orden as orden_materia, t.nombre as tipo, t.orden as orden_tipo, n.nombre as nivel, n.orden as orden_nivel, mo.nombre as modalidad, mo.orden as orden_modalidad from materia m left join tipo t on t.materia_id = m.id left join nivel n on t.id = n.tipo_id left join modalidad mo on n.id = mo.nivel_id;"
        const sql = "select m.nombre as materia, m.orden as orden_materia, t.nombre as tipo, t.orden as orden_tipo, n.nombre as nivel, n.orden as orden_nivel, mo.nombre as modalidad, mo.orden as orden_modalidad, BIN_TO_UUID(mo.uuid) as id_modalidad from materia m left join tipo t on t.materia_uuid = m.uuid left join nivel n on t.uuid = n.tipo_uuid left join modalidad mo on n.uuid = mo.nivel_uuid where ((m.mostrar_cliente = 1 or m.mostrar_cliente is NULL) and (t.mostrar_cliente=1 or t.mostrar_cliente is NULL) and(n.mostrar_cliente=1 or n.mostrar_cliente is NULL) and (mo.mostrar_cliente=1 or mo.mostrar_cliente is NULL)) AND((m.activo is NULL or m.activo = 1) and(t.activo is NULL or t.activo = 1) and (n.activo is NULL or n.activo = 1) and (mo.activo is NULL or mo.activo = 1));"
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

    } catch (error) {
        console.error(error)
    }

}


exports.consultaExamenCheckout = async (uuid) => {
    try {
        //const sql = 'select n.descripcion as descripcion, mo.precio as precio from nivel as n join modalidad as mo on n.uuid=mo.nivel_uuid where n.nombre = ? and mo.nombre = ?;';
        const sql = 'select m.nombre as materia, t.nombre as tipo,n.nombre as nivel, n.descripcion as descripcion,mo.nombre as modalidad, mo.precio as precio from materia as m join tipo as t on t.materia_uuid = m.uuid join  nivel as n on n.tipo_uuid = t.uuid join modalidad as mo on n.uuid = mo.nivel_uuid where mo.uuid = UUID_TO_BIN(?);'
        const respuesta = await utils.queryAsync(sql, [uuid]);
        return {
            materia: respuesta[0].materia,
            tipo: respuesta[0].tipo,
            nivel: respuesta[0].nivel,
            modalidad: respuesta[0].modalidad,
            descripcion: respuesta[0].descripcion,
            precio: respuesta[0].precio
        };
    } catch (error) {

    }

}

exports.consultaHorarios = async (modalidad, id) => {
    try {
        let horarios = {};
        let sql;
        let horarioFinal;

        switch (modalidad) {
            case "Completo":

                break;
            case "Reading_&_Writing":
                sql = "select dia.fecha_Examen, dia.fecha_finalizacion as fecha_cierre, dia.cupo_maximo, BIN_TO_UUID(dia.uuid) as id from examen_en_dia_RW as diarw join dia_RW as dia on diarw.dia_RW_uuid = dia.uuid where modalidad_uuid = UUID_TO_BIN(?) and dia.activo =1 and dia.pausado=0 and diarw.activo=1 and diarw.pausado=0;"
                const horariosRW = await utils.queryAsync(sql, [id]);
                const textoHorario = await diasATexto(horariosRW);
                const cupos = await armarArraydeIdsModalidades(horariosRW, modalidad);

                horarios = {
                    horario: horariosRW,
                    text: textoHorario,
                    cupo: cupos
                }
                horarioFinal = await corroborarCupos(horarios);
                horarios = horarioFinal;

                break;
            case "Listening_&_Speaking":
                sql = "select semana.semana_Examen, semana.finaliza_inscripcion as fecha_cierre, semana.cupo_maximo, BIN_TO_UUID(semana.uuid) as id from examen_en_semana_LS as semLS join semana_LS as semana on semLS.semana_LS_uuid = semana.uuid where modalidad_uuid = UUID_TO_BIN(?) and semana.activo = 1 and semana.pausado=0 and semLS.activo=1 and semLS.pausado=0;"
                const horariosLS = await utils.queryAsync(sql, [id]);
                const textoSemanas = await diasATexto(horariosLS);
                const cuposOrales = await armarArraydeIdsModalidades(horariosLS, modalidad)
                horarios = {
                    horario: horariosLS,
                    text: textoSemanas,
                    cupo: cuposOrales
                }
                horarioFinal = await corroborarCupos(horarios);
                horarios = horarioFinal;

                break
        }

        return horarios;

    } catch (error) {
        console.error(error)
    }
}

async function diasATexto(horarios) {
    const textoHorarios = [];
    try {
        horarios.forEach(horario => {
            if (horario.fecha_Examen) {
                textoHorarios.push(horario.fecha_Examen.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', hour: 'numeric', minute: 'numeric' }));
            } else if (horario.semana_Examen) {
                textoHorarios.push(horario.semana_Examen.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'long' }));
            }


        });
        return textoHorarios;

    } catch (error) {
        console.error(err)
    }

}

async function armarArraydeIdsModalidades(horarios, modalida) {
    try {
        const idsExamenEnDia = [];
        horarios.forEach(horario => {
            idsExamenEnDia.push(horario.id);
        });
        const disponible = await verVentasCupos(idsExamenEnDia, modalida);
        return disponible
    } catch (error) {
        console.error(err)
    }

}

async function verVentasCupos(id, modalidad) {
    try {
        if (id.length > 0) {
            let verVentas;
            if (modalidad == 'Reading_&_Writing') {
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

    } catch (error) {
        console.error(error)
    }

}

async function corroborarCupos(objetoHorario) {
    try {
        let horario = objetoHorario;
        let arrayHorarios = horario.horario;
        let cupos = horario.cupo;

        arrayHorarios.forEach(horario => {
            cupos.forEach(cupo => {
                if (cupo.id != 'null') {
                    if (horario.id == cupo.dia_ID)
                        horario.cupo_maximo = cupo.disponible;
                }
            })
        })
        return {
            horarios: horario.horario,
            text: horario.text
        }
    } catch (err) {
        console.log(err)
    }
}

async function corroborarFechas(objetoHorario) {
    let horario = objetoHorario;
    let arrayHorarios = horario.horario;
    arrayHorarios.forEach(horario=>{
        
    })

}

