const express = require('express');
const bodyParser = require('body-parser');
const controller = require('../MIT/controllers/controller')
const app = express();

app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(`Public`));

function asyncErrorWrap(f) {
    return (req, res, next)=> { 
         return Promise.resolve(f(req,res)).catch(next);
    }
}

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500)
    //res.render('error', { error: err })
    res.send({ error: err.toString()})
}



app.get('/', asyncErrorWrap(async (req,res) => {
    const stylesheet = '/css/Front/style.css';
    const menuItems = await controller.adquirirMenu();
    //const menuItems = { "materias": ["Inglés", "Instrumentos", "Danza", "Teatro"], "tipo": [{ "materia": "Inglés", "tipo": "ISE" }, { "materia": "Inglés", "tipo": "GESE" }, { "materia": "Instrumentos", "tipo": "Guitarra" }, { "materia": "Instrumentos", "tipo": "Piano" }, { "materia": "Danza", "tipo": null }], "nivel": [{ "tipo": "ISE", "nivel": "ISE FOUNDATION" }, { "tipo": "ISE", "nivel": "ISE I" }, { "tipo": "ISE", "nivel": "ISE II" }, { "tipo": "ISE", "nivel": "ISE III" }, { "tipo": "ISE", "nivel": "ISE IV" }, { "tipo": "GESE", "nivel": "Grade 1" }, { "tipo": "GESE", "nivel": "Grade 2" }, { "tipo": "GESE", "nivel": "Grade 3" }, { "tipo": "GESE", "nivel": "Grade 4" }, { "tipo": "GESE", "nivel": "Grade 5" }, { "tipo": "GESE", "nivel": "Grade 6" }, { "tipo": "GESE", "nivel": "Grade 7" }, { "tipo": "GESE", "nivel": "Grade 8" }, { "tipo": "GESE", "nivel": "Grade 9" }, { "tipo": "GESE", "nivel": "Grade 10" }, { "tipo": "GESE", "nivel": "Grade 11" }, { "tipo": "GESE", "nivel": "Grade 12" }, { "tipo": "Guitarra", "nivel": "Cuerdas 1" }, { "tipo": "Guitarra", "nivel": "Cuerdas 2" }, { "tipo": "Piano", "nivel": "Teclas 1" }, { "tipo": "Piano", "nivel": "Teclas 2" }, { "tipo": null, "nivel": null }], "modo": [{ "nivel": "ISE FOUNDATION", "modo": "Completo" }, { "nivel": "ISE FOUNDATION", "modo": "Reading & Writing" }, { "nivel": "ISE FOUNDATION", "modo": "Listening & Speaking" }, { "nivel": "ISE I", "modo": "Completo" }, { "nivel": "ISE I", "modo": "Reading & Writing" }, { "nivel": "ISE I", "modo": "Listening & Speaking" }, { "nivel": "ISE II", "modo": "Completo" }, { "nivel": "ISE II", "modo": "Reading & Writing" }, { "nivel": "ISE II", "modo": "Listening & Speaking" }, { "nivel": "ISE III", "modo": "Completo" }, { "nivel": "ISE III", "modo": "Reading & Writing" }, { "nivel": "ISE III", "modo": "Listening & Speaking" }, { "nivel": "ISE IV", "modo": "Completo" }, { "nivel": "Grade 1", "modo": "Listening & Speaking" }, { "nivel": "Grade 2", "modo": "Listening & Speaking" }, { "nivel": "Grade 3", "modo": "Listening & Speaking" }, { "nivel": "Grade 4", "modo": "Listening & Speaking" }, { "nivel": "Grade 5", "modo": "Listening & Speaking" }, { "nivel": "Grade 6", "modo": "Listening & Speaking" }, { "nivel": "Grade 7", "modo": "Listening & Speaking" }, { "nivel": "Grade 8", "modo": "Listening & Speaking" }, { "nivel": "Grade 9", "modo": "Listening & Speaking" }, { "nivel": "Grade 10", "modo": "Listening & Speaking" }, { "nivel": "Grade 11", "modo": "Listening & Speaking" }, { "nivel": "Grade 12", "modo": "Listening & Speaking" }, { "nivel": "Cuerdas 1", "modo": null }, { "nivel": "Cuerdas 2", "modo": null }, { "nivel": "Teclas 1", "modo": null }, { "nivel": "Teclas 2", "modo": null }, { "nivel": null, "modo": null }, { "nivel": null, "modo": null }]}
    res.render("home", { stylesheet: stylesheet,team:'#team',contacto:'#contacto', materia: menuItems.materias, tipos: menuItems.tipo, nivel: menuItems.nivel, modo: menuItems.modo })
}));

app.get('/checkout/:materia/:tipo/:nivel/:modalidad',asyncErrorWrap (async(req, res) => {
    const stylesheet = '/css/Front/checkoutStyle.css';
    const datosExamenModalidad = await controller.consultaExamenCheckout(req.query.id);
    const horarios = await controller.consultaHorarios(req.params.modalidad, req.query.id);
    
    res.render('checkout', { stylesheet: stylesheet, tipo:datosExamenModalidad.tipo,nivel:datosExamenModalidad.nivel,modo:datosExamenModalidad.modalidad,precio:datosExamenModalidad.precio,descripcion:datosExamenModalidad.descripcion,horario:horarios})
}));

app.get('/faqs',asyncErrorWrap(async (req,res)=>{
    const stylesheet='css/Front/faqs.css';
    const menuItems = await controller.adquirirMenu();
    res.render("faqs", { stylesheet: stylesheet, team: '/#team', contacto: '/#contacto', materia: menuItems.materias, tipos: menuItems.tipo, nivel: menuItems.nivel, modo: menuItems.modo })
}))


app.use(errorHandler);

app.listen(3000, () => {
    console.log(`listening on port 3000`)
})

process.on('unhandledRejection', function (reason, p) {
    console.error(reason);
});