CREATE DATABASE mit;
use mit;

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
    alumno_pk PRIMARY KEY (uuid)
);

-- Table: dia_LS
CREATE TABLE dia_LS (
    uuid int NOT NULL AUTO_INCREMENT,
    fecha_examenLS datetime NOT NULL,
    cupo_maximo INT NOT NULL,
    finaliza_inscripcion datetime NOT NULL,
    pausado boolean NOT NULL,
    activo boolean NOT NULL,
    CONSTRAINT horario_pk PRIMARY KEY (uuid)
);

-- Table: dia_RW
CREATE TABLE dia_RW (
    uuid int NOT NULL AUTO_INCREMENT,
    fecha_examenRW datetime NOT NULL,
    cupo_maximo INT NOT NULL,
    finaliza_inscripcion datetime NOT NULL,
    pausado boolean NOT NULL,
    activo boolean NOT NULL,
    CONSTRAINT horario_pk PRIMARY KEY (uuid)
);

-- Table: examen_en_dia_LS
CREATE TABLE examen_en_dia_LS (
    uuid int NOT NULL AUTO_INCREMENT,
    dia_LS_uuid int NOT NULL,
    modalidad_uuid int NOT NULL,
    pausado boolean NOT NULL,
    activo boolean NOT NULL,
    CONSTRAINT examen_en_determinado_horario_pk PRIMARY KEY (uuid)
);

-- Table: examen_en_dia_RW
CREATE TABLE examen_en_dia_RW (
    uuid int NOT NULL AUTO_INCREMENT,
    dia_RW_uuid int NOT NULL,
    modalidad_uuid int NOT NULL,
    pausado boolean NOT NULL,
    activo boolean NOT NULL,
    CONSTRAINT examen_en_determinado_horario_pk PRIMARY KEY (uuid)
);

-- Table: examen_en_semana_LS
CREATE TABLE examen_en_semana_LS (
    uuid int NOT NULL AUTO_INCREMENT,
    semana_LS_uuid int NOT NULL,
    modalidad_2_uuid int NOT NULL,
    pausado boolean NOT NULL,
    activo boolean NOT NULL,
    CONSTRAINT examen_en_determinado_horario_pk PRIMARY KEY (uuid)
);

-- Table: materia
CREATE TABLE materia (
    id int NOT NULL AUTO_INCREMENT,
    orden int NOT NULL,
    nombre varchar(90) NOT NULL,
    imagen text NULL,
    activo boolean NOT NULL,
    mostrar_cliente boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    CONSTRAINT materia_pk PRIMARY KEY (id)
);

-- Table: modalidad
CREATE TABLE modalidad (
    id int NOT NULL AUTO_INCREMENT,
    nombre varchar(90) NOT NULL,
    precio decimal(6,2) NOT NULL,
    mostrar_cliente boolean NOT NULL,
    activo boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    examen_RW boolean NOT NULL,
    examen_LS boolean NOT NULL,
    nivel_id int NOT NULL,
    orden int NOT NULL,
    CONSTRAINT modalidad_pk PRIMARY KEY (id)
);

-- Table: nivel
CREATE TABLE nivel (
    id int NOT NULL AUTO_INCREMENT,
    orden int NOT NULL,
    nombre varchar(90) NOT NULL,
    descripcion text NULL,
    pdf text NULL,
    imagen text NULL,
    mostrar_cliente boolean NOT NULL,
    activo boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    tipo_id int NOT NULL,
    CONSTRAINT nivel_pk PRIMARY KEY (id)
);

-- Table: reserva
CREATE TABLE reserva (
    uuid int NOT NULL AUTO_INCREMENT,
    alumno_uuid int NOT NULL,
    examen_en_dia_RW_uuid int NOT NULL,
    examen_en_semana_LS_uuid int NOT NULL,
    examen_en_dia_LS_uuid int NOT NULL,
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
    CONSTRAINT reserva_pk PRIMARY KEY (uuid)
);

-- Table: semana_LS
CREATE TABLE semana_LS (
    uuid int NOT NULL AUTO_INCREMENT,
    semana_examen date NOT NULL,
    cupo_maximo INT NOT NULL,
    finaliza_inscripcion datetime NOT NULL,
    pausado boolean NOT NULL,
    activo boolean NOT NULL,
    CONSTRAINT horario_pk PRIMARY KEY (uuid)
);

-- Table: tipo
CREATE TABLE tipo (
    id int NOT NULL AUTO_INCREMENT,
    orden int NOT NULL,
    nombre varchar(90) NOT NULL,
    imagen text NULL,
    activo boolean NOT NULL,
    mostrar_cliente boolean NOT NULL,
    edita_user_secundario boolean NOT NULL,
    materia_id int NOT NULL,
    CONSTRAINT tipo_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: examen_en_dia_LS_dia_LS (table: examen_en_dia_LS)
ALTER TABLE examen_en_dia_LS ADD CONSTRAINT examen_en_dia_LS_dia_LS FOREIGN KEY examen_en_dia_LS_dia_LS (dia_LS_uuid)
    REFERENCES dia_LS (uuid);

-- Reference: examen_en_dia_LS_modalidad (table: examen_en_dia_LS)
ALTER TABLE examen_en_dia_LS ADD CONSTRAINT examen_en_dia_LS_modalidad FOREIGN KEY examen_en_dia_LS_modalidad (modalidad_uuid)
    REFERENCES modalidad (id);

-- Reference: examen_en_dia_RW_dia_RW (table: examen_en_dia_RW)
ALTER TABLE examen_en_dia_RW ADD CONSTRAINT examen_en_dia_RW_dia_RW FOREIGN KEY examen_en_dia_RW_dia_RW (dia_RW_uuid)
    REFERENCES dia_RW (uuid);

-- Reference: examen_en_dia_RW_modalidad (table: examen_en_dia_RW)
ALTER TABLE examen_en_dia_RW ADD CONSTRAINT examen_en_dia_RW_modalidad FOREIGN KEY examen_en_dia_RW_modalidad (modalidad_uuid)
    REFERENCES modalidad (id);

-- Reference: examen_en_semana_LS_modalidad (table: examen_en_semana_LS)
ALTER TABLE examen_en_semana_LS ADD CONSTRAINT examen_en_semana_LS_modalidad FOREIGN KEY examen_en_semana_LS_modalidad (modalidad_2_uuid)
    REFERENCES modalidad (id);

-- Reference: examen_en_semana_LS_semana_LS (table: examen_en_semana_LS)
ALTER TABLE examen_en_semana_LS ADD CONSTRAINT examen_en_semana_LS_semana_LS FOREIGN KEY examen_en_semana_LS_semana_LS (semana_LS_uuid)
    REFERENCES semana_LS (uuid);

-- Reference: modalidad_nivel (table: modalidad)
ALTER TABLE modalidad ADD CONSTRAINT modalidad_nivel FOREIGN KEY modalidad_nivel (nivel_id)
    REFERENCES nivel (id);

-- Reference: nivel_tipo (table: nivel)
ALTER TABLE nivel ADD CONSTRAINT nivel_tipo FOREIGN KEY nivel_tipo (tipo_id)
    REFERENCES tipo (id);

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
ALTER TABLE tipo ADD CONSTRAINT tipo_materia FOREIGN KEY tipo_materia (materia_id)
    REFERENCES materia (id);

-- End of file.

