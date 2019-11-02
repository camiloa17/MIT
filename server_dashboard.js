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

app.get('/materia', controladorDashboard.materia)

app.get('/tipo/:materia', controladorDashboard.tipo)

app.post('/examenes', controladorDashboard.examenesCambios)

app.listen(port, function () {
  console.log( "Listening on port number " + port );
});



