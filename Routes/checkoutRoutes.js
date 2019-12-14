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
    
    const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
    
    if(req.params.modalidad==='Completo'){
        const stylesheet = '/css/Front/checkoutStyle_Step2.css';
        
        res.render('checkoutStep3Co', { stylesheet: stylesheet, nivel: datosExamenModalidad.nivel, modo: datosExamenModalidad.modalidad, precio: datosExamenModalidad.precio, step: 'step_3', materia: datosExamenModalidad.materia, id: datosExamenModalidad.id, tipo: datosExamenModalidad.tipo, horarioId: req.query.idhorario});
    }else {
        const stylesheetInfo = '/css/Front/checkoutStyle_info.css';
        
        res.render('checkoutInformation', { stylesheet: stylesheetInfo, step: 'step_3', materia: datosExamenModalidad.materia, tipo: datosExamenModalidad.tipo, nivel: datosExamenModalidad.nivel, modo: datosExamenModalidad.modalidad, id: datosExamenModalidad.id, horarioId: req.query.idhorario });
    }
});

router.get('/step_4/:materia/:tipo/:nivel/:modalidad', async (req,res)=>{
    const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
    if(req.params.modalidad==='Completo'){
        const stylesheetInfo = '/css/Front/checkoutStyle_info.css';
        
        res.render('checkoutInformation', { stylesheet: stylesheetInfo, step: 'step_4',materia:datosExamenModalidad.materia,tipo:datosExamenModalidad.tipo,nivel:datosExamenModalidad.nivel,modo: datosExamenModalidad.modalidad, id: datosExamenModalidad.id, horarioId:req.query.idhorario});
    }
})


router.post('/horario-selected/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
    const examen={
        materia:datosExamenModalidad.materia,
        tipo: datosExamenModalidad.tipo,
        nivel:datosExamenModalidad.nivel,
        modalidad:datosExamenModalidad.modalidad
    }
    const corroborarHorario = await controller.crearReservaEnProceso(req.query.idhorario,examen.modalidad);
    res.redirect(`/checkout/step_3/${req.params.materia}/${req.params.tipo}/${req.params.nivel}/${req.params.modalidad}?id=${req.query.id}&idhorario=${req.query.idhorario}`)
});


module.exports = router;
