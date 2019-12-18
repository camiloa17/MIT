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
    console.log(horarios);
    res.render('checkoutStep2', { stylesheet: stylesheet, nivel: datosExamenModalidad.nivel, modo: datosExamenModalidad.modalidad, precio: datosExamenModalidad.precio, step: 'step_2', materia: datosExamenModalidad.materia, id: datosExamenModalidad.id, tipo: datosExamenModalidad.tipo, horario: horarios })
});

router.get('/step_3/:materia/:tipo/:nivel/:modalidad', async (req, res) => {
    
    const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
    const existeReserva = await controller.verReservarPaso3(req.query.idreserva);
    if(req.params.modalidad==='Completo'){
        const stylesheet = '/css/Front/checkoutStyle_Step2.css';
        res.render('checkoutStep3Co', { stylesheet: stylesheet, nivel: datosExamenModalidad.nivel, modo: datosExamenModalidad.modalidad, precio: datosExamenModalidad.precio, step: 'step_3', materia: datosExamenModalidad.materia, id: datosExamenModalidad.id, tipo: datosExamenModalidad.tipo, horarioId: req.query.idhorario,horarioLs:req.query.idhorarioL,idreserva:req.query.idreserva});
    }else {
        const stylesheetInfo = '/css/Front/checkoutStyle_info.css';
        res.render('checkoutInformation', { stylesheet: stylesheetInfo, step: 'step_3', materia: datosExamenModalidad.materia, tipo: datosExamenModalidad.tipo, nivel: datosExamenModalidad.nivel, modo: datosExamenModalidad.modalidad, id: datosExamenModalidad.id, horarioId: req.query.idhorario, idreserva: req.query.idreserva});
    }
});

router.get('/step_4/:materia/:tipo/:nivel/:modalidad', async (req,res)=>{
    const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
    if(req.params.modalidad==='Completo'){
        const stylesheetInfo = '/css/Front/checkoutStyle_info.css';
        res.render('checkoutInformation', { stylesheet: stylesheetInfo, step: 'step_4', materia: datosExamenModalidad.materia, tipo: datosExamenModalidad.tipo, nivel: datosExamenModalidad.nivel, modo: datosExamenModalidad.modalidad, id: datosExamenModalidad.id, horarioId: req.query.idhorario, horarioLs: req.query.idhorarioL , idreserva: req.query.idreserva});
    }
})


router.get('/ver-horario/:idreserva', async (req,res)=>{
try {
    const consultarReserva = await controller.verReservarPaso3(req.params.idreserva);
    console.log(consultarReserva[0]);
    res.json(consultarReserva[0])
} catch (err) {
    console.log(err)
}
});



router.post('/horario-selected/:materia/:tipo/:nivel/:modalidad', async (req, res,next) => {
    try{
    const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
    const examen={
        materia:datosExamenModalidad.materia,
        tipo: datosExamenModalidad.tipo,
        nivel:datosExamenModalidad.nivel,
        modalidad:datosExamenModalidad.modalidad
    }
    if(examen.modalidad==='Completo'){
        const crearReservaTemporalCompleto = await controller.crearReservaEnProceso(examen.modalidad, req.query.idhorario,req.query.idhorarioL);
        if(!crearReservaTemporalCompleto){
            res.sendStatus(404);
        }else{
            res.redirect(`/checkout/step_3/${req.params.materia}/${req.params.tipo}/${req.params.nivel}/${req.params.modalidad}?id=${req.query.id}&idhorario=${req.query.idhorario}&idhorarioL=${req.query.idhorarioL}&idreserva=${crearReservaTemporalCompleto.uuid}`)
        }
        
    }else{
        const crearReservaTemporalRwLs = await controller.crearReservaEnProceso(examen.modalidad, req.query.idhorario);
        
        if(!crearReservaTemporalRwLs){
            res.sendStatus(404)
        }else{
            res.redirect(`/checkout/step_3/${req.params.materia}/${req.params.tipo}/${req.params.nivel}/${req.params.modalidad}?id=${req.query.id}&idhorario=${req.query.idhorario}&idreserva=${crearReservaTemporalRwLs.uuid}`)
        }
        
    }
}catch(err){
    console.log('error')
    next(err);

}
    
});


router.put('/horario-selected/:materia/:tipo/:nivel/:modalidad',async(req,res)=>{

})


module.exports = router;
