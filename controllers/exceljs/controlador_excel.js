var excel = require("exceljs");
const controladorDashboard = require('../controladorDashboard')

async function excelTrinity(req, res) {
    let fecha = req.params.fecha;
    let tipo = req.params.tipo;
    let fechaString = req.params.fechaString;
    let fechaText = fechaString.substring(0, 16);

    if (tipo === "RW") {
        let fileName = `Trinity_DiaEscrito_${fechaText}.xlsx`
        let datos = await controladorDashboard.buscarEnDbReservaDiaRw(fecha);

        datos.sort(function (objA, objB) {
            // ordeno por apellido
            let ordenApellidoA = objA.alumno_apellido;
            let ordenApellidoB = objB.alumno_apellido;

            if (ordenApellidoA > ordenApellidoB) {
                return 1;
            } else if (ordenApellidoA < ordenApellidoB) {
                return -1;
            }
        })


        let workbook = await armarFileTrinity(datos, res);
        await sendWorkbook(workbook, res, fileName)

    } else if (tipo === "LS") {
        let fileName = `Trinity_DiaOral_${fechaText}.xlsx`
        let datos = await controladorDashboard.buscarEnDbReservaDiaLs(fecha);

        datos.sort(function (objA, objB) {
            // ordeno por apellido
            let ordenApellidoA = objA.alumno_apellido;
            let ordenApellidoB = objB.alumno_apellido;

            if (ordenApellidoA > ordenApellidoB) {
                return 1;
            } else if (ordenApellidoA < ordenApellidoB) {
                return -1;
            }
        })

        let workbook = await armarFileTrinity(datos, res);
        await sendWorkbook(workbook, res, fileName)

    } else if (tipo.length === 6) {
        let fileName = `Trinity_SemanaOral_${tipo}.xlsx`
        let datos = await controladorDashboard.buscarEnDbReservaEnSemanaLs(fecha);

        datos.sort(function (objA, objB) {
            // ordeno por apellido
            let ordenApellidoA = objA.alumno_apellido;
            let ordenApellidoB = objB.alumno_apellido;

            if (ordenApellidoA > ordenApellidoB) {
                return 1;
            } else if (ordenApellidoA < ordenApellidoB) {
                return -1;
            }
        })

        let workbook = await armarFileTrinity(datos, res);
        await sendWorkbook(workbook, res, fileName)
    }
}

async function armarFileTrinity(datos, res) {
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

    sheet1.columns = [
        { header: '#', width: 3, horizontal: 'center' },
        { header: 'First Name', width: 25, height: 60 },
        { header: '#', width: 3 },
        { header: 'Last Name', width: 25 },
        { header: 'Date of Birth', width: 14, style: { numFmt: 'dd/mm/yyyy', horizontal: 'center' } },
        { header: '#', width: 3 },
        { header: 'Candidate Number', width: 20 },
        { header: '#', width: 3 },
        { header: 'Gender', width: 8 },
        { header: '#', width: 3 },
        { header: '#', width: 3 },
        { header: 'External ID', width: 14 },
        { header: 'Examen Suite', width: 20 },
        { header: 'Examination / Product Name', width: 27 },
    ]

    let rosa = ['B1', 'D1', 'E1', 'I1', 'L1', 'M1', 'N1'];
    rosa.map(key => {
        sheet1.getCell(key).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF99CC' }
        };
    });

    let blue = ['G1']
    blue.map(key => {
        sheet1.getCell(key).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0070C0' }
        };
    });


    let col5 = sheet1.getColumn(5);
    col5.alignment = { horizontal: 'left' }

    let row1 = sheet1.getRow(1);
    row1.height = 42.5;
    row1.alignment = { vertical: 'middle', horizontal: 'center' };


    datos.forEach(venta => {
        sheet1.addRow(
            ['',
                venta.alumno_nombre,
                '',
                venta.alumno_apellido,
                venta.fecha_nac,
                '',
                venta.alumno_candidate_number,
                '',
                venta.alumno_genero,
                '',
                '',
                venta.alumno_documento_id,
                venta.tipo_nombre,
                `${venta.nivel_nombre} ${venta.modalidad_nombre}`,
            ])
    })


    // Se pone BOLD a la primer fila
    sheet1.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    return workbook1
}

async function excelAsistencia(req, res, next) {
    let fecha = req.params.fecha;
    let tipo = req.params.tipo;
    let fechaString = req.params.fechaString;
    let fechaText = fechaString.substring(0, 16);

    if (tipo === "RW") {
        let fileName = `MIT_Asistencia_DiaEscrito_${fechaText}.xlsx`
        let datos = await controladorDashboard.buscarEnDbReservaDiaRw(fecha);
        let workbook = await armarFileAsistencia(datos, res, datos[0].dia_RW_fecha_examen, 'DIA ESCRITO');
        await sendWorkbook(workbook, res, fileName)

    } else if (tipo === "LS") {
        let fileName = `MIT_Asistencia_DiaOral_${fechaText}.xlsx`
        let datos = await controladorDashboard.buscarEnDbReservaDiaLs(fecha);
        let workbook = await armarFileAsistencia(datos, res, datos[0].dia_LS_fecha_examen, 'DIA ORAL');
        await sendWorkbook(workbook, res, fileName)

    } else if (tipo.length === 6) {
        let fileName = `MIT_Asistencia_SemanaOral_${tipo}.xlsx`
        let datos = await controladorDashboard.buscarEnDbReservaEnSemanaLs(fecha);
        let workbook = await armarFileAsistencia(datos, res, datos[0].semana_LS_fecha_examen, 'SEMANA ORAL');
        await sendWorkbook(workbook, res, fileName)
    }
}

async function armarFileAsistencia(datos, res, diaExamen, tipoTexto) {
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

async function sendWorkbook(workbook, response, fileName) {
    response.set({
        'Content-Disposition': `${fileName}`,
        'Content-Type': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    await workbook.xlsx.write(response);
    response.end();
}

module.exports = {
    excelAsistencia: excelAsistencia,
    excelTrinity: excelTrinity,
}

