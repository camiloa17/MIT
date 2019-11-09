const utils = require('../utils');

const conexion = require(`../database/conexionDB/conexionbd`);

exports.adquirirMenu = async ()=>{

    const sql = "select m.nombre as materia,m.orden as orden_materia, t.nombre as tipo, t.orden as orden_tipo, n.nombre as nivel, n.orden as orden_nivel, mo.nombre as modalidad, mo.orden as orden_modalidad from materia m left join tipo t on t.materia_id = m.id left join nivel n on t.id = n.tipo_id left join modalidad mo on n.id = mo.nivel_id;"

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

