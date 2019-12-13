var excel = require("exceljs");
const controladorDashboard = require('../controlador/controladorDashboard')

async function excelTrinity(req, res) {
    let fecha = req.params.fecha;
    let tipo = req.params.tipo;
}

async function excelAsistencia(req, res, next) {
    let fecha = req.params.fecha;
    let tipo = req.params.tipo;
    let fechaString = req.params.fechaString;
    let fechaText= fechaString.substring(0,16)

    if (tipo === "RW") {
        let fileName= `MIT_Asistencia_DiaEscrito_${fechaText}.xlsx`
        let datos = await controladorDashboard.buscarEnDbReservaDiaRw(fecha);
        let workbook = await armarFile(datos, res);
        await sendWorkbook(workbook, res, fileName)

    } else if (tipo === "LS") {
        let fileName= `MIT_Asistencia_DiaOral_${fechaText}.xlsx`
        let datos = await controladorDashboard.buscarEnDbReservaDiaLs(fecha);
        let workbook = await armarFile(datos, res);
        await sendWorkbook(workbook, res, fileName)

    } else if (tipo.length === 6) {
        let fileName= `MIT_Asistencia_SemanaOral_${tipo}.xlsx`
        let datos = await controladorDashboard.buscarEnDbReservaEnSemanaLs(fecha);
        let workbook = await armarFile(datos, res);
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


async function armarFile(datos, res) {
    var workbook1 = new excel.Workbook();

    workbook1.creator = 'Mit';
    workbook1.created = new Date();
    workbook1.modified = new Date();

    var sheet1 = workbook1.addWorksheet('Planilla Asistencia', {
        pageSetup: { paperSize: 9, orientation: 'portrait' }
        // 9 es tamaño A4
    });

    sheet1.pageSetup.margins = {
        left: 0.25, right: 0.25,
        top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3
    };

    var reColumns = [
        { header: 'NOMBRE', key: 'nombre', width: 11 },
        { header: 'APELLIDO', key: 'apellido', width: 8.71 },
        { header: 'F. NAC', key: 'fnac', width: 7.71 },
        { header: 'GENERO', key: 'genero', width: 7.57 },
        { header: 'CANDIDATE NUMBER', key: 'cd', width: 12.86 },
        { header: 'DNI o PASAPORTE', key: 'dni', width: 16.14 },
        { header: 'MOVIL', key: 'movil', width: 11.71 },
        { header: 'EXAMEN', key: 'examen', width: 12.57 },
        { header: 'DISC', key: 'disc', width: 4.29 },
    ];

    sheet1.columns = reColumns;

    datos.forEach(venta => {
        sheet1.addRow({
            nombre: venta.alumno_nombre,
            apellido: venta.alumno_apellido,
            fnac: venta.nacimiento,
            genero: venta.alumno_genero,
            cd: venta.alumno_candidate_number,
            dni: venta.alumno_documento_id,
            movil: "completar movil",
            examen: "completar examen",
            disc: "completar",
        })
    })

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