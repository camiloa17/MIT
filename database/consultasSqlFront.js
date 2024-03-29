

exports.adquirirMenu = async () => {
  return `select m.nombre as materia, m.orden as orden_materia, t.nombre as tipo, t.orden as orden_tipo, n.nombre as nivel, n.orden as orden_nivel, mo.nombre as modalidad, mo.orden as orden_modalidad, BIN_TO_UUID(mo.uuid) as id_modalidad from materia m left join tipo t on t.materia_uuid = m.uuid left join nivel n on t.uuid = n.tipo_uuid left join modalidad mo on n.uuid = mo.nivel_uuid where ((m.mostrar_cliente = 1) and (t.mostrar_cliente=1) and(n.mostrar_cliente=1) and (mo.mostrar_cliente=1)) AND((m.activo = 1) and(t.activo = 1) and (n.activo = 1) and (mo.activo = 1));`
}


exports.consultaExamenPrecioDescripcion = async () => {
  return `select m.nombre as materia, t.nombre as tipo,n.nombre as nivel, n.descripcion as descripcion,BIN_TO_UUID(mo.uuid) as id, mo.nombre as modalidad, mo.precio as precio, mo.examen_RW as exrw, mo.examen_LS as exls, mo.txt_img as img from materia as m join tipo as t on t.materia_uuid = m.uuid join  nivel as n on n.tipo_uuid = t.uuid join modalidad as mo on n.uuid = mo.nivel_uuid where mo.uuid = UUID_TO_BIN(?);`
}


exports.consultaExamenCompletoCupos = async () => {
  return `select
  DISTINCT dia.fecha_Examen,
  dia.fecha_finalizacion as fecha_cierre,
  dia.cupo_maximo as cupos_dia,
  BIN_TO_UUID(diarw.uuid) as id_diaEx,
  BIN_TO_UUID(dia.uuid) as dia_ID,
  'dia' as tabla,
  (dia.cupo_maximo-(select count(*) from reserva as res_dia where res_dia.examen_en_dia_RW_uuid=diarw.uuid and ((res_dia.fecha_venta IS NOT NULL) OR((res_dia.en_proceso=1 and (res_dia.fecha_reserva + INTERVAL 10 MINUTE > NOW()))OR(res_dia.en_proceso=1 and res_dia.fecha_fuera_termino=1 and(res_dia.fecha_reserva + INTERVAL 1440 MINUTE > NOW()))) ) )) as disponible_dia
  ,semana.*
from examen_en_dia_RW as diarw
join dia_RW as dia on diarw.dia_RW_uuid = dia.uuid
join
(select sls.semana_Examen,
sls.finaliza_inscripcion as fecha_cierre,
sls.cupo_maximo as cupo_semana,
BIN_TO_UUID(exsls.uuid) as id_semanaEx,
BIN_TO_UUID(sls.uuid) as semana_id,
'semana' as tabla1, 
(sls.cupo_maximo-(select count(*) from reserva as res where res.examen_en_semana_LS_uuid=exsls.uuid and((res.fecha_venta IS NOT NULL) OR((res.en_proceso=1 and (res.fecha_reserva + INTERVAL 10 MINUTE > NOW()))OR(res.en_proceso=1 and res.fecha_fuera_termino=1 and(res.fecha_reserva + INTERVAL 1440 MINUTE > NOW()))) ))) as disponible_sem
from examen_en_semana_LS as exsls
join semana_LS as sls on exsls.semana_LS_uuid = sls.uuid 
where
  exsls.modalidad_uuid = UUID_TO_BIN(?)
  and sls.activo = 1
  and sls.pausado = 0
  and exsls.activo = 1
  and exsls.pausado = 0
  and sls.semana_Examen >= CURDATE()
  and (sls.cupo_maximo-(select count(*) from reserva as res where res.examen_en_semana_LS_uuid=exsls.uuid and((res.fecha_venta IS NOT NULL) OR((res.en_proceso=1 and (res.fecha_reserva + INTERVAL 10 MINUTE > NOW()))OR(res.en_proceso=1 and res.fecha_fuera_termino=1 and(res.fecha_reserva + INTERVAL 1440 MINUTE > NOW()))) )))>0
  and sls.semana_Examen = (select  min(semana2.semana_Examen) from semana_LS semana2 where (month(semana2.semana_Examen) + year(semana2.semana_Examen))=(month(sls.semana_Examen) + year(sls.semana_Examen)))
   ) as semana on (month(dia.fecha_Examen) + year(dia.fecha_Examen)) =(
  month(semana.semana_Examen) + year(semana.semana_Examen)
)
where
 diarw.modalidad_uuid = UUID_TO_BIN(?)
and dia.activo = 1
and dia.pausado = 0
and diarw.activo = 1
and diarw.pausado = 0
and dia.fecha_Examen >= CURDATE()
and semana.disponible_sem > 0
and (dia.cupo_maximo-(select count(*) from reserva as res_dia where res_dia.examen_en_dia_RW_uuid=diarw.uuid and ((res_dia.fecha_venta IS NOT NULL) OR((res_dia.en_proceso=1 and (res_dia.fecha_reserva + INTERVAL 10 MINUTE > NOW()))OR(res_dia.en_proceso=1 and res_dia.fecha_fuera_termino=1 and(res_dia.fecha_reserva + INTERVAL 1440 MINUTE > NOW()))) )))>0 
order by dia.fecha_Examen;
`
}


