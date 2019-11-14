const express = require('express');
const bodyParser = require('body-parser');
const controladorDashboard = require('./controlador/controladorDashboard')
const port  = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(express.static(`Public`));

const route = {root:`${__dirname}/Public/html/Dashboard/`}


app.get('/', function(req, res){
  res.sendFile( 'index.html', route);
})

app.get('/materia', controladorDashboard.getMateria)

app.get('/tipo/:materia', controladorDashboard.getTipo)

app.get('/nivelChip/:tipo', controladorDashboard.getNivelChips)

app.get('/nivel/:nivel', controladorDashboard.getNivel)

app.get('/modalidad/:nivel', controladorDashboard.getModalidad)

app.post('/examenes/', controladorDashboard.examenesCambios)

app.post('/examenesUpdateNivelModalidad/', controladorDashboard.examenesUpdateNivelModalidad)

app.post('/agregarFechaDia/', controladorDashboard.agregarFechaDia)

app.get('/listarHorarios/', controladorDashboard.listarHorarios)

app.get('/listarExamenes/', controladorDashboard.listarExamenes)


app.listen(port, function () {
  console.log( "Listening on port number " + port );
});



