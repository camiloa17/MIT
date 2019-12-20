const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');




router.get('/step_1/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    try {
        const stylesheet = '/css/Front/checkoutStyle_Step1.css';
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
        res.render('checkoutStep1', { stylesheet: stylesheet, nivel: datosExamenModalidad.nivel, modo: {texto:datosExamenModalidad.modalidad,exrw:datosExamenModalidad.exrw,exls:datosExamenModalidad.exls}, precio: datosExamenModalidad.precio, descripcion: datosExamenModalidad.descripcion, step: 'step_1', materia: datosExamenModalidad.materia, id: datosExamenModalidad.id, tipo: datosExamenModalidad.tipo });
    } catch (err) {
        console.error(err)
    }
});

router.get('/step_2/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    try {
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
        const informacionPagina = {
            stylesheet: '/css/Front/checkoutStyle_Step2.css',
            step: 'step_2',
            materia: datosExamenModalidad.materia,
            tipo: datosExamenModalidad.tipo,
            nivel: datosExamenModalidad.nivel,
            modo: datosExamenModalidad.modalidad,
            exrw: datosExamenModalidad.exrw,
            exls: datosExamenModalidad.exls,
            id: datosExamenModalidad.id
        }
        const horarios = await controller.consultaHorarios({ exrw: informacionPagina.exrw, exls: informacionPagina.exls }, informacionPagina.id);
        
        res.render('checkoutStep2', { stylesheet: informacionPagina.stylesheet, materia: informacionPagina.materia, tipo: informacionPagina.tipo, nivel: informacionPagina.nivel, modo: { texto:informacionPagina.modo , exrw: informacionPagina.exrw, exls: informacionPagina.exls }, step: informacionPagina.step, id: informacionPagina, horario: horarios });
    } catch (err) {
        console.error(err)
    }
});

router.get('/step_3/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    try {
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
        const informacionPagina = {
            stylesheet:"",
            step: 'step_3',
            materia: datosExamenModalidad.materia,
            tipo: datosExamenModalidad.tipo,
            nivel: datosExamenModalidad.nivel,
            modo: datosExamenModalidad.modalidad,
            exrw: datosExamenModalidad.exrw,
            exls: datosExamenModalidad.exls,
            id: datosExamenModalidad.id,
            horarioId: req.query.idhorario,
            horarioLs: req.query.idhorarioL,
            idReserva: req.query.idreserva,
            precio: datosExamenModalidad.precio
        }
        if (datosExamenModalidad.exrw === 1 && datosExamenModalidad.exls === 1) {
            informacionPagina.stylesheet = '/css/Front/checkoutStyle_Step2.css';
            res.render('checkoutStep3Co', { stylesheet: informacionPagina.stylesheet, step: informacionPagina.step, materia: informacionPagina.materia, tipo: informacionPagina.tipo, nivel: informacionPagina.nivel, modo: { texto: informacionPagina.modo, exrw: informacionPagina.exrw, exls: informacionPagina.exls }, id: informacionPagina.id, horarioId: informacionPagina.horarioId, horarioLs: informacionPagina.horarioLs, idreserva: informacionPagina.idReserva });
        } else {
           informacionPagina.stylesheet = '/css/Front/checkoutStyle_info.css';
            res.render('checkoutInformation', { stylesheet: informacionPagina.stylesheet, step: informacionPagina.step, materia: informacionPagina.materia, tipo: informacionPagina.tipo, nivel: informacionPagina.nivel, modo: { texto: informacionPagina.modo, exrw: informacionPagina.exrw, exls: informacionPagina.exls }, id: informacionPagina.id, horarioId: informacionPagina.horarioId, idreserva: informacionPagina.idReserva, precio: informacionPagina.precio });
        }

    } catch (err) {
        console.error(err);
    }
});

router.get('/step_4/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    try {
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
        if (datosExamenModalidad.exrw===1 && datosExamenModalidad.exls===1) {
            
            const informacionPagina = {
                stylesheet: "",
                step: 'step_4',
                materia: datosExamenModalidad.materia,
                tipo: datosExamenModalidad.tipo,
                nivel: datosExamenModalidad.nivel,
                modo: datosExamenModalidad.modalidad,
                exrw: datosExamenModalidad.exrw,
                exls: datosExamenModalidad.exls,
                id: datosExamenModalidad.id,
                horarioId: req.query.idhorario,
                horarioLs: req.query.idhorarioL,
                idReserva: req.query.idreserva,
                precio: datosExamenModalidad.precio
            }
            if(informacionPagina.exrw===1 && informacionPagina.exls===1){
                informacionPagina.stylesheet ='/css/Front/checkoutStyle_info.css'
                res.render('checkoutInformation', { stylesheet: informacionPagina.stylesheet, step: informacionPagina.step, materia: informacionPagina.materia, tipo: informacionPagina.tipo, nivel: informacionPagina.nivel, modo: { texto: informacionPagina.modo, exrw: informacionPagina.exrw, exls: informacionPagina.exls }, id: informacionPagina.id, horarioId: informacionPagina.horarioId, horarioLs: informacionPagina.horarioLs, idreserva: informacionPagina.idReserva, precio: informacionPagina.precio });
            }
            
            
        }

    } catch (err) {
        console.error(err)
    }
})




