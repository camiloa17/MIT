const utils = require('../utils');
const queries = require('../database/consultasSqlFront');
const { DateTime } = require('luxon');

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
            id: respuesta[0].id,
            exrw: respuesta[0].exrw,
            exls: respuesta[0].exls
        };
    } catch (err) {
        console.error(err)
    }

}


exports.consultaHorarios = async (modalidad, id) => {
    try {
        let horarios = {};
        let sql;
        if (modalidad.exrw === 1 && modalidad.exls === 1) {
            sql = await queries.consultaExamenCompletoCupos()
            const horariosCo = await utils.queryAsync(sql, [id, id]);

            horarios = {
                horarios: horariosCo
            }
            const horarioTextCo = await diasATexto(horarios, 'dia');
            horarios = horarioTextCo;

        } else if (modalidad.exrw === 1 && modalidad.exls === 0) {
            sql = await queries.consultaExamenReadingAndWriting();
            const horariosRW = await utils.queryAsync(sql, [id]);

            horarios = {
                horarios: horariosRW,
            }
            const horarioTextRw = await diasATexto(horarios, 'dia');
            horarios = horarioTextRw;
        } else if (modalidad.exrw === 0 && modalidad.exls === 1) {
            sql = await queries.consultaExamenListeningAndSpeaking();
            const horariosLS = await utils.queryAsync(sql, [id]);
            horarios = {
                horarios: horariosLS,
            }
            const horarioTextLs = await diasATexto(horarios, 'semana');
            horarios = horarioTextLs;
        }

        return horarios;

    } catch (err) {
        console.error(err)
    }
}

async function diasATexto(horarios, tipo) {
    const horariosConTexto = horarios;
    try {
        if (tipo === "dia") {
            horariosConTexto.horarios.forEach(horario => {
                let dia = `${DateTime.fromISO(new Date(horario.fecha_Examen).toISOString()).setZone('UTC').toLocaleString({ day: 'numeric' })}`;
                let mes = `${DateTime.fromISO(new Date(horario.fecha_Examen).toISOString()).setZone('UTC').toLocaleString({ month: 'numeric' })}`;
                let año = `${DateTime.fromISO(new Date(horario.fecha_Examen).toISOString()).setZone('UTC').toLocaleString({ year: 'numeric' })}`;;
                let hora = `${DateTime.fromISO(new Date(horario.fecha_Examen).toISOString()).setZone('UTC').toLocaleString({ hour: 'numeric', minute: '2-digit' })}`;
                horario.fecha_Examen = `${dia}/${mes}/${año} ${hora} hora españa`;
            });
        } else if (tipo === 'semana') {
            horariosConTexto.horarios.forEach(horario => {
                let fecha = DateTime.fromISO(new Date(horario.fecha_Examen).toISOString()).setZone('UTC').weekNumber;
                let año = DateTime.fromISO(new Date(horario.fecha_Examen).toISOString()).setZone('UTC').weekYear;
                let mes = DateTime.fromISO(new Date(horario.fecha_Examen).toISOString()).setZone('UTC').monthLong;
                horario.fecha_Examen = `Semana ${fecha} del año ${año} (${mes})`;
            });
        }

        return horariosConTexto;

    } catch (err) {
        console.error(err)
    }

}




exports.crearReservaEnProcesoRwLs = async (modalidad, idExamenEnDia, precio) => {
    try {
        if (modalidad.exrw === 1 && modalidad.exls === 0) {
            const reservaTemporalRW = await crearReservaTemporalRW(idExamenEnDia, precio);
            if (reservaTemporalRW) {
                return { reserva: reservaTemporalRW.reserva, uuid: reservaTemporalRW.uuid }
            } else if (!reservaTemporalRW) {
                return false
            }
        } else if (modalidad.exrw === 0 && modalidad.exls === 1) {
            const reservaTemporalLs = await crearReservaTemporalLs(idExamenEnDia, precio);
            if (reservaTemporalLs) {
                return { reserva: reservaTemporalLs.reserva, uuid: reservaTemporalLs.uuid }
            } else if (!reservaTemporalLs) {
                return false
            }
        }
    } catch (err) {
        console.error(err);
        return false;

    }
}


exports.crearReservaEnProcesoCompleto = async (modalidad, idExamenEnDia, idExamenEnSemana, precio) => {
    try {
        if (modalidad.exrw === 1 && modalidad.exls === 1) {
            const reservaTemporalCompleto = await crearReservaTemporalCompletoBd(idExamenEnDia, idExamenEnSemana, precio);
            if (reservaTemporalCompleto) {
                return { reserva: reservaTemporalCompleto.reserva, uuid: reservaTemporalCompleto.uuid }
            } else if (!reservaTemporalCompleto) {
                return false
            }
        }
    } catch (error) {
        console.error(error)
    }
}

