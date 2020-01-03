const express = require('express');
const router = express.Router();



router.get('/tarifas',async(req,res)=>{
    try{
        const file = `./Archivos/Tipos-de-Examen-y-Nombre-examen.pdf`;
        
        res.download(file,(err)=>{
            console.log(err);
        });
    }catch(error){
        console.error(error)
    }
    
});

router.get('/normas-examen',async(req,res)=>{
    try {
        const file = `./Archivos/NORMAS DE EXAMEN.pdf`;

        res.download(file,(err)=>{
            console.log(err)
        })
        
    } catch (error) {
        console.error(error)
    }
})


module.exports = router;