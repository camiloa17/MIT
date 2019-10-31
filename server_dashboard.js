const express = require('express');
const bodyParser = require('body-parser');
const dashboardController = require('./controller/dashboardController')
const port  = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(express.static(__dirname + `/Public/html/Dashboard/`));


app.get('/', function(req, res){
  res.sendFile( 'index.html');
})

app.get('/materia', dashboardController.materia)

app.get('/tipo/:materia', dashboardController.tipo)

app.listen(port, function () {
  console.log( "Listening on port number " + port );
});



