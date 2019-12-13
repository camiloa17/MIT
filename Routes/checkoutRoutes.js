const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');




router.get('/step_1/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    const stylesheet = '/css/Front/checkoutStyle_Step1.css';
    const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
    
    res.render('checkoutStep1', { stylesheet: stylesheet, nivel: datosExamenModalidad.nivel, modo: datosExamenModalidad.modalidad, precio: datosExamenModalidad.precio, descripcion: datosExamenModalidad.descripcion, step: 'step_1', materia: datosExamenModalidad.materia, id: datosExamenModalidad.id, tipo: datosExamenModalidad.tipo })
});

router.get('/step_2/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    const stylesheet = '/css/Front/checkoutStyle_Step2.css';
    const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
    const horarios = await controller.consultaHorarios(req.params.modalidad, req.query.id);

    res.render('checkoutStep2', { stylesheet: stylesheet, nivel: datosExamenModalidad.nivel, modo: datosExamenModalidad.modalidad, precio: datosExamenModalidad.precio, step: 'step_2', materia: datosExamenModalidad.materia, id: datosExamenModalidad.id, tipo: datosExamenModalidad.tipo, horario: horarios })
});

router.get('/step_3/:materia/:tipo/:nivel/:modalidad', async (req, res) => {

    if(req.params.modalidad==='Completo'){
        res.send('Completo');
    }else {
        res.send('Otro')
    }
});


router.post('/horario-selected/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    
    res.redirect(`/checkout/step_3/${req.params.materia}/${req.params.tipo}/${req.params.nivel}/${req.params.modalidad}?id=${req.query.id}&idhorario=${req.query.idhorario}`)
});


module.exports = router;