router.post('/horario-selected/:materia/:tipo/:nivel/:modalidad', async (req, res, next) => {
    try {
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
        const examen = {
            materia: datosExamenModalidad.materia,
            tipo: datosExamenModalidad.tipo,
            nivel: datosExamenModalidad.nivel,
            modalidad: datosExamenModalidad.modalidad,
            exrw:datosExamenModalidad.exrw,
            exls:datosExamenModalidad.exls
        }
        if (examen.exrw === 1 && examen.exls===1) {
            const crearReservaTemporalCompleto = await controller.crearReservaEnProceso({exrw:examen.exrw,exls:examen.exls}, req.query.idhorario, req.query.idhorarioL);
            if (!crearReservaTemporalCompleto) {
                res.sendStatus(404);
            } else {
                res.redirect(`/checkout/step_3/${req.params.materia}/${req.params.tipo}/${req.params.nivel}/${req.params.modalidad}?id=${req.query.id}&idhorario=${req.query.idhorario}&idhorarioL=${req.query.idhorarioL}&idreserva=${crearReservaTemporalCompleto.uuid}`)
            }

        } else {
            const crearReservaTemporalRwLs = await controller.crearReservaEnProceso({ exrw: examen.exrw, exls: examen.exls }, req.query.idhorario);
            
            if (!crearReservaTemporalRwLs) {
                res.sendStatus(404)
            } else {
                res.redirect(`/checkout/step_3/${req.params.materia}/${req.params.tipo}/${req.params.nivel}/${req.params.modalidad}?id=${req.query.id}&idhorario=${req.query.idhorario}&idreserva=${crearReservaTemporalRwLs.uuid}`)
            }

        }
    } catch (err) {
        console.log('error')

    }

});


router.get('/ver-fecha-fuera-de-termino/:modalidad',async(req,res)=>{
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.params.modalidad);
        if(datosExamenModalidad.exrw===1 && datosExamenModalidad.exls===1){
            const verFueraTerminoCo = await controller.verFechaFueraDeTermino({exrw:datosExamenModalidad.exrw,exls:datosExamenModalidad.exls}, req.query.horario, req.query.idhorarioL);
            res.json({modalidad:{exrw:datosExamenModalidad.exrw,exls:datosExamenModalidad.exls},rw:verFueraTerminoCo.fecha_RW,ls:verFueraTerminoCo.fecha_ls});
        }else{
            const verFueraTermino = await controller.verFechaFueraDeTermino({ exrw: datosExamenModalidad.exrw, exls: datosExamenModalidad.exls }, req.query.horario);
            res.json({ modalidad: { exrw: datosExamenModalidad.exrw, exls: datosExamenModalidad.exls }, rw:verFueraTermino.fecha})
        }
     
})

//Consultar Con Juani si se hace esto
/*

router.get('/ver-horario/:idreserva', async (req, res) => {
    try {
        const consultarReserva = await controller.verReservarPaso3(req.params.idreserva);
        res.json(consultarReserva[0])
    } catch (err) {
        console.log(err)
    }
});



router.post('/horario-updated/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    try {
        
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
        const examen = {
            materia: datosExamenModalidad.materia,
            tipo: datosExamenModalidad.tipo,
            nivel: datosExamenModalidad.nivel,
            modalidad: datosExamenModalidad.modalidad
        }
        //Parte Compelto
        if (examen.modalidad === 'Completo') {
            //Corroboramos si existio un cambio de horario y si esta en los 10 minutos, si es asi se actualiza la reserva y se hace la redirección con
            const corroborarCambioDeHorarioCompleto = await controller.corroborarCambioDeHorario(examen.modalidad, req.query.idreserva, req.query.idhorario, req.query.idhorarioL);
            if(corroborarCambioDeHorarioCompleto){
            const cambioReservaTemporalCompleto = await controller.actualizarReservaEnProceso(examen.modalidad, req.query.idhorario, req.query.idreserva,actualizarReservaEnProceso);
            if (!cambioReservaTemporalCompleto) {
                res.sendStatus(404);
            } else {
                res.redirect(`/checkout/step_3/${req.params.materia}/${req.params.tipo}/${req.params.nivel}/${req.params.modalidad}?id=${req.query.id}&idhorario=${req.query.idhorario}&idhorarioL=${req.query.idhorarioL}&idreserva=${req.query.idreserva}`);
            }
        }else{
                res.redirect(`/checkout/step_3/${req.params.materia}/${req.params.tipo}/${req.params.nivel}/${req.params.modalidad}?id=${req.query.id}&idhorario=${req.query.idhorario}&idhorarioL=${req.query.idhorarioL}&idreserva=${req.query.idreserva}`);
        }

        // Parte RW
        } else {
            const corroborarCambioDeHorarioRwLs = await controller.corroborarCambioDeHorario(req.query.idreserva, req.query.idhorario);
            if (corroborarCambioDeHorarioRwLs) {
                const cambioReservaTemporalRwLs = await controller.actualizarReservaEnProceso(examen.modalidad, req.query.idhorario, req.query.idreserva);
                if (!cambioReservaTemporalRwLs) {
                    res.sendStatus(404);
                } else {
                    res.redirect(`/checkout/step_3/${req.params.materia}/${req.params.tipo}/${req.params.nivel}/${req.params.modalidad}?id=${req.query.id}&idhorario=${req.query.idhorario}&idreserva=${req.query.idreserva}`);
                }
            } else {
                res.redirect(`/checkout/step_3/${req.params.materia}/${req.params.tipo}/${req.params.nivel}/${req.params.modalidad}?id=${req.query.id}&idhorario=${req.query.idhorario}&idreserva=${req.query.idreserva}`);
            }
        }

    } catch (err) {
        console.error(err)
    }
})

*/


module.exports = router;