exports.consultaExamenReadingAndWriting = async () => {
  return `select
  DISTINCT dia.fecha_Examen,
  dia.fecha_finalizacion as fecha_cierre,
  dia.cupo_maximo as cupos_dia,
  BIN_TO_UUID(diarw.uuid) as id_diaEx,
  BIN_TO_UUID(dia.uuid) as dia_ID,
    (dia.cupo_maximo-(select count(*) from reserva as res_dia where res_dia.examen_en_dia_RW_uuid=diarw.uuid and ((res_dia.fecha_venta IS NOT NULL) OR((res_dia.en_proceso=1 and (res_dia.fecha_reserva + INTERVAL 10 MINUTE > NOW()))OR(res_dia.en_proceso=1 and res_dia.fecha_fuera_termino=1 and(res_dia.fecha_reserva + INTERVAL 1440 MINUTE > NOW()))) ) )) as disponible_dia

from examen_en_dia_RW as diarw
join dia_RW as dia on diarw.dia_RW_uuid = dia.uuid
where
 diarw.modalidad_uuid = UUID_TO_BIN(?)
and dia.activo = 1
and dia.pausado = 0
and diarw.activo = 1
and diarw.pausado = 0
and dia.fecha_Examen >= CURDATE()
and (dia.cupo_maximo-(select count(*) from reserva as res_dia where res_dia.examen_en_dia_RW_uuid=diarw.uuid and ((res_dia.fecha_venta IS NOT NULL) OR((res_dia.en_proceso=1 and (res_dia.fecha_reserva + INTERVAL 10 MINUTE > NOW()))OR(res_dia.en_proceso=1 and res_dia.fecha_fuera_termino=1 and(res_dia.fecha_reserva + INTERVAL 1440 MINUTE > NOW()))) )))>0 
order by dia.fecha_Examen;`
}

exports.consultaExamenListeningAndSpeaking = async () => {
  return `select sls.semana_Examen as fecha_Examen,
sls.finaliza_inscripcion as fecha_cierre,
sls.cupo_maximo as cupo_semana,
BIN_TO_UUID(exsls.uuid) as id_diaEx,
BIN_TO_UUID(sls.uuid) as semana_id,
(sls.cupo_maximo-(select count(*) from reserva as res where res.examen_en_semana_LS_uuid=exsls.uuid and((res.fecha_venta IS NOT NULL) OR((res.en_proceso=1 and (res.fecha_reserva + INTERVAL 10 MINUTE > NOW()))OR(res.en_proceso=1 and res.fecha_fuera_termino=1 and(res.fecha_reserva + INTERVAL 1440 MINUTE > NOW()))) ))) as disponible_sem

from examen_en_semana_LS as exsls
join semana_LS as sls on exsls.semana_LS_uuid = sls.uuid 
where
  exsls.modalidad_uuid = UUID_TO_BIN(?)
  and sls.activo = 1
  and sls.pausado = 0
  and exsls.activo = 1
  and exsls.pausado = 0
  and sls.semana_Examen >= CURDATE()
  and (sls.cupo_maximo-(select count(*) from reserva as res where res.examen_en_semana_LS_uuid=exsls.uuid and((res.fecha_venta IS NOT NULL) OR((res.en_proceso=1 and (res.fecha_reserva + INTERVAL 10 MINUTE > NOW()))OR(res.en_proceso=1 and res.fecha_fuera_termino=1 and(res.fecha_reserva + INTERVAL 1440 MINUTE > NOW()))) )))>0
  order by sls.semana_Examen;`
}


exports.consultaExistenciaDeExamenEnHorario = async (modalidad)=>{
  switch (modalidad) {
    case "Completo":
      return `select 
      count(BIN_TO_UUID(semana.uuid)) as id_semana,
      dia.*
      from examen_en_semana_LS as semana
      join(select count(BIN_TO_UUID(diarw.uuid)) as id_dia
      from examen_en_dia_RW as diarw
      where uuid= UUID_TO_BIN(?)
      ) as dia
      where
      uuid = UUID_TO_BIN(?);`
      
    case "Reading & Writing":
      return `select count(BIN_TO_UUID(uuid)) as id from examen_en_dia_RW where uuid = UUID_TO_BIN(?);`
      
    case "Listening & Speaking":
      return `select count(BIN_TO_UUID(uuid)) as id from examen_en_semana_LS where uuid = UUID_TO_BIN(?);`

  }
}


exports.ingresarReservaEnProcesoExamenCompleto=async()=>{
  return `insert into reserva (examen_en_dia_RW_uuid,examen_en_semana_LS_uuid, fecha_reserva,en_proceso,fecha_fuera_termino,monto,uuid)values(UUID_TO_BIN(?),UUID_TO_BIN(?),?,?,?,?,UUID_TO_BIN(?));`
}

