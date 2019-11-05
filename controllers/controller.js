const utils = require('../utils');

const conexion = require(`../database/conexionDB/conexionbd`);

exports.adquirirMenu = async ()=>{

    const sql = "select m.nombre as materia, t.nombre as tipo, n.nombre as nivel, mo.nombre as modalidad from materia m left join tipo t on t.materia_id = m.id left join nivel n on t.id = n.tipo_id left join modalidad mo on n.id = mo.nivel_id;"

    const respuesta = await utils.queryAsync(sql);
    const materias = [];
    const tipo = [];
    const nivel = [];
    const modo = [];

    respuesta.forEach(element => {
        if (!materias.find((arrayMateriaItem) => {
            return arrayMateriaItem === element.materia
        })) {
            materias.push(element.materia);
        }

        if (!tipo.find((arrayTipoItem) => {
            return arrayTipoItem.tipo === element.tipo;
        })) {
            tipo.push({ materia: element.materia, tipo: element.tipo });
        }
        if (!nivel.find((arrayNivelItem) => {
            return arrayNivelItem.nivel === element.nivel
        })) {
            nivel.push({ tipo: element.tipo, nivel: element.nivel });
        }

        modo.push({ nivel: element.nivel, modo: element.modalidad })
    });

    return {
        materias: materias,
        tipo: tipo,
        nivel: nivel,
        modo: modo
    };

}

