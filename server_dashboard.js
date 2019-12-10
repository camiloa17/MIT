const express = require('express');
const bodyParser = require('body-parser');
const controladorDashboard = require('./controlador/controladorDashboard')
const port  = process.env.PORT || 8080;

//const mailSenderFile = require('./mailSender/mailSender')

const app = express();

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

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(express.static(`Public`));

const route = {root:`${__dirname}/Public/html/Dashboard/`}

app.get('/', function(req, res){
  res.sendFile( 'index.html', route);
})

// SOLAPA EXAMENES
app.get('/materia', asyncErrorWrap(controladorDashboard.getMateria))

app.get('/tipo/:materia',  asyncErrorWrap(controladorDashboard.getTipo))

app.get('/nivelChip/:tipo',  asyncErrorWrap(controladorDashboard.getNivelChips))

app.get('/nivel/:nivel',  asyncErrorWrap(controladorDashboard.getNivel))

app.get('/modalidad/:nivel',  asyncErrorWrap(controladorDashboard.getModalidad))

app.post('/examenes/',  asyncErrorWrap(controladorDashboard.examenesCambios))

app.post('/examenesUpdateNivelModalidad/',  asyncErrorWrap(controladorDashboard.examenesUpdateNivelModalidad))

// SOLAPA FECHAS
app.post('/agregarFechaDia/',  asyncErrorWrap(controladorDashboard.agregarFechaDia))

app.get('/listarHorarios/:fechasAntiguas',  asyncErrorWrap(controladorDashboard.listarHorarios))

app.get('/listarHorariosOrales/',  asyncErrorWrap(controladorDashboard.listarHorariosOrales))


app.post('/asignarDiaASemanaExamenOral/', asyncErrorWrap(controladorDashboard.asignarDiaASemanaExamenOral))


app.get('/listarExamenes/',  asyncErrorWrap(controladorDashboard.listarExamenes))

app.get('/listarExamenesEnFecha/:fecha&:tipo',  asyncErrorWrap(controladorDashboard.getExamenesEnFecha))

app.post('/updateExamenesEnFecha/',  asyncErrorWrap(controladorDashboard.updateExamenesEnFecha))

app.post('/agregarFechaSemana/',  asyncErrorWrap(controladorDashboard.agregarFechaSemana))

app.get('/listarSemanas/:fechasAntiguas', asyncErrorWrap(controladorDashboard.listarSemanas))

app.get('/listarExamenesEnSemana/:semana', asyncErrorWrap(controladorDashboard.getExamenesEnSemana))

app.get('/listarReservaSemanasLs/:semana', asyncErrorWrap(controladorDashboard.listarReservaSemanasLs))


app.get('/listarReservaDiaRw/:fecha', asyncErrorWrap(controladorDashboard.listarReservaDiaRw))

app.get('/listarReservaDiaLs/:fecha', asyncErrorWrap(controladorDashboard.listarReservaDiaLs))

app.post('/elminarFechaSemana/', asyncErrorWrap(controladorDashboard.elminarFechaSemana))
app.post('/elminarFechaDiaRw/', asyncErrorWrap(controladorDashboard.elminarFechaDiaRw))
app.post('/elminarFechaDiaLs/', asyncErrorWrap(controladorDashboard.elminarFechaDiaLs))


app.use(errorHandler);


app.listen(port, function () {
  console.log( "Listening on port number " + port );
});



