const utils = require('../utils');
const queries = require('../database/consultasSqlFront');

const uuidv4 = require('uuid/v4');



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

        switch (modalidad) {
            case "Completo":
                sql = await queries.consultaExamenCompletoCupos()
                const horariosCo = await utils.queryAsync(sql, [id, id]);

                horarios = {
                    horarios: horariosCo,
                }
                break

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
        console.error(err)
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

exports.crearReservaEnProceso = async (modalidad, idExamenEnDia, idExamenEnSemana) => {
    try {

        switch (modalidad) {
            case "Completo":
                const reservaTemporalCompleto = await crearReservaTemporalCompleto(idExamenEnDia, idExamenEnSemana);
                if (reservaTemporalCompleto) {
                    return { reserva: reservaTemporalCompleto.reserva, uuid: reservaTemporalCompleto.uuid }
                }else if(!reservaTemporalCompleto){
                    return false
                }
                break;
            case "Reading & Writing":
                const reservaTemporalRW = await crearReservaTemporalRW(idExamenEnDia);
                if(reservaTemporalRW){
                    return {reserva:reservaTemporalRW.reserva, uuid:reservaTemporalRW.uuid}
                }else if(!reservaTemporalRW){
                    return false
                }

                break;

            case "Listening & Speaking":
                const reservaTemporalLs =await crearReservaTemporalLs(idExamenEnDia);
                if(reservaTemporalLs){
                    console.log(reservaTemporalLs);
                    return { reserva: reservaTemporalLs.reserva, uuid: reservaTemporalLs.uuid }
                }else if(!reservaTemporalLs){
                    console.log(reservaTemporalLs)
                    return false
                }
                break;

        }
    } catch (err) {
        console.error(err);
        return false;

    }
}

async function crearReservaTemporalCompleto(idExamenEnDia, idExamenEnSemana) {
    try {
        //Se corrobora que exista los examenes en esos horarios
        const consultaCompleto = await queries.consultaExistenciaDeExamenEnHorario('Completo');
        const corroborarExistenciaExamenCompleto = await utils.queryAsync(consultaCompleto, [idExamenEnDia, idExamenEnSemana]);
        
        if (corroborarExistenciaExamenCompleto[0].id_semana === 1 && corroborarExistenciaExamenCompleto[0].id_dia === 1) {
            //Se crea una fecha un UUID y se inserta la reserva con la informacion minima.
            const fechaReserva = new Date(Date.now()).toISOString();
            const uuid = uuidv4();
            const sqlInsertarCompleto = await queries.ingresarReservaEnProcesoExamenCompleto();
            const insertarReservaCompleto = await utils.queryAsync(sqlInsertarCompleto, [idExamenEnDia, idExamenEnSemana, fechaReserva, 1, 0, uuid]);
            return { reserva: insertarReservaCompleto, uuid: uuid }
        }

    } catch (err) {
        console.error(err)
        return false
    }
}



async function crearReservaTemporalRW(idExamenEnDia){
    try{
    const consultaRw = await queries.consultaExistenciaDeExamenEnHorario('Reading & Writing');
    const corroborarExistenciaExamenRW = await utils.queryAsync(consultaRw, [idExamenEnDia]);
    if (corroborarExistenciaExamenRW[0].id===1){
        const fechaReserva = new Date(Date.now()).toISOString();
        const uuid = uuidv4();
        const sqlInsertarRW= await queries.ingresarReservaEnProcesoExamenRW();
        const insertarReservaRW= await utils.queryAsync(sqlInsertarRW,[idExamenEnDia,fechaReserva,1,0,uuid]);
        
        return {reserva:insertarReservaRW,uuid:uuid}
    }
    }catch(err){
        console.log(err);
        return false
    }

}


async function crearReservaTemporalLs(idExamenEnSemana){
    try {
        const consultaLs = await queries.consultaExistenciaDeExamenEnHorario('Listening & Speaking');
        const corroborarExistenciaExamenLs = await utils.queryAsync(consultaLs, [idExamenEnSemana]);
        if (corroborarExistenciaExamenLs[0].id===1){
            const fechaReserva = new Date(Date.now()).toISOString();
            const uuid = uuidv4();
            const sqlInsertarRW = await queries.ingresarReservaEnProcesoExamenLS();
            const insertarReservaLs = await utils.queryAsync(sqlInsertarRW, [idExamenEnSemana, fechaReserva, 1, 0, uuid]);
            return { reserva: insertarReservaLs, uuid: uuid }
        }
        
    } catch (err) {
        console.log(err)
        return false
    }
}

exports.verReservarPaso3 = async (id) => {
    const consultaReserva = await queries.consultaReservaPaso3();
    const verDB = await utils.queryAsync(consultaReserva, id)
    return verDB
}






