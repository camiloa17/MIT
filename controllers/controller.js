const utils = require('../utils');

const conexion = require(`../database/conexionDB/conexionbd`);



exports.adquirirMenu = async ()=>{

    //const sql = "select m.nombre as materia,m.orden as orden_materia, t.nombre as tipo, t.orden as orden_tipo, n.nombre as nivel, n.orden as orden_nivel, mo.nombre as modalidad, mo.orden as orden_modalidad from materia m left join tipo t on t.materia_id = m.id left join nivel n on t.id = n.tipo_id left join modalidad mo on n.id = mo.nivel_id;"
    const sql = "select m.nombre as materia, m.orden as orden_materia, t.nombre as tipo, t.orden as orden_tipo, n.nombre as nivel, n.orden as orden_nivel, mo.nombre as modalidad, mo.orden as orden_modalidad from materia m left join tipo t on t.materia_uuid = m.uuid left join nivel n on t.uuid = n.tipo_uuid left join modalidad mo on n.uuid = mo.nivel_uuid where ((m.mostrar_cliente = 1 or m.mostrar_cliente is NULL) and (t.mostrar_cliente=1 or t.mostrar_cliente is NULL) and(n.mostrar_cliente=1 or n.mostrar_cliente is NULL) and (mo.mostrar_cliente=1 or mo.mostrar_cliente is NULL)) AND((m.activo is NULL or m.activo = 1) and(t.activo is NULL or t.activo = 1) and (n.activo is NULL or n.activo = 1) and (mo.activo is NULL or mo.activo = 1));"
    const respuesta = await utils.queryAsync(sql);
    const materias = [];
    const tipo = [];
    const nivel = [];
    const modo = [];
    
    respuesta.forEach(element => {
        if (!materias.find((objetoMateriaItem) => {
            return objetoMateriaItem.materias === element.materia
        })) {
            if (element.materia!= null){
                materias.push({materias:element.materia,orden:element.orden_materia});
            }
        }

        if (!tipo.find((objetoTipoItem) => {
            return objetoTipoItem.tipo === element.tipo;
        })) {
            if(element.tipo!= null){
                tipo.push({ materia: element.materia, tipo: element.tipo,orden:element.orden_tipo });
            }
            
        }
        if (!nivel.find((objetoNivelItem) => {
            return objetoNivelItem.nivel === element.nivel
        })) {
            if(element.nivel!= null){
                nivel.push({ tipo: element.tipo, nivel: element.nivel, orden: element.orden_nivel });
            }
            
        }
        if(element.modalidad != null){
            modo.push({ nivel: element.nivel, modo: element.modalidad, orden: element.orden_modalidad })
        }
        
    }); 

    function comparar(a, b) {
        return a.orden - b.orden
    }
    
    materias.sort(comparar);
    tipo.sort(comparar);
    nivel.sort(comparar);
    modo.sort(comparar);

    return {
        materias: materias,
        tipo: tipo,
        nivel: nivel,
        modo: modo
    };

}


exports.consultarDescripcionYPrecioExamen = async(nivel,modalidad)=>{
    const sql = 'select n.descripcion as descripcion, mo.precio as precio from nivel as n join modalidad as mo on n.uuid=mo.nivel_uuid where n.nombre = ? and mo.nombre = ?;';
    const respuesta = await utils.queryAsync(sql,[nivel,modalidad]);
    return {
        descripcion:respuesta[0].descripcion,
        precio:respuesta[0].precio
    };
}

