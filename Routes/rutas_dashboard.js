const express = require('express');
const router = express.Router();
const controladorDashboard = require('../controllers/controladorDashboard')


//const mailSenderFile = require('./mailSender/mailSender')


function asyncErrorWrap(f) {
  return (req, res, next)=> { 
       return Promise.resolve(f(req,res)).catch(next);
  }
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
      return next(err);
  }
  res.status(500);
  console.log(err)
  res.send({ error: err.toString()});
}


router.get('/', function(req, res){
  res.render('dashboardIndex')
})

// SOLAPA EXAMENES
router.get('/materia', asyncErrorWrap(controladorDashboard.getMateria))

router.get('/tipo/:materia',  asyncErrorWrap(controladorDashboard.getTipo))

router.get('/nivelChip/:tipo',  asyncErrorWrap(controladorDashboard.getNivelChips))

router.get('/nivel/:nivel',  asyncErrorWrap(controladorDashboard.getNivel))

router.get('/modalidad/:nivel',  asyncErrorWrap(controladorDashboard.getModalidad))

router.post('/examenes/',  asyncErrorWrap(controladorDashboard.examenesCambios))

router.post('examenesUpdateNivelModalidad/',  asyncErrorWrap(controladorDashboard.examenesUpdateNivelModalidad))

// SOLAPA FECHAS
router.post('/agregarFechaDia/',  asyncErrorWrap(controladorDashboard.agregarFechaDia))

router.get('/listarHorarios/:fechasAntiguas',  asyncErrorWrap(controladorDashboard.listarHorarios))

router.get('/listarHorariosOrales/',  asyncErrorWrap(controladorDashboard.listarHorariosOrales))


router.post('/asignarDiaASemanaExamenOral/', asyncErrorWrap(controladorDashboard.asignarDiaASemanaExamenOral))


router.get('/listarExamenes/',  asyncErrorWrap(controladorDashboard.listarExamenes))

router.get('/listarExamenesEnFecha/:fecha&:tipo',  asyncErrorWrap(controladorDashboard.getExamenesEnFecha))

router.post('/updateExamenesEnFecha/',  asyncErrorWrap(controladorDashboard.updateExamenesEnFecha))

router.post('/agregarFechaSemana/',  asyncErrorWrap(controladorDashboard.agregarFechaSemana))

router.get('/listarSemanas/:fechasAntiguas', asyncErrorWrap(controladorDashboard.listarSemanas))

router.get('/listarExamenesEnSemana/:semana', asyncErrorWrap(controladorDashboard.getExamenesEnSemana))

router.get('/listarReservaSemanasLs/:semana', asyncErrorWrap(controladorDashboard.listarReservaSemanasLs))


router.get('/listarReservaDiaRw/:fecha', asyncErrorWrap(controladorDashboard.listarReservaDiaRw))

router.get('/listarReservaDiaLs/:fecha', asyncErrorWrap(controladorDashboard.listarReservaDiaLs))

router.post('/elminarFechaSemana/', asyncErrorWrap(controladorDashboard.elminarFechaSemana))
router.post('/elminarFechaDiaRw/', asyncErrorWrap(controladorDashboard.elminarFechaDiaRw))
router.post('/elminarFechaDiaLs/', asyncErrorWrap(controladorDashboard.elminarFechaDiaLs))


router.use(errorHandler);

module.exports = router;





