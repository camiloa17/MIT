const conexion = require(`./database/conexionDB/conexionbd`);

exports.queryAsync = (query, values)=> {
    return new Promise((resolve,reject)=>{
        conexion.query({
            sql: query,
            values: values
        }, function (error, results) {
            if(error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    })
    
}

exports.queryClose = async ()=>{
    conexion.release();
}