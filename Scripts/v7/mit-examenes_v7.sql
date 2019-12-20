-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2019-09-30 21:46:29.003

-- tables
-- Table: alumno
CREATE TABLE alumno (
    id int NOT NULL,
    nombre varchar(30) NOT NULL,
    apellido varchar(30) NOT NULL,
    documento_id varchar(30) NOT NULL,
    fecha_nacimiento date NOT NULL,
    genero varchar(1) NOT NULL,
    email varchar(40) NOT NULL,
    movil varchar(30) NOT NULL,
    domicilio text NULL,
    observaciones text NULL,
    usuario varchar(30) NULL,
    clave varchar(30) NULL,
    fecha_inscripcion timestamp NOT NULL,
    CONSTRAINT alumno_pk PRIMARY KEY (id)
);

-- Table: categoria
CREATE TABLE categoria (
    id int NOT NULL,
    orden int NOT NULL,
    nombre varchar(90) NOT NULL,
    mostrar boolean NOT NULL,
    imagen text NOT NULL,
    CONSTRAINT categoria_pk PRIMARY KEY (id)
);

-- Table: examen
CREATE TABLE examen (
    id int NOT NULL,
    orden int NOT NULL,
    nombre varchar(60) NOT NULL,
    precio decimal(6,2) NOT NULL,
    mostrar boolean NOT NULL,
    imagen text NOT NULL,
    descripcion text NOT NULL,
    subcategoria_id int NOT NULL,
    CONSTRAINT examen_pk PRIMARY KEY (id)
);

-- Table: examen_rendido
CREATE TABLE examen_rendido (
    id int NOT NULL,
    rendido boolean NOT NULL,
    nota_obtenida VARCHAR(20) NOT NULL,
    reservas_id int NOT NULL,
    observaciones text NOT NULL,
    CONSTRAINT examen_rendido_pk PRIMARY KEY (id)
);

-- Table: examenes_en_determinado_horario
CREATE TABLE examenes_en_determinado_horario (
    id int NOT NULL,
    examen_id int NOT NULL,
    horario_id int NOT NULL,
    CONSTRAINT examenes_en_determinado_horario_pk PRIMARY KEY (id)
);

-- Table: horario
CREATE TABLE horario (
    id int NOT NULL,
    fecha date NOT NULL,
    hora_inicio datetime NOT NULL,
    hora_fin datetime NOT NULL,
    cupo_max int NOT NULL,
    sala_id int NOT NULL,
    CONSTRAINT horario_pk PRIMARY KEY (id)
);

-- Table: reservas
CREATE TABLE reservas (
    id int NOT NULL,
    fecha_venta timestamp NOT NULL,
    medio_de_pago varchar(30) NOT NULL,
    nro_referencia_pago int NOT NULL,
    monto_abonado int NOT NULL,
    alumno_id int NOT NULL,
    examenes_en_determinado_horario_id int NOT NULL,
    estado varchar(10) NOT NULL,
    observaciones text NOT NULL,
    CONSTRAINT reservas_pk PRIMARY KEY (id)
);

-- Table: sala
CREATE TABLE sala (
    id int NOT NULL,
    nombre_sala varchar(20) NOT NULL,
    ubicacion text NOT NULL,
    capacidad int NOT NULL,
    disponible boolean NOT NULL,
    CONSTRAINT sala_pk PRIMARY KEY (id)
);

-- Table: subcategoria
CREATE TABLE subcategoria (
    id int NOT NULL,
    orden int NOT NULL,
    categoria_id int NOT NULL,
    nombre varchar(90) NOT NULL,
    mostrar boolean NOT NULL,
    imagen text NOT NULL,
    CONSTRAINT subcategoria_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: examen_rendido_reservas (table: examen_rendido)
ALTER TABLE examen_rendido ADD CONSTRAINT examen_rendido_reservas FOREIGN KEY examen_rendido_reservas (reservas_id)
    REFERENCES reservas (id);

-- Reference: examen_subcategoria (table: examen)
ALTER TABLE examen ADD CONSTRAINT examen_subcategoria FOREIGN KEY examen_subcategoria (subcategoria_id)
    REFERENCES subcategoria (id);

-- Reference: exmenes_en_determinado_horario_examen (table: examenes_en_determinado_horario)
ALTER TABLE examenes_en_determinado_horario ADD CONSTRAINT exmenes_en_determinado_horario_examen FOREIGN KEY exmenes_en_determinado_horario_examen (examen_id)
    REFERENCES examen (id);

-- Reference: exmenes_en_determinado_horario_horario (table: examenes_en_determinado_horario)
ALTER TABLE examenes_en_determinado_horario ADD CONSTRAINT exmenes_en_determinado_horario_horario FOREIGN KEY exmenes_en_determinado_horario_horario (horario_id)
    REFERENCES horario (id);

-- Reference: horario_sala (table: horario)
ALTER TABLE horario ADD CONSTRAINT horario_sala FOREIGN KEY horario_sala (sala_id)
    REFERENCES sala (id);

-- Reference: reservas_alumno (table: reservas)
ALTER TABLE reservas ADD CONSTRAINT reservas_alumno FOREIGN KEY reservas_alumno (alumno_id)
    REFERENCES alumno (id);

-- Reference: reservas_exmenes_en_determinado_horario (table: reservas)
ALTER TABLE reservas ADD CONSTRAINT reservas_exmenes_en_determinado_horario FOREIGN KEY reservas_exmenes_en_determinado_horario (examenes_en_determinado_horario_id)
    REFERENCES examenes_en_determinado_horario (id);

-- Reference: subcategoria_categoria (table: subcategoria)
ALTER TABLE subcategoria ADD CONSTRAINT subcategoria_categoria FOREIGN KEY subcategoria_categoria (categoria_id)
    REFERENCES categoria (id);

-- End of file.

