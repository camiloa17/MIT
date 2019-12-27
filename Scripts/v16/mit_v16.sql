-- MySQL Script generated by MySQL Workbench
-- Thu Dec 19 21:19:41 2019
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mit
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mit
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mit` DEFAULT CHARACTER SET utf8 ;
USE `mit` ;

-- -----------------------------------------------------
-- Table `mit`.`materia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mit`.`materia` (
  `uuid` BINARY(16) NOT NULL,
  `orden` INT NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `activo` TINYINT NOT NULL,
  `mostrar_cliente` TINYINT NOT NULL,
  `edita_user_secundario` TINYINT NULL,
  PRIMARY KEY (`uuid`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mit`.`tipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mit`.`tipo` (
  `uuid` BINARY(16) NOT NULL,
  `materia_uuid` BINARY(16) NOT NULL,
  `orden` INT NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `activo` TINYINT NOT NULL,
  `mostrar_cliente` TINYINT NOT NULL,
  `edita_user_secundario` TINYINT NULL,
  PRIMARY KEY (`uuid`),
  INDEX `fk_tipo_materia_idx` (`materia_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_tipo_materia`
    FOREIGN KEY (`materia_uuid`)
    REFERENCES `mit`.`materia` (`uuid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mit`.`nivel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mit`.`nivel` (
  `uuid` BINARY(16) NOT NULL,
  `tipo_uuid` BINARY(16) NOT NULL,
  `orden` INT NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion` TEXT NULL,
  `pdf` TEXT NULL,
  `imagen` TEXT NULL,
  `activo` TINYINT NOT NULL,
  `mostrar_cliente` TINYINT NOT NULL,
  `edita_user_secundario` TINYINT NULL,
  PRIMARY KEY (`uuid`),
  INDEX `fk_nivel_tipo1_idx` (`tipo_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_nivel_tipo1`
    FOREIGN KEY (`tipo_uuid`)
    REFERENCES `mit`.`tipo` (`uuid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mit`.`modalidad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mit`.`modalidad` (
  `uuid` BINARY(16) NOT NULL,
  `orden` INT NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `precio` DECIMAL(6,2) NOT NULL,
  `activo` TINYINT NOT NULL,
  `mostrar_cliente` TINYINT NOT NULL,
  `edita_user_secundario` TINYINT NULL,
  `nivel_uuid` BINARY(16) NOT NULL,
  `examen_RW` TINYINT NULL,
  `examen_LS` TINYINT NULL,
  `txt_img` VARCHAR(45) NULL,
  PRIMARY KEY (`uuid`),
  INDEX `fk_modalidad_nivel1_idx` (`nivel_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_modalidad_nivel1`
    FOREIGN KEY (`nivel_uuid`)
    REFERENCES `mit`.`nivel` (`uuid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mit`.`dia_RW`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mit`.`dia_RW` (
  `uuid` BINARY(16) NOT NULL,
  `fecha_Examen` DATETIME NOT NULL,
  `cupo_maximo` INT NOT NULL,
  `fecha_finalizacion` DATE NULL,
  `pausado` TINYINT NOT NULL,
  `activo` TINYINT NOT NULL,
  PRIMARY KEY (`uuid`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mit`.`semana_LS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mit`.`semana_LS` (
  `uuid` BINARY(16) NOT NULL,
  `semana_Examen` DATE NOT NULL,
  `cupo_maximo` INT NOT NULL,
  `finaliza_inscripcion` DATE NULL,
  `pausado` TINYINT NOT NULL,
  `activo` TINYINT NOT NULL,
  PRIMARY KEY (`uuid`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mit`.`dia_LS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mit`.`dia_LS` (
  `uuid` BINARY(16) NOT NULL,
  `fecha_Examen` DATETIME NOT NULL,
  `cupo_maximo` INT NOT NULL,
  `fecha_finalizacion` DATE NULL,
  `pausado` TINYINT NOT NULL,
  `activo` TINYINT NOT NULL,
  PRIMARY KEY (`uuid`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mit`.`examen_en_dia_RW`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mit`.`examen_en_dia_RW` (
  `uuid` BINARY(16) NOT NULL,
  `activo` TINYINT NOT NULL,
  `pausado` TINYINT NOT NULL,
  `dia_RW_uuid` BINARY(16) NOT NULL,
  `modalidad_uuid` BINARY(16) NOT NULL,
  PRIMARY KEY (`uuid`),
  INDEX `fk_examen_en_dia_RW_dia_RW1_idx` (`dia_RW_uuid` ASC) VISIBLE,
  INDEX `fk_examen_en_dia_RW_modalidad1_idx` (`modalidad_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_examen_en_dia_RW_dia_RW1`
    FOREIGN KEY (`dia_RW_uuid`)
    REFERENCES `mit`.`dia_RW` (`uuid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_examen_en_dia_RW_modalidad1`
    FOREIGN KEY (`modalidad_uuid`)
    REFERENCES `mit`.`modalidad` (`uuid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mit`.`examen_en_semana_LS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mit`.`examen_en_semana_LS` (
  `uuid` BINARY(16) NOT NULL,
  `activo` TINYINT NOT NULL,
  `pausado` TINYINT NOT NULL,
  `semana_LS_uuid` BINARY(16) NOT NULL,
  `modalidad_uuid` BINARY(16) NOT NULL,
  PRIMARY KEY (`uuid`),
  INDEX `fk_examen_en_semana_LS_semana_LS1_idx` (`semana_LS_uuid` ASC) VISIBLE,
  INDEX `fk_examen_en_semana_LS_modalidad1_idx` (`modalidad_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_examen_en_semana_LS_semana_LS1`
    FOREIGN KEY (`semana_LS_uuid`)
    REFERENCES `mit`.`semana_LS` (`uuid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_examen_en_semana_LS_modalidad1`
    FOREIGN KEY (`modalidad_uuid`)
    REFERENCES `mit`.`modalidad` (`uuid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mit`.`alumno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mit`.`alumno` (
  `uuid` BINARY(16) NOT NULL,
  `fecha_inscripcion` TIMESTAMP NOT NULL,
  `candidate_number` VARCHAR(45) NULL,
  `nombre` VARCHAR(45) NULL,
  `apellido` VARCHAR(45) NULL,
  `documento` VARCHAR(45) NULL,
  `fecha_nac` DATE NULL,
  `genero` VARCHAR(1) NULL,
  `email` VARCHAR(45) NULL,
  `telefono_fijo` VARCHAR(45) NULL,
  `movil` VARCHAR(45) NULL,
  `domicilio` TEXT NULL,
  `provincia` VARCHAR(45) NULL,
  `localidad` VARCHAR(45) NULL,
  `observaciones` TEXT NULL,
  `activo` TINYINT NOT NULL,
  `edita_user_secundario` TINYINT NULL,
  PRIMARY KEY (`uuid`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mit`.`reserva`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mit`.`reserva` (
  `uuid` BINARY(16) NOT NULL,
  `fecha_reserva` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `en_proceso` TINYINT NOT NULL,
  `rechazada` TINYINT NULL,
  `fecha_venta` TIMESTAMP NULL,
  `nro_ref_pago` VARCHAR(45) NULL,
  `monto_abonado` DECIMAL(8,2) NULL,
  `fecha_fuera_termino` TINYINT NULL,
  `estado_examen` VARCHAR(45) NULL,
  `discapacidad` TINYINT NULL,
  `academia_amiga` VARCHAR(45) NULL,
  `notas_obtenidas` TEXT NULL,
  `pdf_notas_obtenidas` TEXT NULL,
  `observaciones` TEXT NULL,
  `envio_domicilio_diploma` TINYINT NULL,
  `direccion_envio_domicilio` TEXT NULL,
  `provincia` VARCHAR(45) NULL,
  `localidad` VARCHAR(45) NULL,
  `alumno_uuid` BINARY(16) NULL,
  `examen_en_dia_RW_uuid` BINARY(16) NULL,
  `examen_en_semana_LS_uuid` BINARY(16) NULL,
  `dia_LS_uuid` BINARY(16) NULL,
  PRIMARY KEY (`uuid`),
  INDEX `fk_reserva_alumno1_idx` (`alumno_uuid` ASC) VISIBLE,
  INDEX `fk_reserva_examen_en_dia_RW1_idx` (`examen_en_dia_RW_uuid` ASC) VISIBLE,
  INDEX `fk_reserva_examen_en_semana_LS1_idx` (`examen_en_semana_LS_uuid` ASC) VISIBLE,
  INDEX `fk_reserva_dia_LS1_idx` (`dia_LS_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_reserva_alumno1`
    FOREIGN KEY (`alumno_uuid`)
    REFERENCES `mit`.`alumno` (`uuid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reserva_examen_en_dia_RW1`
    FOREIGN KEY (`examen_en_dia_RW_uuid`)
    REFERENCES `mit`.`examen_en_dia_RW` (`uuid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reserva_examen_en_semana_LS1`
    FOREIGN KEY (`examen_en_semana_LS_uuid`)
    REFERENCES `mit`.`examen_en_semana_LS` (`uuid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reserva_dia_LS1`
    FOREIGN KEY (`dia_LS_uuid`)
    REFERENCES `mit`.`dia_LS` (`uuid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
