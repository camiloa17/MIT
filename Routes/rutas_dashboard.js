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


router.get('/dashboard', function(req, res){
  res.sendFile( 'index.html', route);
})

// SOLAPA EXAMENES
router.get('/dashboard/materia', asyncErrorWrap(controladorDashboard.getMateria))

router.get('/dashboard/tipo/:materia',  asyncErrorWrap(controladorDashboard.getTipo))

router.get('/dashboard/nivelChip/:tipo',  asyncErrorWrap(controladorDashboard.getNivelChips))

router.get('/dashboard/nivel/:nivel',  asyncErrorWrap(controladorDashboard.getNivel))

router.get('/dashboard/modalidad/:nivel',  asyncErrorWrap(controladorDashboard.getModalidad))

router.post('/dashboard/examenes/',  asyncErrorWrap(controladorDashboard.examenesCambios))

router.post('/dasboard/examenesUpdateNivelModalidad/',  asyncErrorWrap(controladorDashboard.examenesUpdateNivelModalidad))

// SOLAPA FECHAS
router.post('/dashboard/agregarFechaDia/',  asyncErrorWrap(controladorDashboard.agregarFechaDia))

router.get('/dashboard/listarHorarios/:fechasAntiguas',  asyncErrorWrap(controladorDashboard.listarHorarios))

router.get('/dashboard/listarHorariosOrales/',  asyncErrorWrap(controladorDashboard.listarHorariosOrales))


router.post('/dashboard/asignarDiaASemanaExamenOral/', asyncErrorWrap(controladorDashboard.asignarDiaASemanaExamenOral))


router.get('/dashboard/listarExamenes/',  asyncErrorWrap(controladorDashboard.listarExamenes))

router.get('/dashboard/listarExamenesEnFecha/:fecha&:tipo',  asyncErrorWrap(controladorDashboard.getExamenesEnFecha))

router.post('/dashboard/updateExamenesEnFecha/',  asyncErrorWrap(controladorDashboard.updateExamenesEnFecha))

router.post('/dashboard/agregarFechaSemana/',  asyncErrorWrap(controladorDashboard.agregarFechaSemana))

router.get('/dashboard/listarSemanas/:fechasAntiguas', asyncErrorWrap(controladorDashboard.listarSemanas))

router.get('/dashboard/listarExamenesEnSemana/:semana', asyncErrorWrap(controladorDashboard.getExamenesEnSemana))

router.get('/dashboard/listarReservaSemanasLs/:semana', asyncErrorWrap(controladorDashboard.listarReservaSemanasLs))


router.get('/dashboard/listarReservaDiaRw/:fecha', asyncErrorWrap(controladorDashboard.listarReservaDiaRw))

router.get('/dashboard/listarReservaDiaLs/:fecha', asyncErrorWrap(controladorDashboard.listarReservaDiaLs))

router.post('/dashboard/elminarFechaSemana/', asyncErrorWrap(controladorDashboard.elminarFechaSemana))
router.post('/dashboard/elminarFechaDiaRw/', asyncErrorWrap(controladorDashboard.elminarFechaDiaRw))
router.post('/dashboard/elminarFechaDiaLs/', asyncErrorWrap(controladorDashboard.elminarFechaDiaLs))


router.use(errorHandler);

module.exports = router;





