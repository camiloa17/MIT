-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2019-10-31 12:45:27.736

-- tables
-- Table: alumno
CREATE TABLE alumno (
    uuid binary(16) NOT NULL,
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

-- Table: dia_LS
CREATE TABLE dia_LS (
    uuid binary(16) NOT NULL,
    fecha_examenLS datetime NOT NULL,
    cupo_maximo int NOT NULL,
    finaliza_inscripcion datetime NOT NULL,
    pausado boolean NOT NULL,
    activo boolean NOT NULL,
    CONSTRAINT horario_pk PRIMARY KEY (uuid)
);

-- Table: dia_RW
CREATE TABLE dia_RW (
    uuid binary(16) NOT NULL,
    fecha_examenRW datetime NOT NULL,
    cupo_maximo int NOT NULL,
    finaliza_inscripcion datetime NOT NULL,
    pausado boolean NOT NULL,
    activo boolean NOT NULL,
    CONSTRAINT horario_pk PRIMARY KEY (uuid)
);

-- Table: examen_en_dia_LS
CREATE TABLE examen_en_dia_LS (
    uuid binary(16) NOT NULL,
    pausado boolean NOT NULL,
    activo boolean NOT NULL,
    dia_LS_uuid binary(16) NOT NULL,
    modalidad_uuid binary(16) NOT NULL,
    CONSTRAINT examen_en_determinado_horario_pk PRIMARY KEY (uuid)
);

-- Table: examen_en_dia_RW
CREATE TABLE examen_en_dia_RW (
    uuid binary(16) NOT NULL,
    pausado boolean NOT NULL,
    activo boolean NOT NULL,
    dia_RW_uuid binary(16) NOT NULL,
    modalidad_uuid binary(16) NOT NULL,
    CONSTRAINT examen_en_determinado_horario_pk PRIMARY KEY (uuid)
);

-- Table: examen_en_semana_LS
CREATE TABLE examen_en_semana_LS (
    uuid binary(16) NOT NULL,
    pausado boolean NOT NULL,
    activo boolean NOT NULL,
    semana_LS_uuid binary(16) NOT NULL,
    modalidad_uuid binary(16) NOT NULL,
    CONSTRAINT examen_en_determinado_horario_pk PRIMARY KEY (uuid)
);

-- Table: materia
CREATE TABLE materia (
    uuid varchar(36) NOT NULL,
    orden int NOT NULL,
    nombre varchar(90) NOT NULL,
    activo boolean NOT NULL,
    mostrar_cliente boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    CONSTRAINT materia_pk PRIMARY KEY (uuid)
);

-- Table: modalidad
CREATE TABLE modalidad (
    uuid varchar(36) NOT NULL,
    nombre varchar(90) NOT NULL,
    orden int NOT NULL,
    precio decimal(6,2) NOT NULL,
    mostrar_cliente boolean NOT NULL,
    activo boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    examen_RW boolean NOT NULL,
    examen_LS boolean NOT NULL,
    nivel_uuid varchar(36) NOT NULL,
    CONSTRAINT modalidad_pk PRIMARY KEY (uuid)
);

-- Table: nivel
CREATE TABLE nivel (
    uuid varchar(36) NOT NULL,
    nombre varchar(90) NOT NULL,
    orden int NOT NULL, 
    descripcion text NULL,
    pdf text NULL,
    imagen text NULL,
    activo boolean NOT NULL,
    mostrar_cliente boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    tipo_uuid varchar(36) NOT NULL,
    CONSTRAINT nivel_pk PRIMARY KEY (uuid)
);

-- Table: orden_elementos
CREATE TABLE orden_elementos (
    uuid binary(16) NOT NULL,
    tabla binary(16) NOT NULL,
    elemento binary(16) NOT NULL,
    orden int NOT NULL,
    CONSTRAINT orden_elementos_pk PRIMARY KEY (uuid)
);

-- Table: reserva
CREATE TABLE reserva (
    uuid binary(16) NOT NULL,
    fecha_venta timestamp NOT NULL,
    medio_de_pago varchar(30) NOT NULL,
    nro_ref_pago int NOT NULL,
    monto_abonado decimal(7,2) NOT NULL,
    fuera_termino boolean NOT NULL,
    estado varchar(20) NOT NULL,
    academia_amiga varchar(30) NOT NULL,
    plataforma varchar(30) NOT NULL,
    notas_obtenidas varchar(20) NOT NULL,
    observaciones text NOT NULL,
    envio_domicilio_diploma boolean NOT NULL,
    direccion_envio_diploma text NOT NULL,
    alumno_uuid binary(16) NOT NULL,
    examen_en_dia_RW_uuid binary(16) NOT NULL,
    examen_en_dia_LS_uuid binary(16) NOT NULL,
    examen_en_semana_LS_uuid binary(16) NOT NULL,
    CONSTRAINT reserva_pk PRIMARY KEY (uuid)
);

-- Table: semana_LS
CREATE TABLE semana_LS (
    uuid binary(16) NOT NULL,
    semana_examen date NOT NULL,
    cupo_maximo int NOT NULL,
    finaliza_inscripcion datetime NOT NULL,
    pausado boolean NOT NULL,
    activo boolean NOT NULL,
    CONSTRAINT horario_pk PRIMARY KEY (uuid)
);

-- Table: tipo
CREATE TABLE tipo (
    uuid varchar(36) NOT NULL,
    orden int NOT NULL,
    nombre varchar(90) NOT NULL,
    activo boolean NOT NULL,
    mostrar_cliente boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    materia_uuid varchar(36) NOT NULL,
    CONSTRAINT tipo_pk PRIMARY KEY (uuid)
);

-- foreign keys
-- Reference: examen_en_dia_LS_dia_LS (table: examen_en_dia_LS)
ALTER TABLE examen_en_dia_LS ADD CONSTRAINT examen_en_dia_LS_dia_LS FOREIGN KEY examen_en_dia_LS_dia_LS (dia_LS_uuid)
    REFERENCES dia_LS (uuid);

-- Reference: examen_en_dia_LS_modalidad (table: examen_en_dia_LS)
ALTER TABLE examen_en_dia_LS ADD CONSTRAINT examen_en_dia_LS_modalidad FOREIGN KEY examen_en_dia_LS_modalidad (modalidad_uuid)
    REFERENCES modalidad (uuid);

-- Reference: examen_en_dia_RW_dia_RW (table: examen_en_dia_RW)
ALTER TABLE examen_en_dia_RW ADD CONSTRAINT examen_en_dia_RW_dia_RW FOREIGN KEY examen_en_dia_RW_dia_RW (dia_RW_uuid)
    REFERENCES dia_RW (uuid);

-- Reference: examen_en_dia_RW_modalidad (table: examen_en_dia_RW)
ALTER TABLE examen_en_dia_RW ADD CONSTRAINT examen_en_dia_RW_modalidad FOREIGN KEY examen_en_dia_RW_modalidad (modalidad_uuid)
    REFERENCES modalidad (uuid);

-- Reference: examen_en_semana_LS_modalidad (table: examen_en_semana_LS)
ALTER TABLE examen_en_semana_LS ADD CONSTRAINT examen_en_semana_LS_modalidad FOREIGN KEY examen_en_semana_LS_modalidad (modalidad_uuid)
    REFERENCES modalidad (uuid);

-- Reference: examen_en_semana_LS_semana_LS (table: examen_en_semana_LS)
ALTER TABLE examen_en_semana_LS ADD CONSTRAINT examen_en_semana_LS_semana_LS FOREIGN KEY examen_en_semana_LS_semana_LS (semana_LS_uuid)
    REFERENCES semana_LS (uuid);

-- Reference: modalidad_nivel (table: modalidad)
ALTER TABLE modalidad ADD CONSTRAINT modalidad_nivel FOREIGN KEY modalidad_nivel (nivel_uuid)
    REFERENCES nivel (uuid);

-- Reference: nivel_tipo (table: nivel)
ALTER TABLE nivel ADD CONSTRAINT nivel_tipo FOREIGN KEY nivel_tipo (tipo_uuid)
    REFERENCES tipo (uuid);

-- Reference: reserva_alumno (table: reserva)
ALTER TABLE reserva ADD CONSTRAINT reserva_alumno FOREIGN KEY reserva_alumno (alumno_uuid)
    REFERENCES alumno (uuid);

-- Reference: reserva_examen_en_dia_LS (table: reserva)
ALTER TABLE reserva ADD CONSTRAINT reserva_examen_en_dia_LS FOREIGN KEY reserva_examen_en_dia_LS (examen_en_dia_LS_uuid)
    REFERENCES examen_en_dia_LS (uuid);

-- Reference: reserva_examen_en_dia_RW (table: reserva)
ALTER TABLE reserva ADD CONSTRAINT reserva_examen_en_dia_RW FOREIGN KEY reserva_examen_en_dia_RW (examen_en_dia_RW_uuid)
    REFERENCES examen_en_dia_RW (uuid);

-- Reference: reserva_examen_en_semana_LS (table: reserva)
ALTER TABLE reserva ADD CONSTRAINT reserva_examen_en_semana_LS FOREIGN KEY reserva_examen_en_semana_LS (examen_en_semana_LS_uuid)
    REFERENCES examen_en_semana_LS (uuid);

-- Reference: tipo_materia (table: tipo)
ALTER TABLE tipo ADD CONSTRAINT tipo_materia FOREIGN KEY tipo_materia (materia_uuid)
    REFERENCES materia (uuid);

-- End of file.

