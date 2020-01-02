const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const stripe = require('stripe')('sk_test_xc62rmtrPT5E8slPpF5UznB700b7VSJv8Z');




router.get('/step_1/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    try {
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
        const informacionPagina = {
            stylesheet: '/css/Front/checkoutStyle_Step1.css',
            step: 'step_1',
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
            precio: datosExamenModalidad.precio,
            descripcion: datosExamenModalidad.descripcion
        }

        res.render('checkoutStep1', { stylesheet: informacionPagina.stylesheet, materia: informacionPagina.materia, tipo: informacionPagina.tipo, nivel: informacionPagina.nivel, modo: { texto: informacionPagina.modo, exrw: informacionPagina.exrw, exls: informacionPagina.exls }, precio: informacionPagina.precio, descripcion: informacionPagina.descripcion, step: informacionPagina.step, id: informacionPagina.id });
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

        res.render('checkoutStep2', { stylesheet: informacionPagina.stylesheet, materia: informacionPagina.materia, tipo: informacionPagina.tipo, nivel: informacionPagina.nivel, modo: { texto: informacionPagina.modo, exrw: informacionPagina.exrw, exls: informacionPagina.exls }, step: informacionPagina.step, id: informacionPagina.id, horario: horarios });
    } catch (err) {
        console.error(err)
        res.sendStatus(500).json({ estado: "algo sucedio en el server" })
    }
});

router.get('/step_3/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    try {
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
        const informacionPagina = {
            stylesheet: "",
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
            informacionPagina.stylesheet = '/css/Front/checkoutStyle_Step3Co.css';
            res.render('checkoutStep3Co', { stylesheet: informacionPagina.stylesheet, step: informacionPagina.step, materia: informacionPagina.materia, tipo: informacionPagina.tipo, nivel: informacionPagina.nivel, modo: { texto: informacionPagina.modo, exrw: informacionPagina.exrw, exls: informacionPagina.exls }, id: informacionPagina.id, horarioId: informacionPagina.horarioId, horarioLs: informacionPagina.horarioLs, idreserva: informacionPagina.idReserva });
        } else {
            informacionPagina.stylesheet = '/css/Front/checkoutStyle_info.css';
            const fechaFinalizacion = await controller.consultarFecha(informacionPagina.idReserva);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: informacionPagina.precio * 100,
                currency: 'eur',
                description: `reserva ${informacionPagina.idReserva}`
            });
            res.render('checkoutInformation', { stylesheet: informacionPagina.stylesheet, step: informacionPagina.step, materia: informacionPagina.materia, tipo: informacionPagina.tipo, nivel: informacionPagina.nivel, modo: { texto: informacionPagina.modo, exrw: informacionPagina.exrw, exls: informacionPagina.exls }, id: informacionPagina.id, horarioId: informacionPagina.horarioId, idreserva: informacionPagina.idReserva, precio: informacionPagina.precio, fechaFinalizacion: fechaFinalizacion[0].fecha, idPayment: paymentIntent.client_secret });
        }

    } catch (err) {
        console.error(err);
    }
});

router.get('/step_4/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    try {
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
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
        if (informacionPagina.exrw === 1 && informacionPagina.exls === 1) {
            informacionPagina.stylesheet = '/css/Front/checkoutStyle_info.css'
            const fechaFinalizacion = await controller.consultarFecha(informacionPagina.idReserva);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: informacionPagina.precio * 100,
                currency: 'eur',
                description: `reserva ${informacionPagina.idReserva}`
            });

            res.render('checkoutInformation', { stylesheet: informacionPagina.stylesheet, step: informacionPagina.step, materia: informacionPagina.materia, tipo: informacionPagina.tipo, nivel: informacionPagina.nivel, modo: { texto: informacionPagina.modo, exrw: informacionPagina.exrw, exls: informacionPagina.exls }, id: informacionPagina.id, horarioId: informacionPagina.horarioId, horarioLs: informacionPagina.horarioLs, idreserva: informacionPagina.idReserva, precio: informacionPagina.precio, fechaFinalizacion: fechaFinalizacion[0].fecha, idPayment: paymentIntent.client_secret });
        } else {
            const pago = await controller.consultarSiPagoExitosamente(informacionPagina.idReserva);
            if(pago.transaccion_status==="succeeded"){
                informacionPagina.stylesheet = '/css/Front/checkoutConfirmation.css';
                res.render('checkoutConfirmation', { stylesheet: informacionPagina.stylesheet, step: informacionPagina.step, materia: informacionPagina.materia, tipo: informacionPagina.tipo, nivel: informacionPagina.nivel, modo: { texto: informacionPagina.modo, exrw: informacionPagina.exrw, exls: informacionPagina.exls }, id: informacionPagina.id, horarioId: informacionPagina.horarioId, horarioLs: informacionPagina.horarioLs, idreserva: informacionPagina.idReserva, precio: informacionPagina.precio });

            }else{
                res.status(404).send('No se encontro la pagina')
            }

        }

    } catch (err) {
        console.error(err)
        res.sendStatus(500).json({ estado: "algo sucedio en el server" })
    }
})


