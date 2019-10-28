INSERT INTO `materia` (`id`, `orden`, `nombre`, `imagen`, `activo`, `mostrar_cliente`, `edita_user_secundario`)
VALUES 
(1, 1, "Inglés", "", true, true, false),
(2, 2, "Instrumentos", "", true, true, false),
(3, 4, "Danza", "", true, true, false),
(4, 3, "Teatro", "", true, true, false);


INSERT INTO `tipo` (`id`, `orden`, `materia_id`, `nombre`, `imagen`, `activo`, `mostrar_cliente`, `edita_user_secundario`)
VALUES 
(1, 1, 1, "ISE", "", true, true, false),
(2, 2, 1, "GESE", "", true, true, false),
(3, 1, 2, "Guitarra", "", true, true, false),
(4, 2, 2, "Piano", "", true, true, false);


INSERT INTO `nivel` (`id`, `orden`, `tipo_id`, `nombre`, `descripcion`, `pdf`, `imagen`, `mostrar_cliente`, `activo`, `edita_user_secundario`)
VALUES 
(1, 1, 1, "ISE FOUNDATION", "descripcion A2 - ISE FOUNDATION", "", "", true, true, false),
(2, 2, 1, "ISE I", "descripcion B1 - ISE I", "", "", true, true, false),
(3, 3, 1, "ISE II", "descripcion B2 - ISE II", "", "", true, true, false),
(4, 4, 1, "ISE III", "descripcion C1 - ISE III", "", "", true, true, false),
(5, 5, 1, "ISE IV", "descripcion C2 - ISE IV", "", "", true, true, false),
(6, 1, 2, "Grade 1", "descripcion Grade 1", "", "", true, true, false),
(7, 2, 2, "Grade 2", "descripcion Grade 2", "", "", true, true, false),
(8, 3, 2, "Grade 3", "descripcion Grade 3", "", "", true, true, false),
(9, 4, 2, "Grade 4", "descripcion Grade 4", "", "", true, true, false),
(10, 5, 2, "Grade 5", "descripcion Grade 5", "", "", true, true, false),
(11, 6, 2, "Grade 6", "descripcion Grade 6", "", "", true, true, false),
(12, 7, 2, "Grade 7", "descripcion Grade 7", "", "", true, true, false),
(13, 8, 2, "Grade 8", "descripcion Grade 8", "", "", true, true, false),
(14, 9, 2, "Grade 9", "descripcion Grade 9", "", "", true, true, false),
(15, 10, 2, "Grade 10", "descripcion Grade 10", "", "", true, true, false),
(16, 11, 2, "Grade 11", "descripcion Grade 11", "", "", true, true, false),
(17, 12, 2, "Grade 12", "descripcion Grade 12", "", "", true, true, false),
(18, 1, 3, "Cuerdas 1", "descripcion Cuerdas 1", "", "", true, true, false),
(19, 2, 3, "Cuerdas 2", "descripcion Cuerdas 2", "", "", true, true, false),
(20, 1, 4, "Teclas 1", "descripcion Teclas 1", "", "", true, true, false),
(21, 2, 4, "Teclas 2", "descripcion Teclas 2", "", "", true, true, false);

INSERT INTO `modalidad` (`id`, `orden`, `nivel_id`, `nombre`, `precio`, `mostrar_cliente`, `activo`, `edita_user_secundario`, `examen_RW`, `examen_LS`)
VALUES 
(1, 1, 1, "Completo", 100, true, true, false, true, true),
(2, 2, 1, "Reading & Writing", 28, true, true, false, true, false),
(3, 3, 1, "Listening & Speaking", 87, true, true, false, false, true),
(4, 1, 2, "Completo", 118, true, true, false, true, true),
(5, 2, 2, "Reading & Writing", 33, true, true, false, true, false),
(6, 3, 2, "Listening & Speaking", 103, true, true, false, false, true),
(7, 1, 3, "Completo", 170, true, true, false, true, true),
(8, 2, 3, "Reading & Writing", 41, true, true, false, true, false),
(9, 3, 3, "Listening & Speaking", 145, true, true, false, false, true),
(10, 1, 4, "Completo", 205, true, true, false, true, true),
(11, 2, 4, "Reading & Writing", 50, true, true, false, true, false),
(12, 3, 4, "Listening & Speaking", 175, true, true, false, false, true),
(13, 1, 5, "Completo", 210, true, true, false, true, true),
(14, 1, 6, "Listening & Speaking", 64, true, true, false, false, true),
(15, 1, 7, "Listening & Speaking", 70, true, true, false, false, true),
(16, 1, 8, "Listening & Speaking", 75, true, true, false, false, true),
(17, 1, 9, "Listening & Speaking", 95, true, true, false, false, true),
(19, 1, 11, "Listening & Speaking", 95, true, true, false, false, true),
(20, 1, 12, "Listening & Speaking", 122, true, true, false, false, true),
(21, 1, 13, "Listening & Speaking", 122, true, true, false, false, true),
(18, 1, 10, "Listening & Speaking", 95, true, true, false, false, true),
(22, 1, 14, "Listening & Speaking", 122, true, true, false, false, true),
(23, 1, 15, "Listening & Speaking", 167, true, true, false, false, true),
(24, 1, 16, "Listening & Speaking", 167, true, true, false, false, true),
(25, 1, 17, "Listening & Speaking", 167, true, true, false, false, true);

INSERT INTO `diaRW` (`uuid`, `examen_datetime`, `cupo`, `finaliza_inscripcion`)
VALUES
("diaRW_01", "27/11/2019", "10:00", 30, "20/11/2019 23:59:59"),
("diaRW_02", "31/11/2019", "9:00", 30, "24/11/2019 23:59:59"),
("diaRW_03", "01/12/2019", "15:00", 30, "25/11/2019 23:59:59"),
("diaRW_04", "07/12/2019", "17:00", 30, "30/11/2019 23:59:59");