async function crearReservaTemporalCompletoBd(idExamenEnDia, idExamenEnSemana, precio) {
    try {
        //Se corrobora que exista los examenes en esos horarios
        const consultaCompleto = await queries.consultaExistenciaDeExamenEnHorario('Completo');
        const corroborarExistenciaExamenCompleto = await utils.queryAsync(consultaCompleto, [idExamenEnDia, idExamenEnSemana]);
        if (corroborarExistenciaExamenCompleto[0].id_semana === 1 && corroborarExistenciaExamenCompleto[0].id_dia === 1) {
            //Se crea una fecha un UUID y se inserta la reserva con la informacion minima.
            const fechaReserva = new Date(Date.now()).toISOString();
            const uuid = uuidv4();
            const sqlInsertarCompleto = await queries.ingresarReservaEnProcesoExamenCompleto();
            const insertarReservaCompleto = await utils.queryAsync(sqlInsertarCompleto, [idExamenEnDia, idExamenEnSemana, fechaReserva, 1, 0, precio, uuid]);
            return { reserva: insertarReservaCompleto, uuid: uuid }
        }

    } catch (err) {
        console.error(err)
        return false
    }
}



async function crearReservaTemporalRW(idExamenEnDia, precio) {

    try {
        const consultaRw = await queries.consultaExistenciaDeExamenEnHorario('Reading & Writing');
        const corroborarExistenciaExamenRW = await utils.queryAsync(consultaRw, [idExamenEnDia]);
        if (corroborarExistenciaExamenRW[0].id === 1) {
            const fechaReserva = new Date(Date.now()).toISOString();
            const uuid = uuidv4();
            const sqlInsertarRW = await queries.ingresarReservaEnProcesoExamenRW();
            const insertarReservaRW = await utils.queryAsync(sqlInsertarRW, [idExamenEnDia, fechaReserva, 1, 0, precio, uuid]);

            return { reserva: insertarReservaRW, uuid: uuid }
        }
    } catch (err) {
        console.error(err);
        return false
    }

}


async function crearReservaTemporalLs(idExamenEnSemana, precio) {
    try {
        const consultaLs = await queries.consultaExistenciaDeExamenEnHorario('Listening & Speaking');
        const corroborarExistenciaExamenLs = await utils.queryAsync(consultaLs, [idExamenEnSemana]);
        if (corroborarExistenciaExamenLs[0].id === 1) {
            const fechaReserva = new Date(Date.now()).toISOString();
            const uuid = uuidv4();
            const sqlInsertarRW = await queries.ingresarReservaEnProcesoExamenLS();
            const insertarReservaLs = await utils.queryAsync(sqlInsertarRW, [idExamenEnSemana, fechaReserva, 1, 0, precio, uuid]);
            return { reserva: insertarReservaLs, uuid: uuid }
        }

    } catch (err) {
        console.error(err)
        return false
    }
}

exports.crearReservaYAlumno = async (informacion, infoExamen) => {
    try {
        let uuidAlumno;
        const infoAlumnoExistente = await verSiExisteAlumno(informacion.doc);
        if(infoAlumnoExistente.length>0){
            uuidAlumno=infoAlumnoExistente[0].id;
            const actualizarAlumnos= await actualizarAlumno(informacion,uuidAlumno);
            const actualizarReservaAlumnoViejo = await crearReserva(informacion, infoExamen, uuidAlumno);
             return {alumno:actualizarAlumnos,reserva:actualizarReservaAlumnoViejo}
            
            
        }else{
             uuidAlumno = uuidv4();
             const crearAlumnos = await crearAlumno(informacion,uuidAlumno);
             const actualizarReservaAlumnoNuevo = await crearReserva(informacion, infoExamen, uuidAlumno);
             return{alumno:crearAlumnos,reserva:actualizarReservaAlumnoNuevo}
             
        }
        

    } catch (error) {
        console.error(error);
    }
}

async function crearAlumno(informacion,uuid) {
    try {
    /* activo,nombre,apellido,fecha_nac,fecha_inscripcion,document,genero,email,telefono_fijo,movil,provincia,localidad,direccion,zip,idtrinity,uuid*/
        const infoAlumno = [
            1,
            informacion.nombre,
            informacion.apellido,
            new Date(informacion.fnacimiento).toISOString(),
            new Date().toISOString(),
            informacion.doc,
            informacion.genero,
            informacion.email,
            informacion.tfijo,
            informacion.tmovil,
            informacion.prov,
            informacion.localidad,
            `${informacion.direccion}${(informacion.direccion2 ? informacion.direccion2 : "")}`,
            informacion.zip,
            `${(informacion.inputTrinity ? informacion.inputTrinity : "")}`,
            uuid
        ]
       
        const query = await queries.crearAlumno();
        const insertarAlumno = await utils.queryAsync(query, infoAlumno);
        return insertarAlumno;
    } catch (error) {
        console.error(error)
    }

}