router.get('/step_5/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    try {
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
        const informacionPagina = {
            stylesheet: '/css/Front/checkoutConfirmation.css',
            step: 'step_5',
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
        const pago = await controller.consultarSiPagoExitosamente(informacionPagina.idReserva);
        if (pago.transaccion_status === "succeeded") {
        res.render('checkoutConfirmation', { stylesheet: informacionPagina.stylesheet, step: informacionPagina.step, materia: informacionPagina.materia, tipo: informacionPagina.tipo, nivel: informacionPagina.nivel, modo: { texto: informacionPagina.modo, exrw: informacionPagina.exrw, exls: informacionPagina.exls }, id: informacionPagina.id, horarioId: informacionPagina.horarioId, horarioLs: informacionPagina.horarioLs, idreserva: informacionPagina.idReserva, precio: informacionPagina.precio});
        }else{
            res.status(404).send('No se encontro la pagina')
        }
        
    } catch (error) {
        console.error(error)
    }
});



router.post('/horario-selected/:materia/:tipo/:nivel/:modalidad', async (req, res, next) => {
    try {
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
        const examen = {
            materia: datosExamenModalidad.materia,
            tipo: datosExamenModalidad.tipo,
            nivel: datosExamenModalidad.nivel,
            modalidad: datosExamenModalidad.modalidad,
            precio: datosExamenModalidad.precio,
            exrw: datosExamenModalidad.exrw,
            exls: datosExamenModalidad.exls
        }
        if (examen.exrw === 1 && examen.exls === 1) {
            const crearReservaTemporalCompleto = await controller.crearReservaEnProcesoCompleto({ exrw: examen.exrw, exls: examen.exls }, req.query.idhorario, req.query.idhorarioL, examen.precio);
            if (!crearReservaTemporalCompleto) {
                res.sendStatus(404);
            } else {
                res.redirect(`/checkout/step_3/${req.params.materia}/${req.params.tipo}/${req.params.nivel}/${req.params.modalidad}?id=${req.query.id}&idhorario=${req.query.idhorario}&idhorarioL=${req.query.idhorarioL}&idreserva=${crearReservaTemporalCompleto.uuid}`)
            }

        } else {
            const crearReservaTemporalRwLs = await controller.crearReservaEnProcesoRwLs({ exrw: examen.exrw, exls: examen.exls }, req.query.idhorario, examen.precio);
            if (!crearReservaTemporalRwLs) {
                res.sendStatus(404)
            } else {
                res.redirect(`/checkout/step_3/${req.params.materia}/${req.params.tipo}/${req.params.nivel}/${req.params.modalidad}?id=${req.query.id}&idhorario=${req.query.idhorario}&idreserva=${crearReservaTemporalRwLs.uuid}`)
            }

        }
    } catch (err) {
        console.log(err)

    }

});


router.get('/ver-fecha-fuera-de-termino/:modalidad', async (req, res) => {
    try {
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.params.modalidad);
        if (datosExamenModalidad.exrw === 1 && datosExamenModalidad.exls === 1) {
            const verFueraTerminoCo = await controller.verFechaFueraDeTermino({ exrw: datosExamenModalidad.exrw, exls: datosExamenModalidad.exls }, req.query.horario, req.query.idhorarioL);
            res.json({ modalidad: { exrw: datosExamenModalidad.exrw, exls: datosExamenModalidad.exls }, rw: verFueraTerminoCo.fecha_RW, ls: verFueraTerminoCo.fecha_ls });
        } else {
            const verFueraTermino = await controller.verFechaFueraDeTermino({ exrw: datosExamenModalidad.exrw, exls: datosExamenModalidad.exls }, req.query.horario);
            res.json({ modalidad: { exrw: datosExamenModalidad.exrw, exls: datosExamenModalidad.exls }, rw: verFueraTermino.fecha })
        }

    } catch (err) {
        console.error(err)
    }
})

router.post('/adicionar-envio/:idSecret/:idReserva', async (req, res) => {
    try {
        const idSecret = req.params.idSecret;
        const idReserva = req.params.idReserva;
        const precioReserva = await controller.consultaPrecio(idReserva);
        stripe.paymentIntents.update(idSecret, {
            amount: await precioReserva.precio * 100 + 1000
        }, function (err, paymentIntentUpdated) {
            if (err) {
                console.error(err)
            } else {
                res.json({ precio: paymentIntentUpdated.amount });
            }
        })
    } catch (error) {
        console.error(error)
    }
});



router.post('/reserva/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    try {
        const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
        const infoFormulario =req.body;
        const informacionPagina = {
            stylesheet: "",
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
        const crearReserva= await controller.crearReservaYAlumno(infoFormulario,informacionPagina);

        if(!crearReserva){
            res.sendStatus('500')
        }else{
            res.json(`/checkout/step_5/${informacionPagina.materia}/${informacionPagina.tipo}/${informacionPagina.nivel}/${informacionPagina.modo}?id=${informacionPagina.id}&idhorario=${informacionPagina.horarioId}&idhorarioL=${informacionPagina.horarioLs}&idreserva=${informacionPagina.idReserva}`);
        }

    } catch (error) {
        	console.log(error);
    }


});




module.exports = router;
