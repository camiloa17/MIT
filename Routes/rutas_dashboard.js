const express = require('express');
const router = express.Router();
const controladorDashboard = require('../controllers/controladorDashboard');
const controladorExcel = require('../controllers/exceljs/controlador_excel');
const controladorMailSender = require('../controllers/mailSender/controladorMailSender');
const users = require('../passport/usuarios')

///////////////////
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('../passport/passport-config')


initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

router.use(express.urlencoded({ extended: true }))
router.use(flash())

router.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))


router.get('/', checkAuthenticated, (req, res) => {
  res.render('fechasDashboard.ejs')
})

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login_dashboard.ejs')
})


router.post('/examenes', checkAuthenticated, (req,res)=>{
  res.render('examenesDashboard.ejs')
})

router.post('/fechas', checkAuthenticated, (req,res)=>{
  res.render('fechasDashboard.ejs')
})

router.post('/alumnos', checkAuthenticated, (req,res)=>{
  res.render('alumnosDashboard.ejs')
})



router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/dashboard/login',
  failureFlash: true
}))

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
    
  }
  res.redirect('/dashboard/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard')
  }
  next()
}

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/dashboard/login')
})



///////////////////


function asyncErrorWrap(f) {
  return (req, res, next) => {
    return Promise.resolve(f(req, res)).catch(next);
  }
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  console.log(err)
  res.send({ error: err.toString() });
}




// SOLAPA EXAMENES
router.get('/materia', asyncErrorWrap(controladorDashboard.getMateria))

router.get('/tipo/:materia', asyncErrorWrap(controladorDashboard.getTipo))

router.get('/nivelChip/:tipo', asyncErrorWrap(controladorDashboard.getNivelChips))

router.get('/nivel/:nivel', asyncErrorWrap(controladorDashboard.getNivel))

router.get('/modalidad/:nivel', asyncErrorWrap(controladorDashboard.getModalidad))


router.post('/examenesCambios/', asyncErrorWrap(controladorDashboard.examenesCambios))

router.post('/examenesUpdateNivelModalidad/', asyncErrorWrap(controladorDashboard.examenesUpdateNivelModalidad))

// SOLAPA FECHAS

router.post('/agregarFechaDia/', asyncErrorWrap(controladorDashboard.agregarFechaDia))

router.get('/listarHorarios/:fechasAntiguas', asyncErrorWrap(controladorDashboard.listarHorarios))

router.get('/listarHorariosOrales/', asyncErrorWrap(controladorDashboard.listarHorariosOrales))


router.post('/asignarDiaASemanaExamenOral/', asyncErrorWrap(controladorDashboard.asignarDiaASemanaExamenOral))


router.get('/listarExamenes/', asyncErrorWrap(controladorDashboard.listarExamenes))

router.get('/listarExamenesEnFecha/:fecha&:tipo', asyncErrorWrap(controladorDashboard.getExamenesEnFecha))

router.post('/updateExamenesEnFecha/', asyncErrorWrap(controladorDashboard.updateExamenesEnFecha))

router.post('/agregarFechaSemana/', asyncErrorWrap(controladorDashboard.agregarFechaSemana))

router.get('/listarSemanas/:fechasAntiguas', asyncErrorWrap(controladorDashboard.listarSemanas))

router.get('/listarExamenesEnSemana/:semana', asyncErrorWrap(controladorDashboard.getExamenesEnSemana))

router.get('/listarReservaSemanasLs/:semana', asyncErrorWrap(controladorDashboard.listarReservaSemanasLs))


router.get('/listarReservaDiaRw/:fecha', asyncErrorWrap(controladorDashboard.listarReservaDiaRw))

router.get('/listarReservaDiaLs/:fecha', asyncErrorWrap(controladorDashboard.listarReservaDiaLs))

router.post('/elminarFechaSemana/', asyncErrorWrap(controladorDashboard.elminarFechaSemana))
router.post('/elminarFechaDiaRw/', asyncErrorWrap(controladorDashboard.elminarFechaDiaRw))
router.post('/elminarFechaDiaLs/', asyncErrorWrap(controladorDashboard.elminarFechaDiaLs))

//
router.get('/excelAsistencia/:fecha&:tipo&:fechaString', asyncErrorWrap(controladorExcel.excelAsistencia))
router.get('/excelTrinity/:fecha&:tipo&:fechaString', asyncErrorWrap(controladorExcel.excelTrinity))

router.post('/enviarMails/', asyncErrorWrap(controladorMailSender.enviarMails))


// SOLAPA ALUMNOS

router.get('/listarAlumnos/:filtro&:valor&:todos', asyncErrorWrap(controladorDashboard.listarAlumnos))



router.use(errorHandler);

module.exports = router;





