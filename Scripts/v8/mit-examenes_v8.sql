-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2019-10-14 19:22:08.304

-- tables
-- Table: alumno
CREATE TABLE alumno (
    uuid int NOT NULL AUTO_INCREMENT,
    fecha_inscripcion timestamp NOT NULL,
    candidate_number varchar(30) NOT NULL,
    nombre varchar(30) NOT NULL,
    apellido varchar(30) NOT NULL,
    documento_id varchar(30) NOT NULL,
    fecha_nacimiento date NOT NULL,
    genero varchar(1) NOT NULL,
    email varchar(40) NOT NULL,
    movil varchar(30) NOT NULL,
    domicilio text NOT NULL,
    observaciones text NOT NULL,
    activo boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    CONSTRAINT alumno_pk PRIMARY KEY (uuid)
);

-- Table: costos_extra
CREATE TABLE costos_extra (
    uuid int NOT NULL AUTO_INCREMENT,
    detalle_costo varchar(30) NOT NULL,
    monto decimal(7,2) NOT NULL,
    reserva_uuid int NOT NULL,
    CONSTRAINT costos_extra_pk PRIMARY KEY (uuid)
);

-- Table: examen_en_determinado_horario
CREATE TABLE examen_en_determinado_horario (
    uuid int NOT NULL AUTO_INCREMENT,
    semana_asignada_uuid int NOT NULL,
    habilita_setear_hora boolean NOT NULL,
    horario_uuid int NOT NULL,
    modalidad_uuid int NOT NULL,
    rendido boolean NOT NULL,
    nota_obtenida varchar(30) NULL,
    observaciones text NULL,
    CONSTRAINT examen_en_determinado_horario_pk PRIMARY KEY (uuid)
);

-- Table: horario
CREATE TABLE horario (
    uuid int NOT NULL AUTO_INCREMENT,
    fecha date NOT NULL,
    hora_inicio datetime NOT NULL,
    hora_final datetime NOT NULL,
    cupo_maximo int NOT NULL,
    sala_uuid int NOT NULL,
    CONSTRAINT horario_pk PRIMARY KEY (uuid)
);

-- Table: materia
CREATE TABLE materia (
    uuid int NOT NULL AUTO_INCREMENT,
    orden int NOT NULL,
    nombre varchar(90) NOT NULL,
    imagen text NULL,
    activo boolean NOT NULL,
    mostrar_cliente boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    CONSTRAINT materia_pk PRIMARY KEY (uuid)
);

-- Table: modalidad
CREATE TABLE modalidad (
    uuid int NOT NULL AUTO_INCREMENT,
    nivel_uudi int NOT NULL,
    requiere_lock_semana boolean NOT NULL,
    nombre varchar(90) NOT NULL,
    precio decimal(6,2) NOT NULL,
    mostrar_cliente boolean NOT NULL,
    activo boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    CONSTRAINT modalidad_pk PRIMARY KEY (uuid)
);

-- Table: nivel
CREATE TABLE nivel (
    uudi int NOT NULL AUTO_INCREMENT,
    orden int NOT NULL,
    tipo_uuid int NOT NULL,
    nombre varchar(90) NOT NULL,
    descripcion text NULL,
    pdf text NULL,
    imagen int NULL,
    mostrar_cliente boolean NOT NULL,
    activo boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    CONSTRAINT nivel_pk PRIMARY KEY (uudi)
);

-- Table: reserva
CREATE TABLE reserva (
    uuid int NOT NULL AUTO_INCREMENT,
    alumno_uuid int NOT NULL,
    examen_en_determinado_horario_uuid int NOT NULL,
    fecha_venta timestamp NOT NULL,
    medio_de_pago varchar(30) NOT NULL,
    nro_ref_pago int NOT NULL,
    monto_abonado decimal(7,2) NOT NULL,
    estado varchar(20) NOT NULL,
    observaciones text NOT NULL,
    CONSTRAINT reserva_pk PRIMARY KEY (uuid)
);

