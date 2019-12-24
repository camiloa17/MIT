var excel = require("exceljs");
const controladorDashboard = require('../controladorDashboard')

async function excelTrinity(req, res) {
    let fecha = req.params.fecha;
    let tipo = req.params.tipo;
}

async function excelAsistencia(req, res, next) {
    let fecha = req.params.fecha;
    let tipo = req.params.tipo;
    let fechaString = req.params.fechaString;
    let fechaText = fechaString.substring(0, 16)

    if (tipo === "RW") {
        let fileName = `MIT_Asistencia_DiaEscrito_${fechaText}.xlsx`
        let datos = await controladorDashboard.buscarEnDbReservaDiaRw(fecha); 
        let workbook = await armarFile(datos, res, datos[0].dia_RW_fecha_examen, 'DIA ESCRITO');
        await sendWorkbook(workbook, res, fileName)

    } else if (tipo === "LS") {
        let fileName = `MIT_Asistencia_DiaOral_${fechaText}.xlsx`
        let datos = await controladorDashboard.buscarEnDbReservaDiaLs(fecha);
        let workbook = await armarFile(datos, res, datos[0].dia_LS_fecha_examen, 'DIA ORAL');
        await sendWorkbook(workbook, res, fileName)

    } else if (tipo.length === 6) {
        let fileName = `MIT_Asistencia_SemanaOral_${tipo}.xlsx`
        let datos = await controladorDashboard.buscarEnDbReservaEnSemanaLs(fecha);
        let workbook = await armarFile(datos, res, datos[0].semana_LS_fecha_examen, 'SEMANA ORAL');
        await sendWorkbook(workbook, res, fileName)
    }
}

async function sendWorkbook(workbook, response, fileName) {
    response.set({
        'Content-Disposition': `${fileName}`,
        'Content-Type': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    await workbook.xlsx.write(response);
    response.end();
}

async function armarFile(datos, res, diaExamen, tipoTexto) {
    var workbook1 = new excel.Workbook();

    workbook1.creator = 'Mit';
    workbook1.created = new Date();
    workbook1.modified = new Date();

    var sheet1 = workbook1.addWorksheet('Planilla Asistencia', {
        pageSetup: { paperSize: 9, orientation: 'portrait' }      // 9 es tamaño A4
    });

    sheet1.pageSetup.margins = {
        left: 0.25, right: 0.25,
        top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3
    };

    sheet1.addTable({
        name: 'Titulo',
        ref: 'A1',
        headerRow: true,

        columns: [
            { name: 'FECHA EXAMEN' },
            { name: 'TIPO EXAMEN' },
            { name: 'CUPO MAXIMO' },
            { name: 'VENTAS' },
            { name: 'CUPOS LIBRES' },
        ],
        rows: [
            [diaExamen, tipoTexto, datos[0].totales_cupo_maximo, datos[0].totales_ventas, datos[0].totales_cupo_maximo - datos[0].totales_ventas],
        ],
    });

    let rowss = [];

    datos.forEach(venta => {
        rowss.push(
            [venta.alumno_nombre,
            venta.alumno_apellido,
            venta.fecha_nac,
            venta.alumno_genero,
            venta.alumno_candidate_number,
            venta.alumno_documento_id,
            venta.alumno_movil,
            venta.alumno_telefono_fijo,
            venta.alumno_email,
            venta.alumno_domicilio,
            venta.alumno_provincia,
            venta.alumno_localidada,
            venta.alumno_observaciones,
            venta.discapacidad,
            venta.requiere_envio_domicilio_diploma,
            venta.direccion_envio_domicilio_diploma,
            venta.localidad_envio_domicilio_diploma,
            venta.provincia_envio_domicilio_diploma,
            venta.fecha_venta,
            venta.nro_ref_pago,
            venta.monto_abonado,
            venta.fecha_fuera_termino,
            venta.academia_amiga,
            venta.estado_examen,
            venta.reserva_observaciones,
            venta.materia_nombre,
            venta.tipo_nombre,
            venta.nivel_nombre,
            venta.modalidad_nombre,
            venta.dia_RW_fecha_examen ? venta.dia_RW_fecha_examen : '-',
            venta.examen_en_semana_LS_uuid ? venta.semana_LS_fecha_examen : '-',                  
            venta.dia_LS_fecha_examen ? venta.dia_LS_fecha_examen : '-'
            ]) 
    })

    sheet1.addTable({
        name: 'Datos',
        ref: 'A4',
        headerRow: true,

        columns: [
            { name: 'NOMBRE' },
            { name: 'APELLIDO' },
            { name: 'F. NAC' },
            { name: 'GENERO' },
            { name: 'CANDIDATE NUMBER' },
            { name: 'DNI o PASAPORTE' },
            { name: 'TELEFONO MOVIL' },
            { name: 'TELEFONO FIJO' },
            { name: 'EMAIL' },
            { name: 'DOMICILIO' },
            { name: 'PROVINCIA' },
            { name: 'LOCALIDAD' },
            { name: 'ALUMNO OBS' },
            { name: 'DISCAPACIDAD' },
            { name: 'REQ ENVIO DOMICILIO' },
            { name: 'DIRECCION ENV DOM' },
            { name: 'LOCALIDAD ENV DOM' },
            { name: 'PROVINCIA ENV DOM' },
            { name: 'FECHA VENTA' },
            { name: 'NRO REF PAGO' },
            { name: 'MONTO ABONADO' },
            { name: 'FECHA FUERA DE TERMINO' },
            { name: 'ACADEMIA AMIGA' },
            { name: 'ESTADO EXAMEN' },
            { name: 'OBS RESERVA' },
            { name: 'MATERIA' },
            { name: 'TIPO' },
            { name: 'NIVEL' },
            { name: 'MODALIDAD' },
            { name: 'DIA ESCRITO' },
            { name: 'SEMANA ORAL' },
            { name: 'DIA ORAL ASIGNADO' },

        ],
        rows: rowss,

    });
    
    // Se pone BOLD a la primer fila
    sheet1.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    // ESTO ES SI QUIERO GUARDAR EL EXCEL EN UNA CARPETA DEL SERVER
    // workbook1.xlsx.writeFile(`./exceljs/downloads/MIT_asistencia.xlsx`).then(function () {
    //     console.log("xlsx file is written.");
    // });

    return workbook1
}


module.exports = {
    excelAsistencia: excelAsistencia,
    excelTrinity: excelTrinity,
}

