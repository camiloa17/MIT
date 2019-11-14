const express = require('express');
const bodyParser = require('body-parser');
const controladorDashboard = require('./controlador/controladorDashboard')
const port  = process.env.PORT || 8080;

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

app.get('/listarHorarios/',  asyncErrorWrap(controladorDashboard.listarHorarios))

app.get('/listarExamenes/',  asyncErrorWrap(controladorDashboard.listarExamenes))

app.use(errorHandler);

app.listen(port, function () {
  console.log( "Listening on port number " + port );
});