-- Table: sala
CREATE TABLE sala (
    uuid int NOT NULL AUTO_INCREMENT,
    nombre_sala varchar(20) NOT NULL,
    ubicacion text NOT NULL,
    capacidad int NOT NULL,
    mostrar boolean NOT NULL,
    activo boolean NOT NULL,
    CONSTRAINT sala_pk PRIMARY KEY (uuid)
);

-- Table: semana_asignada
CREATE TABLE semana_asignada (
    uuid int NOT NULL AUTO_INCREMENT,
    numero_semana int NOT NULL,
    ano int NOT NULL,
    CONSTRAINT semana_asignada_pk PRIMARY KEY (uuid)
);

-- Table: tipo
CREATE TABLE tipo (
    uuid int NOT NULL AUTO_INCREMENT,
    orden int NOT NULL,
    materia_uuid int NOT NULL,
    nombre varchar(90) NOT NULL,
    imagen text NULL,
    activo boolean NOT NULL,
    mostrar_cliente boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    CONSTRAINT tipo_pk PRIMARY KEY (uuid)
);

-- foreign keys
-- Reference: costos_extra_reserva (table: costos_extra)
ALTER TABLE costos_extra ADD CONSTRAINT costos_extra_reserva FOREIGN KEY costos_extra_reserva (reserva_uuid)
    REFERENCES reserva (uuid);

-- Reference: examen_en_determinado_horario_horario (table: examen_en_determinado_horario)
ALTER TABLE examen_en_determinado_horario ADD CONSTRAINT examen_en_determinado_horario_horario FOREIGN KEY examen_en_determinado_horario_horario (horario_uuid)
    REFERENCES horario (uuid);

-- Reference: examen_en_determinado_horario_modalidad (table: examen_en_determinado_horario)
ALTER TABLE examen_en_determinado_horario ADD CONSTRAINT examen_en_determinado_horario_modalidad FOREIGN KEY examen_en_determinado_horario_modalidad (modalidad_uuid)
    REFERENCES modalidad (uuid);

-- Reference: examen_en_determinado_horario_semana_asignada (table: examen_en_determinado_horario)
ALTER TABLE examen_en_determinado_horario ADD CONSTRAINT examen_en_determinado_horario_semana_asignada FOREIGN KEY examen_en_determinado_horario_semana_asignada (semana_asignada_uuid)
    REFERENCES semana_asignada (uuid);

-- Reference: horario_sala (table: horario)
ALTER TABLE horario ADD CONSTRAINT horario_sala FOREIGN KEY horario_sala (sala_uuid)
    REFERENCES sala (uuid);

-- Reference: modalidad_nivel (table: modalidad)
ALTER TABLE modalidad ADD CONSTRAINT modalidad_nivel FOREIGN KEY modalidad_nivel (nivel_uudi)
    REFERENCES nivel (uudi);

-- Reference: nivel_tipo (table: nivel)
ALTER TABLE nivel ADD CONSTRAINT nivel_tipo FOREIGN KEY nivel_tipo (tipo_uuid)
    REFERENCES tipo (uuid);

-- Reference: reserva_alumno (table: reserva)
ALTER TABLE reserva ADD CONSTRAINT reserva_alumno FOREIGN KEY reserva_alumno (alumno_uuid)
    REFERENCES alumno (uuid);

-- Reference: reserva_examen_en_determinado_horario (table: reserva)
ALTER TABLE reserva ADD CONSTRAINT reserva_examen_en_determinado_horario FOREIGN KEY reserva_examen_en_determinado_horario (examen_en_determinado_horario_uuid)
    REFERENCES examen_en_determinado_horario (uuid);

-- Reference: tipo_materia (table: tipo)
ALTER TABLE tipo ADD CONSTRAINT tipo_materia FOREIGN KEY tipo_materia (materia_uuid)
    REFERENCES materia (uuid);

-- End of file.