INSERT INTO `diaLS` (`uuid`, `examen_datetime`, `cupo`, `finaliza_inscripcion`)
VALUES
("diaLS_01", "27/11/2019", "10:00", 30, "20/11/2019 23:59:59"),
("diaLS_02", "31/11/2019", "9:00", 30, "24/11/2019 23:59:59"),
("diaLS_03", "01/12/2019", "15:00", 30, "25/11/2019 23:59:59"),
("diaLS_04", "07/12/2019", "17:00", 30, "30/11/2019 23:59:59");

INSERT INTO `semanaLS` (`uuid`, `examen_yearweek`, `cupo`, `finaliza_inscripcion`)
VALUES
("semLS_01", 201942, 30, "20/11/2019 23:59:59"),
("semLS_02", 201947 ,30, "20/11/2019 23:59:59"),
("semLS_03", 201951, 30, "20/11/2019 23:59:59");


INSERT INTO `examen_en_dia_RW` (`uuid`, `modalidad_uuid`, `diaRW_uuid`)
VALUES
("end_RW_01", "mod02", "diaRW_03"),
("end_RW_02", "mod05", "diaRW_04"),
("end_RW_03", "mod05", "diaRW_01"),
("end_RW_04", "mod01", "diaRW_01"),
("end_RW_05", "mod01", "diaRW_02");

INSERT INTO `examen_en_dia_LS` (`uuid`, `modalidad_uuid`, `diaLS_uuid`)
VALUES
("end_LS_01", "mod03", "diaLS_03"),
("end_LS_02", "mod0", "diaLS_04"),
("end_LS_03", "mod05", "diaLS_01"),
("end_LS_04", "mod01", "diaLS_01"),
("end_LS_05", "mod01", "diaLS_02");


INSERT INTO `examen_en_semana_LS` (`uuid`, `modalidad_uuid`, `semanaLS_uuid`)
VALUES
("ens_LS_01", "mod03", "semLS_01"),
("ens_LS_02", "mod06", "semLS_02"),
("ens_LS_03", "mod03", "semLS_03"),
("ens_LS_04") "mod03", "semLS_03");



INSERT INTO `reserva` (`uuid`, `alumno_uuid`, `examen_en_dia_RW`, `examen_en_semana_LS`, `examen_en_dia_LS`, `linkORweb`, `fueraTermino`, `academia_amiga`, `fecha_venta`, `medio_de_pago`, `nro_ref_pago`, `monto_abonado`, `estado`, `notas_obtenidas`, `observaciones`)
VALUES
("res_01", "alm_01", finaliza
































INSERT INTO `alumno` (`id`, `nombre`, `apellido`, `documento_id`, `fecha_nacimiento`, `genero`, `email`, `movil`, `domicilio`, `observaciones`, `usuario`, `clave`, `fecha_inscripcion`)
VALUES 
(1, "Juan Ignacio", "Simioli", "31.116.545", "1978-03-09", "M", "juanim@gmail.com", "011 15 1616 5424", "Ayacucho 917 3c ", "", "", "", "2019-09-30 23:12:51"),
(2, "Marcos Miguel", "Macchi", "10.564.395", "1981-02-07", "M", "marmi@gmail.com", "011 15 4621 4575", "Santa Fe 917 3c ", "", "", "", "2019-09-27 01:24:51"),
(3, "Ernesto", "Proazzi", "40.564.841", "1998-05-21", "M", "ernest@gmail.com", "011 15 0135 6972", "Quesada 917 3c ", "", "", "", "2019-09-22 17:28:51"),
(4, "Mariana Micaela", "Buscaglia", "22.643.975", "1999-12-27", "F", "marian@gmail.com", "011 15 8523 6547", "Riobamba 917 3c ", "", "", "", "2019-09-25 18:18:51"),
(5, "Faviola", "Minujin", "33.468.137", "1994-01-31", "F", "faviola@gmail.com", "011 15 4638 7469", "Rodriguez Peña 917 3c ", "", "", "", "2019-09-25 20:56:51"),
(6, "Jose Federico", "Tinelli", "34.719.345", "1990-02-28", "M", "josef@gmail.com", "011 15 1234 5678", "Cabildo 917 3c ", "", "", "", "2019-09-02 11:04:51"),
(7, "Uvaldo Jeronimo", "Gimenez", "29.462.345", "2009-09-22", "M", "uvaldo@gmail.com", "011 15 4627 9631", "Roosevelt 917 3c ", "", "", "", "2019-09-03 07:45:51"),
(8, "Francisco", "Mañas", "36.454.315", "2002-08-06", "M", "fran@gmail.com", "011 15 7152 6489", "Congreso 917 3c ", "", "", "", "2019-09-15 23:45:51"),
(9, "Martin", "Rodriguez", "41.437.197", "1940-07-01", "M", "tincho@gmail.com", "011 15 4632 6859", "Cramer 917 3c ", "", "", "", "2019-09-17 03:03:51"),
(10, "Esteban Fabian", "Perez", "54.346.475", "1954-12-14", "M", "esteban@gmail.com", "011 15 7512 9634", "Dorrego  917 3c ", "", "", "", "2019-09-18 13:33:51"),
(11, "Josefina Roberta", "Arenilla", "8.234.754", "1983-02-01", "F", "josef@gmail.com", "011 15 4545 6565", "Bulnes 917 3c ", "", "", "", "2019-09-19 11:02:51");