exports.ingresarReservaEnProcesoExamenRW= async()=>{
  return `insert into reserva (examen_en_dia_RW_uuid, fecha_reserva,en_proceso,fecha_fuera_termino,monto,uuid) values (UUID_TO_BIN(?),?,?,?,?,UUID_TO_BIN(?));`
}

exports.ingresarReservaEnProcesoExamenLS= async()=>{
  return `insert into reserva (examen_en_semana_LS_uuid, fecha_reserva,en_proceso,fecha_fuera_termino,monto,uuid) values (UUID_TO_BIN(?),?,?,?,?,UUID_TO_BIN(?));`
}

exports.consultaReservaPaso3 = async()=>{
  return `select count(BIN_TO_UUID(uuid)) as reserva from reserva where uuid=UUID_TO_BIN(?) and en_proceso=1;`
}

exports.consultaFueraDeTerminoCompleto= async()=>{
  return `select if(DATE(?)<DATE(dia.fecha_finalizacion),'true','false') as fecha_RW,
  dia.fecha_Examen,
  dia.fecha_finalizacion, 
  semana.* 
  from examen_en_dia_RW as diaexrw
  join dia_RW as dia on dia.uuid=diaexrw.dia_RW_uuid
  join (
      select if(DATE(?)<DATE(sls.finaliza_inscripcion),'true','false') as fecha_ls,
      sls.semana_Examen,
      sls.finaliza_inscripcion 
      from examen_en_semana_LS as exls
      join semana_LS as sls on sls.uuid=exls.semana_LS_uuid
      where exls.uuid=UUID_TO_BIN(?)
  ) as semana on (month(dia.fecha_Examen) + year(dia.fecha_Examen)) = (month(semana.semana_Examen) + year(semana.semana_Examen))
  where diaexrw.uuid= UUID_TO_BIN(?);`
}

exports.consultaFueraDeTerminoRW = async ()=>{
  return `select if(DATE(?)<DATE(dia.fecha_finalizacion),'true','false') as fecha,
  dia.fecha_Examen,
  dia.fecha_finalizacion
  from examen_en_dia_RW as diaexrw
  join dia_RW as dia on dia.uuid=diaexrw.dia_RW_uuid
  where diaexrw.uuid= UUID_TO_BIN(?);`
}

exports.consultaFueraDeTerminoLS = async ()=>{
  return `select if(DATE(?)<DATE(sls.finaliza_inscripcion),'true','false') as fecha,
      sls.semana_Examen,
      sls.finaliza_inscripcion 
      from examen_en_semana_LS as exls
      join semana_LS as sls on sls.uuid=exls.semana_LS_uuid
      where exls.uuid=UUID_TO_BIN(?)`
}

exports.consultaPrecioReservaTemporal = async()=>{
  return `select monto as precio from reserva where uuid=UUID_TO_BIN(?)`
}

exports.consultaFechaReservaTemporal = async()=>{
  return `select fecha_reserva as fecha from reserva where uuid=UUID_TO_BIN(?)`
}

exports.consultaSiEstaFueraDeDiezMinutos = async()=>{
  return `select
  count(fecha_reserva) as fecha
from reserva
where
  uuid = UUID_TO_BIN(?)
  and (fecha_reserva + INTERVAL 10 MINUTE > now());`
}

exports.crearAlumno = async ()=>{
  return `insert into alumno(
    activo,
    nombre,
    apellido,
    fecha_nac,
    fecha_inscripcion,
    documento,
    genero,
    email,
    telefono_fijo,
    movil,
    provincia,
    localidad,
    domicilio,
    codigo_postal,
    candidate_number,
    uuid
  )
values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UUID_TO_BIN(?));`
}

exports.verExistenciaAlumno = async()=>{
  return `select BIN_TO_UUID(uuid) as id from alumno where documento=?;`
}

exports.actualizarAlumno= async()=>{
  return `update alumno 
set 
activo=1,
nombre=?,
apellido=?,
documento=?,
genero=?,
email=?,
telefono_fijo=?,
movil=?,
provincia=?,
localidad = ?,
domicilio = ?,
codigo_postal=?,
candidate_number=?
where uuid = UUID_TO_BIN(?);`
}

exports.actualizarReservaConfirmada = async ()=>{
  return `update reserva 
set 
alumno_uuid=UUID_TO_BIN(?),
codigo_postal_envio_domicilio=?,
direccion_envio_domicilio=?,
discapacidad=?,
en_proceso=?,
envio_domicilio_diploma=?,
fecha_venta=?,
id_trinity=?,
localidad_envio_domicilio=?,
monto=?,
provincia_envio_domicilio=?,
rechazada=?,
transaccion_id=?,
transaccion_status=?
where uuid=UUID_TO_BIN(?);`
}

exports.verSiSePago = async ()=>{
  return `select transaccion_status from reserva where uuid = UUID_TO_BIN(?);`
}