async function verSiExisteAlumno(documento) {
    try {
        const query = await queries.verExistenciaAlumno();
        const verSiExiste = await utils.queryAsync(query, documento);
        
        return verSiExiste;
    } catch (error) {
        console.error(error)
    }
}

async function actualizarAlumno(informacion,uuidAlumno) {
    try {
        const infoAlumno = [
            informacion.nombre,
            informacion.apellido,
            informacion.doc,
            informacion.genero,
            informacion.email,
            informacion.tfijo,
            informacion.tmovil,
            informacion.prov,
            informacion.localidad,
            `${informacion.direccion}${(informacion.direccion2 ? informacion.direccion2 : "")}`,
            informacion.zip,
            `${(informacion.inputTrinity ? informacion.inputTrinity : "")}`,
            uuidAlumno
        ]
        const query = await queries.actualizarAlumno();
        const actualizar = await utils.queryAsync(query, infoAlumno);
        
        return actualizar;

    } catch (error) {
        console.error(error)
    }
}

async function crearReserva(informacion,infoExamen,uuidAlumno) {
    try {
        /*alumno_uuid,codigo_postal_envio_domicilio,direccion_envio_domicilio,discapacidad,en_proceso,envio_domicilio_diploma,fecha_venta,id_trinity,localidad_envio_domicilio,monto,pronvincia_envio_domicilio,rechazada,transaccion_id,transaccion_status, UUID*/
        const infoReserva = [
            uuidAlumno,
            `${(informacion.envioSi === true ? (informacion.adicionDom === true ? informacion.zipEnvioAd : informacion.zip) : "")}`,
            `${(informacion.envioSi === true ? (informacion.adicionDom === true ? informacion.direccionEnvioAd + " " + (informacion.direccion2EnvioAd ? informacion.direccion2EnvioAd : "") : informacion.direccion + " " + (informacion.direccion2 ? informacion.direccion2 : "")) : "")}`,
            `${informacion.discapacidad ? 1 : 0}`,
            0,
            `${informacion.envioSi ? 1 : 0}`,
            new Date().toISOString(),
            `${(informacion.inputTrinity ? informacion.inputTrinity : "")}`,
            `${(informacion.envioSi === true ? (informacion.adicionDom === true ? informacion.localidadEnvioAd : informacion.localidad) : "")}`,
            (informacion.resultado.paymentIntent.amount / 100),
            `${(informacion.envioSi === true ? (informacion.adicionDom === true ? informacion.provinciaEnvioAd : informacion.prov) : "")}`,
            `${(informacion.resultado.paymentIntent.status === "success" ? 1 : 0)}`,
            `${informacion.resultado.paymentIntent.id}`,
            `${informacion.resultado.paymentIntent.status}`,
            infoExamen.idReserva
        ]
        const query = await queries.actualizarReservaConfirmada();
        const actualizarReserva = await utils.queryAsync(query, infoReserva);
        
        return actualizarReserva;
    } catch (error) {
        console.error(error);
    }

}




/* Ver si la fecha esta fuera de termino*/
exports.verFechaFueraDeTermino = async (modalidad, idDia, idSemana) => {
    try {

        const fecha = DateTime.utc().toISODate();
        let sql;
        let consulta;
        if (modalidad.exrw === 1 && modalidad.exls === 1) {
            sql = await queries.consultaFueraDeTerminoCompleto();
            consulta = await utils.queryAsync(sql, [fecha, fecha, idSemana, idDia]);
        } else if (modalidad.exrw === 1 && modalidad.exls === 0) {
            sql = await queries.consultaFueraDeTerminoRW();
            consulta = await utils.queryAsync(sql, [fecha, idDia])
        } else if (modalidad.exrw === 0 && modalidad.exls === 1) {
            sql = await queries.consultaFueraDeTerminoLS();
            consulta = await utils.queryAsync(sql, [fecha, idDia])
        }


        return consulta[0];

    } catch (error) {
        console.error(error);
    }


}

/*Consulta la fecha tempral*/
exports.consultarFecha = async (id) => {
    try {
        const consultaSql = await queries.consultaFechaReservaTemporal();
        const fecha = await utils.queryAsync(consultaSql, id);
        return fecha;
    } catch (error) {
        console.error(error)
    }
}

exports.consultarFueraDeDiezMinutos = async (id) => {
    try {

    } catch (err) {

    }
}


exports.consultaPrecio = async (id) => {
    try {
        const consultSql = await queries.consultaPrecioReservaTemporal();
        const precio = await utils.queryAsync(consultSql, id);

        if (precio.length > 0) {

            return precio[0]
        }
    } catch (error) {
        console.log(error)
    }
}








